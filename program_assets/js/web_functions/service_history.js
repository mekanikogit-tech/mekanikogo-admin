let tblHistory;

loadHistory();



$('#txtSearchHistory').keyup(function(){
    tblHistory.search($(this).val()).draw();
});

$("#btnExportReport").click(function(){
	$(".btn-export-history").click();
});


function loadHistory() {
    tblHistory = 
    $('#tblHistory').DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        'pageLength': 15,
        "order": [],
        'info': true,
        'autoWidth': false,
        'select': true,
        'sDom': 'Btp<"clear">',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-history",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback': function(nRow, aData, iDisplayIndex) {
            $('td', nRow).attr('nowrap', 'nowrap');
            return nRow;
        },
        'ajax': {
            'url': '../program_assets/php/web/service_history.php',
            'type': 'POST',
            'data': function(d) {
                d.command = 'get_history';
                d.status = $('#ddlStatusFilter').val();
                d.dateRequested = $('#dateRequested').val();
            }
        },
        'aoColumns': [
            { mData: 'customerName'},
            { mData: 'concern'},
            { mData: 'dateCreated'},
            { mData: 'contactNumber'},
            { mData: 'requestingShop'},
            { mData: 'shopNumber'},
            { mData: 'status'}
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function(oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function(e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

$('#btnGenerateReport').on('click', function() {
    tblHistory.ajax.reload();
});

