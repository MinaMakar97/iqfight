<?php
    include "utils.php";

    $dbConn = connettiDB();

    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        // Richiesta delle categorie
        $query = $dbConn->prepare("SELECT nome FROM categoria");
        $query->execute();
        $result = $query->get_result();
        $risposta = [];
        while ($row = $result->fetch_assoc()) {
            array_push($risposta, $row["nome"]);
        }
        echo json_encode(["categorie" => $risposta]);
    }
    else if ($_SERVER['REQUEST_METHOD'] == "POST") {
        // Crea nuova domanda
        $json = prendiJson();
        controllaParametri($json, "categoria", "domanda", "rispostaCorretta", "risposta2", "risposta3", "risposta4");
        $domanda = $json["domanda"];
        $rispostaCorretta = $json["rispostaCorretta"];
        $risposta2 = $json["risposta2"];
        $risposta3 = $json["risposta3"];
        $risposta4 = $json["risposta4"];
        $categoria = $json["categoria"];
        $query = $dbConn->prepare("INSERT INTO domanda VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssss", $domanda, $rispostaCorretta, $risposta2, $risposta3, $risposta4, $categoria);
        $query->execute();
        echo json_encode(["successo" => true]);
    }

    disconnettiDB($dbConn);
?>