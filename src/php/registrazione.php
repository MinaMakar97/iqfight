<?php
    include "utils.php";
	$dbConn = connettiDB();

	if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $json = prendiJson();
        $username = $json["username"];
        $password = $json["password"];
        $email = $json["email"];
        controllaParametri($json, "username", "email", "password");
        $password = password_hash($password, PASSWORD_DEFAULT);
        
        if (emailRegistrata($dbConn,$email)) {
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
        $_SESSION["username_temp"] = $username;
        echo json_encode(["successo"=> true]);
    }

    disconnettiDB($dbConn);

?>