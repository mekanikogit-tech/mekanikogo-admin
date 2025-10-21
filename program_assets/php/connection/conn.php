<?php
	date_default_timezone_set('Asia/Manila');
	$host = "localhost";
	$user = "root";
	$pass = "";
	$data = "mekanikogo";
	$global_date  = date('Y-m-d H:i:s', time());

	$con  = mysqli_connect($host,$user,$pass,$data);

	if($con === false){
	    die("ERROR: Could not connect. " . mysqli_connect_error());
	}
?>