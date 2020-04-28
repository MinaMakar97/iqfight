<?php
	include "utils.php";
	
	$dbConn = connettiDB();

	if ($_SERVER['REQUEST_METHOD'] == "POST") {
		// Creazione di una stanza
		$json = prendiJson();
		controllaParametri($json, "privata", "nome", "categoria");
		$creatore = $_SESSION["username"];
		$privata = intval($json["privata"]);
		$nome = $json["nome"];
		$categoria = $json["categoria"];

		$query = $dbConn->prepare("INSERT INTO stanza VALUES (DEFAULT, ?, ?, ?, ?, null, 0, null, 0, 0);");
		if (!$query) {
			die(json_encode(["errore" => mysqli_error($dbConn)]));
		}
		$query->bind_param('ssis', $nome, $categoria, $privata, $creatore);
		if (!$query->execute()) {
			die(json_encode(["errore" => mysqli_error($dbConn)]));
		}
		$risultato = ["idStanza" => $dbConn->insert_id];
		echo json_encode($risultato);
	}
	else if ($_SERVER['REQUEST_METHOD'] == "PUT") {
		// Un giocatore vuole entrare in una stanza o avviarla
		$json = prendiJson();
		$azione = $json["azione"];
		$idStanza = $json["idStanza"];
		controllaParametri($json, "azione", "idStanza");
		$username = $_SESSION["username"];
		if ($azione == "entra") {
			$query = $dbConn->prepare("INSERT INTO partecipa VALUES (?, ?, 0, null, null, 1);");
			if (!$query) {
				die(json_encode(["errore" => mysqli_error($dbConn)]));
			}
			$query->bind_param('is', $idStanza, $username);
			if (!$query->execute()) {
				die(json_encode(["errore" => mysqli_error($dbConn)]));
			}
			$risultato = ["successo" => true];
			$query = $dbConn->prepare("SELECT id, nome, categoria, privata FROM stanza WHERE id = ?");
			$query->bind_param("s", $idStanza);
			$risultatoQuery = $query->execute();
			$stanza = $risultatoQuery->fetch_assoc();
			$risultato["id"] = $stanza["id"];
			$risultato["nome"] = $stanza["nome"];
			$risultato["categoria"] = $stanza["categoria"];
			$risultato["privata"] = $stanza["privata"];
			echo json_encode($risultato);
		}
	}
	else if ($_SERVER['REQUEST_METHOD'] == "DELETE"){
		$json = prendiJson();
		$idStanza = $json["idStanza"];
		controllaParametri($json, "idStanza");
		$query = $dbConn -> prepare("DELETE FROM partecipa where idStanza = ?");
		$query -> bind_param("i",$idStanza);
		$query -> execute();
	}

	disconnettiDB($dbConn);
?>