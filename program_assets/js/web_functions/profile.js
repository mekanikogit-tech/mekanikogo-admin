$("#btn_password").click(function(){
    var password_1 = $("#txt_new_password").val();
    var password_2 = $("#txt_repeat_password").val();
    
    if (password_1 == "" || password_2 == "") {
        JAlert("Please fill in all required fields","red");
    } else if (password_1 != password_2) {
        JAlert("Passwords are not the same","red");
    } else if (password_1.length < 8) {
        JAlert("Passwords must be 8 characters","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/profile.php",
            data: {
                password : password_1,
                command  : "update_pass"
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                if (data[0].error) {
                    JAlert(data[0].message,"red");
                } else {
                    JConfirm("Password has been changed-green", () => {
                        window.location.href = "../pages/profile";
                    });
                }
            }
        });
    }
});

function openImage() {
    javascript:document.getElementById('image_uploader').click();
}

$('#image_uploader').change(function (e) {
	var file_data = $('#image_uploader').prop('files')[0];
	var form_data = new FormData();
	form_data.append('file', file_data);
	$.ajax({
	    url: '../program_assets/php/web/upload_profile.php',
	    dataType: 'text',
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: form_data,
	    type: 'post',
	    success: function(data) {
            id = data.trim();
            $('#imgProfile').attr("src", "../profile/" + id + ".png?random=" + Math.random());
            isImageAdded = 1;
        }
	});
});