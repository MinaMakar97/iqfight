<?php 
    include "utils.php";
    $dbConn = connettiDB();

    if ($_SERVER['REQUEST_METHOD'] == "POST"){
        controllaStanza();
        eliminaGiocatoreDaStanza($dbConn, $_SESSION["username"],$_SESSION["idStanza"]);
	}
	disconnettiDB($dbConn);

?>