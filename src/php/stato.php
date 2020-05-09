<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $username = $_SESSION["username"];
        $idStanza = $_SESSION["idStanza"];

        aggiornaUltimaRichiesta($dbConn, $username);

        if (infoStanza($dbConn, $idStanza)["numDomanda"] < $numDomande) {
            if (!tempoScaduto($dbConn, $idStanza, $tempoDomanda)) {
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
                        $query = $dbConn->prepare("UPDATE stanza SET domandaDaCambiare = 1 WHERE id = ?");
                        $query->bind_param("i", $idStanza);
                        $query->execute();

                        echo json_encode(["successo" => true, "azione" => "risultati", "giocatori" => creaRisultati($dbConn, $idStanza)]);
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
                    // Controlla se qualcuno si è disconnesso
                    $query = $dbConn->prepare("SELECT username, UNIX_TIMESTAMP(ultimaRichiesta) as ultimaRichiesta FROM partecipaWHERE idStanza = ?");
                    $query->bind_param("i", $idStanza);
                    $query->execute();
                    $giocatori = $query->get_result();
                    $giocatori = $giocatori->fetch_all(MYSQLI_ASSOC);
                    $tempo = time();
                    foreach($giocatori as $giocatore){
                        if ($tempo - $giocatore["ultimaRichiesta"] > 4) {
                            eliminaGiocatoreDaStanza($dbConn, $giocatore["username"], $idStanza);
                        }
                    }
                    echo json_encode(["successo" => true, "azione" => null]);
                }
            } else {
                // Tempo scaduto, manda i risultati
                $query = $dbConn->prepare("UPDATE stanza SET domandaDaCambiare = 1 WHERE id = ?");
                $query->bind_param("i", $idStanza);
                $query->execute();

                echo json_encode(["successo" => true, "azione" => "risultati", "giocatori" => creaRisultati($dbConn, $idStanza)]);
            }
        } else {
            echo json_encode(["successo" => true, "azione" => "finita", "giocatori" => classificaGioco($dbConn, $idStanza)]);
        }
    }

    disconnettiDB($dbConn);

    function aggiornaUltimaRichiesta(mysqli $dbConn, $username)
    {
        $query = $dbConn->prepare("UPDATE partecipa SET ultimoTempo = CURRENT_TIMESTAMP WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
    }

    function creaRisultati(mysqli $dbConn, $idStanza)
    {
        $query = $dbConn->prepare("SELECT username, punteggio, rispostaCorretta FROM partecipa WHERE idStanza = ? ORDER BY punteggio DESC");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $result = $query->get_result();
        $result = $result->fetch_all(MYSQLI_ASSOC);
        return $result;
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

    function statoGiocatori(mysqli $dbConn, $idStanza) {
        $query = $dbConn->prepare("SELECT partecipa.username, avatar, punteggio, CASE WHEN rispostaCorretta IS NULL THEN 0 ELSE 1 END as risposto FROM partecipa, utente WHERE idStanza = ? AND utente.username = partecipa.username");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $result = $query->get_result();
        $result = $result->fetch_all(MYSQLI_ASSOC);
        return $result;
    }
?>