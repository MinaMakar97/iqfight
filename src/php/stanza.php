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
			die (json_encode(["successo" => false, "errore" => mysqli_error($dbConn)]));
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
			$query = $dbConn->prepare("INSERT INTO partecipa VALUES (?, ?, 0, null, null, 1,DEFAULT);");
			if (!$query) {
				die(json_encode(["successo"=>false, "errore" => mysqli_error($dbConn)]));
			}
			$query->bind_param('is', $idStanza, $username);
			$query->execute();
			$risultato = ["successo" => true];
			$query = $dbConn->prepare("SELECT id, nome, categoria, privata, iniziata,creatore FROM stanza WHERE id = ?");
			$query->bind_param("i", $idStanza);
			$query->execute();
			$stanza = $query->get_result();
			$stanza = $stanza->fetch_assoc();
			$risultato["id"] = $stanza["id"];
			$risultato["nome"] = $stanza["nome"];
			$risultato["categoria"] = $stanza["categoria"];
			$risultato["privata"] = $stanza["privata"];
			$risultato["iniziata"] = $stanza["iniziata"];
			$risultato["creatore"] = $stanza["creatore"] == $username;
			$query = $dbConn ->prepare("UPDATE partecipa SET aggiornaGiocatori = 1 WHERE idStanza = ?");
			$query->bind_param("i",$idStanza);
			if ($query->execute()){
				$_SESSION["idStanza"] = $idStanza;
				echo json_encode($risultato);
			}
			else {
				echo json_encode(["successo"=>false, "errore" => mysqli_error($dbConn)]);
			}
		}
		else if ($azione == "inizio"){
			$query = $dbConn ->prepare("UPDATE stanza SET iniziata = 1 WHERE id = ?");
			$query->bind_param("i",$idStanza);
			if ($query->execute()){
				echo json_encode(["successo" => true, "azione" => "inizio"]);
			}
			else {
				echo json_encode(["successo"=>false, "errore" => mysqli_error($dbConn)]);
			}
		}
	}
	else if($_SERVER["REQUEST_METHOD"] == "GET"){
		//ritornare i giocatori
		$username = $_SESSION["username"];
		$idStanza = $_SESSION["idStanza"];

		$query = $dbConn->prepare("SELECT iniziata, aggiornaGiocatori FROM partecipa, stanza WHERE username = ? AND idStanza = ?");
		$query->bind_param("si", $username, $idStanza);
		$query->execute();
		$row = $query->get_result();
		$row = $row->fetch_assoc();
		$iniziata = $row["iniziata"];
		$aggiornaGiocatori = $row["aggiornaGiocatori"];

		$query = $dbConn->prepare("SELECT utente.username,avatar,punteggio,UNIX_TIMESTAMP(ultimaRichiesta) as ultimaRichiesta FROM partecipa,utente WHERE idStanza = ? and partecipa.username=utente.username");
		$query->bind_param("i", $idStanza);
		$query->execute();
		$giocatori = $query->get_result();
		$giocatori = $giocatori->fetch_all(MYSQLI_ASSOC);

		$query = $dbConn->prepare("UPDATE partecipa SET ultimaRichiesta = now() where username = ?");
		$query->bind_param("s",$_SESSION["username"]);
		$query->execute();

		foreach($giocatori as $giocatore){
			if (time() - $giocatore["ultimaRichiesta"] > 4) {
				eliminaGiocatoreDaStanza($dbConn, $giocatore["username"], $_SESSION["idStanza"]);
			}
		}

		if ($iniziata == 1){
			echo json_encode(["successo"=>true, "azione"=>"inizio"]);
		}
		else if($aggiornaGiocatori == 1) {
			echo json_encode(["successo"=>true, "azione"=>"aggiorna","giocatori"=>$giocatori]);
			$query = $dbConn->prepare("UPDATE partecipa SET aggiornaGiocatori = 0 WHERE username = ?");
			$query->bind_param("s", $username);
			$query->execute();
		
		}
		else {
			die (json_encode(["successo"=>true,"azione" => null]));
		}
	}
	else if ($_SERVER['REQUEST_METHOD'] == "DELETE"){
        eliminaGiocatoreDaStanza($dbConn, $_SESSION["username"],$_SESSION["idStanza"]);
	}

	disconnettiDB($dbConn);

	function eliminaGiocatoreDaStanza(mysqli $dbConn, $username, $idStanza) {
		$query = $dbConn->prepare("DELETE FROM partecipa where username = ?");
		$query->bind_param("s",$username);
        $query->execute();
        $query = $dbConn->prepare("UPDATE partecipa SET aggiornaGiocatori = 1 where idStanza = ?");
        $query->bind_param("i", $idStanza);
		$query->execute();

		if ($query->affected_rows == 0){
			$query = $dbConn->prepare("DELETE FROM stanza where id = ?");
			$query->bind_param("i", $idStanza);
			$query->execute();
		}
		
		unset($_SESSION["idStanza"]);
	}
?>

