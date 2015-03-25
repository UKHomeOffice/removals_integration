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
        var bed_counts = data.totals.bed_counts, key, centre_data;
        for(key in bed_counts){
            if (bed_counts.hasOwnProperty(key)) {
                centre_data = bed_counts[key];
                centre_data.name = key;
                centre_data.updatedAt = new Date();
                centre_data.current_beds_male = centre_data.male;
                centre_data.current_beds_female = centre_data.female;
                centre_data.current_beds_ooc = centre_data.out_of_commission;
                dashboard_update_centre(key, centre_data);
            }
        }
    });
});