<?php
    include "utils.php";

    $conn = connettiDB();
    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $conn->query("START TRANSACTION");
        $query = $conn->prepare("DELETE FROM domandeStanza where idStanza = ?");
        $query->bind_param("i", $_SESSION["idStanza"]);
        $query->execute();

        $query = $conn->prepare("UPDATE stanza SET iniziata = 0, numDomanda = -1, domandaDaCambiare = 0 WHERE id = ?");
        $query->bind_param("i",$_SESSION["idStanza"]);
        if($query->execute()) echo json_encode(["successo"=>true]);

        $query = $conn->prepare("UPDATE partecipa SET rispostaCorretta = null, punteggio = 0, aggiornaGiocatori = 1, ultimaRichiesta=null WHERE idStanza = ?");
        $query->bind_param("i", $_SESSION["idStanza"]);
        $query->execute();
        $conn->query("COMMIT");
    }

    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        $conn->query("START TRANSACTION");
        $query = $conn->prepare("SELECT iniziata FROM stanza WHERE id = ?");
        $query->bind_param("i", $_SESSION["idStanza"]);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        $conn->query("COMMIT");
        if ($row["iniziata"] == 0){
            echo json_encode(["successo" => true, "iniziata"=>true]);
        }
        else {
            echo json_encode(["successo" => true, "iniziata"=>false]);
        }
    }

?>