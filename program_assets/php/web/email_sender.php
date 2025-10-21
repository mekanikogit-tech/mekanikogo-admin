<?php
	use PHPMailer\PHPMailer\PHPMailer; 
	use PHPMailer\PHPMailer\Exception;
	
	require '../phpmailer/src/Exception.php';
	require '../phpmailer/src/PHPMailer.php';
	require '../phpmailer/src/SMTP.php';

	function sendEmail($email, $subject, $message) {
	    $mail = new PHPMailer;
	    $mail->isSMTP();
	    $mail->SMTPDebug = 0;
	    $mail->Host = 'smtp.gmail.com';
	    $mail->Port = 587;
	    $mail->SMTPAuth = true;
	    $mail->Username = 'mekanikogojakemiller@gmail.com';
	    $mail->Password = 'oudrxophsgxzmxmz';
	    $mail->setFrom('mekanikogojakemiller@gmail.com', 'MekanikoGo Online Mechanic Shop Finder');
	    $mail->addAddress($email, '');
	    $mail->Subject = $subject;
	    $mail->Body = $message;

	    if (!$mail->send()) {
	        return [false, 'Mailer Error: ' . $mail->ErrorInfo];
	    } else {
	        return [true, 'The email message was sent.'];
	    }
	}
?>