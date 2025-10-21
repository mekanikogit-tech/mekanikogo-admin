let tblTools;
let isAdd = 1;
let oldToolName = "";
let toolId = 0;

loadTools();

$("#btnAddTools").click(function(){
    isAdd = 1;
    
    $('#imgProfile').attr('src', `./../photos/tools/default.png?random=` + getRandom());
    $("#btnDelete").prop("disabled", true);
    $("#txtToolName").val("");
    $("#txtDescription").val("");
	$("#mdTools").modal();
});

$("#btnExportTools").click(function(){
	$(".btn-export-tool").click();
});

$('#txtSearchTools').keyup(function(){
    tblTools.search($(this).val()).draw() ;
});


$("#btnSaveChanges").click(function () {
    let toolName = $("#txtToolName").val().trim();
    let description = $("#txtDescription").val().trim();
    let imageFile = $("#image_uploader")[0].files[0]; // image input

    if (toolName === "" || description === "") {
        JAlert("Please fill in all required fields", "red");
        return;
    }

    // Require image on Add mode only
    if (isAdd && !imageFile) {
        JAlert("Please select an image for the tool.", "red");
        return;
    }

    let formData = new FormData();
    let mode = isAdd ? "save" : "update";
    let id = isAdd ? null : tblTools.row(".selected").data().id;

    formData.append("command", "save_or_update_tool");
    formData.append("mode", mode);
    formData.append("id", id);
    formData.append("tool", toolName);
    formData.append("description", description);

    if (imageFile) {
        formData.append("file", imageFile);
    }

    $.ajax({
        url: '../program_assets/php/web/tools.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            const res = response[0];
            JAlert(res.message, res.color);

            if (!res.error) {
                $("#mdTools").modal("hide");
                loadTools();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
            JAlert("An error occurred. Please try again.", "red");
        }
    });
});


$('#tblTools tbody').on('click', 'td button', function (){
	var data = tblTools.row( $(this).parents('tr') ).data();
    
    isAdd = 0;
    oldToolName = data.tool;
    toolId = data.id;
    
    $('#imgProfile').attr('src', `./../photos/tools/${toolId}.png?random=` + getRandom());
    $("#btnDelete").prop("disabled", false);
    $("#txtToolName").val(data.tool);
    $("#txtDescription").val(data.description);
    $("#mdTools").modal();
});

$('#txtSearchTools').keyup(function(){
    tblTools.search($(this).val()).draw() ;
});

$("#btnDelete").click(function(){
	$.ajax({
        url: '../program_assets/php/web/tools.php',
        type: 'POST',
        dataType: 'json',
        data: {
            command: 'delete_tool',
            id: toolId
        },
        success: function(response) {
            const res = response[0];
            JAlert(res.message, res.color);

            if (!res.error) {
                $("#mdTools").modal("hide");
                loadTools();
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            JAlert("An error occurred. Please try again.", "red");
        }
    });
});

function loadTools() {
    tblTools = 
    $('#tblTools').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-tool",
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
        	'url'       : '../program_assets/php/web/tools.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_tools',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'tool'},
            { mData: 'description'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
            {"className": "text-wrap", "targets": [1]},
            {"className": "custom-center", "targets": [2]},
        	{ "width": "1%", "targets": [0,2] }
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

function openImage() {
    document.getElementById('image_uploader').click();
}

document.getElementById('image_uploader').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file && file.type.match('image.*')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('imgProfile').src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file (PNG or JPEG).");
    }
});

function getRandom() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}