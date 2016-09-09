define([
    'jquery',
    'backbone',
    'underscore',
    'views/main-container',
    'views/report-container',
    'views/notifications'
], function($, Backbone, _, MainContainerView, ReportContainerView, NotificationsView){

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

            this.views.push(new MainContainerView(this.getViewParams('main-container')));
            this.views.push(new ReportContainerView(this.getViewParams('report-container')));
            this.views.push(new NotificationsView(this.getViewParams('notifications')));
        },
        getViewParams: function(id) {
            return { name: id, app: this };
        }
    }, Backbone.Events);

});