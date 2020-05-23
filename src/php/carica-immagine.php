<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $username = isset($_SESSION["username"]) ? $_SESSION["username"] : $_SESSION["username_temp"];

        // Crea la cartella degli avatars se non esiste
        $target_dir = "avatars/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir);
        }

        $target_file = null;
        if (!isset($_FILES["avatar"])) {
            // Immagine ritagliata dalla canvas
            $imgData = base64_decode(explode(",", $_POST["avatar"])[1]);
            $target_file = "avatars/" . $username . ".png";
            $success = file_put_contents($target_file, $imgData);
            if (!$success)
                die(json_encode(["successo" => false, "motivazione" => "Impossibile caricare l'immagine"]));
        } else {
            // Immagine della registrazione
            $source_file = $_FILES["avatar"]["name"];
            $imageFileType = strtolower(pathinfo($source_file,PATHINFO_EXTENSION));
            $target_file = $target_dir . basename($username . "." . $imageFileType);
            $uploadOk = 1;
    
            // Check file size
            if ($_FILES["avatar"]["size"] > 2000000) {
                die(json_encode(["successo"=> false, "motivazione" => "Mi dispiace file troppo grande"]));
            }
            // Allow certain file formats
            if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
                die (json_encode(["successo"=> false, "motivazione" => "Formato del file errato"]));
    
            }
            // if everything is ok, try to upload file
            if (!move_uploaded_file($_FILES["avatar"]["tmp_name"], $target_file)) {
                die(json_encode(["successo"=> false, "motivazione" => "C'e' stato un errore nel caricamento immagine"]));
            }
        }
        
        $query = $dbConn -> prepare("UPDATE utente SET avatar = ? WHERE username = ?");
        $path = "/iqfight/" . $target_file;
        $query->bind_param("ss", $path, $username);
        $query->execute();

        echo json_encode(["successo" => true, "messaggio" => "Immagine caricata con successo!"]);
    }
    disconnettiDB($dbConn);
?>