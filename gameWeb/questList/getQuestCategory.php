<?php
require '../../database/connectDb.php';

$questCat = [];
$conn = connectDB();
$stmt = $conn->prepare("SELECT name, locked FROM questcategories");
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$result = $stmt->fetchAll();

foreach($result as $row)
{
    $questCat[$row["name"]] = $row["locked"];
    //array_push($questCat, [$row["name"] => $row["locked"]]);
}
echo json_encode(["questCat" => $questCat]);
?>