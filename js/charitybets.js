var appData = {};
var userId = 1;

function init()
{
    $.getJSON( apiUrl + 'charitybets/?a=appData&k=qwerty', function( data ) {
        appData = data;
        appData.betDetails = {};
        appData.userDetails = {};
        addBetDetails(appData.publicBets);
        addBetDetails(appData.myBets);
        populateMyBets();
        populatePublicBets();
        populateLeaderboard(appData.leaderboards.winners);
        $('#content').height($(window).height() - $('#appTitleBar').height() - $('#appFooter').height() - 20);
    });
}

function loadMessages(contentType, contentId)
{
    paLoadMessagesForContent('charitybets', contentType, contentId, function (data) {
        appData.betDetails[contentId].messages = data;
        populateMessages(data);
    });
}

function loadUser(userId)
{
    $.getJSON( apiUrl + 'charitybets/?a=userDetails&userId=' + userId, function (data){
        appData.userDetails[userId] = data;
        populateUser(data);
    });
}

function populateMessages(messages)
{
    var result = '';
    for (i=0;i<messages.length;i++)
    {
       var sentDate = new Date(messages[i].sent_date);
       result += '<li class="list-group-item" style="font-weight:normal;">';
       result += '<div class="messageInfo"><span class="pull-right">' + formatDateTime(sentDate) + '</span>'
       result += '<a href="#user_' + messages[i].sender_id + '">' + messages[i].sender_name + '</a></div>';
       result += '<p>' + messages[i].body + '</p></li>'
    }
    $('#bdMessageList').html(result);
}

function addBetDetails(bets)
{
    for (i=0;i<bets.length;i++)
    {
       if (appData.betDetails[bets[i].id]==null) appData.betDetails[bets[i].id] = bets[i];
    }
}


function selectView(view)
{
    if (view=='mainTabs') $('#mainTabs').show(); else $('#mainTabs').hide();
    if (view=='betDetails') $('#betDetails').show(); else $('#betDetails').hide();
    if (view=='userDetails') $('#userDetails').show(); else $('#userDetails').hide();
    if (view=='sendMessage') $('#sendMessage').show(); else $('#sendMessage').hide();
}

function showBet(id)
{
    var tzOffset = new Date().getTimezoneOffset();
    var bet = appData.betDetails[id];
    var eventDate = new Date(bet.event_date)
    eventDate.setMinutes(eventDate.getMinutes() + tzOffset);

    $('#bdAmount').html('$' + bet.amount);
    $('#bdSubmitter').html('<a href="#user_' + bet.submitter_id + '">' + bet.submitter_name + '</a>');
    if (bet.acceptor_id>0) $('#bdAcceptor').html('<a href="javascript:showUser(' + bet.acceptor_id + ');">' + bet.acceptor_name + '</a>');
    $('#bdEventDate').html(formatDateTime(eventDate));

    $('#bdNewMessage').attr('href', '#message_bet_' + id);

    switch (bet.status)
    {
        case "open":
            $('#bdAccept').show();
            if (bet.acceptor_id==userId) $('#bdReject').show(); else $('#bdReject').hide();
            $('#bdVictoryDefeat').hide();
            $('#bdPay').hide();
            $('#bdStatus').html('Awaiting Acceptance');
            break;
        case "accepted":
            $('#bdAccept').hide();
            if (bet.submitter_id==userId || bet.acceptor_id==userId) $('#bdVictoryDefeat').show(); else $('#bdVictoryDefeat').hide();
            $('#bdPay').hide();
            $('#bdStatus').html('Accepted<br/>Awaiting Outcome');
            break;
        case "settled":
            $('#bdAccept').hide();
            $('#bdVictoryDefeat').hide();
            if (bet.submitter_id==userId || bet.acceptor_id==userId) {
                if (winner_id==userId) $('#bdPay').hide(); else $('#bdPay').show();
            } else $('#bdPay').hide();
            var winnerName = (bet.submitter_id==userId) ? bet.submitter_name : bet.acceptor_name;
            $('#bdStatus').html('Won by ' + winnerName + '<br/>Awaiting Payment');
            break;
        case "paid":
            $('#bdAccept').hide();
            $('#bdVictoryDefeat').hide();
            $('#bdPay').hide();
            var winnerName = (bet.submitter_id==userId) ? bet.submitter_name : bet.acceptor_name;
            var looserName = (bet.submitter_id==userId) ? bet.acceptor_name : bet.submitter_name;
            $('#bdStatus').html('Won by ' + winnerName + '<br/>Paid by ' + looserName);
            break;
        case "cancelled":
            $('#bdAccept').hide();
            $('#bdVictoryDefeat').hide();
            $('#bdPay').hide();
            $('#bdStatus').html('Cancelled');
    }

    if (typeof bet.messages != 'undefined' && bet.messages!=null) populateMessages(bet.messages); else loadMessages('bet', bet.id);

    selectView('betDetails');
}

