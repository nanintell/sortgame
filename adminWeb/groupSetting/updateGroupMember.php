<?php
session_start();
require '../../database/connectDb.php';

$operation = $_REQUEST["method"];

$conn = connectDB();

if ($operation == "update-member") {
    $userId = $_REQUEST["memberIndex"];
    $studentId = $_REQUEST["studentId"];
    $studentName = $_REQUEST["studentName"];

    $stmt = $conn->prepare("UPDATE users SET studentId = :studentId, name = :studentName WHERE userId = :userId");
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_STR);
    $stmt->bindParam(':studentName', $studentName, PDO::PARAM_STR);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    $stmt->execute();
    echo $userId;
} else if ($operation == "insert-member") {
    $groupId = $_REQUEST["groupId"];
    $studentId = $_REQUEST["studentId"];
    $studentName = $_REQUEST["studentName"];

    $stmt = $conn->prepare("INSERT INTO users (userId, studentId, name) VALUES (NULL, :studentId, :studentName)");
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_STR);
    $stmt->bindParam(':studentName', $studentName, PDO::PARAM_STR);
    $stmt->execute();
    $newUserId = $conn->lastInsertId();

    //echo $newUserId;
    $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
    $stmt->execute();

    //insert playable characters
    $stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
                                SELECT :userId, charId, 0, 0
                                FROM characters
                                WHERE requireQuest IS NULL
                                    AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
    $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
    $stmt->execute();

    //insert sortprogress
    $stmt = $conn->prepare("INSERT INTO sortprogress (sproId, userId, sortId, attempt, fullScore, maxScore, meanScore)
                                SELECT NULL, :userId, elemId, 0, 0, 0, 0 
                                FROM elements
                                WHERE sort != 'random'");
    $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(["userId" => $newUserId]);
} else if ($operation == "update-group") {
    $groupId = $_REQUEST["groupId"];
    $groupName = $_REQUEST["name"];
    $groupDeadline = $_REQUEST["deadline"];
    if ($groupDeadline == "" || $groupDeadline == "0000-00-00 00:00") {
        $groupDeadline = NULL;
    }

    $stmt = $conn->prepare("UPDATE usergroups SET name = :groupName, deadline = :groupDeadline WHERE groupId = :groupId");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->bindParam(':groupDeadline', $groupDeadline, PDO::PARAM_STR);
    $stmt->bindParam(':groupName', $groupName, PDO::PARAM_STR);
    $stmt->execute();
    echo $groupId;
    //UPDATE `usergroups` SET `name` = 'CPE Regular Class ', `deadline` = '2023-02-24 03:26:00' WHERE `usergroups`.`groupId` = 1
} else if ($operation == "insert-group") {
    $groupName = $_REQUEST["name"];
    $groupDeadline = $_REQUEST["deadline"];
    if ($groupDeadline == "" || $groupDeadline == "0000-00-00 00:00") {
        $groupDeadline = NULL;
    }

    $stmt = $conn->prepare("INSERT INTO usergroups (groupId, name, deadline) VALUES (NULL, :groupName, :groupDeadline)");
    $stmt->bindParam(':groupDeadline', $groupDeadline, PDO::PARAM_STR);
    $stmt->bindParam(':groupName', $groupName, PDO::PARAM_STR);
    $stmt->execute();
    $newGroupId = $conn->lastInsertId();
    echo json_encode(["groupId" => $newGroupId]);
    //INSERT INTO `usergroups` (`groupId`, `name`, `deadline`) VALUES (NULL, 'a', '2023-02-24 02:02:57')
} else if ($operation == "delete-group") {
    $groupId = $_REQUEST["groupId"];

    $stmt = $conn->prepare("DELETE FROM groupmembers WHERE groupId = :groupId");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->execute();

    $stmt = $conn->prepare("DELETE FROM usergroups WHERE groupId = :groupId");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->execute();

    echo 1;
    //DELETE FROM groupmembers WHERE groupId = 2
    //DELETE FROM usergroups WHERE groupId = 4
} else if ($operation == "delete-member") {
    $groupId = $_REQUEST["groupId"];
    $userId = $_REQUEST["userId"];

    $stmt = $conn->prepare("DELETE FROM groupmembers WHERE userId = :userId AND groupId = :groupId");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    $stmt->execute();

    echo 1;
} else if ($operation == "move-member") {
    $groupId = $_REQUEST["groupId"];
    $userId = $_REQUEST["userId"];

    $stmt = $conn->prepare("DELETE FROM groupmembers WHERE userId = :userId");
    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    $stmt->execute();

    $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
    $stmt->bindParam(':groupId', $groupId, PDO::PARAM_STR);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    $stmt->execute();
    echo 1;
    //INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)
} else if ($operation == "import-group") {
    $group = $_REQUEST["group"];
    $newGroup = [];
    for($i = 0; $i < count($group); $i++) {
        if($group[$i]["groupId"] == -1) {
            $stmt = $conn->prepare("INSERT INTO usergroups (groupId, name, deadline) VALUES (NULL, :groupName, NULL)");
            $stmt->bindParam(':groupName', $group[$i]["name"], PDO::PARAM_STR);
            $stmt->execute();
            $newGroupId = $conn->lastInsertId();
            array_push($newGroup, ["groupId" => $newGroupId, "exist" => $group[$i]["exist"], "name" => $group[$i]["name"], "deadline" => NULL, "member" => []]);
        } else {
            $newGroupId = $group[$i]["groupId"];
            array_push($newGroup, ["groupId" => $group[$i]["groupId"], "exist" => $group[$i]["exist"], "name" => $group[$i]["name"], "deadline" => NULL, "member" => []]);
        }

        foreach($group[$i]["member"] as $m) {
            if($m["userId"] == -1) {
                $stmt = $conn->prepare("INSERT INTO users (userId, studentId, name) VALUES (NULL, :studentId, :studentName)");
                $stmt->bindParam(':studentId', $m["stuId"], PDO::PARAM_STR);
                $stmt->bindParam(':studentName', $m["name"], PDO::PARAM_STR);
                $stmt->execute();
                $newUserId = $conn->lastInsertId();
                
                //echo $newUserId;
                $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
                $stmt->bindParam(':groupId', $newGroupId, PDO::PARAM_STR);
                $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
                $stmt->execute();
            
                //insert playable characters
                $stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
                                            SELECT :userId, charId, 0, 0
                                            FROM characters
                                            WHERE requireQuest IS NULL
                                                AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
                $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
                $stmt->execute();
            
                //insert sortprogress
                $stmt = $conn->prepare("INSERT INTO sortprogress (sproId, userId, sortId, attempt, fullScore, maxScore, meanScore)
                                            SELECT NULL, :userId, elemId, 0, 0, 0, 0 
                                            FROM elements
                                            WHERE sort != 'random'");
                $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
                $stmt->execute();
            
                array_push($newGroup[$i]["member"], ["userId" => $newUserId, "studentId" => $m["stuId"], "name" => $m["name"]]);
            } else {
                $stmt = $conn->prepare("UPDATE users SET name = :name WHERE userId = :userId");
                $stmt->bindParam(':name', $m["name"], PDO::PARAM_STR);
                $stmt->bindParam(':userId', $m["userId"], PDO::PARAM_STR);
                $stmt->execute();
    
                $stmt = $conn->prepare("DELETE FROM groupmembers WHERE userId = :userId");
                $stmt->bindParam(':userId', $m["userId"], PDO::PARAM_STR);
                $stmt->execute();
            
                $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
                $stmt->bindParam(':groupId', $newGroupId, PDO::PARAM_STR);
                $stmt->bindParam(':userId', $m["userId"], PDO::PARAM_STR);
                $stmt->execute();

                array_push($newGroup[$i]["member"], ["userId" => $m["userId"], "studentId" => $m["stuId"], "name" => $m["name"]]);
            }
        }
    }
    echo json_encode(["group" => $newGroup]);
} else if ($operation == "import-member") {
    $groupIndex = $_REQUEST["groupIndex"];
    $users = $_REQUEST["member"];
    $newUsers = [];
    foreach($users as $row) {
        if ($row["userId"] == -1) {
            $stmt = $conn->prepare("INSERT INTO users (userId, studentId, name) VALUES (NULL, :studentId, :studentName)");
            $stmt->bindParam(':studentId', $row["stuId"], PDO::PARAM_STR);
            $stmt->bindParam(':studentName', $row["name"], PDO::PARAM_STR);
            $stmt->execute();
            $newUserId = $conn->lastInsertId();
        
            //echo $newUserId;
            $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
            $stmt->bindParam(':groupId', $groupIndex, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
            $stmt->execute();
        
            //insert playable characters
            $stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
                                        SELECT :userId, charId, 0, 0
                                        FROM characters
                                        WHERE requireQuest IS NULL
                                            AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
            $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
            $stmt->execute();
        
            //insert sortprogress
            $stmt = $conn->prepare("INSERT INTO sortprogress (sproId, userId, sortId, attempt, fullScore, maxScore, meanScore)
                                        SELECT NULL, :userId, elemId, 0, 0, 0, 0 
                                        FROM elements
                                        WHERE sort != 'random'");
            $stmt->bindParam(':userId', $newUserId, PDO::PARAM_STR);
            $stmt->execute();
        
            array_push($newUsers, ["userId" => $newUserId, "studentId" => $row["stuId"], "name" => $row["name"]]);
        } else {
            $stmt = $conn->prepare("UPDATE users SET name = :name WHERE userId = :userId");
            $stmt->bindParam(':name', $row["name"], PDO::PARAM_STR);
            $stmt->bindParam(':userId', $row["userId"], PDO::PARAM_STR);
            $stmt->execute();

            $stmt = $conn->prepare("DELETE FROM groupmembers WHERE userId = :userId");
            $stmt->bindParam(':userId', $row["userId"], PDO::PARAM_STR);
            $stmt->execute();
        
            $stmt = $conn->prepare("INSERT INTO groupmembers (groupId, userId) VALUES (:groupId, :userId)");
            $stmt->bindParam(':groupId', $groupIndex, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $row["userId"], PDO::PARAM_STR);
            $stmt->execute();
        }
    }
    echo json_encode(["newUsers" => $newUsers]);
}

$conn = null;
?>