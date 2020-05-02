<?php
	include "utils.php";
	
	$dbConn = connettiDB();

	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		$query = $dbConn->prepare("SELECT utente.username, punteggio, avatar FROM classifica INNER JOIN utente WHERE classifica.username = utente.username ORDER BY punteggio DESC");
		if (!$query) {
			die(json_encode(["errore" => mysqli_error($dbConn)]));
		}
		if (!$query->execute()) {
			die(json_encode(["errore" => mysqli_error($dbConn)]));
        }
        $queryResult = $query->get_result();
        $classifica = [];
		while ($ris = $queryResult->fetch_assoc()) {
            array_push($classifica, [
                "username" => $ris["username"],
                "punteggio" => $ris["punteggio"],
                "avatar" => $ris["avatar"]
            ]);
        }
		echo json_encode(["successo" => true, "giocatori" => $classifica]);
	}

	disconnettiDB($dbConn);
?>