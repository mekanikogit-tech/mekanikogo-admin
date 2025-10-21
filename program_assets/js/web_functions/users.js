var tblAccount;
var userId;

$(document).ready(function() {
    loadAccount();
});

$('#txtSearchAccount').keyup(function(){
    tblAccount.search($(this).val()).draw();
});

$("#btnExportAccount").click(function(){
	$(".btn-export-account").click();
});


$('#tblAccount tbody').on('click', 'td button', function () {
    var data = tblAccount.row($(this).parents('tr')).data();
    userId = data.id;
    
    JConfirm("Are you sure you want to delete account?-red", () => {
        $.ajax({
            url: "../program_assets/php/web/shops_approval",
            data: {
                command   : 'delete_account',
                id        : userId
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message, data[0].color);
                
                if (!data[0].error) {
                    loadAccount();
                }
            },
            error: function() {
                JAlert("An error occurred. Please try again.", "red");
            },
            complete: function() {
                
            }
        });
    }, () => {
        JAlert("Process has been cancelled","blue");
    });
});


function loadAccount() {
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
            className: "btn btn-default btn-sm hide btn-export-account",
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
        	'url'       : '../program_assets/php/web/shops_approval.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_users'
        	}    
        },
        'aoColumns' : [
        	{ mData: 'fullName'},
            { mData: 'emailAddress'},
            { mData: 'mobileNumber'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="edit_' + row.id + '" name="edit_' + row.id + '" type="submit" class="btn btn-danger btn-xs dt-button edit">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [3]},
        	{"className": "dt-center", "targets": [0,1,2,3]},
        	{ "width": "1%", "targets": [3] }
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

function resetMessage(currentStatus) {
    $("#btnSaveChanges").prop("disabled", previousStatus == currentStatus);
    
    if (previousStatus == currentStatus) {
        $("#txtTitle").val("");
        $("#txtMessage").val("");
    } else {
        if (currentStatus == "Approved") {
            $("#txtTitle").val("Account has been approved");
            $("#txtMessage").val("Congratulations! Your account has been approved, and you can now use the app.");
        }
        
        if (currentStatus == "Pending") {
            $("#txtTitle").val("Account is pending approval");
            $("#txtMessage").val("Your account is currently under review. You will be notified once it is approved.");
        }
    
        if (currentStatus == "Declined") {
            $("#txtTitle").val("Account has been rejected");
            $("#txtMessage").val("We regret to inform you that your account has been rejected. Please contact support for more details.");
        }
    
        if (currentStatus == "Ban") {
            $("#txtTitle").val("Account has been banned");
            $("#txtMessage").val("Your account has been banned due to violations of our terms of service. Please reach out to support for further assistance.");
        }
    }
}