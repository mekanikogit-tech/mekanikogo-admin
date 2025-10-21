var tblBooking;


loadBooking(0);


$('#txtSearchData').keyup(function(){
    tblBooking.search($(this).val()).draw() ;
});

$("#cmbDriver").on("change", function() {
    var id = $(this).val();
    loadBooking(id);
    loadTotalBooking(id);
});

$("#btnExportDriver").click(function(){
	$(".btn-export-book").click();
});

function loadBooking(updateId) {
    var totalKM = 0;
    
    tblBooking = 
    $('#tblBooking').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-book",
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
        	'url'       : '../program_assets/php/web/booking_history.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'get_booking',
                id : updateId
        	}    
        },
        'aoColumns' : [
        	{ mData: 'fullName'},
            { mData: 'dropOffName'},
            { mData: 'dropOffAddress'},
            { mData: 'pickUpName'},
            { mData: 'pickUpAddress'},
            { mData: 'totalKM'},
            { mData: 'famountToPay'},
            { mData: 'bookingStatus'},
            { mData: 'dateCreated'}
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            totalKM += aData["totalKM"];
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

function loadTotalBooking(id) {
    $.ajax({
        url: '../program_assets/php/web/booking_history.php',
        data: {
            command : 'get_booking_total',
            id : id
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            $("#spTotalKM").text("Total KM: " + data[0].totalKM);
            $("#spTotalAmount").text("Total Amount: " + data[0].amountToPay);
        }
    });
}