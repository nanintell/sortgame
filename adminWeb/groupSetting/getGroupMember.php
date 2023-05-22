<?php
session_start();
require '../../database/connectDb.php';

    //query group
    $group = [];
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT groupId, name, DATE_FORMAT(deadline, '%Y-%m-%d %H:%i') AS deadline FROM usergroups;");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();

    foreach($result as $row)
    {
        $stmtm = $conn->prepare("SELECT userId, studentId, name 
                                FROM users
                                WHERE userId IN 
                                    (SELECT userId FROM groupmembers WHERE groupId = :groupId);");
        $stmtm->bindParam(':groupId', $row["groupId"], PDO::PARAM_STR);
        $stmtm->execute();
        $stmtm->setFetchMode(PDO::FETCH_ASSOC);
        $members = $stmtm->fetchAll();

        $deadline = $row["deadline"];
        if(is_null($deadline))
        {
            $deadline = "";
        }

        array_push($group, 
            [
                "name" => $row["name"],
                "groupId" => $row["groupId"],
                "deadline" => $deadline,
                "member" => $members
            ]
        );
    }

    /*
    SELECT userId, studentId, name
    FROM users
    WHERE userId NOT IN (SELECT userId FROM groupmembers);
    */
    $outsider = [];
    $stmt = $conn->prepare("SELECT userId, studentId, name
                            FROM users
                            WHERE userId NOT IN 
                                (SELECT userId FROM groupmembers);");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $outsider = $stmt->fetchAll();

    $conn = null;
    echo json_encode(["group" => $group, "outsider" => $outsider]);

?>