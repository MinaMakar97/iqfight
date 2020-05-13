<?php
    include "utils.php";
    $conn = connettiDB();
    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        $conn->query("START TRANSACTION");
        $json = infoStanza($conn,$_SESSION["idStanza"]);
        $domandaDaCambiare = $json["domandaDaCambiare"];
        $numDomanda = $json["numDomanda"];

        if ($domandaDaCambiare == 1){
            if ($numDomanda == $numDomande - 1) {
                // Partita finita
                $conn->query("COMMIT");
                echo json_encode(["successo" => true, "azione" => "finita", "giocatori" => classificaGioco($conn, $_SESSION["idStanza"])]);
                die();
            }
            else {
                if (!tempoScaduto($conn, "timestampRisultati", $_SESSION["idStanza"], $tempoRisultati)) {
                    // Domanda chiesta troppo presto, si devono ancora visualizzare i risultati
                    echo json_encode(["successo" => false, "motivazione" => "La nuova domanda non è ancora pronta"]);
                    $conn->query("COMMIT");
                    die();
                } else {
                    // E' tempo di cambiare domanda
                    aggiornaStanza($conn, $_SESSION["idStanza"]);
                    $numDomanda += 1;
                }
            }
        }
        $conn->query("COMMIT");
        $json = prendiDomanda($conn,$_SESSION["idStanza"],$numDomanda);
        $domanda = $json["domanda"];
        $risposte = [$json["rispCorretta"],$json["risposta2"],$json["risposta3"],$json["risposta4"]];
        shuffle($risposte);
        echo json_encode(["successo" => true, "azione" => "domanda","domanda" => $domanda, "risposte" => $risposte]);

    }
    disconnettiDB($conn);
    

    function aggiornaStanza($conn, $idStanza){
        $query = $conn->prepare("UPDATE stanza SET domandaDaCambiare = 0, numDomanda = numDomanda + 1, timestampDomanda = now() WHERE id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();

        $query = $conn->prepare("UPDATE partecipa SET rispostaCorretta = null WHERE idStanza = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
    }

    function classificaGioco(mysqli $dbConn, $idStanza)
    {
        $query = $dbConn->prepare("SELECT utente.username, punteggio, avatar FROM partecipa,utente WHERE partecipa.username = utente.username AND idStanza = ? ORDER BY punteggio DESC LIMIT 3");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $row = $query->get_result();
        $giocatori = $row->fetch_all(MYSQLI_ASSOC);
        return $giocatori;
    }

?>