define([
    'jquery',
    'socket',
    'collections/suites'
], function($, socket, SuitesCollection){
    var initialize = function(){

        window.jQuery = $;

        loadFlatUI(function() {
            delete window.jQuery;
        });

        var suites = new SuitesCollection();
        suites.fetch({
            success: function(data){
                console.log(data);
            }, error: function(data){
                console.log(data);
            }
        });
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