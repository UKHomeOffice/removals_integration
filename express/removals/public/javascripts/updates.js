$(function() {
    var socket = io();

    function dashboard_update_centre(name, bed_counts) {
        var slug = name.replace(/([^\w])/g,'').toLowerCase(),
            $panel = $("#" + slug),
            $ul = $panel.find('ul.availability'),
            $tailer = $panel.find('.tailer'),
            $centre_panel_html = $(template_centre_panel({centre:bed_counts})),
            $replacement = $centre_panel_html.filter('ul.availability'),
            $lastUpdated = $centre_panel_html.filter('.tailer');
        bed_counts.slug = slug;
        bed_counts.updatedAt = null;

        $ul.replaceWith($replacement);
        $tailer.replaceWith($lastUpdated);

        if (0 === bed_counts.male) {
            $panel.addClass('full');
        } else {
            $panel.removeClass('full');
        }
    }

    socket.on("centre-update",function(data){
        dashboard_update_centre(data.name, data);
    });
});