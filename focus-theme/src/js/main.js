$(function() {
    'use strict';
    // Init Masonry
    var $grid = $('.grid').masonry({
        // options...
    });
    // Layout Masonry after each image loads
    $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
});
