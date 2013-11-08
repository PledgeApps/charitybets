var appData = {};
var userId = 1;

function init()
{
    $.getJSON( apiUrl + '/charitybets/?a=appData&k=qwerty', function( data ) {
        console.log(data);
        appData = data;
        populateMyBets();
        populatePublicBets();
        populateLeaderboard(appData.leaderboards.winners);
    });
}

function showBet(id)
{
    $('#betDetails').show();
    $('#mainTabs').hide();
}

function showMainTabs()
{
    $('#betDetails').hide();
    $('#mainTabs').show();
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

function populatePublicBets()
{
    populateBets(appData.publicBets, $('#publicBetsList'));
}

function populateMyBets()
{
    populateBets(appData.myBets, $('#myBetsList'));
}

function populateBets(data, container)
{
    var result = '';
    for (var i=0;i<data.length;i++)
    {
        var entry = appData.myBets[i];
        var submitterName = (entry.submitter_id==userId) ? "You" : entry.submitter_name;
        var acceptorName = (entry.acceptor_id==userId) ? "You" : entry.acceptor_name;
        var displayTime = entry.eventDate;
        result += '<a href="javascript:showBet(' + entry.id.toString() + ');" class="list-group-item">' + submitterName + ' Bet ' + acceptorName + ' $' + entry.amount + ' that ' + entry.title;
        result += '<div class="betInfo">Expires ' + displayTime + '</div></a>';
    }
    container.html(result);
}

$(function() { init(); });