<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $target_dir = "avatars/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir);
        }
        $source_file = $_FILES["avatar"]["name"];
        $imageFileType = strtolower(pathinfo($source_file,PATHINFO_EXTENSION));
        $target_file = $target_dir . basename($_SESSION["username_temp"] . "." . $imageFileType);
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
            die(json_encode(["successo"=> false, "motivazione" => "c'e' stato un errore nel caricamento immagine"]));
        }
        echo json_encode(["successo" => true]);
    }
    $query = $dbConn -> prepare("UPDATE utente SET avatar = ? WHERE username = ?");
    $path = "/iqfight/" . $target_file;
    $query->bind_param("ss", $path, $_SESSION["username_temp"]);
    $query->execute();
    disconnettiDB($dbConn);
?>