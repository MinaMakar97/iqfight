<?php
    include "utils.php";
    $conn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        if (isset($_SESSION["username"])){
            $query = $conn->prepare("SELECT username, email, avatar,dark,partiteVinte,risposteGiuste, PartiteGiocate FROM utente where username = ?");
            $query->bind_param("s",$_SESSION["username"]);
            $query->execute();
            $query = $query->get_result();
            $query = $query->fetch_assoc();
            echo json_encode(["successo" => true, "username" => $query["username"], "avatar" => $query["avatar"],"dark" => $query["dark"],"partiteVinte" => $query["partiteVinte"],"risposteGiuste" => $query["risposteGiuste"], "partiteGiocate" => $query["PartiteGiocate"], "email"=>$query["email"]]);
        }
        else {
            echo json_encode(["successo" => false, "motivazione" => "Utente non loggato"]);
        }
    }
    if ($_SERVER["REQUEST_METHOD"] == "PUT"){
        $json = prendiJson();
        controllaParametri($json, "dark");
        $dark = $json["dark"];
        $query = $conn->prepare("UPDATE utente SET dark = ? where username = ?");
        $query->bind_param("is",$dark,$_SESSION["username"]);
        $query->execute();
    }
    else if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $json = prendiJson();
        controllaParametri($json, "azione","cambio");

        if ($json["azione"] == "username"){
            cambiaNome($conn, $_SESSION["username"], $json["cambio"]);
        }
        else if($json["azione"] == "email"){
            cambiaEmail($conn, $_SESSION["username"], $json["cambio"]);
        }
        else if ($json["azione"] == "password"){
            cambiaPassword($conn, $_SESSION["username"], $json["cambio"]);
        }
    }

    function cambiaNome(mysqli $conn, $username, $newUsername){
        $query = $conn->prepare("UPDATE utente SET username = ? WHERE username = ?");
        $query->bind_param("ss", $newUsername,$username);
        if (!$query->execute()){
            echo json_encode(["successo" => false, "motivazione" => "username gia' utilizzato"]);
            die();
        }
        $_SESSION["username"] = $newUsername;
        echo json_encode(["successo" => true, "messaggio" => "Username cambiato con successo"]);
    }

    function cambiaEmail(mysqli $conn, $username, $newEmail){
        if (emailRegistrata($conn,$newEmail)){
            echo json_encode(["successo" => false, "motivazione" => "Email gia' presente"]);
            die();
        }
        $query = $conn->prepare("UPDATE utente SET email = ? WHERE username = ?");
        $query->bind_param("ss", $newEmail,$username);
        $query->execute();
        echo json_encode(["successo" => true, "messaggio" => "Email cambiata con successo"]);
    }

    function cambiaPassword(mysqli $conn, $username, $newPassword){
        $password = password_hash($newPassword, PASSWORD_DEFAULT);
        $query = $conn->prepare("UPDATE utente SET password = ? WHERE username = ?");
        $query->bind_param("ss", $password,$username);
        $query->execute();
        echo json_encode(["successo" => true, "messaggio" => "Password cambiata con successo"]);
    }




?>