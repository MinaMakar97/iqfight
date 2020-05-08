<?php
    // Abilita risposte CORS
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Headers: Content-type");
        header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE");
        header("Access-Control-Allow-Credentials: true");
    }

    session_set_cookie_params(60 * 60 * 24 * 15);
    session_start();
    
    
    function prendiJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function connettiDB() {
        $conn = @mysqli_connect("localhost", "root", "", "iqfight");
        if (!$conn)
            die (json_encode(["successo" => false, "motivazione" => "Impossibile connettersi al database"]));
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