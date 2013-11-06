
function showTab(tab)
{
    $('.appFooter').find('a').removeAttr('style');
    $('#tab_' + tab).css('background-color', '#000000').css('background-image', 'none');
}

function init()
{
    $('#mybets').load('ajax/mybets.html', function(){
        $('#allbets').load('ajax/allbets.html', function(){
            $('#leaderboard').load('ajax/leaderboard.html', function() {
                $('#container').trigger('create');
            });
        });
    });
}

$(function() {
    //init();
});