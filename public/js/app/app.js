define([
    'jquery',
    'backbone',
    'underscore',
    'common/base.collection',
    'views/navbar-container',
    'views/main-container',
    'views/report-container',
    'views/notifications'
], function($, Backbone, _, BaseCollection, NavBarView, MainView, ReportView, NotificationsView){

    var loadFlatUI = function (callback) {
        var script = document.createElement('script');
        script.src = "admin/public/js/flat-ui.min.js";
        document.body.appendChild(script);
        callback && (script.onload = callback);
    };

    return _.extend({
        views: new BaseCollection(),
        initialize: function() {
            window.jQuery = $;

            loadFlatUI(function() {
                delete window.jQuery;
            });

            this.views.add([
                { id: 'navbar', view: new NavBarView({app: this}) },
                { id: 'main', view: new MainView({app: this}) },
                { id: 'report', view: new ReportView({app: this}) },
                { id: 'notifications', view: new NotificationsView({app: this}) }
            ]);
        }
    }, Backbone.Events);

});