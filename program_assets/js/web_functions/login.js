$("#btn_signin").click(function(){
	login();
});

$(".login").keyup(function(event) {
    if (event.keyCode === 13) {
        login();
    }
});

$("#aForgotPassword").click(function(){
	$.confirm({
		title: 'Forgot Password',
		content: '' +
		'<div>' +
		'<div class="form-group">' +
		'<label>Enter Email Address</label>' +
		'<input type="text" placeholder="" class="email form-control" required /><br>' +
		'<code class="cust-label">A password reset link will be sent to your email</code>' +
		'</div>' +
		'</div>',
		buttons: {
			formSubmit: {
				text: 'Submit',
				btnClass: 'btn-blue',
				action: function () {
					var email = this.$content.find('.email').val();
					if(!email){
						$.alert('Please provide Email Address');
						return false;
					}
					
					checkAccount(email);
				}
			},
			cancel: function () {

			},
		},
		onContentReady: function () {
			var jc = this;
			this.$content.find('form').on('submit', function (e) {
				e.preventDefault();
				jc.$$formSubmit.trigger('click');
			});
		}
	});
});

function checkAccount(email) {
	var currentDomain = window.location.hostname;
	var passwordResetLink = currentDomain + "/mekanikogo-admin/pages/password_reset.php?account=idHere";
	var message = "Please copy the link below to reset your password\n\n\n" + passwordResetLink;
	
	$.ajax({
		url: '../program_assets/php/web/profile.php',
		data: {
			command : 'email_check',
			email   : email,
			message : message
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			JAlert(data.message,data.color);
		}
	});
}

function login () {
	var username = $("#txt_username").val();
	var password = $("#txt_password").val();

	if (username == "" || password == "") {
		JAlert("Please provide username and password","red");
	} else {
		$.ajax({
		    url: '../program_assets/php/web/login.php',
		    data: {
		        'username': username,
		        'password': password
		    },
		    type: 'post',
		    success: function(data) {
		    	var data = jQuery.parseJSON(data);
				
				if (data.isAccountExist == 1) {
					window.location.href = "../pages/shops_approval";
				} else {
					JAlert("Account does not exist","red");
				}
		    }
		});
	}
}


function JConfirm (message,confirmCallback) {
	var [c_message,c_color] = message.split('-');
	var default_color;
	
	if (c_color == null) {
		default_color = "orange";
	} else {
		default_color = c_color;
	}
	
	$.confirm({
		title    : 'System Message',
		content  : c_message,
		type     : default_color,
		icon     : 'fa fa-question-circle',
		backgroundDismiss : false,
		backgroundDismissAnimation : 'glow',
		buttons: {
			confirm: confirmCallback
		}
	});
}

function JAlert (message,type,confirmCallback) {
	$.alert({
		title    : 'System Message',
		content  : message,
		type     : type,
		icon     : 'fa fa-warning',
		backgroundDismiss : false,
		backgroundDismissAnimation : 'glow'
	});
}