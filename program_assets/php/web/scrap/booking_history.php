<?php
    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';
    include 'email_sender.php';
    
    $command = $_POST['command'];
    
    switch($command) {
        case "get_booking" :
            $id = $_POST["id"];
                
            $sql = "
                SELECT 
                    CONCAT(b.lastName,', ',b.firstName,' ',IFNULL(b.middleName,'')) AS fullName,
                    a.dropOffName,
                    a.dropOffAddress,
                    a.pickUpName,
                    a.pickUpAddress,
                    a.totalKM,
                    FORMAT(amountToPay,2) AS famountToPay,
                    amountToPay,
                    a.bookingStatus,
                    DATE_FORMAT(a.dateCreated, '%m/%d/%Y') AS dateCreated
                FROM
                    t_booking_queue a 
                INNER JOIN
                    t_registration b 
                ON 
                    a.createId = b.id
                WHERE
                    a.updateId = $id
                ORDER BY
                    a.dateCreated DESC;
            ";
            return builder($con,$sql); 
            
        break;
    
        case "get_booking_total" :
            $id = $_POST["id"];
                
            $sql    = "
                SELECT 
                    SUM(a.totalKM) AS totalKM,
                    FORMAT(SUM(a.amountToPay),2) AS amountToPay
                FROM
                    t_booking_queue a 
                INNER JOIN
                    t_registration b 
                ON 
                    a.createId = b.id
                WHERE
                    a.updateId = $id
                ORDER BY
                    a.dateCreated DESC;
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'totalKM'     => $row["totalKM"],
                    'amountToPay' => $row["amountToPay"]
                );
            }
            echo json_encode($json);
            
        break;
    }
    
    mysqli_close($con);
?>