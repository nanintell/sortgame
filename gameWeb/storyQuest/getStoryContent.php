<?php
session_start();
require '../../database/connectDb.php';

$user = $_SESSION["studentId"];
$questId = $_REQUEST["quest"];
$isGuest = true;
if($user != "guest")
{
    $isGuest = $user;
}

//query story lines
$storyline = [];

$conn = connectDB();

$stmt = $conn->prepare("SELECT speaker, text, 
                            (SELECT spritePath FROM sprites WHERE spriteId = lSpriteId) AS lSprite, 
                            (SELECT spritePath FROM sprites WHERE spriteId = rSpriteId) AS rSprite
                        FROM storytexts
                        WHERE questId = :questId
                        ORDER BY no;");
$stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$result = $stmt->fetchAll();

foreach($result as $row)
{
    $lSprite = "";
    $rSprite = "";
    if(is_null($row['lSprite']) == FALSE)
    {
        $lSprite = $row['lSprite'];
    }
    if(is_null($row['rSprite']) == FALSE)
    {
        $rSprite = $row['rSprite'];
    }
    array_push($storyline, [
        "sprite" => [$lSprite, $rSprite],
        "speaker" => $row['speaker'],
        "text" => $row['text']
    ]);
}

//query story picture
$storyPic = [];

$stmt = $conn->prepare("SELECT picture, start-1 AS start, stop-1 AS stop 
                        FROM storypics
                        WHERE questId = :questId;");
$stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$result = $stmt->fetchAll();

foreach($result as $row)
{
    array_push($storyPic, [
        "picture" => $row['picture'],
        "start" => intval($row['start']),
        "stop" => intval($row['stop'])
    ]);
}

$newContent = [];
$stmt = $conn->prepare("SELECT title FROM library WHERE requireQuest = :questId;");
$stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
$stmt->execute();
$result = $stmt->fetchAll();
if(count($result) > 0) {
    foreach ($result as $row) {
        array_push($newContent, $row["title"]);
    }
}  

$conn = null;

echo json_encode(["isGuest" => $isGuest, "story" => $storyline, "pic" => $storyPic, "newContent" => $newContent]);
?>