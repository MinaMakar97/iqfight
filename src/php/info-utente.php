<?php
    include "utils.php";
    $conn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        if (isset($_SESSION["username"])){
            $query = $conn->prepare("SELECT username, avatar FROM utente where username = ?");
            $query->bind_param("s",$_SESSION["username"]);
            $query->execute();
            $query = $query->get_result();
            $query = $query->fetch_assoc();
            echo json_encode(["successo" => true, "username" => $query["username"], "avatar" => $query["avatar"]]);
        }
        else {
            echo json_encode(["successo" => false, "motivazione" => "Utente non loggato"]);
        }
    }

?>