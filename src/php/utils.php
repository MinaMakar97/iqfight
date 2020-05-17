<?php
// Abilita risposte CORS
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Headers: Content-type");
        header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE");
        header("Access-Control-Allow-Credentials: true");
    }

    $dbHost = "localhost";
    $dbUser = "iqfight";
    $dbPassw = "";
    $dbName = "my_iqfight";

    // Variabili di gioco
    $tempoDomanda = 20;
    $tempoRisultati = 2;
    $numDomande = 3;

    session_set_cookie_params(60 * 60 * 24 * 15);
    session_start();


    function prendiJson()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function connettiDB()
    {
        global $dbHost, $dbUser, $dbPassw, $dbName;
        $conn = @mysqli_connect($dbHost, $dbUser, $dbPassw, $dbName);
        if (!$conn)
            die(json_encode(["successo" => false, "motivazione" => "Impossibile connettersi al database"]));
        $conn->set_charset("utf8");
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
        $query = $conn->query("SELECT nome FROM categoria WHERE nome <> 'Casuale'");
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
        return $query->affected_rows;
    }

    function tempoScaduto(mysqli $dbConn, $campo, $idStanza, $tempo)
    {
        $query = $dbConn->prepare("SELECT UNIX_TIMESTAMP(" . $campo . ") as " . $campo . " FROM stanza WHERE id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $stanza = $query->get_result();
        $stanza = $stanza->fetch_assoc();
        if (time() - $stanza[$campo] > $tempo) return true;
        return false;
    }

    function prendiDomanda($conn, $idStanza,$numDomanda){
        $query = $conn->prepare("SELECT domanda, rispCorretta, risposta2, risposta3, risposta4 FROM domandestanza,domanda WHERE indice = ? and idStanza = ? and domandestanza.idDomanda = domanda.id");
        $query->bind_param("ii",$numDomanda,$idStanza);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        return $row;
    }

    function infoStanza($conn ,$idStanza){
        $query = $conn->prepare("SELECT domandaDaCambiare,numDomanda FROM stanza WHERE id = ? FOR UPDATE");
        $query->bind_param("i",$idStanza);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        return $row;
    }

    function eliminaGiocatoreDaStanza(mysqli $dbConn, $username, $idStanza) {
		$query = $dbConn->prepare("DELETE FROM partecipa where username = ?");
		$query->bind_param("s",$username);
        $query->execute();
        $numGiocatoriAttuale = aggiornaGiocatori($dbConn, $idStanza);

		if ($numGiocatoriAttuale == 0){
			$query = $dbConn->prepare("DELETE FROM domandestanza where idStanza = ?");
			$query->bind_param("i", $idStanza);
			$query->execute();
			$query = $dbConn->prepare("DELETE FROM stanza where id = ?");
			$query->bind_param("i", $idStanza);
			$query->execute();
        }
        
        $query = $dbConn->prepare("SELECT creatore FROM stanza WHERE stanza.id = ?");
        $query->bind_param("i",$idStanza);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        if ($row["creatore"] == $username){
            $query = $dbConn->prepare("SELECT username FROM partecipa where idStanza = ?");
            $query->bind_param("i",$idStanza);
            $query->execute();
            $row = $query->get_result();
            $row = $row->fetch_assoc();

            $query = $dbConn->prepare("UPDATE stanza SET creatore = ?  WHERE id = ?");
            $query->bind_param("si",$row["username"],$idStanza);
            $query->execute();
        }
		
		unset($_SESSION["idStanza"]);
    }
    
    function fLog($message) {
        $file = fopen("lastest.log", "a");
        fwrite($file, date("d/m/Y - H:i:s") . " " . $message . "\n");
        fclose($file);
    }

    function controllaLogin() {
        if (!isset($_SESSION["username"])) die(json_encode(["successo" => false, "Devi aver effetuato il login per inviare questa richiesta"]));
    }

    function controllaStanza() {
        controllaLogin();
        if (!isset($_SESSION["idStanza"])) die(json_encode(["successo" => false, "Devi entrare in una stanza per inviare questa richiesta"]));
    }

?>