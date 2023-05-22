<?php
session_start();
if (isset($_SESSION["studentId"]) == true) {
    unset($_SESSION["adminId"]);
    unset($_SESSION["adminName"]);
} else {
    session_unset();
    session_destroy();
}

?>