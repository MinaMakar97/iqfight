<?php
    session_start();
    
    function prendiJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function connettiDB() {
        return mysqli_connect("localhost", "root", "", "iqfight");
    }

    function disconnettiDB($conn) {
        return mysqli_close($conn);
    }
?>