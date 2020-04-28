<?php
    
    // Abilita risposte CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

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
    
    function controllaParametri($json) {
        $args = array_slice(func_get_args(), 1);
        foreach ($args as $param) {
            if (!isset($json[$param])) die(json_encode(["errore" => "Formato della richiesta non corretto"]));
        }
    }
?>