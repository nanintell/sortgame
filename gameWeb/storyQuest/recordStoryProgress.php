<?php
require '../../database/connectDb.php';

$questId = $_REQUEST["quest"];
$hasPlayed = $_REQUEST["played"];
$user = $_REQUEST["user"];

$conn = connectDB();

if ($user != "guest") {
    $exp = $_REQUEST["exp"];
    //update story progress (score in story are fixed to 100 as player only need to read it. 
    //Thus, exp for story quest must be very low!)

    //check if it's really been played or not.
    $stmt = $conn->prepare("SELECT qproId FROM questprogress WHERE userId = :userId AND questId = :questId");
    $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
    $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    if (count($result) > 0) {
        $hasPlayed = 'true';
        if (count($result) > 1) {
            $qproid_tokeep = $result[0]["qproId"];
            $stmt = $conn->prepare("DELETE FROM questprogress WHERE qproId != :qproId AND questId = :questId AND userId = :userId");
            $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
            $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
            $stmt->bindParam(':qproId', $qproid_tokeep, PDO::PARAM_STR);
            $stmt->execute();
        }
    }

    if ($hasPlayed == 'true') {
        $exp = floor($exp / 2);
        $stmt = $conn->prepare("UPDATE questprogress
                                INNER JOIN 
                                (
                                    SELECT attempt+1 AS nowAttempt,
                                        clear+1 AS nowClear,
                                        pass+1 AS nowPass,
                                        100 AS nowMax,
                                        100 AS nowMean,
                                        qproId
                                    FROM questprogress
                                ) as calcProgress
                                ON questprogress.qproId = calcProgress.qproId
                                SET attempt = calcProgress.nowAttempt,
                                    clear = calcProgress.nowClear,
                                    pass = calcProgress.nowPass,
                                    maxScore = calcProgress.nowMax,
                                    meanScore = calcProgress.nowMean
                                WHERE userId = :userId 
                                AND questId = :questId");
        $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
        $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmt->execute();

    } else {
        $stmt = $conn->prepare("INSERT IGNORE INTO questprogress 
                                    (userId, questId, attempt, clear, pass, maxScore, meanScore) 
                                VALUES (:userId, :questId, 1, 1, 1, 100, 100)");
        $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
        $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmt->execute();
    }

    //exp will be given to all character
    $stmt = $conn->prepare("UPDATE players
                            INNER JOIN(
                                SELECT exp + :exp AS nowExp, 
                                    playerId
                                FROM players
                            ) AS newExp
                            ON players.playerId = newExp.playerId
                            SET exp = newExp.nowExp
                            WHERE userId = :userId");
    $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
    $stmt->bindParam(':exp', $exp, PDO::PARAM_INT);
    $stmt->execute();
}

//insert new unlocked character
/*$stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
SELECT :userId, charId, 0, 0
FROM characters
WHERE requireQuest = :questId 
AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
$stmt->bindParam(':userId', $user, PDO::PARAM_STR);
$stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
$stmt->execute();*/

//check unlocked character
if($hasPlayed == "false") {
    $unlockedChar = [];
    $stmt = $conn->prepare("SELECT charId, name FROM characters WHERE requireQuest = :questId");
    $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    if (count($result) > 0) {
        //insert new character to player
        if ($user != "guest") {
            $unlockedChar = array_column($result, "name");
            $stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
            SELECT :userId, charId, :exp, 0
            FROM characters
            WHERE requireQuest = :questId
                AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
            $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
            $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
            $stmt->bindParam(':exp', $exp, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            $unlockedChar = $result;
        }
    }

    //check unlocked element
    $unlockedElem = [];
    $stmt = $conn->prepare("SELECT elemId, name FROM elements WHERE requireQuest = :questId");
    $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    if (count($result) > 0) {
        $unlockedElem = array_column($result, "name");
    }

    //check unlocked quest
    $unlockedQuest = [];
    $stmt = $conn->prepare("SELECT title FROM quests WHERE requireQuest = :questId");
    $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    if (count($result) > 0) {
        $unlockedQuest = array_column($result, "title");
    }

    echo json_encode(["character" => $unlockedChar, "element" => $unlockedElem, "quest" => $unlockedQuest]);
}

$conn = null;
?>