<?php
    include "utils.php";
    $conn = connettiDB();
    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        controllaStanza();
        $conn->query("START TRANSACTION");
        $json = infoStanza($conn,$_SESSION["idStanza"]);
        $domandaDaCambiare = $json["domandaDaCambiare"];
        $numDomanda = $json["numDomanda"];

        if ($domandaDaCambiare == 1){
            if ($numDomanda == $numDomande - 1) {
                // Partita finita
                if (categoriaStanza($conn,$_SESSION["idStanza"]) == "Casuale"){
                    inserisciGiocatoreClassifica($conn, $_SESSION["username"]);
                }
                $conn->query("COMMIT");
                numPartiteUtente($conn,$_SESSION["username"]);
                $giocatori = classificaGioco($conn, $_SESSION["idStanza"]);
                if ($giocatori[0]["username"] == $_SESSION["username"]) partitaVinta($conn,$_SESSION["username"]);
                echo json_encode(["successo" => true, "azione" => "finita", "giocatori" => $giocatori]);
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

    function numPartiteUtente(mysqli $conn, $username){
        $query = $conn->prepare("UPDATE utente SET partiteGiocate = partiteGiocate + 1 WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
    }

    function partitaVinta(mysqli $conn, $username){
        $query = $conn->prepare("UPDATE utente SET partiteVinte = partiteVinte + 1 WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
    }
    
    function categoriaStanza($conn, $idStanza){
        $rowUsername = $conn->prepare("SELECT categoria FROM stanza WHERE id = ?");
        $rowUsername->bind_param("i",$idStanza);
        $rowUsername->execute();
        $row = $rowUsername->get_result();
        $row = $row->fetch_assoc();
        return $row["categoria"];
    }

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

    function inserisciGiocatoreClassifica(mysqli $conn, $username){
        $query = $conn->query("SELECT count(*) as total FROM classifica");
        $query = $query->fetch_assoc();
        $rowUsername = $conn->prepare("SELECT punteggio FROM partecipa WHERE username = ?");
        $rowUsername->bind_param("s",$username);
        $rowUsername->execute();
        $row = $rowUsername->get_result();
        $row = $row->fetch_assoc();
        if ($query["total"] < 10){
            $query=$conn->prepare("INSERT INTO classifica VALUES (?,?)");
            $query->bind_param("si",$username,$row["punteggio"]);
            if (!$query->execute()){
                $punteggioGiocatore = punteggioGiocatoreClassifica($conn,$username);
                if ($punteggioGiocatore < $row["punteggio"]){
                    $query = $conn->prepare("UPDATE classifica SET punteggio = ? WHERE username = ?");
                    $query->bind_param("is", $row["punteggio"],$username);
                    $query->execute();
                }
            }

        }
        else{
            $query = $conn->query("SELECT min(punteggio) as minimo FROM classifica");
            $query = $query->fetch_assoc();
            $minimo = $query["minimo"];
            if ($row["punteggio"] > $minimo) {
                $query=$conn->prepare("INSERT INTO classifica VALUES (?,?)");
                $query->bind_param("si",$username,$row["punteggio"]);
                if ($query->execute()){
                    $query = $conn->prepare("DELETE FROM classifica WHERE punteggio = ? LIMIT 1");
                    $query->bind_param("i", $minimo);
                    $query->execute();  
                }
                else{
                    $punteggioGiocatore = punteggioGiocatoreClassifica($conn,$username);
                    if ($punteggioGiocatore < $row["punteggio"]){
                        $query = $conn->prepare("UPDATE classifica SET punteggio = ? WHERE username = ?");
                        $query->bind_param("is", $row["punteggio"],$username);
                        $query->execute();
                    }
                }
            }
        }
        
    }
        
    function punteggioGiocatoreClassifica(mysqli $conn, $username) {
        $query = $conn->prepare("SELECT punteggio FROM classifica WHERE username = ?");
        $query->bind_param("s", $username);
        $query->execute();
        $res = $query->get_result();
        $res = $res->fetch_assoc();
        return $res["punteggio"];
    }
?>