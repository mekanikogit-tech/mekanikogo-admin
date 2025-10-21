var tblAccount;
var isNewAccount;
var userId;

loadAdminAccount();


$('#txtSearchAccount').keyup(function(){
    tblAccount.search($(this).val()).draw() ;
});

$("#btnExportAccount").click(function(){
	$(".btn-export-admin").click();
});

$("#btnAddAccount").click(function(){
    $("#txtFirstName").prop("disabled", false);
    $("#txtMiddleName").prop("disabled", false);
    $("#txtLastName").prop("disabled", false);
    $("#txtMobileNumber").prop("disabled", false);
    $("#txtEmailAddress").prop("disabled", false);
    $("#txtUsername").prop("disabled", false);
    $("#txtFirstName").val("");
    $("#txtMiddleName").val("");
    $("#txtLastName").val("");
    $("#txtMobileNumber").val("");
    $("#txtEmailAddress").val("");
    $("#txtUsername").val("");
    $("#btnReset").prop("disabled", true);
    $("#btnDelete").prop("disabled", true);
    $("#btnSaveUser").prop("disabled", false);
    
	$("#mdAccount").modal();
});

$('#tblAccount tbody').on('click', 'td button', function (){
	var data = tblAccount.row( $(this).parents('tr') ).data();
    
    userId = data.id;
    
    $("#txtFirstName").prop("disabled", true);
    $("#txtMiddleName").prop("disabled", true);
    $("#txtLastName").prop("disabled", true);
    $("#txtMobileNumber").prop("disabled", true);
    $("#txtEmailAddress").prop("disabled", true);
    $("#txtUsername").prop("disabled", true);
    $("#btnReset").prop("disabled", false);
    $("#btnDelete").prop("disabled", false);
    $("#btnSaveUser").prop("disabled", true);
    
    $("#txtFirstName").val(data.firstName);
    $("#txtMiddleName").val(data.middleName);
    $("#txtLastName").val(data.lastName);
    $("#txtMobileNumber").val(data.mobileNumber);
    $("#txtEmailAddress").val(data.email);
    $("#txtUsername").val(data.username);
    
    $("#mdAccount").modal();
});

$("#btnReset").click(function(){
	$.ajax({
        url: "../program_assets/php/web/admin_registration",
        data: {
            command   : 'reset_password',
            id        : userId
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            $("#mdAccount").modal("hide");
        }
    });
});

$("#btnDelete").click(function(){
	$.ajax({
        url: "../program_assets/php/web/admin_registration",
        data: {
            command   : 'delete_account',
            id        : userId
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                loadAdminAccount();
                $("#mdAccount").modal("hide");
            }
        }
    });
});

$("#btnSaveUser").click(function(){
    var firstName    = $("#txtFirstName").val();
    var middleName   = $("#txtMiddleName").val();
    var lastName     = $("#txtLastName").val();
    var emailAddress = $("#txtEmailAddress").val();
    var username     = $("#txtUsername").val();
    var mobileNumber = $("#txtMobileNumber").val();
    
    if (firstName == "" || lastName == "" || emailAddress == "" || username == "" || mobileNumber == "") {
        JAlert("Please fill in required fields","red");
    } else if (!validateEmail(emailAddress)) {
        JAlert("Please provide a proper email","red");
    } else if (mobileNumber.length < 11) {
        JAlert("Mobile number must be 11 digits","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/admin_registration",
            data: {
                command   : 'save_account',
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                emailAddress: emailAddress,
                username: username,
                mobileNumber: mobileNumber
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    $("#mdAccount").modal("hide");
                    loadAdminAccount();
                }
            }
        });
    }
});

function loadAdminAccount() {
    tblAccount = 
    $('#tblAccount').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : '../program_assets/php/web/admin_registration.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_admin_accounts',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
            { mData: 'mobileNumber'},
            { mData: 'email'},
            { mData: 'username'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="edit_' + row.id + '" name="edit_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button edit">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [6]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5]},
        	{ "width": "1%", "targets": [6] }
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
}

function numOnly(selector){
    selector.value = selector.value.replace(/[^0-9]/g,'');
}