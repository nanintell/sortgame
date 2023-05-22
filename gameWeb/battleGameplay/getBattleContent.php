<?php
session_start();
require '../../database/connectDb.php';

$user = $_SESSION["studentId"]; //user is for recording progress
$questId = $_REQUEST["quest"];
$isGuest = true;

$conn = connectDB();
$player = [];
if($user != "guest")
{
    $isGuest = $user;
    //query team member
    $stmt = $conn->prepare("SELECT exp, c.hp, c.name AS charName, s.name AS skillName, e.sort, e.name AS element
                            FROM players p, characters c, skills s, elements e 
                            WHERE p.userId = :userId 
                                AND p.inTeam = 1
                                AND c.charId = p.charId
                                AND s.skillId = c.skillId
                                AND e.elemId = s.elemId;");
    $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();

    foreach($result as $row)
    {
        $level = 1;
        $exp = 0;
        for ($i = 1; $i <= 50 && $exp <= $row['exp']; $i++)
        {
            $exp = round(0.32*(($i-1)**3) + 6.4*(($i-1)**2) + 16*($i-1));
            if($exp > $row['exp'])
            {
                $level = $i-1;
            }
        }
        if($row['exp'] > round(0.32*((49)**3) + 6.4*((49)**2) + 16*(49))) {
            $level = 49;
        }
        $hp = intval($row['hp']) + (($level-1) * 20);

        array_push($player, [
            "hp" => $hp, 
            "maxHP" => $hp, 
            "skill" => ["name" => $row['skillName'], "sort" => $row['sort'], "element" => $row['element']],
            "level" => $level,
            "name" => $row['charName']
        ]);
    }

    $stmt = $conn->prepare("SELECT sort 
        FROM elements
        WHERE sort != 'random'
        AND (requireQuest IS NULL 
        OR requireQuest IN 
            (SELECT questId FROM questprogress WHERE userId = :userId AND clear > 0));");
    $stmt->bindParam(':userId', $user, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    $elements = array_column($result, 'sort');

} else {
    $stmt = $conn->prepare("SELECT c.charId, c.name, c.hp, sk.name AS skill, e.sort, e.name AS element
                            FROM characters c, skills sk, elements e
                            WHERE sk.skillId = c.skillId 
                                AND e.elemId = sk.elemId;");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    foreach($result as $row)
    {
        array_push($player, 
                    [
                        "id" => $row['charId'],
                        "name" => $row['name'],  
                        "hp" => $row['hp'], 
                        "skill" => ["name" => $row['skill'], "sort" => $row['sort'], "element" => $row['element']]
                    ]);
    }

    $stmt = $conn->prepare("SELECT sort, requireQuest FROM elements WHERE sort != 'random'");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $elements = $stmt->fetchAll();
}



//query monster
$mobUnique = [];

$stmt = $conn->prepare("SELECT m.mobId, m.hp, s.spritePath AS sprite, m.attack, wm.number, w.no
                        FROM wavemonsters wm, waves w, monsters m, sprites s
                        WHERE w.waveId = wm.waveId
                            AND m.mobId = wm.mobId
                            AND s.spriteId = m.spriteId
                            AND w.questId = :questId
                        ORDER BY w.no;");
$stmt->bindParam(':questId', $questId, PDO::PARAM_STR);
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$result = $stmt->fetchAll();

$wave = array_fill(0, (max(array_column($result, 'no'))), []);
$mobAdded = [];
foreach($result as $row)
{
    //mob
    if (is_null(array_search($row['mobId'], $mobAdded)) || (array_search($row['mobId'], $mobAdded) === FALSE))
    {
        $stmte = $conn->prepare("SELECT e.sort, r.name
                                FROM monsters m, elementresistance er, elements e, resistvalues r
                                WHERE m.mobId = :mobId
                                    AND m.mobId = er.mobId 
                                    AND e.elemId = er.elemId
                                    AND r.resId = er.resId;");
        $stmte->bindParam(':mobId', $row['mobId'], PDO::PARAM_STR);
        $stmte->execute();
        $stmte->setFetchMode(PDO::FETCH_ASSOC);
        $elementResist = $stmte->fetchAll();

        array_push($mobAdded, $row['mobId']);
        array_push(
            $mobUnique, 
            [
                "id" => $row['mobId'],
                "hp" => $row['hp'],  
                "img" => $row['sprite'],
                "attack" => $row['attack'],
                "element" => array_combine(array_column($elementResist, 'sort'), array_column($elementResist, 'name'))
            ]
        );
    }

    //wave
    $mob = array_fill(0, $row['number'] , intval($row['mobId']));
    $wave[$row['no'] - 1] = array_merge($wave[$row['no'] - 1], $mob);
    shuffle($wave[$row['no'] - 1]);
}
$conn = null;

//return
echo json_encode(["isGuest" => $isGuest, "player" => $player, "mob" => $mobUnique, "wave" => $wave, "element" => $elements]);
?>