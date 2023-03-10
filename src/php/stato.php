<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        controllaStanza();
        $username = $_SESSION["username"];
        $idStanza = $_SESSION["idStanza"];

        aggiornaUltimaRichiesta($dbConn, $username);

        if (!tempoScaduto($dbConn, "timestampDomanda", $idStanza, $tempoDomanda)) {
            $query = $dbConn->prepare("SELECT aggiornaGiocatori FROM partecipa WHERE username = ?");
            $query->bind_param("s", $username);
            $query->execute();
            $result = $query->get_result();
            $result = $result->fetch_assoc();
            $aggiornaGiocatori = $result["aggiornaGiocatori"];

            if ($aggiornaGiocatori == 1) {
                $giocatori = statoGiocatori($dbConn, $idStanza);
                $tuttiRisposto = true;
                foreach ($giocatori as $g) {
                    if ($g["risposto"] == 0) {
                        $tuttiRisposto = false;
                        break;
                    }
                }
                if ($tuttiRisposto) {
                    // Tutti hanno risposto, manda risultati
                    mandaRisultati($dbConn, $idStanza);
                }
                else {
                    // Un giocatore ha risposto oppure è entrato/uscito
                    echo json_encode(["successo" => true, "azione" => "aggiorna", "giocatori" => $giocatori]);
                }
                $query = $dbConn->prepare("UPDATE partecipa SET aggiornaGiocatori = 0 WHERE username = ?");
                $query->bind_param("s", $username);
                $query->execute();
            }
            else {
                echo json_encode(["successo" => true, "azione" => null]);
            }
        } else {
            // Tempo scaduto, manda i risultati
            mandaRisultati($dbConn, $idStanza);
        }

    }

    disconnettiDB($dbConn);

    function aggiornaUltimaRichiesta(mysqli $dbConn, $username)
    {
        $query = $dbConn->prepare("UPDATE partecipa SET ultimaRichiesta = CURRENT_TIMESTAMP WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
    }

    function creaRisultati(mysqli $dbConn, $idStanza)
    {
        $query = $dbConn->prepare("SELECT username, punteggio, rispostaCorretta FROM partecipa WHERE idStanza = ? ORDER BY punteggio DESC");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $result = $query->get_result();
        $giocatori = [];
        while( $row = $result->fetch_assoc()){
            $giocatori[$row["username"]] = $row;  
        }
        return $giocatori;
    }

    

    function statoGiocatori(mysqli $dbConn, $idStanza) {
        $query = $dbConn->prepare("SELECT partecipa.username, avatar, CASE WHEN rispostaCorretta IS NULL THEN 0 ELSE 1 END as risposto FROM partecipa, utente WHERE idStanza = ? AND utente.username = partecipa.username");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $result = $query->get_result();
        $giocatori = [];
        while( $row = $result->fetch_assoc()){
            $giocatori[$row["username"]] = $row;  
        }
        return $giocatori;
    }

    function mandaRisultati(mysqli $dbConn, $idStanza) {
        $query = $dbConn->prepare("UPDATE stanza SET domandaDaCambiare = 1, timestampRisultati = CURRENT_TIMESTAMP WHERE id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();

        $info = infoStanza($dbConn, $idStanza);
        $domanda = prendiDomanda($dbConn, $idStanza, $info["numDomanda"]);

        echo json_encode(["successo" => true, "azione" => "risultati", "rispCorretta" => $domanda["rispCorretta"], "giocatori" => creaRisultati($dbConn, $idStanza)]);
    }
?>