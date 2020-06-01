<?php
    // TODO: da completare
    include "utils.php";
    $conn = connettiDB();
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        // Login
        $json = prendiJson();
        $username = $json["username"];
        $password = $json["password"];
        controllaParametri($json, "username","password");
        // echo json_encode(["successo" => true]);
        $query = $conn -> prepare("SELECT username,password FROM utente WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
        $risultatoQuery = $query->get_result();
        if (!$risultatoQuery) {die(json_encode(["errore" => "Username o password non corretti"]));}
        if (isset($_SESSION["username_temp"])) unset($_SESSION["username_temp"]);
        $_SESSION["username"] = $username;
        $userNpass = $risultatoQuery->fetch_assoc();
        if (!$userNpass || !password_verify($password,$userNpass["password"])){
            die(json_encode(["errore" => "Username o password non corretti"]));
        }
        echo json_encode(["successo" => true, "url" => "/gioca"]);

    }

    else if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
        // Logout
        session_unset();
        echo json_encode(["successo" => true]);
    }

    else if ($_SERVER['REQUEST_METHOD'] == "GET") {
        // Controllo autenticazione
        echo json_encode(["loggato" => isset($_SESSION["username"])]);
    }
    disconnettiDB($conn);
?>