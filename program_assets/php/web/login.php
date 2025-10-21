<?php
	session_start();
	include dirname(__FILE__,2) . '/config.php';
	include $main_location . '/connection/conn.php';

	$username = $_POST["username"] ?? '';
	$password = $_POST["password"] ?? '';

	$sql = "
		SELECT id, 
		       CONCAT(firstName, ' ', middleName, ' ', lastName) AS fullName,
		       username, 
		       DATE_FORMAT(dateCreated, '%m/%d/%Y') AS member_since, 
		       isPasswordChange 
		FROM tbl_admin_registration 
		WHERE username = ? 
		AND password = MD5(?) 
		AND isActive = 1
	";

	$stmt = mysqli_prepare($con, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $username, $password);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);

	$count = mysqli_num_rows($result);
	$row = mysqli_fetch_assoc($result);

	if ($row) {
		$_SESSION['id']               = $row['id'];
		$_SESSION['fullName']         = $row['fullName'];
		$_SESSION['username']         = $row['username'];
		$_SESSION['date_created']     = $row['member_since'];
		$_SESSION['isPasswordChange'] = $row['isPasswordChange'];
	}

	echo json_encode(['isAccountExist' => $count != 0]);

	mysqli_close($con);
?>
