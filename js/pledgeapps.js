var apiUrl = 'http://192.168.8.100:3102/';
var userKey = 'qwerty';

function paLoadMessagesForContent(appName, contentType, contentId, cb)
{
    $.getJSON( apiUrl + '?a=contentMessages&appName=' + appName + '&contentType=' + contentType + '&contentId=' + contentId, cb);
}


function paSendMessage(appName, contentType, contentId, body, cb)
{
    var data = {
        a: 'postMessage',
        k: userKey,
        appName: appName,
        contentType: contentType,
        contentId: contentId,
        body: body
    };
    $.post( apiUrl, data).done(cb);
}



var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        console.log('Received Event: ' + id);

    }
};
