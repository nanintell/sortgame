<?php
function connectDB()
{
    //connecting to my local computer
    
    $servername = "localhost:3307";
    $username = "root";
    $password = "";
    $dbname = "sortgame_server";
    

    //connecting to server
    /*$servername = "localhost";
    $username = "cpekmut1_sa";
    $password = "106010501048";
    $dbname = "cpekmut1_sortgame_new";*/

    try {
        $conn = new PDO("mysql:host=" . $servername . ";dbname=" . $dbname . ";charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        return "Connection failed: " . $e->getMessage();
    }
}

?>