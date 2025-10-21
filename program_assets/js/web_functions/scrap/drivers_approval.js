var tblAccount;
var isNewAccount;
var userId;
var previousStatus;
var currentEmail;

$(document).ready(function() {
    loadDriversAccount();
});

$('#txtSearchAccount').keyup(function(){
    tblAccount.search($(this).val()).draw();
});

$("#btnExportAccount").click(function(){
	$(".btn-export-account").click();
});

$(".clickable-image").click(function() {
    var imgSrc = $(this).attr("src");
    var fullSizeImgSrc = imgSrc.replace("thumbnail", "fullsize"); 
    window.open(fullSizeImgSrc, '_blank');
});

$('#tblAccount tbody').on('click', 'td button', function (){
	var data = tblAccount.row( $(this).parents('tr') ).data();
    
    previousStatus = data.status;
    userId = data.id;
    currentEmail = data.emailAddress;
    
    $("#txtFirstName").val(data.firstName);
    
    $("#txtMiddleName").val(data.middleName);
    $("#txtLastName").val(data.lastName);
    $("#txtMobileNumber").val(data.mobileNumber);
    $("#txtEmailAddress").val(data.emailAddress);
    $("#txtUsername").val(data.username);
    $("#txtFullAddress").val(data.fullAddress);
    $("#txtCarType").val(data.carType);
    $("#txtPlateNumber").val(data.plateNumber);
    $("#cmbAccountStatus").val(data.status).trigger("change");
    $("#img1").attr("src", "../../sampa-api/pictures/" + data.applicationId + "/" + data.driversLicenseDocumentFileName + ".png?rand=" + new Date().getTime());
    $("#img2").attr("src", "../../sampa-api/pictures/" + data.applicationId + "/" + data.vehicleOfficialReceiptFileName + ".png?rand=" + new Date().getTime());
    $("#img3").attr("src", "../../sampa-api/pictures/" + data.applicationId + "/" + data.certificationRegistrationFileName + ".png?rand=" + new Date().getTime());
    
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
        $btnSaveChanges.prop("disabled", true); // Disable button
        $btnSaveChanges.html('<i class="fa fa-spinner fa-spin"></i> Loading...');

        $.ajax({
            url: "../program_assets/php/web/drivers_approval",
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
                    loadDriversAccount();
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


function loadDriversAccount() {
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
        	'url'       : '../program_assets/php/web/drivers_approval.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_accounts',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
            { mData: 'mobileNumber'},
            { mData: 'emailAddress'},
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
    
        if (currentStatus == "Rejected") {
            $("#txtTitle").val("Account has been rejected");
            $("#txtMessage").val("We regret to inform you that your account has been rejected. Please contact support for more details.");
        }
    
        if (currentStatus == "Ban") {
            $("#txtTitle").val("Account has been banned");
            $("#txtMessage").val("Your account has been banned due to violations of our terms of service. Please reach out to support for further assistance.");
        }
    }
}