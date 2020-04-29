<?php
    include "utils.php";
	$dbConn = connettiDB();

	if ($_SERVER['REQUEST_METHOD'] == "POST") {
		// Creazione di una stanza
        $json = prendiJson();
        $username = $json["username"];
        $password = $json["password"];
        $email = $json["email"];
        controllaParametri($json, "username", "email", "password");
        $password = password_hash($password, PASSWORD_DEFAULT);
        $query = $dbConn -> prepare("SELECT email FROM utente WHERE email = ?");
        $query->bind_param("s",$email);
        $query->execute();
        // $row = mysql_num_rows($query); 
        $risultatoQuery = $query->get_result();
        if (mysqli_num_rows($risultatoQuery) > 0) {
            die(json_encode(["successo"=> false, "motivazione" => "email registrata"]));
        }
        $query = $dbConn->prepare("INSERT INTO utente (username, email, password) VALUES ( ?, ?, ?);");
        
        if (!$query) {
			die(json_encode(["successo" => false, "motivazione" => mysqli_error($dbConn)]));
		}
		$query->bind_param('sss', $username,$email, $password);
		if (!$query->execute()) {
            die(json_encode(["successo"=> false, "motivazione" => "username già utilizzato"]));
        }
        $_SESSION["username"] = $username;
        echo json_encode(["successo"=> true]);
    }

    disconnettiDB($dbConn);

?>