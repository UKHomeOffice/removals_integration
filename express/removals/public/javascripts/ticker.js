(function() {
    window.setInterval(function() {
        console.log('tick');
        $('.panel').each(function() {
            var $panel = $(this),
                $tailer = $panel.find('.tailer'),
                updatedAt = $tailer.data('updated-at');

            console.log($panel.find('h2').text() + ":  " + updatedAt);
            $tailer.replaceWith(template_tailer({updatedAt:updatedAt}));
        });
    }, 1000);
})();