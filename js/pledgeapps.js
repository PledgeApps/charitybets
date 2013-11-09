var apiUrl = 'http://192.168.8.100:3101/';
var userData = {};

function paLoadMessagesForContent(appName, contentType, contentId, cb)
{
    $.getJSON( apiUrl + '?a=contentMessages&appName=' + appName + '&contentType=' + contentType + '&contentId=' + contentId, cb);
}

/*
function loadUserData(userGuid) {
    $.getJSON(apiUrl + '?a=userData&userGuid=' + userGuid, function( data ) {
        userData = data;
    }
}*/