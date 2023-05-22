<?php
session_start();
$user = $_SESSION["studentId"];
require '../../database/connectDb.php';

if($user != "guest")
{
    //query team member
    $teamMember = [];
    $storeMember = [];
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT p.playerId, c.name, p.exp, c.hp, p.inTeam, sk.name AS skill, e.name AS element, sp.spritePath
                            FROM players p, characters c, sprites sp, skills sk, elements e
                            WHERE c.charId = p.charId 
                                AND sp.spriteId = c.spriteId 
                                AND sk.skillId = c.skillId 
                                AND e.elemId = sk.elemId 
                                AND p.userId = :studentId");
    $stmt->bindParam(':studentId', $user, PDO::PARAM_STR);
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
        
        $skillHtml = $row['skill'].' ('.$row['element'].') <img src="../elementPic/'.strtolower($row['element']).'.png" style="width:30px;height:30px;">';

        if($row['inTeam'] == 1)
        {
            array_push($teamMember, 
                        [
                            "id" => $row['playerId'],
                            "name" => $row['name'], 
                            "level" => $level, 
                            "hp" => $hp, 
                            "skill" => $skillHtml, 
                            "sprite" => $row['spritePath']
                        ]);
        }
        else
        {
            array_push($storeMember, 
                        [
                            "id" => $row['playerId'],
                            "name" => $row['name'], 
                            "level" => $level, 
                            "hp" => $hp, 
                            "skill" => $skillHtml, 
                            "sprite" => $row['spritePath']
                        ]);
        }

    }

    $conn = null;
    echo json_encode(["isGuest" => false, "team" => $teamMember, "member" => $storeMember]);
}
else
{
    $allChars = [];
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT c.charId, c.name, c.hp, sk.name AS skill, e.name AS element, sp.spritePath
                            FROM characters c, sprites sp, skills sk, elements e
                            WHERE sp.spriteId = c.spriteId 
                                AND sk.skillId = c.skillId 
                                AND e.elemId = sk.elemId;");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $result = $stmt->fetchAll();
    
    foreach($result as $row)
    {
        $skillHtml = $row['skill'].' ('.$row['element'].') <img src="../elementPic/'.strtolower($row['element']).'.png" style="width:30px;height:30px;">';
        array_push($allChars, 
                    [
                        "id" => $row['charId'],
                        "name" => $row['name'],  
                        "hp" => $row['hp'], 
                        "skill" => $skillHtml, 
                        "sprite" => $row['spritePath']
                    ]);
    }
    $conn = null;
    echo json_encode(["isGuest" => true, "allChars" => $allChars]);
}

?>