$(function() {
    var socket = io();

    function dashboard_update_centre(name, bed_counts) {
        var slug = bed_counts.slug,
            $panel = $("#" + slug),
            $ul = $panel.find('ul.availability'),
            $tailer = $panel.find('.tailer'),
            $centre_panel_html = $(template_centre_panel({centre:bed_counts})),
            $replacement = $centre_panel_html.filter('ul.availability'),
            $lastUpdated;
        console.log(bed_counts.updatedAt);
        $lastUpdated = $(template_tailer({updatedAt:bed_counts.updatedAt}));

        $ul.replaceWith($replacement);
        $tailer.replaceWith($lastUpdated);

        if (bed_counts.is_full) {
            $panel.addClass('full');
        } else {
            $panel.removeClass('full');
        }
    }

    socket.on("centre-update",function(data){
        dashboard_update_centre(data.name, data);
    });
});
