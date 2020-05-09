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


    function prendiJson()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function connettiDB()
    {
        $conn = @mysqli_connect("localhost", "root", "", "iqfight");
        if (!$conn)
            die(json_encode(["successo" => false, "motivazione" => "Impossibile connettersi al database"]));
        return $conn;
    }

    function disconnettiDB($conn)
    {
        return mysqli_close($conn);
    }

    function controllaParametri($json)
    {
        $args = array_slice(func_get_args(), 1);
        foreach ($args as $param) {
            if (!isset($json[$param])) die(json_encode(["errore" => "Formato della richiesta non corretto"]));
        }
    }

    function getCategorie(mysqli $conn)
    {
        $query = $conn->query("SELECT nome FROM categoria");
        $rows = $query->fetch_all(MYSQLI_ASSOC);
        $categoria = [];
        for ($i = 0; $i < count($rows); $i++)
            array_push($categoria, $rows[$i]["nome"]);
        return $categoria;
    }

    function aggiornaGiocatori(mysqli $conn, $idStanza)
    {
        $query = $conn->prepare("UPDATE partecipa SET aggiornaGiocatori = 1 WHERE idStanza = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
    }

    function tempoScaduto(mysqli $dbConn, $idStanza, $x)
    {
        $query = $dbConn->prepare("SELECT UNIX_TIMESTAMP(timestampDomanda) as timestampDomanda FROM stanza WHERE id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $stanza = $query->get_result();
        $stanza = $stanza->fetch_assoc();
        if (time() - $stanza["timestampDomanda"] > $x) return true;
        return false;
    }

    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        $conn = connettiDB();
        echo (tempoScaduto($conn,1,10));
        disconnettiDB($conn);
    }
?>