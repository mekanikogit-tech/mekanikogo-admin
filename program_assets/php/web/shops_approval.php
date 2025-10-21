<?php
    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';
    include 'email_sender.php';
    
    $command = $_POST['command'];
    
    switch($command) {
        case "get_accounts" :
                
            $sql = "
                SELECT 
                    a.id,
                    CONCAT(a.lastName, ', ', a.firstName, ' ', IFNULL(a.middleName,'')) AS ownersName,
                    a.shopName,
                    a.shopNumber,
                    TRIM(BOTH ',' FROM CONCAT(
                        CASE WHEN a.openMonday = 1 THEN 'M,' ELSE '' END,
                        CASE WHEN a.openTuesday = 1 THEN 'T,' ELSE '' END,
                        CASE WHEN a.openWednesday = 1 THEN 'W,' ELSE '' END,
                        CASE WHEN a.openThursday = 1 THEN 'TH,' ELSE '' END,
                        CASE WHEN a.openFriday = 1 THEN 'F,' ELSE '' END,
                        CASE WHEN a.openSaturday = 1 THEN 'S,' ELSE '' END,
                        CASE WHEN a.openSunday = 1 THEN 'SU,' ELSE '' END
                    )) AS `schedule`,
                    CONCAT(
                        DATE_FORMAT(a.openingTime, '%h:%i %p'), ' - ', 
                        DATE_FORMAT(a.closingTime, '%h:%i %p')
                    ) AS businessHours,
                    a.`status`,
                    a.emailAddress,
                    a.shopLat,
                    a.shopLng
                FROM
                    tbl_users a 
                WHERE
                    isDriver = 0
                ORDER BY
                    a.id DESC;
            ";
            return builder($con,$sql); 
            
        break;
    
        case "get_users" :
                
            $sql = "
                SELECT 
                    a.id,
                    CONCAT(a.lastName, ', ', a.firstName, ' ', IFNULL(a.middleName,'')) AS fullName,
                    a.emailAddress,
                    a.mobileNumber
                FROM
                    tbl_users a 
                WHERE
                    isDriver = 1
                ORDER BY
                    a.id DESC;
            ";
            return builder($con,$sql); 
            
        break;
    
        case "update_status" :
                
            $id      = $_POST["id"];
            $title   = $_POST["title"];
            $message = $_POST["message"];
            $status  = $_POST["status"];
            $email   = $_POST["email"];
            
            $query = "UPDATE tbl_users SET `status` = ? WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"si",$status,$id);
                mysqli_stmt_execute($stmt);
                
                list($success, $message) = sendEmail($email, $title, $message);
                
                if ($success) {
                    $error   = false;
                    $color   = "green";
                    $message = "Status has been changed";
                } else {
                    $error   = false;
                    $color   = "orange";
                    $message = "Status has been changed but were unable to notify the user. Kindly contact them";
                }
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to change status. Please try again later";
            }    
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            
            echo json_encode($json);
            
        break;
    
        case "delete_account" :
                
            $id  = $_POST["id"];
            
            $query = "DELETE FROM tbl_users WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"i",$id);
                mysqli_stmt_execute($stmt);
                
                $error   = false;
                $color   = "green";
                $message = "Account has been deleted";
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error deleting. Please try again later";
            }    
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            
            echo json_encode($json);
            
        break;
    }
    
    mysqli_close($con);
?>