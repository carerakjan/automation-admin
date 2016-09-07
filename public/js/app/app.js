define([
    'jquery',
    'socket',
    'views/main-container'
], function($, socket, MainContainerView){
    var initialize = function(){

        window.jQuery = $;

        loadFlatUI(function() {
            delete window.jQuery;
        });

        new MainContainerView();
    };

    var loadFlatUI = function (callback) {
        var script = document.createElement('script');
        script.src = "admin/public/js/flat-ui.min.js";
        document.body.appendChild(script);
        callback && (script.onload = callback);
    };

    return {
        initialize: initialize
    };
});