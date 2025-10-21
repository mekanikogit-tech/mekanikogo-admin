<?php
    if(!isset($_SESSION)) { session_start(); } 
    include '../program_assets/php/connection/conn.php';
    
    $message = "";
    $alertClass = "alert-danger"; // Default class for error

    if (isset($_GET['account'])) {
        $id = $_GET['account'];
        
        $query = "UPDATE tbl_admin_registration SET `password` = MD5(username), isPasswordChange = 0 WHERE id = ?";
        if ($stmt = mysqli_prepare($con, $query)) {
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
           
            $message = "<strong>Password Reset Successful!</strong> Click <a href='login.php' class='alert-link'>here</a> to log in. You will be required to change your password upon login.";
            $alertClass = "alert-success"; // Success class
        } else {
            $message = "<strong>Something went wrong.</strong> Please try again later.";
        }
    } else {
        $message = "<strong>Invalid request.</strong> Please check the link and try again.";
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Password Reset</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    body {
        background: #f8f9fa;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
    }
    .card {
        max-width: 400px;
        width: 100%;
        padding: 20px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        background: #fff;
    }
    .alert {
        font-size: 14px;
    }
  </style>
</head>
<body> 

<div class="card">
    <div class="alert <?php echo $alertClass; ?>" role="alert">
        <?php echo $message; ?>
    </div>
</div>

</body>
</html>
