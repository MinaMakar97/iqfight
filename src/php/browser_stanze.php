<?php
    include "utils.php";
    $dbConn = connettiDB();

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        // Ottieni tutte le stanze
        $testoQuery = "SELECT id, nome, categoria, creatore, COUNT(*) as giocatori FROM stanza INNER JOIN partecipa WHERE stanza.id = partecipa.idStanza AND privata = 0 AND iniziata = 0 GROUP BY partecipa.idStanza";
        $query = $dbConn->query($testoQuery);
        if (!$query) {
            die(json_encode(["successo" => false, "motivazione" => mysqli_error($dbConn)]));
        }
        echo json_encode(["successo" => true, "stanze" => $query->fetch_all(MYSQLI_ASSOC)]);
    }

    disconnettiDB($dbConn);
?>