<?php
session_start();
if (isset($_SESSION["adminId"]) == true) {
    unset($_SESSION["studentId"]);
    unset($_SESSION["name"]);
    unset($_SESSION["cleared"]);
    unset($_SESSION["deadline"]);
} else {
    session_unset();
    session_destroy();
}

?>