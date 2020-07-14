<?php
$api_key = $_GET["api_key"];
$action = $_GET["action"];
header("Content-Type: application/json; charset=UTF-8");

switch ($action) {
case "REGISTER":
	$username = $_GET["username"];
        $out["status"] = 0;
        $out["message"] = "username is " . $username;
	
	break;
default:
	$out["status"] = 1;
	$out["message"] = "'action' argument is missing or is invalid";
	break;
}

echo json_encode($out);

?>
