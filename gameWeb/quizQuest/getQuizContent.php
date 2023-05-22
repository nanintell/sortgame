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

//query quiz
$quiz = [];

$conn = connectDB();

$stmt = $conn->prepare("SELECT quizId, question, picture, testElemId,
                            (SELECT spritePath FROM sprites WHERE spriteId = lSpriteId) AS lSprite,
                            (SELECT spritePath FROM sprites WHERE spriteId = rSpriteId) AS rSprite
                        FROM quizzes 
                        WHERE questId = :questId;");
$stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$result = $stmt->fetchAll();

foreach($result as $row)
{
    $lSprite = "";
    $rSprite = "";
    if(!(is_null($row['lSprite'])))
    {
        $lSprite = $row['lSprite'];
    }
    if(!(is_null($row['rSprite'])))
    {
        $rSprite = $row['rSprite'];
    }

    $choices = [];

    $stmtc = $conn->prepare("SELECT choiceId, label FROM choices
                            WHERE quizId = :quizId;");
    $stmtc->bindParam(':quizId', $row['quizId'], PDO::PARAM_STR);
    $stmtc->execute();
    $stmtc->setFetchMode(PDO::FETCH_ASSOC);
    $choiceList = $stmtc->fetchAll();

    foreach($choiceList as $c)
    {
        $stmto = $conn->prepare("SELECT text, correct 
                                FROM options
                                WHERE choiceId = :choiceId;");
        $stmto->bindParam(':choiceId', $c['choiceId'], PDO::PARAM_STR);
        $stmto->execute();
        $stmto->setFetchMode(PDO::FETCH_ASSOC);
        $optionList = $stmto->fetchAll();

        $correctAnswer = [];
        foreach($optionList as $o)
        {
            if($o['correct'] == 1)
            {
                array_push($correctAnswer, $o['text']);
            }
        }

        $options = array_column($optionList, 'text');
        shuffle($options);

        array_push($choices, 
        [
            "label" => $c['label'],
            "correct" => $correctAnswer,
            "option" => $options
        ]);

    }

    array_push($quiz, 
    [
        "question" => $row['question'], 
        "testSort" => $row['testElemId'],
        "sprite" => [$lSprite, $rSprite],
        "picture" => $row['picture'],
        "dropdownChoice" => $choices
    ]);
}

shuffle($quiz);

$conn = null;

echo json_encode(["isGuest" => $isGuest, "quiz" => $quiz]);
?>