<?php
    include "utils.php";
    $conn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        avviaStanza($conn,$_SESSION["idStanza"]);
        $categoria = getCategoria($conn,$_SESSION["idStanza"]);
        if ($categoria == "Casuale") generaDomandeCasuali($conn,$numDomande,$_SESSION["idStanza"]);
        else generaDomande($conn,$numDomande,$categoria,$_SESSION["idStanza"]);
        echo json_encode( ["successo" => true]);
    }

    disconnettiDB($conn);

    function getCategoria(mysqli $conn, $idStanza){
        $query = $conn->prepare("SELECT categoria FROM stanza WHERE id = ?");
        $query->bind_param("i",$idStanza);
        $query->execute();
        $row = $query->get_result();
        $row = $row->fetch_assoc();
        return $row["categoria"];
    }

    function avviaStanza(mysqli $conn, $idStanza)
    {
        $query = $conn->prepare("UPDATE stanza SET iniziata=1 and domandaDaCambiare=1 WHERE id = ?");
        $query->bind_param("i", $idStanza);
        $query->execute();
        
    }

    function salvaDomande(mysqli $conn,$domande,$idStanza){
        $query = $conn->prepare("INSERT INTO domandeStanza (indice,idDomanda,idStanza) VALUES (?,?,?)");
        for ($i=0; $i < count($domande); $i++){
            $query->bind_param("iii",$i,$domande[$i],$idStanza);
            $query->execute();
        }
    }

    function generaDomandeCasuali(mysqli $conn, $numDomande,$idStanza)
    {
        $domande = [];
        $categorieUscite = [];
        $categorie = getCategorie($conn);
        while (count($domande) < $numDomande) {
            $random = rand(0, count($categorie)-1);
            if (!in_array($categorie[$random], $categorieUscite)) {
                array_push($categorieUscite, $categorie[$random]);
                $nonTrovato = true;
                while ($nonTrovato) {
                    $domanda = getDomandaRandomica($conn, $categorie[$random]);
                    if (!in_array($domanda, $domande)) {
                        $nonTrovato = false;
                        array_push($domande, $domanda);
                    }
                }
            } else if (count($categorie) == count($categorieUscite)) {
                $categorieUscite = [];
            }
        }
        salvaDomande($conn,$domande,$idStanza);
    }

    function generaDomande(mysqli $conn,$numDomande,$categoria,$idStanza){
        $domande = [];
        while(count($domande) < $numDomande){
            $domanda = getDomandaRandomica($conn,$categoria);
            if (!in_array($domanda,$domande)) array_push($domande,$domanda);
        }
        salvaDomande($conn,$domande,$idStanza);
    }
    

    function getDomandaRandomica(mysqli $conn,$categoria)
    {
        $query = $conn->prepare("SELECT id FROM domanda WHERE categoria = ? ORDER BY RAND() LIMIT 1");
        $query->bind_param("s", $categoria);
        $query->execute();
        $rows = $query->get_result();
        $rows = $rows->fetch_assoc();
        return $rows["id"];
    }
?>