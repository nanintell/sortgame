<?php
require '../../database/connectDb.php';
session_start();
$user = $_SESSION["studentId"];

$contentType = $_REQUEST["content"];
if ($user != "guest") {
    if ($contentType == "library") {
        //query avaliable story
        $content = [];

        $conn = connectDB();
        $stmt = $conn->prepare("SELECT title, contentFile
                                FROM library
                                WHERE requireQuest IS NULL 
                                    OR requireQuest IN 
                                        (SELECT questId FROM questprogress WHERE pass > 0 AND userId = :studentId)");
        $stmt->bindParam(':studentId', $user, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        if(count($result) > 0)
        {
            foreach($result as $row)
            {
                array_push($content, ["title" => $row['title'], "content" => file_get_contents($row['contentFile'])]);
            }
        }
        $conn = null;

        echo json_encode(["isGuest" => false, "content" => $content]);
    } else if ($contentType == "progress") {
        //query quest progress
        $conn = connectDB();
        $stmt = $conn->prepare("SELECT qc.name AS qtype, q.title AS quest, attempt, pass, maxScore, meanScore
                                FROM questprogress qp, quests q, users u, stages s, chapters c, questcategories qc
                                WHERE qp.questId = q.questId 
                                    AND u.userId = qp.userId 
                                    AND c.chId = s.chId
                                    AND s.stageId = q.stageId
                                    AND qc.qCatId = c.qCatId
                                    AND qp.userId = :studentId
                                ORDER BY q.title");
        $stmt->bindParam(':studentId', $user, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        $progress = [];
        array_push($progress, ["mode" => "Main Quest", "progress" => []]);
        array_push($progress, ["mode" => "Level Quest", "progress" => []]);
        array_push($progress, ["mode" => "Hard Quest", "progress" => []]);

        if(count($result) > 0)
        {
            foreach($result as $row)
            {
                $type = 0;
                if($row['qtype'] == 'main')
                {
                    $type = 0;
                }
                else if($row['qtype'] == 'level')
                {
                    $type = 1;
                }
                else if($row['qtype'] == 'hard')
                {
                    $type = 2;
                }
                array_push($progress[$type]["progress"], 
                            [
                                "quest" => $row['quest'], 
                                "attempt" => $row['attempt'], 
                                "clear" => $row['pass'], 
                                "maxScore" => $row['maxScore'], 
                                "meanScore" => $row['meanScore']
                            ]);
            }
        }

        //query sort progress
        $sortProgress = [];
        $stmt = $conn->prepare("SELECT e.sort, attempt, fullScore, maxScore, meanScore 
                                FROM sortprogress sp, elements e
                                WHERE e.elemId = sp.sortId AND sp.userId = :studentId;");
        $stmt->bindParam(':studentId', $user, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach($result as $row)
        {
            if($row['sort'] == 'counting')
            {
                $row['sort'] = 'Distribution Counting Sort';
            }
            else
            {
                $row['sort'][0] = strtoupper($row['sort'][0]);
            }
            array_push($sortProgress, 
                        [
                            "sort" => $row['sort'], 
                            "attempt" => $row['attempt'], 
                            "fullScore" => $row['fullScore'], 
                            "maxScore" => $row['maxScore'], 
                            "meanScore" => $row['meanScore']
                        ]);
        }

        $conn = null;
        echo json_encode(["isGuest" => false, "progress" => $progress, "sort" => $sortProgress]);
    }
} else {
    if ($contentType == "library") {
        //gen all story avaliable
        $content = [];
        $conn = connectDB();
        $stmt = $conn->prepare("SELECT title, contentFile, requireQuest
                                FROM library");
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach($result as $row)
        {
            array_push($content, 
                        [
                            "title" => $row['title'], 
                            "content" => file_get_contents($row['contentFile']), 
                            "require" => $row['requireQuest']
                        ]);
        }
        $conn = null;
        echo json_encode(["isGuest" => true, "allContent" => $content]);
    } else if ($contentType == "progress") {
        $allQuest = [];
        $conn = connectDB();
        $stmt = $conn->prepare("SELECT c.qCatId, q.questId, q.title FROM quests q, chapters c, stages s 
                                WHERE s.stageId = q.stageId AND c.chId = s.chId;
                                ORDER BY q.title");
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach($result as $row)
        {
            array_push($allQuest, 
                        [
                            "category" => $row["qCatId"],
                            "questId" => $row['questId'],
                            "title" => $row['title']
                        ]);
        }
        $conn = null;
        //only echo isGuest = true
        echo json_encode(["isGuest" => true, "questList" => $allQuest]);
    }
}

?>