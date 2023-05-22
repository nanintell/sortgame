<?php
session_start();

require '../../database/connectDb.php';

$rawId = $_REQUEST['id'];
$adminId = trim(strtolower($_REQUEST['id']));

if($rawId != -1)
{
    $adminPwd = $_REQUEST['pwd'];
    //echo $check;
    
    $_SESSION["adminId"] = "";
    $_SESSION["adminName"] = "";
    
    //query check id
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT adminId, 
                                SUBSTRING_INDEX(name, ' ', 1) as firstname
                            FROM admins
                            WHERE (adminId = :adminId 
                                OR TRIM(LOWER(SUBSTRING_INDEX(name, ' ', 1))) = :adminId) 
                            AND (password = :adminPwd);");
    $stmt->bindParam(':adminId', $adminId, PDO::PARAM_STR);
    $stmt->bindParam(':adminPwd', $adminPwd, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    
    //should find only 1 admin
    if (count($result) == 1) {
        $_SESSION["adminId"] = $result[0]['adminId'];
        $_SESSION["adminName"] = $result[0]['firstname'];
    } else {
        $_SESSION["adminId"] = "";
        $_SESSION["adminName"] = "";
    }
    $conn = null;
}

//print_r($result);

//print_r($_SESSION);

$userObj = [];
$userObj["name"] = $_SESSION["adminName"];
$userObj["adminId"] = $_SESSION["adminId"];

echo json_encode($userObj);
?>