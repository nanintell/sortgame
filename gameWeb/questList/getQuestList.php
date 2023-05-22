<?php
session_start();
require '../../database/connectDb.php';

$stuId = $_SESSION["studentId"];
$category = $_REQUEST["category"];

//how to get quest
//query to get all chapters
//while checking each chapter, query to get all stages
//while checking each stage in chapter loop, query to get played and avaliable quests
//for stages and chapters that does not contain any quests, delete them.

if ($stuId == "guest") {

    $chapters = []; //avaliable quests for this user

    $conn = connectDB();

    //query chapters
    $stmtc = $conn->prepare("SELECT ch.chId, ch.name 
                            FROM chapters ch, questcategories qc 
                            WHERE qc.qCatId = ch.qCatId AND qc.name = :category
                            ORDER BY name DESC");
    $stmtc->bindParam(':category', $category, PDO::PARAM_STR);
    $stmtc->execute();
    $stmtc->setFetchMode(PDO::FETCH_ASSOC);
    $chDetail = $stmtc->fetchAll();

    foreach($chDetail as $ch)
    {
        $chapter = ["title" => $ch['name'], "stage" => []];
        //query stages
        $stmts = $conn->prepare("SELECT stageId, name 
                                FROM stages 
                                WHERE chId = :chapterId
                                ORDER BY name DESC");
        $stmts->bindParam(':chapterId', $ch['chId'], PDO::PARAM_STR);
        $stmts->execute();
        $stmts->setFetchMode(PDO::FETCH_ASSOC);
        $stDetail = $stmts->fetchAll();

        foreach($stDetail as $st)
        {
            $stages = ["title" => $st['name'], "quest" => []];
            //query quests
            $stmtq = $conn->prepare("SELECT q.questId, qt.name AS type, q.requireQuest, bg.picture, q.exp, q.title, q.qDesc
                                    FROM quests q, questtypes qt, backgroundpics bg
                                    WHERE qt.qTypeId = q.qTypeId 
                                        AND q.stageId = :stageId
                                        AND q.bgPicId = bg.bgPicId
                                    ORDER BY title DESC");
            $stmtq->bindParam(':stageId', $st['stageId'], PDO::PARAM_STR);
            $stmtq->execute();
            $stmtq->setFetchMode(PDO::FETCH_ASSOC);
            $qDetail = $stmtq->fetchAll();

            foreach($qDetail as $q)
            {
                $quests = [
                    "id" => $q['questId'],
                    "title" => $q['title'],
                    "quest_desc" => $q['qDesc'],
                    "exp" => $q['exp'],
                    "star" => "000",
                    "require" => $q['requireQuest'],
                    "type" => $q['type'],
                    "background" => $q['picture'],
                    "battle_desc" => NULL
                ];

                if($q['type'] == 'battle')
                {
                    $stmtb = $conn->prepare("SELECT bDescId, bDesc, wave FROM battlesdetail WHERE questId = :questId;");
                    $stmtb->bindParam(':questId', $q['questId'], PDO::PARAM_STR);
                    $stmtb->execute();
                    $stmtb->setFetchMode(PDO::FETCH_ASSOC);
                    $bDetail = $stmtb->fetchAll();

                    $battleDesc = [
                        "desc" => $bDetail[0]['bDesc'],
                        "wave" => $bDetail[0]['wave'],
                        "element" => []
                    ];

                    $stmtb = $conn->prepare("SELECT 
                                                (SELECT name FROM elements WHERE elemId = sr.elemId) AS element, 
                                                (SELECT name FROM resistvalues WHERE resId = sr.resId) AS resist
                                            FROM shownelementresistance sr
                                            WHERE bDescId = :battleDetail;");
                    $stmtb->bindParam(':battleDetail', $bDetail[0]['bDescId'], PDO::PARAM_STR);
                    $stmtb->execute();
                    $stmtb->setFetchMode(PDO::FETCH_ASSOC);
                    $temp = $stmtb->fetchAll();
                    $battleDesc['element'] = array_combine(array_column($temp, "element"), array_column($temp, "resist"));

                    $quests['battle_desc'] = $battleDesc;
                }

                if(count($quests) > 0)
                {
                    array_push($stages['quest'], $quests);
                }
                
            }

            if(count($stages['quest']) > 0)
            {
                array_push($chapter['stage'], $stages);
            }

        }

        if(count($chapter['stage']) > 0)
        {
            array_push($chapters, $chapter);
        }
    }

    $conn = null;
    echo json_encode(["isGuest" => true, "chapters" => $chapters]);

} else {
    //for logged in user, progress is in database
    //thus, we can check by sql query
    //query here
    $chapters = []; //avaliable quests for this user

    $conn = connectDB();

    //query chapters
    $stmtc = $conn->prepare("SELECT ch.chId, ch.name 
                            FROM chapters ch, questcategories qc 
                            WHERE qc.qCatId = ch.qCatId AND qc.name = :category
                            ORDER BY name DESC");
    $stmtc->bindParam(':category', $category, PDO::PARAM_STR);
    $stmtc->execute();
    $stmtc->setFetchMode(PDO::FETCH_ASSOC);
    $chDetail = $stmtc->fetchAll();

    foreach($chDetail as $ch)
    {
        $chapter = ["title" => $ch['name'], "stage" => []];
        //query stages
        $stmts = $conn->prepare("SELECT stageId, name 
                                FROM stages 
                                WHERE chId = :chapterId
                                ORDER BY name DESC");
        $stmts->bindParam(':chapterId', $ch['chId'], PDO::PARAM_STR);
        $stmts->execute();
        $stmts->setFetchMode(PDO::FETCH_ASSOC);
        $stDetail = $stmts->fetchAll();

        foreach($stDetail as $st)
        {
            $stages = ["title" => $st['name'], "quest" => []];
            //query quests
            $stmtq = $conn->prepare("SELECT q.questId, qt.name AS type, q.requireQuest, bg.picture, q.exp, q.title, q.qDesc,
                                        (SELECT CONCAT(clear > 0, pass > 0, maxScore = 100) 
                                            FROM questprogress 
                                            WHERE userId = :userId AND questId = q.questId) AS stars
                                    FROM quests q, questtypes qt, backgroundpics bg
                                    WHERE qt.qTypeId = q.qTypeId 
                                        AND q.stageId = :stageId
                                        AND q.bgPicId = bg.bgPicId
                                        AND (q.requireQuest IS NULL 
                                            OR q.requireQuest IN 
                                                (SELECT questId FROM questprogress WHERE userId = :userId AND pass > 0))
                                    ORDER BY title DESC");
            $stmtq->bindParam(':stageId', $st['stageId'], PDO::PARAM_STR);
            $stmtq->bindParam(':userId', $stuId, PDO::PARAM_STR);
            $stmtq->execute();
            $stmtq->setFetchMode(PDO::FETCH_ASSOC);
            $qDetail = $stmtq->fetchAll();

            foreach($qDetail as $q)
            {
                $quests = [
                    "id" => $q['questId'],
                    "title" => $q['title'],
                    "quest_desc" => $q['qDesc'],
                    "exp" => $q['exp'],
                    "require" => $q['requireQuest'],
                    "star" => "".$q['stars'],
                    "type" => $q['type'],
                    "background" => $q['picture'],
                    "battle_desc" => NULL
                ];

                if($q['type'] == 'battle')
                {
                    $stmtb = $conn->prepare("SELECT bDescId, bDesc, wave FROM battlesdetail WHERE questId = :questId;");
                    $stmtb->bindParam(':questId', $q['questId'], PDO::PARAM_STR);
                    $stmtb->execute();
                    $stmtb->setFetchMode(PDO::FETCH_ASSOC);
                    $bDetail = $stmtb->fetchAll();

                    $battleDesc = [
                        "desc" => $bDetail[0]['bDesc'],
                        "wave" => $bDetail[0]['wave'],
                        "element" => []
                    ];

                    $stmtb = $conn->prepare("SELECT 
                                                (SELECT name FROM elements WHERE elemId = sr.elemId) AS element, 
                                                (SELECT name FROM resistvalues WHERE resId = sr.resId) AS resist
                                            FROM shownelementresistance sr
                                            WHERE bDescId = :battleDetail;");
                    $stmtb->bindParam(':battleDetail', $bDetail[0]['bDescId'], PDO::PARAM_STR);
                    $stmtb->execute();
                    $stmtb->setFetchMode(PDO::FETCH_ASSOC);
                    $temp = $stmtb->fetchAll();
                    $battleDesc['element'] = array_combine(array_column($temp, "element"), array_column($temp, "resist"));

                    $quests['battle_desc'] = $battleDesc;
                }

                if(count($quests) > 0)
                {
                    array_push($stages['quest'], $quests);
                }
                
            }

            if(count($stages['quest']) > 0)
            {
                array_push($chapter['stage'], $stages);
            }

        }

        if(count($chapter['stage']) > 0)
        {
            array_push($chapters, $chapter);
        }
    }

    $conn = null;
    echo json_encode(["isGuest" => false, "chapters" => $chapters]);
}
?>