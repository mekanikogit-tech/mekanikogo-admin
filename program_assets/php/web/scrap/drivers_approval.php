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
                
            $sql = "SELECT * FROM t_registration WHERE isPassenger = 0 ORDER BY dateCreated";
            return builder($con,$sql); 
            
        break;
    
        case "update_status" :
                
            $id      = $_POST["id"];
            $title   = $_POST["title"];
            $message = $_POST["message"];
            $status  = $_POST["status"];
            $email   = $_POST["email"];
            
            $query = "UPDATE t_registration SET `status` = ? WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"si",$status,$id);
                mysqli_stmt_execute($stmt);
                
                list($success, $message) = sendEmail($email, $title, $message);
                
                if ($success) {
                    $error   = false;
                    $color   = "green";
                    $message = "Status has been changed";
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Unable to change status. Please try again later";
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
    }
    
    mysqli_close($con);
?>