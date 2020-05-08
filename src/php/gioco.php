<?php 
    include "utils.php";
    $dbConn = connettiDB();
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $query = $dbConn->prepare("SELECT id,numDomanda FROM stanza WHERE id = ?");
        $idStanza = $_SESSION["idStanza"];
        $query->bind_param("i",$idStanza);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        if ($row['numDomanda'] > 10)
            classificaGioco($dbConn,$idStanza);
    }
    disconnettiDB($dbConn);

    function classificaGioco(mysqli $dbConn,$idStanza){
        $query = $dbConn->prepare("SELECT utente.username,punteggio,avatar FROM partecipa,utente WHERE partecipa.username = utente.username AND idStanza = ? ORDER BY punteggio DESC LIMIT 3");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $row = $query->get_result();
        $giocatori = $row->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["giocatori" => $giocatori]);
    }

?>