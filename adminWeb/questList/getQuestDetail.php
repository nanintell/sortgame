<?php
require '../../database/connectDb.php';
session_start();

$conn = connectDB();

$method = $_REQUEST["operation"];

if ($method == "init") {
    //get story pictures
    $storypics = scandir("../../storyPic");
    array_splice($storypics, 0, 2);

    //get all quests
    $quests = [];
    $stmt = $conn->prepare("SELECT questId, title FROM quests ORDER BY title");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($quests, ["id" => $row["questId"], "title" => $row["title"]]);
    }

    //get all background pics
    $bgpics = [];
    $stmt = $conn->prepare("SELECT bgPicId, name, picture FROM backgroundpics");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($bgpics, ["id" => $row["bgPicId"], "name" => $row["name"], "path" => str_replace("../backgroundPics/", "", $row["picture"])]);
    }

    //get all sorts
    $sorts = [];
    $stmt = $conn->prepare('SELECT elemId, sort, name, requireQuest FROM elements');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($sorts, ["id" => $row["elemId"], "name" => $row["sort"], "element" => $row["name"], "required" => $row["requireQuest"]]);
    }

    //get all resistances
    $res = [];
    $stmt = $conn->prepare('SELECT resId, name FROM resistvalues');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($res, ["id" => $row["resId"], "name" => $row["name"]]);
    }

    //get all sprites
    $sprites = [];
    $stmt = $conn->prepare('SELECT spriteId, name FROM sprites');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($sprites, ["id" => $row["spriteId"], "name" => $row["name"]]);
    }

    //get all monsters
    $mobs = [];
    $stmt = $conn->prepare('SELECT mobId, name, hp, spriteId, attack FROM monsters');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        $mobresist = [];
        $stmte = $conn->prepare('SELECT elemId, resId 
                                    FROM elementresistance
                                    WHERE mobId = :mobId');
        $stmte->bindParam(':mobId', $row["mobId"], PDO::PARAM_STR);
        $stmte->execute();
        $stmte->setFetchMode(PDO::FETCH_ASSOC);
        $elemresist = $stmte->fetchAll();
        foreach ($elemresist as $elem) {
            array_push($mobresist, ["element" => $elem["elemId"], "resist" => $elem["resId"]]);
        }

        array_push($mobs, [
            "id" => $row["mobId"],
            "name" => $row["name"],
            "hp" => $row["hp"],
            "spriteId" => $row["spriteId"],
            "attack" => $row["attack"],
            "resist" => $mobresist
        ]);
    }

    //get all chracters
    $characters = [];
    $stmt = $conn->prepare('SELECT charId, name, requireQuest FROM characters');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($characters, ["id" => $row["charId"], "name" => $row["name"], "required" => $row["requireQuest"]]);
    }

    //get all library contents
    $libraryContent = [];
    $stmt = $conn->prepare('SELECT bookId, title, requireQuest FROM library');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach ($result as $row) {
        array_push($libraryContent, ["id" => $row["bookId"], "name" => $row["title"], "required" => $row["requireQuest"]]);
    }
    
    echo json_encode([
        "storypics" => $storypics,
        "quests" => $quests,
        "bgpics" => $bgpics,
        "sorts" => $sorts,
        "res" => $res,
        "sprites" => $sprites,
        "mobs" => $mobs,
        "character" => $characters,
        "library" => $libraryContent
    ]);
} else if ($method == "quest") {
    $questId = $_REQUEST["questId"];
    $qTypeId = $_REQUEST["qTypeId"];

    //get detail depending on type
    if ($qTypeId == 1) {
        //story
        $storytext = [];
        $storypic = [];
        $stmt = $conn->prepare("SELECT speaker, text, lSpriteId, rSpriteId 
                                FROM storytexts
                                WHERE questId = :questId
                                ORDER BY no");
        $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach ($result as $row) {
            $text = "";
            if (strlen($row["speaker"]) > 0) {
                $text = $row["speaker"] . ":" . $row["text"];
            } else {
                $text = $row["text"];
            }
            array_push($storytext, [
                "text" => $text,
                "sprites" => [$row["lSpriteId"], $row["rSpriteId"]],
            ]);
        }

        $stmt = $conn->prepare("SELECT picture, start, stop FROM storypics
                                WHERE questId = :questId");
        $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        foreach ($result as $row) {
            array_push($storypic, [
                "picture" => str_replace("../storyPic/", "", $row["picture"]),
                "range" => [$row["start"], $row["stop"]],
            ]);
        }

        echo json_encode([
            "text" => $storytext,
            "pic" => $storypic
        ]);

    } else if ($qTypeId == 2) {
        //quiz
        $question = [];

        $stmtq = $conn->prepare("SELECT quizId, testElemId, question, lSpriteId, rSpriteId, picture 
                                FROM quizzes
                                WHERE questId = :questId");
        $stmtq->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmtq->execute();
        $stmtq->setFetchMode(PDO::FETCH_ASSOC);
        $quiz = $stmtq->fetchAll();
        
        foreach ($quiz as $q) {
            $dropdown = [];
            $stmtd = $conn->prepare("SELECT choiceId, label 
                                    FROM choices
                                    WHERE quizId = :quizId;");
            $stmtd->bindParam(':quizId', $q["quizId"], PDO::PARAM_STR);
            $stmtd->execute();
            $stmtd->setFetchMode(PDO::FETCH_ASSOC);
            $option = $stmtd->fetchAll();

            foreach($option as $o) {
                $choice = [];
                $stmtc = $conn->prepare("SELECT text, correct 
                                        FROM options
                                        WHERE choiceId = :choiceId;");
                $stmtc->bindParam(':choiceId', $o["choiceId"], PDO::PARAM_STR);
                $stmtc->execute();
                $stmtc->setFetchMode(PDO::FETCH_ASSOC);
                $choice = $stmtc->fetchAll();

                array_push($dropdown, ["label" => $o["label"], "choice" => $choice]);
            }
            array_push($question, ["sort" => $q["testElemId"], 
                                    "question" => $q["question"],
                                    "sprites" => [$q["lSpriteId"], $q["rSpriteId"]],
                                    "picture" => str_replace("../storyPic/", "" , $q["picture"]),
                                    "dropdown" => $dropdown
                                ]);
        }
        echo json_encode(["question" => $question]);
    } else if ($qTypeId == 3) {
        //battle
        $battle = [];
        $stmt = $conn->prepare("SELECT bDescId, bDesc 
                                FROM battlesdetail
                                WHERE questId = :questId");
        $stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        $battle["bDesc"] = $result[0]["bDesc"];

        $stmt = $conn->prepare("SELECT elemId as element, resId as resist
                                FROM shownelementresistance
                                WHERE bDescId = :bDescId
                                ORDER BY element");
        $stmt->bindParam(':bDescId', $result[0]["bDescId"], PDO::PARAM_STR);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $battle["elemresist"] = $stmt->fetchAll();

        $wave = [];

        $stmtw = $conn->prepare("SELECT waveId 
                                FROM waves
                                WHERE questId = :questId
                                ORDER BY no");
        $stmtw->bindParam(':questId', $questId, PDO::PARAM_STR);
        $stmtw->execute();
        $stmtw->setFetchMode(PDO::FETCH_ASSOC);
        $wavemob = $stmtw->fetchAll();

        foreach($wavemob as $w) {
            $stmtw = $conn->prepare("SELECT mobId AS mob, number 
                                    FROM wavemonsters
                                    WHERE waveId = :waveId");
            $stmtw->bindParam(':waveId', $w["waveId"], PDO::PARAM_STR);
            $stmtw->execute();
            $stmtw->setFetchMode(PDO::FETCH_ASSOC);
            array_push($wave, $stmtw->fetchAll());
        }

        $battle["wave"] = $wave;
        echo json_encode(["battle" => $battle]);
    }

}




?>