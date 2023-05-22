<?php
require '../../database/connectDb.php';
session_start();
$user = $_SESSION["adminId"];

//$contentType = $_REQUEST["content"];

//query quest progress
$conn = connectDB();
$stmt = $conn->prepare("SELECT groupId, name, deadline FROM usergroups;");
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$group = $stmt->fetchAll();

$timeNow = new DateTime();

$progress = [];

foreach($group as $g)
{
    $deadline = new DateTime($g["deadline"]);

    //array_push($progress, ["mode" => $g['name'], "progress" => []]);

    //query users
    $stmtu = $conn->prepare("SELECT userId, studentId 
                            FROM users
                            WHERE userId IN 
                                (SELECT userId FROM groupmembers WHERE groupId = :groupId);");
    $stmtu->bindParam(':groupId', $g['groupId'], PDO::PARAM_STR);
    $stmtu->execute();
    $stmtu->setFetchMode(PDO::FETCH_ASSOC);
    $members = $stmtu->fetchAll();

    $student = [];
    foreach($members as $m)
    {
        //query progress percentage
        $stmtp = $conn->prepare("SELECT q.questId AS totalQuest,
                                    (SELECT qp.qproId 
                                    FROM questprogress qp 
                                    WHERE qp.userId = :userId 
                                        AND qp.pass > 0
                                        AND qp.questId = q.questId) AS playedQuest
                                FROM quests q, stages s, chapters c
                                WHERE c.qCatId = 1 AND q.stageId = s.stageId AND s.chId = c.chId;");
        $stmtp->bindParam(':userId', $m['userId'], PDO::PARAM_STR);
        $stmtp->execute();
        $stmtp->setFetchMode(PDO::FETCH_ASSOC);
        $questProgress = $stmtp->fetchAll();

        $totalQuest = 
            count(
                array_column($questProgress, 'totalQuest')
            );
        $playedQuest = 
            count(
                array_filter(
                    array_column($questProgress, 'playedQuest'), function($x) { return !(is_null($x)); }
                )
            );
        //var_dump(array_column($questProgress, 'totalQuest'));
        //var_dump(array_column($questProgress, 'totalQuest'));
        $progressPercentage = intval(100 * ($playedQuest / $totalQuest));

        $sortLevel = [];

        //if clear game or the group's deadline has past, show actual progress instead of zeros
        if($totalQuest == $playedQuest || $timeNow > $deadline)
        {
            //query sort progress
            $stmtb = $conn->prepare("SELECT 
                                        (SELECT sort 
                                        FROM elements 
                                        WHERE elemId = s.sortId) AS sort,
                                        s.meanScore
                                    FROM sortprogress s
                                    WHERE s.userId = :userId;");
            $stmtb->bindParam(':userId', $m['userId'], PDO::PARAM_STR);
            $stmtb->execute();
            $stmtb->setFetchMode(PDO::FETCH_ASSOC);
            $sortProgress = $stmtb->fetchAll();
            foreach($sortProgress as $sort)
            {
                $level = 1;
                if($sort['meanScore'] > 80)
                {
                    $level = 5;
                }
                else if($sort['meanScore'] > 60)
                {
                    $level = 4;
                }
                else if($sort['meanScore'] > 40)
                {
                    $level = 3;
                }
                else if($sort['meanScore'] > 20)
                {
                    $level = 2;
                }
                else
                {
                    $level = 1;
                }
                $sortLevel[$sort['sort']] = $level;
            }
        }
        else 
        {
            $sortLevel['bubble'] = 0;
            $sortLevel['insertion'] = 0;
            $sortLevel['selection'] = 0;
            $sortLevel['merge'] = 0;
            $sortLevel['quick'] = 0;
            $sortLevel['heap'] = 0;
            $sortLevel['counting'] = 0;
        }
        array_push($student, ["studentId" => $m['studentId'], "progressPercentage" => $progressPercentage, "sortLevel" => $sortLevel]);
    }

    array_push($progress, ["group" => $g['name'], "members" => $student]);
}


$conn = null;
echo json_encode($progress);


?>