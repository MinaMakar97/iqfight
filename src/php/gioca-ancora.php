<?php
    include "utils.php";

    $conn = connettiDB();
    $conn->query("START TRANSACTION");
    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $query = $conn->prepare("DELETE FROM domandeStanza where idStanza = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();

        $query = $conn->prepare("UPDATE stanza SET iniziata = 0, numDomanda = -1, domandaDaCambiare = 0 WHERE id = ?");
        $query->bind_param("i",$_SESSION["idStanza"]);
        if($query->execute()) echo json_encode(["successo"=>true]);

        $query = $conn->prepare("UPDATE partecipa SET rispostaCorretta = null, punteggio = 0, aggiornaGiocatori = 1, ultimaRichiesta=null WHERE idStanza = ?");
        $query->bind_param("i", $_SESSION["idStanza"]);
        $query->execute();

    }
    $conn->query("COMMIT");

?>