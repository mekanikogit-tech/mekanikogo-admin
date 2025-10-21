<?php?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>MekanikoGo | Login</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.7 -->
  <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="../bower_components/Ionicons/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../dist/css/AdminLTE.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="../plugins/iCheck/square/blue.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="../bower_components/select2/dist/css/select2.min.css">
  <!-- Custom Confirm -->
  <link rel="stylesheet" href="../bower_components/custom-confirm/jquery-confirm.min.css">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"-->
	<link rel="stylesheet" href="../fonts/fonts.css">
		
  
  <!-- StartUp Custom CSS (do not remove)  -->
  <link href="../plugins/bootoast/bootoast.css" rel="stylesheet" type="text/css">
  <link href="../program_assets/css/style.css" rel="stylesheet" type="text/css">
  <style>
    /*.login-page, .register-page {
      height: auto;
      background: #ffffff;
    }*/
  </style>
</head>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="login-logo" style="margin-bottom: 0px;">
    <a href="#" style="font-size: 30px;"><b>
      MekanikoGo
    </b></a>
    <br>
    <br>
    <img src="./../dist/img/logo.png" style="width: 100%; border-style: solid;" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'">
  </div>
  <!-- /.login-logo -->
  <div class="login-box-body">
    <p class="login-box-msg">Sign in to start your session</p>
      <div class="form-group has-feedback">
        <input id="txt_username" name="txt_username" type="text" class="form-control login cust-label" placeholder="Enter your Username">
        <span class="glyphicon glyphicon-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="txt_password" name="txt_password" type="password" class="form-control login cust-label" placeholder="Enter your Password">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <div class="col-xs-8">
          <div class="checkbox icheck">
            <!--label>
              <input type="checkbox"> Remember Me
            </label-->
          </div>
        </div>
        <!-- /.col -->
        
        <div class="col-xs-8">
          <a id="aForgotPassword" href="#" class="cust-label">Forgot Password</a>
        </div>
        <div class="col-xs-4">
          <button id="btn_signin" name="btn_signin" type="submit" class="btn btn-primary btn-block cust-label">Sign In</button>
        </div>
        <!-- /.col -->
      </div>

    <!--div class="social-auth-links text-center">
      <p>- OR -</p>
      <a href="#" class="btn btn-block btn-social btn-facebook btn-flat"><i class="fa fa-facebook"></i> Sign in using
        Facebook</a>
      <a href="#" class="btn btn-block btn-social btn-google btn-flat"><i class="fa fa-google-plus"></i> Sign in using
        Google+</a>
    </div -->
    <!-- /.social-auth-links -->

    <!--a href="#">I forgot my password</a><br>
    <a href="register.html" class="text-center">Register a new membership</a-->

  </div>
  <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<!-- NO INTERNET MODAL -->
<div class="modal fade" id="modal-default" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-sm">
    <div class="box box-danger">
      <div class="box-body">
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <label>System Message</label>
            <br>
              <center>
                <img class="img-res" src="../dist/img/404-error.png" alt="No Internet Connection">
              </center>
            <br>
            <p class="cust-label">There is no Internet connection. Kindly use the local program to continue your transaction and sync later.</p>
          </div>
        </div>
      </div>
    </div>
  <!-- /.modal-content -->
  </div>
<!-- /.modal-dialog -->
</div>

<!-- jQuery 3 -->
<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../bower_components/jquery-ui/jquery-ui.min.js"></script>
<!-- Bootstrap 3.3.7 -->
<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- iCheck -->
<script src="../plugins/iCheck/icheck.min.js"></script>
<script src="../plugins/bootoast/bootoast.js"></script>
<!-- Select2 -->
<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
<!-- Custom Confirm -->
<script src="../bower_components/custom-confirm/jquery-confirm.min.js"></script>
<!-- StartUp Custom JS (do not remove)  -->
<!--<script src="../program_assets/js/site_essentials/others.js"></script>-->
<!-- Select2 -->
<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
<script src="../program_assets/js/web_functions/login.js?random=<?php echo uniqid(); ?>"></script>
</body>
</html>
