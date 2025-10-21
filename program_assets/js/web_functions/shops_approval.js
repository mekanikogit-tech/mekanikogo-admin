var tblAccount;
var isNewAccount;
var userId;
var previousStatus;
var currentEmail;

$(document).ready(function() {
    loadShopsAccount();
});

$('#txtSearchAccount').keyup(function(){
    tblAccount.search($(this).val()).draw();
});

$("#btnExportAccount").click(function(){
	$(".btn-export-account").click();
});


$('#tblAccount tbody').on('click', 'td button', function () {
    var data = tblAccount.row($(this).parents('tr')).data();

    previousStatus = data.status;
    userId = data.id;
    currentEmail = data.emailAddress;

    $("#txtOwnersName").val(data.ownersName);
    $("#txtShopName").val(data.shopName);
    $("#txtContactNumber").val(data.shopNumber);
    $("#txtSchedule").val(data.schedule);
    $("#txtBusinessHours").val(data.businessHours);
    $("#cmbAccountStatus").val(data.status).trigger("change");

    if (data.shopLat && data.shopLng) {
        var lat = data.shopLat;
        var lng = data.shopLng;
        var zoom = 15;
        var mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
        $("#shopMap").attr("src", mapSrc);
    } else {
        $("#shopMap").attr("src", ""); 
    }

    $("#mdAccount").modal();
});


$("#cmbAccountStatus").on("change", function() {
    resetMessage(this.value);
});

$("#btnSaveChanges").click(function() {
    var title   = $("#txtTitle").val();
    var message = $("#txtMessage").val();
    
    if (message == "") {
        JAlert("Please provide message", "red");
    } else {
        var $btnSaveChanges = $("#btnSaveChanges");
        $btnSaveChanges.prop("disabled", true);
        $btnSaveChanges.html('<i class="fa fa-spinner fa-spin"></i> Loading...');

        $.ajax({
            url: "../program_assets/php/web/shops_approval",
            data: {
                command   : 'update_status',
                id        : userId,
                status    : $("#cmbAccountStatus").val(),
                title     : title,
                message   : message,
                email     : currentEmail
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message, data[0].color);
                
                if (!data[0].error) {
                    previousStatus = $("#cmbAccountStatus").val();
                    resetMessage(previousStatus);
                    loadShopsAccount();
                }
            },
            error: function() {
                // Handle error (in case the request fails)
                JAlert("An error occurred. Please try again.", "red");
            },
            complete: function() {
                $btnSaveChanges.prop("disabled", false);
                $btnSaveChanges.html('<i class="fa fa-save"></i> Save Changes');
            }
        });
    }
});

$("#btnDeleteAccount").click(function(){
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
                    $("#mdAccount").modal("hide");
                    loadShopsAccount();
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


function loadShopsAccount() {
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
        		command : 'get_accounts',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'ownersName'},
            { mData: 'shopName'},
            { mData: 'shopNumber'},
            { mData: 'schedule'},
            { mData: 'businessHours'},
            { mData: 'status'},
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