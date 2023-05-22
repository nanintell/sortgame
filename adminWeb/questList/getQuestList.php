<?php
session_start();
require '../../database/connectDb.php';

//$stuId = $_SESSION["studentId"];
$category = $_REQUEST["category"];

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

foreach ($chDetail as $ch) {
    $chapter = ["title" => $ch['name'], "id" => $ch['chId'], "stage" => []];
    //query stages
    $stmts = $conn->prepare("SELECT stageId, name 
                                FROM stages 
                                WHERE chId = :chapterId
                                ORDER BY name DESC");
    $stmts->bindParam(':chapterId', $ch['chId'], PDO::PARAM_STR);
    $stmts->execute();
    $stmts->setFetchMode(PDO::FETCH_ASSOC);
    $stDetail = $stmts->fetchAll();

    foreach ($stDetail as $st) {
        $stages = ["title" => $st['name'], "id" => $st['stageId'], "quest" => []];
        //query quests
        $stmtq = $conn->prepare("SELECT q.questId, q.qTypeId AS type, q.requireQuest, q.bgPicId AS picture, q.exp, q.title, q.qDesc
                                    FROM quests q
                                    WHERE q.stageId = :stageId
                                    ORDER BY title DESC");
        $stmtq->bindParam(':stageId', $st['stageId'], PDO::PARAM_STR);
        $stmtq->execute();
        $stmtq->setFetchMode(PDO::FETCH_ASSOC);
        $qDetail = $stmtq->fetchAll();

        foreach ($qDetail as $q) {
            $quests = [
                "id" => $q['questId'],
                "title" => $q['title'],
                "quest_desc" => $q['qDesc'],
                "exp" => $q['exp'],
                "require" => $q['requireQuest'],
                "type" => $q['type'],
                "background" => $q['picture']
            ];

            array_push($stages['quest'], $quests);

        }

        array_push($chapter['stage'], $stages);

    }


    array_push($chapters, $chapter);

}

$conn = null;
echo json_encode(["isGuest" => false, "chapters" => $chapters]);
?>