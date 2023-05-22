<?php
require '../../database/connectDb.php';
session_start();

$category = $_REQUEST["cat"];
$lock = $_REQUEST["lock"];

$questCat = [];
$conn = connectDB();
$stmt = $conn->prepare("UPDATE questcategories SET locked = :lock WHERE name = :cat;");
$stmt->bindParam(':lock', $lock, PDO::PARAM_STR);
$stmt->bindParam(':cat', $category, PDO::PARAM_STR);
$stmt->execute();

echo $lock;
?>