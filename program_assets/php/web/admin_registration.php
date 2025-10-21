<?php
    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';
    
    $command = $_POST['command'];
    
    switch($command) {
        case "get_admin_accounts" :
                
            $sql = "SELECT * FROM tbl_admin_registration WHERE isActive = 1 ORDER BY dateCreated";
            return builder($con,$sql); 
            
        break;
    
        case "reset_password" :
            $id = $_POST["id"];
            
            $query = "UPDATE tbl_admin_registration SET `password` = MD5(username),isPasswordChange = 0 WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"i",$id);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Password has been reset. It is now same as username"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to reset password. Plase try again later"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "delete_account" :
            $id = $_POST["id"];
            
            $query = "UPDATE tbl_admin_registration SET isActive = 0 WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"i",$id);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Account has been deleted."; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to delete account. Plase try again later"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "save_account" :
            
            $firstName    = $_POST['firstName'];
            $middleName   = $_POST['middleName'];
            $lastName     = $_POST['lastName'];
            $emailAddress = $_POST['emailAddress'];
            $username     = $_POST['username'];
            $mobileNumber = $_POST['mobileNumber'];
            $dateCreated  = $global_date;
            
            $checkUsernameQuery = "SELECT COUNT(*) FROM tbl_admin_registration WHERE username = ?";
            if ($stmt = mysqli_prepare($con, $checkUsernameQuery)) {
                mysqli_stmt_bind_param($stmt, "s", $username);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $usernameCount);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);
            
                if ($usernameCount > 0) {
                    echo json_encode([[
                        'error' => true,
                        'color' => "red",
                        'message' => "Username already exists. Please choose another one."
                    ]]);
                    exit;
                }
            }

            $checkEmailQuery = "SELECT COUNT(*) FROM tbl_admin_registration WHERE email = ?";
            if ($stmt = mysqli_prepare($con, $checkEmailQuery)) {
                mysqli_stmt_bind_param($stmt, "s", $emailAddress);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_bind_result($stmt, $emailCount);
                mysqli_stmt_fetch($stmt);
                mysqli_stmt_close($stmt);
            
                if ($emailCount > 0) {
                    echo json_encode([[
                        'error' => true,
                        'color' => "red",
                        'message' => "Email already exists. Please use another email."
                    ]]);
                    exit;
                }
            }
            
            $query = "INSERT INTO tbl_admin_registration (firstName, middleName, lastName, mobileNumber, email, username, password, dateCreated) 
                      VALUES (?, ?, ?, ?, ?, ?, MD5(?), ?)";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt, "ssssssss", $firstName, $middleName, $lastName, $mobileNumber, $emailAddress, $username, $username, $dateCreated);
                mysqli_stmt_execute($stmt);
            
                echo json_encode([[
                    'error' => false,
                    'color' => "green",
                    'message' => "Admin account has been created successfully. Username and password are the same temporarily."
                ]]);
            } else {
                echo json_encode([[
                    'error' => true,
                    'color' => "red",
                    'message' => "Unable to create account. Please try again later."
                ]]);
            }
            
        break;
    }
    
    mysqli_close($con);
?>