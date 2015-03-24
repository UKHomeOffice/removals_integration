$(function() {
    var socket = io();

    function dashboard_update_centre(name, bed_counts) {
        var slug = name.replace(/([^\w])/g,'').toLowerCase(),
            $panel = $("#" + slug),
            $ele = $panel.find('ul.availability'),
            centre_panel_html = template_centre_panel({centre:bed_counts}),
            $replacement = $(centre_panel_html).filter('ul.availability');
        bed_counts.slug = slug;
        bed_counts.updatedAt = null;

        $ele.replaceWith($replacement);

        if (0 === bed_counts.male || 0 === bed_counts.female) {
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