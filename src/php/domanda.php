<?php
    include "utils.php";
    $conn = connettiDB();
    if ($_SERVER["REQUEST_METHOD"] == "GET"){
        $json = infoStanza($conn,$_SESSION["idStanza"]);
        $domandaDaCambiare = $json["domandaDaCambiare"];
        $numDomanda = $json["numDomanda"];
        if ($domandaDaCambiare == 1){
            aggiornaStanza($conn, $_SESSION["idStanza"]);
            $numDomanda+=1;
        }
        $json = prendiDomanda($conn,$_SESSION["idStanza"],$numDomanda);
        $domanda = $json["domanda"];
        $risposte = [$json["rispCorretta"],$json["risposta2"],$json["risposta3"],$json["risposta4"]];
        shuffle($risposte);
        echo json_encode(["successo" => true, "domanda" => $domanda, "risposte" => $risposte]);

    }
    disconnettiDB($conn);
    

    function aggiornaStanza($conn, $idStanza){
        $query = $conn->prepare("UPDATE stanza SET domandaDaCambiare = 0, numDomanda = numDomanda + 1, timestampDomanda = now() WHERE id = ?");
        $query->bind_param("i",$idStanza);
        $query->execute();
    }

?>