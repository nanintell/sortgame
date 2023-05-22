<?php
require '../../database/connectDb.php';

$recordType = $_REQUEST["record"];
$user = $_REQUEST["user"];
$score = $_REQUEST["score"];
$conn = connectDB();
if ($user != "guest") {
    if ($recordType == "sort") {
        $sort = $_REQUEST["sort"];

        //record sort, score
        $stmt = $conn->prepare("UPDATE sortprogress
                                INNER JOIN
                                (
                                    SELECT attempt+1 AS nowAttempt, 
                                        fullScore+(:score = 100) AS nowFull, 
                                        IF(maxScore > :score, maxScore, :score) AS nowMax, 
                                        CONVERT((((meanScore * attempt) + :score) / (attempt + 1)), INTEGER) AS nowMean,
                                        sproId
                                    FROM sortprogress
                                ) AS calcProgress
                                ON sortprogress.sproId = calcProgress.sproId
                                SET attempt = calcProgress.nowAttempt,
                                    fullScore = calcProgress.nowFull,
                                    maxScore = calcProgress.nowMax,
                                    meanScore = calcProgress.nowMean
                                WHERE userId = :userId 
                                AND sortId = (SELECT elemId FROM elements WHERE sort = :sortName)");
        $stmt->bindParam(':score', $score, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
        $stmt->bindParam(':sortName', $sort, PDO::PARAM_STR);
        $stmt->execute();
    } else if ($recordType == "progress") {
        $questId = $_REQUEST["quest"];
        $clear = $_REQUEST["clear"];
        $pass = $_REQUEST["pass"];
        $hasPlayed = $_REQUEST["played"];
        $exp = $_REQUEST["exp"];

        if ($clear == 'true') {
            $clear = 1;
        } else {
            $clear = 0;
        }
        if ($pass == 'true') {
            $pass = 1;
        } else {
            $pass = 0;
        }

        //check if the quest has been played (to counter a case where player completes the same quest in 2 tabs)
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
                                            clear+:clear AS nowClear,
                                            pass+:pass AS nowPass,
                                            IF(maxScore > :score, maxScore, :score) AS nowMax,
                                            CONVERT((((meanScore * attempt) + :score) / (attempt + 1)), INTEGER) AS nowMean,
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
            $stmt->bindParam(':score', $score, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
            $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
            $stmt->bindParam(':pass', $pass, PDO::PARAM_INT);
            $stmt->bindParam(':clear', $clear, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            //ignore if found duplicate row, to prevent users hack
            $stmt = $conn->prepare("INSERT IGNORE INTO questprogress 
                                        (userId, questId, attempt, clear, pass, maxScore, meanScore) 
                                    VALUES (:userId, :questId, 1, :clear, :pass, :score, :score)");
            $stmt->bindParam(':score', $score, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
            $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
            $stmt->bindParam(':pass', $pass, PDO::PARAM_INT);
            $stmt->bindParam(':clear', $clear, PDO::PARAM_INT);
            $stmt->execute();
        }

        //exp will be given to the character in team
        $stmt = $conn->prepare("UPDATE players
                                INNER JOIN(
                                    SELECT exp + :exp AS nowExp, 
                                        playerId
                                    FROM players
                                ) AS newExp
                                ON players.playerId = newExp.playerId
                                SET exp = newExp.nowExp
                                WHERE userId = :userId AND inTeam = 1");
        $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
        $stmt->bindParam(':exp', $exp, PDO::PARAM_INT);
        $stmt->execute();

        //half exp will be given to the character not in team
        $stmt = $conn->prepare("UPDATE players
                                INNER JOIN(
                                    SELECT exp + ( :exp / 2 ) AS nowExp, 
                                        playerId
                                    FROM players
                                ) AS newExp
                                ON players.playerId = newExp.playerId
                                SET exp = newExp.nowExp
                                WHERE userId = :userId AND inTeam = 0");
        $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
        $stmt->bindParam(':exp', $exp, PDO::PARAM_INT);
        $stmt->execute();

        //insert new unlocked character
        if ($score >= 50 && $hasPlayed == "false") {
            /*$stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
            SELECT :userId, charId, 0, 0
            FROM characters
            WHERE requireQuest = :questId
            AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
            $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
            $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
            $stmt->execute();*/

            //check unlocked character
            $unlockedChar = [];
            $stmt = $conn->prepare("SELECT charId, name FROM characters WHERE requireQuest = :questId");
            $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
            $stmt->execute();
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $result = $stmt->fetchAll();
            if (count($result) > 0) {
                $unlockedChar = array_column($result, "name");
                //insert new character to player
                $stmt = $conn->prepare("INSERT INTO players (userId, charId, exp, inTeam)
                SELECT :userId, charId, :exp, 0
                FROM characters
                WHERE requireQuest = :questId
                    AND charId NOT IN (SELECT charId FROM players WHERE userId = :userId);");
                $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
                $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
                $stmt->bindParam(':exp', $exp, PDO::PARAM_INT);
                $stmt->execute();
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
    }
} else if ($user == "guest" && $recordType == "progress") {
    $questId = $_REQUEST["quest"];
    $hasPlayed = $_REQUEST["played"];

    if($score >= 50 && $hasPlayed == "false") {
        $unlockedChar = [];
        $stmt = $conn->prepare("SELECT charId, name FROM characters WHERE requireQuest = :questId");
        $stmt->bindParam(':questId', $questId, PDO::PARAM_INT);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

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
}
$conn = null;
?>