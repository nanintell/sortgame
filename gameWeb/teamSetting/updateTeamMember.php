<?php
session_start();
$user = $_SESSION["studentId"];
require '../../database/connectDb.php';

//characters (need only id) which are swapped
$team = json_decode($_REQUEST["team"]);
$member = json_decode($_REQUEST["member"]);

if($user != "guest")
{
    $conn = connectDB();
    if(!(is_null($team)))
    {
        $stmt = $conn->prepare("UPDATE players SET inTeam = 1 WHERE playerId = :teamId");
        $stmt->bindParam(':teamId', $team, PDO::PARAM_STR);
        $stmt->execute();
    }
    if(!(is_null($member)))
    {
        $stmt = $conn->prepare("UPDATE players SET inTeam = 0 WHERE playerId = :memberId");
        $stmt->bindParam(':memberId', $member, PDO::PARAM_STR);
        $stmt->execute();
    }

    $conn = null;
    echo json_encode(["isGuest" => false, "status" => 1, "team" => $team, "member" => $member]);
}
else
{
    //update local storage not here
    echo json_encode(["isGuest" => true]);
}

?>