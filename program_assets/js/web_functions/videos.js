let tblVideo;
let isAdd = 1;
let videoId = 0;

loadVideos();

$("#btnAddVideo").click(function(){
    isAdd = 1;
    $("#btnDelete").prop("disabled", true);
    $("#txtVideoName").val("");
    $("#txtLink").val("");
    $("#mdVideo").modal();
});

$("#btnExportVideo").click(function(){
	$(".btn-export-video").click();
});

$('#txtSearchTools').keyup(function(){
    tblVideo.search($(this).val()).draw();
});

$("#btnSaveChanges").click(function () {
    let videoName = $("#txtVideoName").val().trim();
    let link = $("#txtLink").val().trim();

    if (videoName === "" || link === "") {
        JAlert("Please fill in all required fields", "red");
        return;
    }

    let formData = new FormData();
    let mode = isAdd ? "save" : "update";
    let id = isAdd ? null : tblVideo.row(".selected").data().id;

    formData.append("command", "save_or_update_video");
    formData.append("mode", mode);
    formData.append("id", id);
    formData.append("title", videoName);
    formData.append("link", link);

    $.ajax({
        url: '../program_assets/php/web/videos.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            const res = response[0];
            JAlert(res.message, res.color);

            if (!res.error) {
                $("#mdVideo").modal("hide");
                loadVideos();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
            JAlert("An error occurred. Please try again.", "red");
        }
    });
});

$('#tblVideo tbody').on('click', 'td button', function (){
	var data = tblVideo.row($(this).parents('tr')).data();

    isAdd = 0;
    videoId = data.id;

    $("#btnDelete").prop("disabled", false);
    $("#txtVideoName").val(data.title);
    $("#txtLink").val(data.link);
    $("#mdVideo").modal();
});

$("#btnDelete").click(function(){
	$.ajax({
        url: '../program_assets/php/web/videos.php',
        type: 'POST',
        dataType: 'json',
        data: {
            command: 'delete_video',
            id: videoId
        },
        success: function(response) {
            const res = response[0];
            JAlert(res.message, res.color);

            if (!res.error) {
                $("#mdVideo").modal("hide");
                loadVideos();
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            JAlert("An error occurred. Please try again.", "red");
        }
    });
});

function loadVideos() {
    tblVideo = 
    $('#tblVideo').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-video",
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
        	'url'       : '../program_assets/php/web/videos.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_videos',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'title'},
            { mData: 'link',
                render: function(data, type, row) {
                    return `<a href="${data}" target="_blank">${data}</a>`;
                }
            },
            { mData: 'id',
                render: function (data, type, row) {
                    return '<div class="input-group">' + 
                           '	<button type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
            {"className": "custom-center", "targets": [2]},
            {"className": "dt-center", "targets": [0,1]},
        	{ "width": "1%", "targets": [0,2] }
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            console.log('Video table initialized.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}
