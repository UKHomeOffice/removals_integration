(function() {
    window.setInterval(function() {
        $('.panel').each(function() {
            var $panel = $(this),
                $tailer = $panel.find('.tailer'),
                updatedAt = $tailer.data('updated-at');

            $tailer.replaceWith(template_tailer({updatedAt:updatedAt}));
        });
    }, 20000);
})();