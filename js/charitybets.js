
function showTab(tab)
{
    $('#appFooter').find('a').removeAttr('style');
    $('#content').load('ajax/' + tab + '.html', function() {
        $('#content').trigger('create');
        $('#tab_' + tab).css('background-color', '#000000').css('background-image', 'none');
    });
}

$(function() {
    showTab('leaderboard');
});