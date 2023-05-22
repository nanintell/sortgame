<?php
require '../../database/connectDb.php';

$check = $_REQUEST['studentId'];
//echo $check;
session_start();

if ($check != 0) {
    $_SESSION["studentId"] = "";
    $_SESSION["name"] = "";
    $_SESSION["deadline"] = "";
    $_SESSION["cleared"] = 0;

    if ($check == "guest") {
        $_SESSION["studentId"] = "guest";
        $_SESSION["name"] = "";
        $conn = connectDB();
        $freeChar = [];
        $stmt = $conn->prepare("SELECT charId FROM characters WHERE requireQuest IS NULL;");
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();
        foreach($result as $row) {
            array_push($freeChar, ["charId" => $row["charId"], "exp" => 0]);
        }
        $conn = null;
    } else {
        //query check id
        $conn = connectDB();
        $stmt = $conn->prepare("SELECT u.userId, u.name, ug.deadline
                                FROM users u, usergroups ug, groupmembers gm
                                WHERE u.userId = gm.userId AND gm.groupId = ug.groupId AND u.studentId = :studentId");
        $stmt->bindParam(':studentId', $check, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        //one student should be in 1 group
        if (count($result) == 1) {
            $_SESSION["studentId"] = $result[0]['userId'];
            $_SESSION["name"] = $result[0]['name'];
            $_SESSION["deadline"] = $result[0]['deadline'];

            //get progress of the found student
            $stmt = $conn->prepare("SELECT q.questId AS totalQuest, 
                        (SELECT qp.qProId 
                        FROM questprogress qp 
                        WHERE qp.questId = q.questId AND userId = :userId) AS playedQuest
                    FROM quests q, stages s, chapters c
                    WHERE q.stageId = s.stageId AND s.chId = c.chId AND c.qCatId = 1");
            $stmt->bindParam(':userId', $_SESSION["studentId"], PDO::PARAM_STR);
            $stmt->execute();
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $result = $stmt->fetchAll();
            $totalQuest = 
                count(
                    array_column($result, 'totalQuest')
                );
            $playedQuest = 
                count(
                    array_filter(
                        array_column($result, 'playedQuest'), function($x) { return !(is_null($x)); }
                    )
                );
            if ($playedQuest == $totalQuest) {
                $_SESSION["cleared"] = 1;
            }

        } else {
            $_SESSION["studentId"] = $check;
            $_SESSION["name"] = "";
            $_SESSION["deadline"] = "";
            $_SESSION["cleared"] = "";
        }


        $conn = null;
    }
}

//print_r($result);

$userObj = [];
$userObj["name"] = $_SESSION["name"];
$userObj["studentId"] = $_SESSION["studentId"];
$userObj["deadline"] = $_SESSION["deadline"];
$userObj["cleared"] = $_SESSION["cleared"];
if ($check == "guest") {
    $userObj["freeChar"] = $freeChar;
}

echo json_encode($userObj);
?>