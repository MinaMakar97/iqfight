<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        // Richiesta delle categorie
        echo json_encode(["categorie" => getCategorie($dbConn)]);
    }
    else if ($_SERVER['REQUEST_METHOD'] == "POST") {
        // Crea nuova domanda
        controllaLogin();
        $json = prendiJson();
        controllaParametri($json, "categoria", "domanda", "rispostaCorretta", "risposta2", "risposta3", "risposta4");
        $domanda = $json["domanda"];
        $rispostaCorretta = $json["rispostaCorretta"];
        $risposta2 = $json["risposta2"];
        $risposta3 = $json["risposta3"];
        $risposta4 = $json["risposta4"];
        $categoria = $json["categoria"];
        $query = $dbConn->prepare("INSERT INTO domanda (domanda, rispCorretta, risposta2, risposta3, risposta4, categoria) VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssss", $domanda, $rispostaCorretta, $risposta2, $risposta3, $risposta4, $categoria);
        $query->execute();
        echo json_encode(["successo" => true]);
    }

    disconnettiDB($dbConn);
?>