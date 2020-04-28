<?php
    // TODO: da completare
    include "utils.php";

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        // Login
        $json = prendiJson();
        $username = $json["username"];
        $password = $json["password"];
        $_SESSION["username"] = $username;
        echo json_encode(["successo" => true]);
    }
    else if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
        // Logout
        session_unset();
        echo json_encode(["successo" => true]);
    }
?>