<?php
    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include 'email_sender.php';

    $command = $_POST["command"];
    
    switch ($command) {
        case "check_change_pass" :
                
            echo $_SESSION["isPasswordChange"];        
            
        break;
    
        case "email_check" :
            
            $email   = $_POST["email"] ?? '';
            $message = $_POST["message"] ?? '';

            $query = "SELECT id FROM tbl_admin_registration WHERE email = ? AND isActive = 1";
            $stmt  = mysqli_prepare($con, $query);
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
        
            if ($row = mysqli_fetch_assoc($result)) {
                $message =  str_replace("idHere", $row["id"], $message);
                list($success, $message) = sendEmail($email, 'Admin Password Reset Link', $message);
                
                if ($success) {
                    $response = [
                        'error'   => false,
                        'color'   => "green",
                        'message' => "Email link has been sent to your email"
                    ];
                } else {
                    $response = [
                        'error'   => true,
                        'color'   => "red",
                        'message' => $message
                    ];
                }
            } else {
                $response = [
                    'error'   => true,
                    'color'   => "red",
                    'message' => "Account with this email doesn't exist."
                ];
            }
        
            echo json_encode($response);
            
        break;
        
        case "update_pass" :
            
            $id               = $_SESSION['id'];
            $password         = $_POST["password"];
            $isPasswordChange = 1;
            
            $query = "UPDATE tbl_admin_registration SET password = MD5(?),isPasswordChange = ? WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"sii",$password,$isPasswordChange,$id);
                mysqli_stmt_execute($stmt);
            
                $_SESSION["isPasswordChange"] = $isPasswordChange;        
                
                $error   = false;
                $color   = "green";
                $message = "Password has been changed";
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to change password. Please try again later";
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