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
			die (json_encode(["successo" => false, "errore" => "ciao sono errore "]));
		}
		$query->bind_param('ssis', $nome, $categoria, $privata, $creatore);
		if (!$query->execute()) {
			die(json_encode(["successo" => false, "errore" => mysqli_error($dbConn)]));
		}
		$risultato = ["successo" => true, "idStanza" => $dbConn->insert_id];
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
				die(json_encode(["successo"=>false, "errore" => mysqli_error($dbConn)]));
			}
			$query->bind_param('is', $idStanza, $username);
			if (!$query->execute()) {
				die(json_encode(["successo"=>false,"errore" => mysqli_error($dbConn)]));
			}
			$risultato = ["successo" => true];
			$query = $dbConn->prepare("SELECT id, nome, categoria, privata, iniziata FROM stanza WHERE id = ?");
			$query->bind_param("s", $idStanza);
			$query->execute();
			$stanza = $query->get_result();
			$stanza = $stanza->fetch_assoc();
			$risultato["id"] = $stanza["id"];
			$risultato["nome"] = $stanza["nome"];
			$risultato["categoria"] = $stanza["categoria"];
			$risultato["privata"] = $stanza["privata"];
			$risultato["iniziata"] = $stanza["iniziata"];
			$query = $dbConn ->prepare("UPDATE partecipa SET aggiornaGiocatori = 1 WHERE idStanza = ? and username <> ?");
			$query->bind_param("is", $idStanza,$username);
			$query->execute();
			if (!$query){
				echo json_encode($risultato);
			}
			else {
				die json_encode(["successo"=>false,"errore" => mysqli_error($dbConn)]);
			}
		}
	}
	else if($_SERVER["REQUEST_METHOD"] == "GET"){
		$json = prendiJson();
		$idStanza = $json["idStanza"];
		controllaParametri($json,"idStanza");
		$query = $dbConn ->prepare("SELECT giocatore FROM stanza WHERE id = ?");
		$query->bind_param("s", $idStanza);
		$query->execute();
		$stanza = $query->get_result();
		$stanza = $stanza->fetch_assoc();
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