function showUser(id)
{
    if (appData.userDetails[id]!=null) populateUser(appData.userDetails[id]); else loadUser(id);
}


function showMessage(contentType, contentId)
{
    selectView('sendMessage');
    var height = $('#content').height() - $('#smTitle').outerHeight() - $('#smSendButton').outerHeight();
    $('#smBody').outerHeight(height-70);
    $('#smSendButton').data('contentType', contentType).data('contentId', contentId);
}

function sendMessage()
{
    var contentType = $('#smSendButton').data('contentType');
    var contentId = $('#smSendButton').data('contentId');
    var body = $('#smBody').val();
    paSendMessage('charitybets', contentType, contentId, body, function(data){
        if (contentType=='bet')
        {
            appData.betDetails[contentId].messages=null;
            showBet(contentId);
        }
    });
}




function formatTime(d)
{
    var h = d.getHours();
    var m = d.getMinutes().toString();
    if (m.length==1) m = '0' + m;
    var p = 'AM';
    if (h >= 12) { h = h-12; p = "PM"; }
    if (h == 0) h = 12;
    return h + ':' + m + ' ' + p
}

function formatDate(d) { return (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear(); }

function formatDateTime(d) { return formatDate(d) + ' ' + formatTime(d); }

function populateUser(user)
{
    var totalWon = 0;
    var totalGiven = 0;
    var totalOwed = 0;
    var currentWagers = 0;
    for (i=0; i<user.bets.length; i++)
    {
        var bet = user.bets[i];
        if (bet.winner_id == userId)
        {
            if (bet.status=='paid') totalWon += bet.amount;
        } else {
            if (bet.status=='paid') totalGiven += bet.amount;
            if (bet.status=='settled') totalOwed += bet.amount;
        }
        if (bet.status=='open' || bet.status=='accepted') currentWagers += bet.amount;
    }

    $('#udUserName').html(user.user_name);
    $('#udTotalWon').html('$' + totalWon);
    $('#udTotalGiven').html('$' + totalGiven);
    $('#udTotalOwed').html('$' + totalOwed);
    $('#udCurrentWagers').html('$' + currentWagers);
    $('#udDateJoined').html(formatDate(new Date(user.registration_date)));
    populateBets(user.bets, $('#userBetsList'))
    selectView('userDetails');
}

function populateLeaderboard(leaderboard)
{
    var result = '';
    for (var i=0;i<leaderboard.length;i++)
    {
        var entry = leaderboard[i];
        result += '<a href="javascript:showUser(' + entry.id.toString() + ');" class="list-group-item"><span class="pull-right">$' + entry.total.toString() + '</span>' + entry.user_name + '</a>';
    }
    $('#leaderboardList').html(result);
}

function populatePublicBets() { populateBets(appData.publicBets, $('#publicBetsList')); }

function populateMyBets() { populateBets(appData.myBets, $('#myBetsList')); }

function populateBets(data, container)
{
    var result = '';
    for (var i=0;i<data.length;i++)
    {
        var entry = appData.myBets[i];
        var submitterName = (entry.submitter_id==userId) ? "You" : entry.submitter_name;
        var acceptorName = (entry.acceptor_id==userId) ? "You" : entry.acceptor_name;
        var displayTime = formatDateTime(new Date(entry.event_date));
        result += '<a href="#bet_' + entry.id.toString() + '" class="list-group-item">' + submitterName + ' Bet ' + acceptorName + ' $' + entry.amount + ' that ' + entry.title;
        result += '<div class="betInfo">Expires ' + displayTime + '</div></a>';
    }
    container.html(result);
}

$(function() { init(); });

function clearHash() { window.location.hash=''; }



$(window).on('hashchange', function() {
    var parts = window.location.hash.replace('#','').split('_');
    switch (parts[0])
    {
        case '':
            selectView('mainTabs');
            break;
        case 'bet':
            showBet(parts[1]);
            break;
        case 'user':
            showUser(parts[1]);
            break;
        case 'message':
            showMessage(parts[1],parts[2]);
            break;
    }
});

$( window ).resize(function() {
    $('#content').height($(window).height() - $('#appTitleBar').height() - $('#appFooter').height() - 20 );
});