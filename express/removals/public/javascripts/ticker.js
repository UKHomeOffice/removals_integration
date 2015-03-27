(function() {
    window.setInterval(function() {
        console.log('tick');
        $('.panel').each(function() {
            var $panel = $(this),
                $tailer = $panel.find('.tailer'),
                updatedAt = $tailer.data('updated-at');

            $tailer.replaceWith(template_tailer({updatedAt:updatedAt}));
        });
    }, 1000);
})();