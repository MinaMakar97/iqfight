<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_SESSION["username"];
        $idStanza = $_SESSION["idStanza"];
        $json = prendiJson();
        controllaParametri($json, "risposta");
        $rispostaClient = $json["risposta"];
        if (!tempoScaduto($dbConn, "timestampDomanda", $idStanza, $tempoDomanda)) {
            if (rispostaCorretta($dbConn, $username, $rispostaClient, $idStanza)) {
                aggiornaPunteggio($dbConn, $username, $idStanza, $tempoDomanda);
            }
            aggiornaGiocatori($dbConn, $idStanza);
            echo json_encode(["successo" => true]);
        } else {
            echo json_encode(["successo" => false, "motivazione" => "Tempo scaduto"]);
        }
    }

    disconnettiDB($dbConn);

    function rispostaCorretta(mysqli $dbConn, $username, $rispostaClient, $idStanza)
    {
        $info = infoStanza($dbConn, $idStanza);
        $domanda = prendiDomanda($dbConn, $idStanza, $info["numDomanda"]);
        $rispCorretta = $domanda["rispCorretta"];

        $rispCorrettaClient = $rispCorretta == $rispostaClient;
        $query = $dbConn->prepare("UPDATE partecipa SET rispostaCorretta = ? WHERE username = ?");
        $query->bind_param("is", $rispCorrettaClient, $username);
        $query->execute();
        return $rispCorrettaClient;
    }

    function aggiornaPunteggio(mysqli $dbConn, $username, $idStanza, $tempoDomanda)
    {
        $query = $dbConn->prepare("SELECT UNIX_TIMESTAMP(timestampDomanda) as timeDomanda FROM stanza WHERE stanza.id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
        $result = $query->get_result();
        $result = $result->fetch_assoc();
        $timeDomanda = $result["timeDomanda"];

        $secImpiegati = time() - $timeDomanda;
        $punteggio = ($tempoDomanda - $secImpiegati) * 10;

        $query = $dbConn->prepare("UPDATE partecipa SET punteggio = punteggio + ? WHERE username = ?");
        $query->bind_param("is", $punteggio, $username);
        $query->execute();

        return $punteggio;
    }
