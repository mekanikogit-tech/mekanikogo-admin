<?php
if (!isset($_SESSION)) {
    session_start();
}

include dirname(__FILE__, 2) . '/config.php';
include $main_location . '/connection/conn.php';
include '../builder/builder_select.php';
include '../builder/builder_table.php';

$command = $_POST['command'];

switch ($command) {
    case "get_history":
        $status = $_POST['status'] ?? '';
        $dateRequested = $_POST['dateRequested'] ?? '';

        $sql = "
            SELECT 
                CONCAT(b.lastName,', ',b.firstName,' ',IFNULL(b.middleName,'')) AS customerName,
                a.concern,
                DATE_FORMAT(a.dateCreated, '%m/%d/%Y') AS dateCreated,
                b.mobileNumber AS contactNumber,
                c.shopName AS requestingShop,
                c.shopNumber,
                a.`status`
            FROM
                tbl_request a
            INNER JOIN
                tbl_users b 
                ON a.createdBy = b.id 
            INNER JOIN
                tbl_users c 
                ON a.requestedTo = c.id
            WHERE 1 = 1
        ";

        if (!empty($status)) {
            $sql .= " AND a.status = '" . mysqli_real_escape_string($con, $status) . "'";
        }

        if (!empty($dateRequested)) {
            $sql .= " AND DATE(a.dateCreated) = '" . mysqli_real_escape_string($con, $dateRequested) . "'";
        }

        return builder($con, $sql);
        break;
}

mysqli_close($con);
