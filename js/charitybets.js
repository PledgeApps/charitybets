var appData = {};


function init()
{
    $.getJSON( apiUrl + '/charitybets/?a=appData&k=qwerty', function( data ) {
        console.log(data);
        appData = data;
    });
}

$(function() {
    init();
});