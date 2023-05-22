<?php
require '../../database/connectDb.php';
session_start();

$conn = connectDB();

$operation = $_REQUEST["method"];

if ($operation == "update-chapter") {
    $name = $_REQUEST["title"];
    $id = $_REQUEST["id"];
    $stmt = $conn->prepare("UPDATE chapters SET name = :title WHERE chId = :chId");
    $stmt->bindParam(":title", $name, PDO::PARAM_STR);
    $stmt->bindParam(":chId", $id, PDO::PARAM_STR);
    $stmt->execute();
    echo 1;
} else if ($operation == "update-stage") {
    $name = $_REQUEST["title"];
    $id = $_REQUEST["id"];
    $stmt = $conn->prepare("UPDATE stages SET name = :title WHERE stageId = :stageId");
    $stmt->bindParam(":title", $name, PDO::PARAM_STR);
    $stmt->bindParam(":stageId", $id, PDO::PARAM_STR);
    $stmt->execute();
    echo 1;
    //UPDATE `stages` SET `name` = 'Stage 1 - Strange Placed' WHERE `stages`.`stageId` = 1
} else if ($operation == "delete-stage") {
    $id = $_REQUEST["id"];
    //like a chapter, deleting a stage requires referenced questIds to be removed either by deleting or updating to null
    //thus, the sql code is also extremely long
    $sql_deleteSt = 
    "   /*SET REQUIRE QUEST TO NULL*/
        UPDATE quests SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        UPDATE characters SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        UPDATE elements SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        UPDATE library SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
        
        /*DELETE INDIRECTLY REFERENCED DATA*/
        DELETE FROM options 
        WHERE choiceId IN 
            (SELECT choiceId FROM choices 
            WHERE quizId IN 
                (SELECT quizId FROM quizzes 
                WHERE questId IN 
                    (SELECT questId FROM quests 
                    WHERE stageId = :stageId
                    )
                )
            );
            
        DELETE FROM choices 
        WHERE quizId IN 
            (SELECT quizId FROM quizzes 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId = :stageId
                )
            );
            
        DELETE FROM shownelementresistance
        WHERE bDescId IN 
            (SELECT bDescId FROM battlesdetail 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId = :stageId
                )
            );
            
        DELETE FROM wavemonsters
        WHERE waveId IN 
            (SELECT waveId FROM waves 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId = :stageId
                )
            );
        
        /*DELETE DIRECTLY REFERENCED DATA*/
        DELETE FROM battlesdetail 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
        
        DELETE FROM questprogress 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
        
        DELETE FROM quizzes 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        DELETE FROM storytexts 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        DELETE FROM storypics 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        DELETE FROM waves 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId = :stageId
            );
            
        /*DELETE QUESTS*/
        DELETE FROM quests 
        WHERE stageId = :stageId;
        
        /*DELETE STAGES*/
        DELETE FROM stages 
        WHERE stageId = :stageId;";
    $stmt = $conn->prepare($sql_deleteSt);
    $stmt->bindParam(":stageId", $id, PDO::PARAM_STR);
    $stmt->execute();
    //delete quest
    //delete stage
    //delete chapter
    echo 1;
} else if ($operation == "delete-chapter") {
    $id = $_REQUEST["id"];
    //deleting a chapter requires referenced questIds to be removed either by deleting or updating to null
    //thus, the sql code is extremely long
    $sql_deleteCh = 
    "   /*SET REQUIRE QUEST TO NULL*/
        UPDATE quests SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        UPDATE characters SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        UPDATE elements SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        UPDATE library SET requireQuest = NULL 
        WHERE requireQuest IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
        
        /*DELETE INDIRECTLY REFERENCED DATA*/
        DELETE FROM options 
        WHERE choiceId IN 
            (SELECT choiceId FROM choices 
            WHERE quizId IN 
                (SELECT quizId FROM quizzes 
                WHERE questId IN 
                    (SELECT questId FROM quests 
                    WHERE stageId IN 
                        (SELECT stageId FROM stages WHERE chId = :chId)
                    )
                )
            );
            
        DELETE FROM choices 
        WHERE quizId IN 
            (SELECT quizId FROM quizzes 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId IN 
                    (SELECT stageId FROM stages WHERE chId = :chId)
                )
            );
            
        DELETE FROM shownelementresistance
        WHERE bDescId IN 
            (SELECT bDescId FROM battlesdetail 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId IN 
                    (SELECT stageId FROM stages WHERE chId = :chId)
                )
            );
            
        DELETE FROM wavemonsters
        WHERE waveId IN 
            (SELECT waveId FROM waves 
            WHERE questId IN 
                (SELECT questId FROM quests 
                WHERE stageId IN 
                    (SELECT stageId FROM stages WHERE chId = :chId)
                )
            );
        
        /*DELETE DIRECTLY REFERENCED DATA*/
        DELETE FROM battlesdetail 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
        
        DELETE FROM questprogress 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
        
        DELETE FROM quizzes 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        DELETE FROM storytexts 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        DELETE FROM storypics 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );
            
        DELETE FROM waves 
        WHERE questId IN 
            (SELECT questId FROM quests 
            WHERE stageId IN 
                (SELECT stageId FROM stages WHERE chId = :chId)
            );

        /*DELETE QUESTS*/
        DELETE FROM quests 
        WHERE stageId IN 
            (SELECT stageId FROM stages WHERE chId = :chId);
        
        /*DELETE STAGES*/
        DELETE FROM stages 
        WHERE chId = :chId;
        
        /*DELETE CHAPTER*/
        DELETE FROM chapters 
        WHERE chId = :chId;";
    $stmt = $conn->prepare($sql_deleteCh);
    $stmt->bindParam(":chId", $id, PDO::PARAM_STR);
    $stmt->execute();
    //delete quest
    //delete stage
    //delete chapter
    echo 1;
} else if ($operation == "delete-quest") {
    $id = $_REQUEST["id"];
    $sql_deleteQ = 
    "   /*SET REQUIRE QUEST TO NULL*/
        UPDATE quests SET requireQuest = NULL 
        WHERE requireQuest = :questId;
            
        UPDATE characters SET requireQuest = NULL 
        WHERE requireQuest = :questId;
            
        UPDATE elements SET requireQuest = NULL 
        WHERE requireQuest = :questId;
            
        UPDATE library SET requireQuest = NULL 
        WHERE requireQuest = :questId;
        
        /*DELETE INDIRECTLY REFERENCED DATA*/
        DELETE FROM options 
        WHERE choiceId IN 
            (SELECT choiceId FROM choices 
            WHERE quizId IN 
                (SELECT quizId FROM quizzes 
                WHERE questId = :questId
                )
            );
            
        DELETE FROM choices 
        WHERE quizId IN 
            (SELECT quizId FROM quizzes 
            WHERE questId = :questId
            );
            
        DELETE FROM shownelementresistance
        WHERE bDescId IN 
            (SELECT bDescId FROM battlesdetail 
            WHERE questId = :questId
            );
            
        DELETE FROM wavemonsters
        WHERE waveId IN 
            (SELECT waveId FROM waves 
            WHERE questId = :questId
            );
        
        /*DELETE DIRECTLY REFERENCED DATA*/
        DELETE FROM battlesdetail 
        WHERE questId = :questId;
        
        DELETE FROM questprogress 
        WHERE questId = :questId;
        
        DELETE FROM quizzes 
        WHERE questId = :questId;
            
        DELETE FROM storytexts 
        WHERE questId = :questId;
            
        DELETE FROM storypics 
        WHERE questId = :questId;
            
        DELETE FROM waves 
        WHERE questId = :questId;
            
        /*DELETE QUESTS*/
        DELETE FROM quests 
        WHERE questId = :questId;";

    $stmt = $conn->prepare($sql_deleteQ);
    $stmt->bindParam(":questId", $id, PDO::PARAM_STR);
    $stmt->execute();
    //delete quest
    //delete stage
    //delete chapter
    echo 1;
} else if ($operation == "insert-chapter") {
    $name = $_REQUEST["title"];
    $category = $_REQUEST["category"];
    $stmt = $conn->prepare("INSERT INTO chapters (chId, qCatId, name) 
                            SELECT NULL, qCatId , :title
                            FROM questcategories 
                            WHERE name = :category");
    $stmt->bindParam(":title", $name, PDO::PARAM_STR);
    $stmt->bindParam(":category", $category, PDO::PARAM_STR);
    $stmt->execute();
    $newCh = $conn->lastInsertId();
    echo json_encode(["chId" => $newCh]);
} else if ($operation == "insert-stage") {
    $name = $_REQUEST["title"];
    $chId = $_REQUEST["chapter"];

    $stmt = $conn->prepare("INSERT INTO stages (stageId, name, chId) 
                            VALUES (NULL, :title, :chId)");
    $stmt->bindParam(":title", $name, PDO::PARAM_STR);
    $stmt->bindParam(":chId", $chId, PDO::PARAM_STR);
    $stmt->execute();
    $newSt = $conn->lastInsertId();
    echo json_encode(["stageId" => $newSt]);
} else if ($operation == "insert-quest") {
    $questinfo = $_REQUEST["questinfo"];
    $stageId = $_REQUEST["stageId"];
    $type = $_REQUEST["type"];
    $newMob = [];

    $stmt = $conn->prepare("INSERT INTO quests (questId, qTypeId, stageId, requireQuest, bgPicId, exp, title, qDesc) 
                            VALUES (NULL, :type, :stageId, :required, :questBg, :questExp, :title, :questDesc)");
    $stmt->bindParam(":questDesc", $questinfo["questDesc"], PDO::PARAM_STR);
    $stmt->bindParam(":title", $questinfo["title"], PDO::PARAM_STR);
    if($questinfo["required"] == "") {
        $questinfo["required"] = NULL;
    }
    $stmt->bindParam(":required", $questinfo["required"], PDO::PARAM_STR);
    $stmt->bindParam(":questExp", $questinfo["questExp"], PDO::PARAM_STR);
    $stmt->bindParam(":questBg", $questinfo["questBg"], PDO::PARAM_STR);
    $stmt->bindParam(":stageId", $stageId, PDO::PARAM_STR);
    $stmt->bindParam(":type", $type, PDO::PARAM_STR);
    $stmt->execute();

    $questId = $conn->lastInsertId();

    if($type == "1") {
        $storytext = $_REQUEST["storytext"];
        $storypics = $_REQUEST["storypics"];

        $stmt = $conn->prepare("INSERT INTO storytexts (tStoryId, questId, no, speaker, text, lSpriteId, rSpriteId) 
                                VALUES (NULL, :questId, :no, :speaker, :text, :lSpriteId, :rSpriteId)");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
    
        for($i = 0 ; $i < count($storytext) ; $i++) {
            $no = $i + 1;
            $stmt->bindParam(":no", $no, PDO::PARAM_STR);
            $stmt->bindParam(":speaker", $storytext[$i]["speaker"], PDO::PARAM_STR);
            $stmt->bindParam(":text", $storytext[$i]["text"], PDO::PARAM_STR);
            if($storytext[$i]["sprite"][0] == "") {
                $storytext[$i]["sprite"][0] = NULL;
            }
            if($storytext[$i]["sprite"][1] == "") {
                $storytext[$i]["sprite"][1] = NULL;
            }
            $stmt->bindParam(":lSpriteId", $storytext[$i]["sprite"][0], PDO::PARAM_STR);
            $stmt->bindParam(":rSpriteId", $storytext[$i]["sprite"][1], PDO::PARAM_STR);
            $stmt->execute();
        }
    
        if($storypics != "") {
            $stmt = $conn->prepare("INSERT INTO storypics (pStoryId, questId, picture, start, stop) VALUES (NULL, :questId, :picture, :start, :stop)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        
            for($i = 0 ; $i < count($storypics) ; $i++) {
                $stmt->bindParam(":picture", $storypics[$i]["pic"], PDO::PARAM_STR);
                $stmt->bindParam(":start", $storypics[$i]["start"], PDO::PARAM_STR);
                $stmt->bindParam(":stop", $storypics[$i]["end"], PDO::PARAM_STR);
                $stmt->execute();
            }
        }
    } else if($type == "2") {
        $question = $_REQUEST["question"];
        
        for ($i = 0 ; $i < count($question) ; $i++) {
            $stmt = $conn->prepare("INSERT INTO quizzes (quizId, questId, testElemId, question, lSpriteId, rSpriteId, picture) 
                                    VALUES (NULL, :questId, :sort, :question, :lSprite, :rSprite, :picture)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
            $stmt->bindParam(":sort", $question[$i]["sort"], PDO::PARAM_STR);
            $stmt->bindParam(":question", $question[$i]["question"], PDO::PARAM_STR);
            if($question[$i]["sprites"][0] == "") {
                $question[$i]["sprites"][0] = NULL;
            }
            $stmt->bindParam(":lSprite", $question[$i]["sprites"][0], PDO::PARAM_STR);
            if($question[$i]["sprites"][1] == "") {
                $question[$i]["sprites"][1] = NULL;
            }
            $stmt->bindParam(":rSprite", $question[$i]["sprites"][1], PDO::PARAM_STR);
            if($question[$i]["pic"] == "") {
                $question[$i]["pic"] = NULL;
            }
            $stmt->bindParam(":picture", $question[$i]["pic"], PDO::PARAM_STR);
            $stmt->execute();
            
            $quizId = $conn->lastInsertId();

            for($j = 0 ; $j < count($question[$i]["dropdown"]); $j++) {
                $stmt = $conn->prepare("INSERT INTO choices (choiceId, quizId, label) VALUES (NULL, :quizId, :label)");
                $stmt->bindParam(":quizId", $quizId, PDO::PARAM_STR);
                $stmt->bindParam(":label", $question[$i]["dropdown"][$j]["label"], PDO::PARAM_STR);
                $stmt->execute();

                $choiceId = $conn->lastInsertId();

                for($k = 0 ; $k < count($question[$i]["dropdown"][$j]["choice"]); $k++) {
                    $stmt = $conn->prepare("INSERT INTO options (optionId, choiceId, text, correct) VALUES (NULL, :choiceId, :text, :correct)");
                    $stmt->bindParam(":choiceId", $choiceId, PDO::PARAM_STR);
                    $stmt->bindParam(":text", $question[$i]["dropdown"][$j]["choice"][$k]["label"], PDO::PARAM_STR);
                    $stmt->bindParam(":correct", $question[$i]["dropdown"][$j]["choice"][$k]["correct"], PDO::PARAM_STR);
                    $stmt->execute();
                }
            }

        }
    } else if($type == "3") {
        $battle = $_REQUEST["battle"];
        //$newMob = [];
        
        $wavecount = count($battle["wave"]);
        $stmt = $conn->prepare("INSERT INTO battlesdetail (bDescId, questId, bDesc, wave) VALUES (NULL, :questId, :desc, :wave)");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->bindParam(":desc", $battle["desc"], PDO::PARAM_STR);
        $stmt->bindParam(":wave", $wavecount, PDO::PARAM_STR);
        $stmt->execute();
        $bDescId = $conn->lastInsertId();

        $stmt = $conn->prepare("INSERT INTO shownelementresistance (bDescId, elemId, resId) VALUES (:bDescId, :elemId, :resId)");
        $stmt->bindParam(":bDescId", $bDescId, PDO::PARAM_STR);
        for($i = 0 ; $i < count($battle["elem"]) ; $i++) {
            if($battle["elem"][$i]["resist"] == "") {
                $battle["elem"][$i]["resist"] = NULL;
            }
            $stmt->bindParam(":resId", $battle["elem"][$i]["resist"], PDO::PARAM_STR);
            $stmt->bindParam(":elemId", $battle["elem"][$i]["element"], PDO::PARAM_STR);
            $stmt->execute();
        }

        //insert new mobs if have
        for($i = 0; $i < count($battle["mob"]); $i++) {
            if($battle["mob"][$i]["mobid"] == "") {
                $stmt = $conn->prepare("INSERT INTO monsters (mobId, name, hp, spriteId, attack) 
                                    VALUES (NULL, :name, :hp, :spriteId, :attack)");
                $stmt->bindParam(":name", $battle["mob"][$i]["detail"]["name"], PDO::PARAM_STR);
                $stmt->bindParam(":hp", $battle["mob"][$i]["detail"]["hp"], PDO::PARAM_INT);
                $stmt->bindParam(":spriteId", $battle["mob"][$i]["detail"]["sprite"], PDO::PARAM_STR);
                $stmt->bindParam(":attack", $battle["mob"][$i]["detail"]["atk"], PDO::PARAM_INT);
                $stmt->execute();
                $mobid = $conn->lastInsertId();

                $stmt = $conn->prepare("INSERT INTO elementresistance (mobId, elemId, resId) 
                                    VALUES (:mobId, :elemId, :resist)");
                $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                for($k = 0 ; $k < count($battle["mob"][$i]["detail"]["element"]) ; $k++) {
                    $stmt->bindParam(":elemId", $battle["mob"][$i]["detail"]["element"][$k]["element"], PDO::PARAM_STR);
                    $stmt->bindParam(":resist", $battle["mob"][$i]["detail"]["element"][$k]["resist"], PDO::PARAM_STR);
                    $stmt->execute();
                }
                $battle["mob"][$i]["mobid"] = $mobid;

                //due to monsters table trigger, we need to check if its name changed or not
                $stmt = $conn->prepare("SELECT name FROM monsters WHERE mobId = :mobId");
                $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                $stmt->execute();
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $mobNewName = $stmt->fetchAll();

                array_push($newMob, [
                    "id" => $mobid, 
                    "attack" => $battle["mob"][$i]["detail"]["atk"], 
                    "hp" => $battle["mob"][$i]["detail"]["hp"], 
                    "name" => $mobNewName[0]["name"], 
                    "spriteId" => $battle["mob"][$i]["detail"]["sprite"], 
                    "resist" => $battle["mob"][$i]["detail"]
                ]);
            }
        }
     
        for($i = 0 ; $i < count($battle["wave"]) ; $i++) {
            $no = $i + 1;
            $stmt = $conn->prepare("INSERT INTO waves (waveId, questId, no) VALUES (NULL, :questId, :no)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
            $stmt->bindParam(":no", $no, PDO::PARAM_STR);
            $stmt->execute();

            $waveId = $conn->lastInsertId();

            for($j = 0 ; $j < count($battle["wave"][$i]) ; $j++) {
                $stmt = $conn->prepare("INSERT INTO wavemonsters (waveId, mobId, number) 
                                        VALUES (:waveId, :mobId, :number)");
                $stmt->bindParam(":waveId", $waveId, PDO::PARAM_STR);
                $stmt->bindParam(":mobId", $battle["mob"][$battle["wave"][$i][$j]["mobid"]]["mobid"], PDO::PARAM_STR);
                $stmt->bindParam(":number", $battle["wave"][$i][$j]["number"], PDO::PARAM_STR);
                $stmt->execute();
            }
        }
    }
    if(count($newMob) > 0) {
        echo json_encode(["questId" => $questId, "newMob" => $newMob]);
    } else {
        echo json_encode(["questId" => $questId]);
    }
} else if ($operation == "update-quest") {
    $questId = $_REQUEST["questId"];
    $questinfo = $_REQUEST["questinfo"];
    $oldtype = $_REQUEST["oldtype"];
    $type = $_REQUEST["type"];
    $newMob = [];

    $stmt = $conn->prepare("UPDATE quests 
                            SET qDesc = :questDesc, title = :title, requireQuest = :required, exp = :questExp, bgPicId = :questBg, qTypeId = :type
                            WHERE questId = :questId");
    $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
    $stmt->bindParam(":type", $type, PDO::PARAM_STR);
    $stmt->bindParam(":questDesc", $questinfo["questDesc"], PDO::PARAM_STR);
    $stmt->bindParam(":title", $questinfo["title"], PDO::PARAM_STR);
    if($questinfo["required"] == "") {
        $questinfo["required"] = NULL;
    }
    $stmt->bindParam(":required", $questinfo["required"], PDO::PARAM_STR);
    $stmt->bindParam(":questExp", $questinfo["questExp"], PDO::PARAM_STR);
    $stmt->bindParam(":questBg", $questinfo["questBg"], PDO::PARAM_STR);
    $stmt->execute();

    //delete old type data
    if($oldtype == "2") {
        $sqlDeleteQuiz = "
            DELETE FROM options 
                WHERE choiceId IN 
                    (SELECT choiceId FROM choices 
                    WHERE quizId IN 
                        (SELECT quizId FROM quizzes 
                        WHERE questId = :questId
                        )
                    );
            DELETE FROM choices 
                WHERE quizId IN 
                    (SELECT quizId FROM quizzes 
                    WHERE questId = :questId
                    );
            DELETE FROM quizzes 
                WHERE questId = :questId;
        ";
        $stmt = $conn->prepare($sqlDeleteQuiz);
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
    } else if($oldtype == "3") {
        $sqlDeleteBattle = "
            DELETE FROM shownelementresistance
                WHERE bDescId IN 
                    (SELECT bDescId FROM battlesdetail 
                    WHERE questId = :questId
                    );
            DELETE FROM wavemonsters
                WHERE waveId IN 
                    (SELECT waveId FROM waves 
                    WHERE questId = :questId
                    );
            DELETE FROM battlesdetail 
                WHERE questId = :questId;
            DELETE FROM waves 
                WHERE questId = :questId;
        ";
        $stmt = $conn->prepare($sqlDeleteBattle);
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
    } else if($oldtype == "1") {
        $sqlDeleteStory = "
            DELETE FROM storytexts WHERE questId = :questId;
            DELETE FROM storypics WHERE questId = :questId;
        ";
        $stmt = $conn->prepare($sqlDeleteStory);
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
    }

    if($type == "1") {
        $storytext = $_REQUEST["storytext"];
        $storypics = $_REQUEST["storypics"];

        $stmt = $conn->prepare("DELETE FROM storytexts WHERE questId = :questId");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
    
        $stmt = $conn->prepare("INSERT INTO storytexts (tStoryId, questId, no, speaker, text, lSpriteId, rSpriteId) 
                                VALUES (NULL, :questId, :no, :speaker, :text, :lSpriteId, :rSpriteId)");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
    
        for($i = 0 ; $i < count($storytext) ; $i++) {
            $no = $i + 1;
            $stmt->bindParam(":no", $no, PDO::PARAM_STR);
            $stmt->bindParam(":speaker", $storytext[$i]["speaker"], PDO::PARAM_STR);
            $stmt->bindParam(":text", $storytext[$i]["text"], PDO::PARAM_STR);
            if($storytext[$i]["sprite"][0] == "") {
                $storytext[$i]["sprite"][0] = NULL;
            }
            if($storytext[$i]["sprite"][1] == "") {
                $storytext[$i]["sprite"][1] = NULL;
            }
            $stmt->bindParam(":lSpriteId", $storytext[$i]["sprite"][0], PDO::PARAM_STR);
            $stmt->bindParam(":rSpriteId", $storytext[$i]["sprite"][1], PDO::PARAM_STR);
            $stmt->execute();
        }
    
        $stmt = $conn->prepare("DELETE FROM storypics WHERE questId = :questId");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
    
        if($storypics != "") {
            $stmt = $conn->prepare("INSERT INTO storypics (pStoryId, questId, picture, start, stop) VALUES (NULL, :questId, :picture, :start, :stop)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        
            for($i = 0 ; $i < count($storypics) ; $i++) {
                $stmt->bindParam(":picture", $storypics[$i]["pic"], PDO::PARAM_STR);
                $stmt->bindParam(":start", $storypics[$i]["start"], PDO::PARAM_STR);
                $stmt->bindParam(":stop", $storypics[$i]["end"], PDO::PARAM_STR);
                $stmt->execute();
            }
        }
    } else if($type == "2") {
        $question = $_REQUEST["question"];

        $sqlDeleteQuiz = "
            DELETE FROM options 
                WHERE choiceId IN 
                    (SELECT choiceId FROM choices 
                    WHERE quizId IN 
                        (SELECT quizId FROM quizzes 
                        WHERE questId = :questId
                        )
                    );
            DELETE FROM choices 
                WHERE quizId IN 
                    (SELECT quizId FROM quizzes 
                    WHERE questId = :questId
                    );
            DELETE FROM quizzes 
                WHERE questId = :questId;
        ";
        $stmt = $conn->prepare($sqlDeleteQuiz);
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();
        
        for ($i = 0 ; $i < count($question) ; $i++) {
            $stmt = $conn->prepare("INSERT INTO quizzes (quizId, questId, testElemId, question, lSpriteId, rSpriteId, picture) 
                                    VALUES (NULL, :questId, :sort, :question, :lSprite, :rSprite, :picture)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
            $stmt->bindParam(":sort", $question[$i]["sort"], PDO::PARAM_STR);
            $stmt->bindParam(":question", $question[$i]["question"], PDO::PARAM_STR);
            if($question[$i]["sprites"][0] == "") {
                $question[$i]["sprites"][0] = NULL;
            }
            $stmt->bindParam(":lSprite", $question[$i]["sprites"][0], PDO::PARAM_STR);
            if($question[$i]["sprites"][1] == "") {
                $question[$i]["sprites"][1] = NULL;
            }
            $stmt->bindParam(":rSprite", $question[$i]["sprites"][1], PDO::PARAM_STR);
            if($question[$i]["pic"] == "") {
                $question[$i]["pic"] = NULL;
            }
            $stmt->bindParam(":picture", $question[$i]["pic"], PDO::PARAM_STR);
            $stmt->execute();
            
            $quizId = $conn->lastInsertId();

            for($j = 0 ; $j < count($question[$i]["dropdown"]); $j++) {
                $stmt = $conn->prepare("INSERT INTO choices (choiceId, quizId, label) VALUES (NULL, :quizId, :label)");
                $stmt->bindParam(":quizId", $quizId, PDO::PARAM_STR);
                $stmt->bindParam(":label", $question[$i]["dropdown"][$j]["label"], PDO::PARAM_STR);
                $stmt->execute();

                $choiceId = $conn->lastInsertId();

                for($k = 0 ; $k < count($question[$i]["dropdown"][$j]["choice"]); $k++) {
                    $stmt = $conn->prepare("INSERT INTO options (optionId, choiceId, text, correct) VALUES (NULL, :choiceId, :text, :correct)");
                    $stmt->bindParam(":choiceId", $choiceId, PDO::PARAM_STR);
                    $stmt->bindParam(":text", $question[$i]["dropdown"][$j]["choice"][$k]["label"], PDO::PARAM_STR);
                    $stmt->bindParam(":correct", $question[$i]["dropdown"][$j]["choice"][$k]["correct"], PDO::PARAM_STR);
                    $stmt->execute();
                }
            }

        }
    } else if ($type == "3") {
        $battle = $_REQUEST["battle"];
        //$newMob = [];
        
        $wavecount = count($battle["wave"]);
        $stmt = $conn->prepare("UPDATE battlesdetail SET bDesc = :desc, wave = :wave WHERE questId = :questId");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->bindParam(":desc", $battle["desc"], PDO::PARAM_STR);
        $stmt->bindParam(":wave", $wavecount, PDO::PARAM_STR);
        $stmt->execute();

        $stmt = $conn->prepare("UPDATE shownelementresistance SET resId = :resId 
                                WHERE bDescId IN (SELECT bDescId FROM battlesdetail WHERE questId = :questId) 
                                    AND elemId = :elemId");
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        for($i = 0 ; $i < count($battle["elem"]) ; $i++) {
            if($battle["elem"][$i]["resist"] == "") {
                $battle["elem"][$i]["resist"] = NULL;
            }
            $stmt->bindParam(":resId", $battle["elem"][$i]["resist"], PDO::PARAM_STR);
            $stmt->bindParam(":elemId", $battle["elem"][$i]["element"], PDO::PARAM_STR);
            $stmt->execute();
        }

        $sqlDeleteBattle = "
            DELETE FROM wavemonsters
                WHERE waveId IN 
                    (SELECT waveId FROM waves 
                    WHERE questId = :questId
                    );
            DELETE FROM waves 
                WHERE questId = :questId;
        ";
        $stmt = $conn->prepare($sqlDeleteBattle);
        $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
        $stmt->execute();

        //insert new mobs if have
        for($i = 0; $i < count($battle["mob"]); $i++) {
            if($battle["mob"][$i]["mobid"] == "") {
                $stmt = $conn->prepare("INSERT INTO monsters (mobId, name, hp, spriteId, attack) 
                                    VALUES (NULL, :name, :hp, :spriteId, :attack)");
                $stmt->bindParam(":name", $battle["mob"][$i]["detail"]["name"], PDO::PARAM_STR);
                $stmt->bindParam(":hp", $battle["mob"][$i]["detail"]["hp"], PDO::PARAM_INT);
                $stmt->bindParam(":spriteId", $battle["mob"][$i]["detail"]["sprite"], PDO::PARAM_STR);
                $stmt->bindParam(":attack", $battle["mob"][$i]["detail"]["atk"], PDO::PARAM_INT);
                $stmt->execute();
                $mobid = $conn->lastInsertId();

                $stmt = $conn->prepare("INSERT INTO elementresistance (mobId, elemId, resId) 
                                    VALUES (:mobId, :elemId, :resist)");
                $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                for($k = 0 ; $k < count($battle["mob"][$i]["detail"]["element"]) ; $k++) {
                    $stmt->bindParam(":elemId", $battle["mob"][$i]["detail"]["element"][$k]["element"], PDO::PARAM_STR);
                    $stmt->bindParam(":resist", $battle["mob"][$i]["detail"]["element"][$k]["resist"], PDO::PARAM_STR);
                    $stmt->execute();
                }
                $battle["mob"][$i]["mobid"] = $mobid;

                //due to monsters table trigger, we need to check if its name changed or not
                $stmt = $conn->prepare("SELECT name FROM monsters WHERE mobId = :mobId");
                $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                $stmt->execute();
                $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $mobNewName = $stmt->fetchAll();

                array_push($newMob, [
                    "id" => $mobid, 
                    "attack" => $battle["mob"][$i]["detail"]["atk"], 
                    "hp" => $battle["mob"][$i]["detail"]["hp"], 
                    "name" => $mobNewName[0]["name"], 
                    "spriteId" => $battle["mob"][$i]["detail"]["sprite"], 
                    "resist" => $battle["mob"][$i]["detail"]
                ]);
            }
        }
     
        for($i = 0 ; $i < count($battle["wave"]) ; $i++) {
            $no = $i + 1;
            $stmt = $conn->prepare("INSERT INTO waves (waveId, questId, no) VALUES (NULL, :questId, :no)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
            $stmt->bindParam(":no", $no, PDO::PARAM_STR);
            $stmt->execute();

            $waveId = $conn->lastInsertId();

            for($j = 0 ; $j < count($battle["wave"][$i]) ; $j++) {
                $stmt = $conn->prepare("INSERT INTO wavemonsters (waveId, mobId, number) 
                                        VALUES (:waveId, :mobId, :number)");
                $stmt->bindParam(":waveId", $waveId, PDO::PARAM_STR);
                $stmt->bindParam(":mobId", $battle["mob"][$battle["wave"][$i][$j]["mobid"]]["mobid"], PDO::PARAM_STR);
                $stmt->bindParam(":number", $battle["wave"][$i][$j]["number"], PDO::PARAM_STR);
                $stmt->execute();
            }
        }
    }

    if(count($newMob) > 0) {
        echo json_encode(["status" => 1, "newMob" => $newMob]);
    } else if($type == "3" && count($newMob) == 0) {
        echo json_encode(["status" => 1]);
    } else {
        echo 1;
    }

    //UPDATE battlesdetail SET bDesc = :desc, wave = '3' WHERE questId = :questId
    //SELECT bDescId FROM shownelementresistance WHERE bDescId IN (SELECT bDescId FROM battlesdetail WHERE questId = 6);
    //INSERT INTO waves (waveId, questId, no) VALUES (NULL, '4', '1')
    //INSERT INTO monsters (mobId, name, hp, spriteId, attack) VALUES (NULL, :name, :hp, :spriteId, :attack)
    //INSERT INTO elementresistance (mobId, elemId, resId) VALUES (:mobId, :elemId, :resist)
    //INSERT INTO wavemonsters (waveId, mobId, number) VALUES (:waveId, :mobId, :number)
} else if ($operation == "import-quest") {
    $quests = $_REQUEST["questimport"];
    $stageId = $_REQUEST["stageId"];
    $newMob = [];
    $newQuestId = [];

    foreach($quests as $questinfo) {
        $stmt = $conn->prepare("INSERT INTO quests (questId, qTypeId, stageId, requireQuest, bgPicId, exp, title, qDesc) 
                                VALUES (NULL, :type, :stageId, NULL, :questBg, :questExp, :title, :questDesc)");
        $stmt->bindParam(":questDesc", $questinfo["quest description"], PDO::PARAM_STR);
        $stmt->bindParam(":title", $questinfo["title"], PDO::PARAM_STR);
        $stmt->bindParam(":questExp", $questinfo["exp"], PDO::PARAM_STR);
        $stmt->bindParam(":questBg", $questinfo["background picture"], PDO::PARAM_STR);
        $stmt->bindParam(":stageId", $stageId, PDO::PARAM_STR);
        $questtypeid = 1;
        if($questinfo["quest type"] == "story") {
            $questtypeid = 1;
        } else if ($questinfo["quest type"] == "battle") {
            $questtypeid = 3;
        } else if ($questinfo["quest type"] == "quiz") {
            $questtypeid = 2;
        }
        $stmt->bindParam(":type", $questtypeid, PDO::PARAM_STR);
        $stmt->execute();
        $questId = $conn->lastInsertId();

        if($questinfo["quest type"] == "story") {
            $stmt = $conn->prepare("INSERT INTO storytexts (tStoryId, questId, no, speaker, text, lSpriteId, rSpriteId) 
                        VALUES (NULL, :questId, :no, :speaker, :text, :lSpriteId, :rSpriteId)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);

            for($i = 0 ; $i < count($questinfo["storyline"]) ; $i++) {
                $no = $i + 1;
                $stmt->bindParam(":no", $no, PDO::PARAM_STR);
                $stmt->bindParam(":speaker", $questinfo["storyline"][$i]["speaker"], PDO::PARAM_STR);
                $stmt->bindParam(":text", $questinfo["storyline"][$i]["line"], PDO::PARAM_STR);
                if($questinfo["storyline"][$i]["left sprite"] == "") {
                    $questinfo["storyline"][$i]["left sprite"] = NULL;
                }
                if($questinfo["storyline"][$i]["right sprite"] == "") {
                    $questinfo["storyline"][$i]["right sprite"] = NULL;
                }
                $stmt->bindParam(":lSpriteId", $questinfo["storyline"][$i]["left sprite"], PDO::PARAM_STR);
                $stmt->bindParam(":rSpriteId", $questinfo["storyline"][$i]["right sprite"], PDO::PARAM_STR);
                $stmt->execute();
            }

            if(count($questinfo["story picture"]) > 0) {
                $stmt = $conn->prepare("INSERT INTO storypics (pStoryId, questId, picture, start, stop) VALUES (NULL, :questId, :picture, :start, :stop)");
                $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);

                for($i = 0 ; $i < count($questinfo["story picture"]) ; $i++) {
                    $stmt->bindParam(":picture", $questinfo["story picture"][$i]["picture"], PDO::PARAM_STR);
                    $stmt->bindParam(":start", $questinfo["story picture"][$i]["start"], PDO::PARAM_STR);
                    $stmt->bindParam(":stop", $questinfo["story picture"][$i]["end"], PDO::PARAM_STR);
                    $stmt->execute();
                }
            }
        } else if ($questinfo["quest type"] == "battle") {
            $wavecount = count($questinfo["wave"]);
            $stmt = $conn->prepare("INSERT INTO battlesdetail (bDescId, questId, bDesc, wave) VALUES (NULL, :questId, :desc, :wave)");
            $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
            $stmt->bindParam(":desc", $questinfo["battle desc"]["desc"], PDO::PARAM_STR);
            $stmt->bindParam(":wave", $wavecount, PDO::PARAM_STR);
            $stmt->execute();
            $bDescId = $conn->lastInsertId();
    
            $stmt = $conn->prepare("INSERT INTO shownelementresistance (bDescId, elemId, resId) 
                                        SELECT :bDescId, elemId, :resId FROM elements WHERE name = :elemName");
            $stmt->bindParam(":bDescId", $bDescId, PDO::PARAM_STR);
            $bdesc_prop = array_keys($questinfo["battle desc"]);
            for($i = 0 ; $i < count($questinfo["battle desc"]) ; $i++) {
                if($bdesc_prop[$i] != "desc") {
                    if($questinfo["battle desc"][$bdesc_prop[$i]] == "") {
                        $questinfo["battle desc"][$bdesc_prop[$i]] = NULL;
                    }
                    $stmt->bindParam(":resId", $questinfo["battle desc"][$bdesc_prop[$i]], PDO::PARAM_STR);
                    $stmt->bindParam(":elemName", $bdesc_prop[$i], PDO::PARAM_STR);
                    $stmt->execute();
                }
            }

            for($i = 0; $i < count($questinfo["monsters"]); $i++) {
                if($questinfo["monsters"][$i]["existMob"] == "") {
                    $stmt = $conn->prepare("INSERT INTO monsters (mobId, name, hp, spriteId, attack) 
                                        VALUES (NULL, :name, :hp, :spriteId, :attack)");
                    $stmt->bindParam(":name", $questinfo["monsters"][$i]["name"], PDO::PARAM_STR);
                    $stmt->bindParam(":hp", $questinfo["monsters"][$i]["hp"], PDO::PARAM_INT);
                    $stmt->bindParam(":spriteId", $questinfo["monsters"][$i]["sprite"], PDO::PARAM_STR);
                    $stmt->bindParam(":attack", $questinfo["monsters"][$i]["attack"], PDO::PARAM_INT);
                    $stmt->execute();
                    $mobid = $conn->lastInsertId();

                    $stmt = $conn->prepare("INSERT INTO elementresistance (mobId, elemId, resId) 
                                        VALUES (:mobId, :elemId, :resist)");
                    $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                    $mobProp = array_keys($questinfo["monsters"][$i]["element"]);
                    $elementResist = [];
                    for($k = 0 ; $k < count($questinfo["monsters"][$i]["element"]) ; $k++) {
                        //echo $mobProp[$k];
                        //echo $questinfo["monsters"][$i]["element"][$mobProp[$k]];

                        $elemId = intval($mobProp[$k]) + 1;
                        $stmt->bindParam(":elemId", $elemId, PDO::PARAM_STR);
                        $stmt->bindParam(":resist", $questinfo["monsters"][$i]["element"][$mobProp[$k]], PDO::PARAM_STR);
                        $stmt->execute();
                        array_push($elementResist, ["element" => $mobProp[$k], "resist" => $questinfo["monsters"][$i]["element"][$mobProp[$k]]]);
                    }
                    $questinfo["monsters"][$i]["existMob"] = $mobid;

                    //due to monsters table trigger, we need to check if its name changed or not
                    $stmt = $conn->prepare("SELECT name FROM monsters WHERE mobId = :mobId");
                    $stmt->bindParam(":mobId", $mobid, PDO::PARAM_STR);
                    $stmt->execute();
                    $stmt->setFetchMode(PDO::FETCH_ASSOC);
                    $mobNewName = $stmt->fetchAll();

                    array_push($newMob, [
                        "id" => $mobid, 
                        "attack" => $questinfo["monsters"][$i]["attack"], 
                        "hp" => $questinfo["monsters"][$i]["hp"], 
                        "name" => $mobNewName[0]["name"], 
                        "spriteId" => $questinfo["monsters"][$i]["sprite"], 
                        "resist" => $elementResist
                    ]);
                }
            }
         
            for($i = 0 ; $i < count($questinfo["wave"]) ; $i++) {
                $no = $i + 1;
                $stmt = $conn->prepare("INSERT INTO waves (waveId, questId, no) VALUES (NULL, :questId, :no)");
                $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
                $stmt->bindParam(":no", $no, PDO::PARAM_STR);
                $stmt->execute();
    
                $waveId = $conn->lastInsertId();
    
                for($j = 0 ; $j < count($questinfo["wave"][$i]) ; $j++) {
                    $mobinwave = 0;
                    foreach($questinfo["monsters"] as $m) {
                        if ($questinfo["wave"][$i][$j]["mob"] == $m["id"]) {
                            $mobinwave = $m["existMob"];
                        }
                    }

                    $stmt = $conn->prepare("INSERT INTO wavemonsters (waveId, mobId, number) 
                                            VALUES (:waveId, :mobId, :number)");
                    $stmt->bindParam(":waveId", $waveId, PDO::PARAM_STR);
                    $stmt->bindParam(":mobId", $mobinwave, PDO::PARAM_STR);
                    $stmt->bindParam(":number", $questinfo["wave"][$i][$j]["number"], PDO::PARAM_STR);
                    $stmt->execute();
                }
            }
        } else if ($questinfo["quest type"] == "quiz") {
            for ($i = 0 ; $i < count($questinfo["question"]) ; $i++) {
                $stmt = $conn->prepare("INSERT INTO quizzes (quizId, questId, testElemId, question, lSpriteId, rSpriteId, picture) 
                                        VALUES (NULL, :questId, :sort, :question, :lSprite, :rSprite, :picture)");
                $stmt->bindParam(":questId", $questId, PDO::PARAM_STR);
                $stmt->bindParam(":sort", $questinfo["question"][$i]["sort"], PDO::PARAM_STR);
                $stmt->bindParam(":question", $questinfo["question"][$i]["question"], PDO::PARAM_STR);
                if($questinfo["question"][$i]["left sprite"] == "") {
                    $questinfo["question"][$i]["left sprite"] = NULL;
                }
                $stmt->bindParam(":lSprite", $questinfo["question"][$i]["sprite"][0], PDO::PARAM_STR);
                if($questinfo["question"][$i]["right sprite"] == "") {
                    $questinfo["question"][$i]["right sprite"] = NULL;
                }
                $stmt->bindParam(":rSprite", $questinfo["question"][$i]["right sprite"], PDO::PARAM_STR);
                if($questinfo["question"][$i]["picture"] == "") {
                    $questinfo["question"][$i]["picture"] = NULL;
                }
                $stmt->bindParam(":picture", $questinfo["question"][$i]["picture"], PDO::PARAM_STR);
                $stmt->execute();
                
                $quizId = $conn->lastInsertId();
    
                for($j = 0 ; $j < count($questinfo["question"][$i]["dropdown"]); $j++) {
                    $stmt = $conn->prepare("INSERT INTO choices (choiceId, quizId, label) VALUES (NULL, :quizId, :label)");
                    $stmt->bindParam(":quizId", $quizId, PDO::PARAM_STR);
                    $stmt->bindParam(":label", $questinfo["question"][$i]["dropdown"][$j]["label"], PDO::PARAM_STR);
                    $stmt->execute();
    
                    $choiceId = $conn->lastInsertId();
    
                    for($k = 0 ; $k < count($questinfo["question"][$i]["dropdown"][$j]["choice"]); $k++) {
                        $stmt = $conn->prepare("INSERT INTO options (optionId, choiceId, text, correct) VALUES (NULL, :choiceId, :text, :correct)");
                        $stmt->bindParam(":choiceId", $choiceId, PDO::PARAM_STR);
                        $stmt->bindParam(":text", $questinfo["question"][$i]["dropdown"][$j]["choice"][$k]["label"], PDO::PARAM_STR);
                        $stmt->bindParam(":correct", $questinfo["question"][$i]["dropdown"][$j]["choice"][$k]["correct"], PDO::PARAM_STR);
                        $stmt->execute();
                    }
                }
            }
        }

        //$questinfo["db_id"] = $questId;
        array_push($newQuestId, $questId);
    }
    $req = [];
    for ($i = 0; $i < count($quests); $i++) {
        if($quests[$i]["required quest"] != "") {
            $stmt = $conn->prepare("UPDATE quests SET requireQuest = :req WHERE questId = :questId");
            $stmt->bindParam(":questId", $newQuestId[$i], PDO::PARAM_STR);

            if($quests[$i]["required quest"]["inDb"] == 1) {
                $stmt->bindParam(":req", $quests[$i]["required quest"]["id"], PDO::PARAM_STR);
                array_push($req, $quests[$i]["required quest"]["id"]);
            } else {
                $stmt->bindParam(":req", $newQuestId[$quests[$i]["required quest"]["id"]], PDO::PARAM_STR);
                array_push($req, $newQuestId[$quests[$i]["required quest"]["id"]]);
            }
            $stmt->execute();
        } else {
            array_push($req, "");
        }
    }

    if(count($newMob) > 0) {
        echo json_encode(["required" => $req, "questId" => $newQuestId, "newMob" => $newMob]);
    } else {
        echo json_encode(["required" => $req, "questId" => $newQuestId]);
    }
} else if ($operation == "update-require-character") {
    $charId = $_REQUEST["charId"];
    $questId = $_REQUEST["require"];
    $stmt = $conn->prepare("UPDATE characters SET requireQuest = :reqQuest WHERE charId = :charId");
    $stmt->bindParam(":charId", $charId, PDO::PARAM_STR);
    $stmt->bindParam(":reqQuest", $questId, PDO::PARAM_STR);
    $stmt->execute();
} else if ($operation == "update-require-element") {
    $elemId = $_REQUEST["elemId"];
    $questId = $_REQUEST["require"];
    $stmt = $conn->prepare("UPDATE elements SET requireQuest = :reqQuest WHERE elemId = :elemId");
    $stmt->bindParam(":elemId", $elemId, PDO::PARAM_STR);
    $stmt->bindParam(":reqQuest", $questId, PDO::PARAM_STR);
    $stmt->execute();
} else if ($operation == "update-require-library") {
    $bookId = $_REQUEST["bookId"];
    $questId = $_REQUEST["require"];
    $stmt = $conn->prepare("UPDATE chapters SET requireQuest = :reqQuest WHERE bookId = :bookId");
    $stmt->bindParam(":bookId", $bookId, PDO::PARAM_STR);
    $stmt->bindParam(":reqQuest", $questId, PDO::PARAM_STR);
    $stmt->execute();
} else if ($operation == "import-storypic") {
    $storyPic = $_FILES["story-pic-img-file"];
    $storyFileName = $_REQUEST["story-pic-name"];
    $storyPath = "../../storyPic/";
    $extension = pathinfo($storyPic["name"], PATHINFO_EXTENSION);
    if ($storyFileName != "") {
        $storyFileName = $storyFileName . '.' . $extension; 
    } else {
        $storyFileName = basename($storyPic["name"]); 
    }
    $storyPath = $storyPath . $storyFileName;
    $status = move_uploaded_file($storyPic["tmp_name"], $storyPath);
    if ($status == true) {
        echo json_encode(["status" => 1, "fileName" => $storyFileName]);
    } else {
        echo json_encode(["status" => 0]);
    }
} else if ($operation == "import-bg") {
    $bgPic = $_FILES["bg-img-file"];
    $bgFileName = $_REQUEST["bg-name"];
    $bgPath = "../backgroundPics/";
    $bgName = "";
    $newBgId = "";
    $extension = pathinfo($bgPic["name"], PATHINFO_EXTENSION);
    if ($bgFileName != "") {
        $bgFileName = $bgFileName . '.' . $extension; 
    } else {
        $bgFileName = basename($bgPic["name"]); 
    }
    $bgName = str_replace('.' . $extension, "", $bgFileName);
    $bgPathFromIndex = $bgPath . $bgFileName;
    $bgPath = "../" . $bgPathFromIndex;
    $status = move_uploaded_file($bgPic["tmp_name"], $bgPath);
    if ($status == true) {
        $stmt = $conn->prepare("INSERT INTO backgroundpics (bgPicId, name, picture) VALUES (NULL, :bgName, :bgPic)");
        $stmt->bindParam(":bgName", $bgName, PDO::PARAM_STR);
        $stmt->bindParam(":bgPic", $bgPathFromIndex, PDO::PARAM_STR);
        $stmt->execute();
        $newBgId = $conn->lastInsertId();
        echo json_encode(["status" => 1, "fileName" => $bgName, "path" => $bgPathFromIndex, "id" => $newBgId]);
    } else {
        echo json_encode(["status" => 0]);
    }
}

$conn = null;

?>