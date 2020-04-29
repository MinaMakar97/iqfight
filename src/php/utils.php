<?php
    // Abilita risposte CORS
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Methods: PUT, POST");
    header("Access-Control-Allow-Credentials: true");
    
    session_start();
    
    
    function prendiJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function connettiDB() {
        $conn = mysqli_connect("localhost", "root", "", "iqfight");
        if (!$conn)
            die ("Connessione fallita: " . $conn-> mysqli_connect_error());
        return $conn;
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