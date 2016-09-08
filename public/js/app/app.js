define([
    'jquery',
    'backbone',
    'underscore',
    'views/main-container'
], function($, Backbone, _, MainContainerView){

    var loadFlatUI = function (callback) {
        var script = document.createElement('script');
        script.src = "admin/public/js/flat-ui.min.js";
        document.body.appendChild(script);
        callback && (script.onload = callback);
    };

    return _.extend({
        views: [],
        initialize: function() {
            window.jQuery = $;

            loadFlatUI(function() {
                delete window.jQuery;
            });

            this.views.push(new MainContainerView({ name: 'main-container', app: this }));
        }
    }, Backbone.Events);

});