<?php
	include "utils.php";
	
	$dbConn = connettiDB();

	if ($_SERVER['REQUEST_METHOD'] == "POST") {
		// Creazione di una stanza
		controllaLogin();
		$json = prendiJson();
		controllaParametri($json, "privata", "nome", "categoria");
		$creatore = $_SESSION["username"];
		$privata = intval($json["privata"]);
		$nome = $json["nome"];
		$categoria = $json["categoria"];
		$query = $dbConn->prepare("INSERT INTO stanza (nome, categoria, privata, creatore) VALUES (?, ?, ?, ?);");
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
		controllaLogin();
		$json = prendiJson();
		controllaParametri($json, "azione", "idStanza");
		$azione = $json["azione"];
		$idStanza = $json["idStanza"];
		$username = $_SESSION["username"];
		if ($azione == "entra") {
			$query = $dbConn->prepare("INSERT INTO partecipa (idStanza, username) VALUES (?, ?)");
			$query->bind_param('is', $idStanza, $username);
			if (!$query->execute()) 
				die(json_encode(["successo" => false, "motivazione" => "La stanza non esiste"]));
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
		
	}
	else if($_SERVER["REQUEST_METHOD"] == "GET"){
		controllaStanza();
		//ritornare i giocatori
		$username = $_SESSION["username"];
		$idStanza = $_SESSION["idStanza"];

		$query = $dbConn->prepare("SELECT iniziata, aggiornaGiocatori,creatore FROM partecipa, stanza WHERE id = idStanza AND username = ? AND idStanza = ?");
		$query->bind_param("si", $username, $idStanza);
		$query->execute();
		$row = $query->get_result();
		$row = $row->fetch_assoc();
		$iniziata = $row["iniziata"];
		$creatore = $row["creatore"];
		$aggiornaGiocatori = $row["aggiornaGiocatori"];

		$query = $dbConn->prepare("SELECT utente.username,avatar,punteggio,UNIX_TIMESTAMP(ultimaRichiesta) as ultimaRichiesta FROM partecipa,utente WHERE idStanza = ? and partecipa.username=utente.username");
		$query->bind_param("i", $idStanza);
		$query->execute();
		$giocatori = $query->get_result();
		$giocatori = $giocatori->fetch_all(MYSQLI_ASSOC);

		$query = $dbConn->prepare("UPDATE partecipa SET ultimaRichiesta = now() where username = ?");
		$query->bind_param("s",$_SESSION["username"]);
		$query->execute();

		// foreach($giocatori as $giocatore){
		// 	if ( $giocatore["ultimaRichiesta"] != null && time() - $giocatore["ultimaRichiesta"] > 4) {
		// 		eliminaGiocatoreDaStanza($dbConn, $giocatore["username"], $_SESSION["idStanza"]);
		// 	}
		// }

		if ($iniziata == 1){
			echo json_encode(["successo"=>true, "azione"=>"inizio"]);
		}
		else if($aggiornaGiocatori == 1) {
			if ($creatore != $username) $creatore = null;
			echo json_encode(["successo"=>true, "azione"=>"aggiorna","creatore"=>$creatore, "giocatori"=>$giocatori]);
			$query = $dbConn->prepare("UPDATE partecipa SET aggiornaGiocatori = 0 WHERE username = ?");
			$query->bind_param("s", $username);
			$query->execute();
		
		}
		else {
			die (json_encode(["successo"=>true ,"azione" => null]));
		}
	}

	disconnettiDB($dbConn);
	
?>

