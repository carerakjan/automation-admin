define([
    'jquery',
    'socket',
    'underscore',
    'common/base.view',
    'text!templates/notifications.html'
], function($, socket, _, BaseView, notificationsTemplate){
    return BaseView.extend({

        el: $("#notifications"),

        _templateString: notificationsTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.options.app, 'app:Notify', this.showNotification.bind(this));
            socket.on('notification', this.render.bind(this));
        },

        showNotification: function(data) {
            this.render(data);
        },

        handleReceivedNotification: function(data) {
            var options = {};

            if(data.connection) {
                switch (data.connection[1]) {
                    case 'connect':
                        options.message = 'New connection';
                        options.cls = 'pumpkin';
                        break;

                    case 'reconnect':
                        options.message = 'Connection reloaded';
                        options.cls = 'belize-hole';
                        break;

                    case 'error':
                        options.message = data.connection[2];
                        options.cls = 'pomegranate';
                        break;
                }
            }

            return options;
        },

        render: function(data) {
            var notification = this.template(this.handleReceivedNotification(data));
            notification = $(notification).css({opacity: '.8'});
            this.$el.append(this.hangAnimation(notification));
        },

        hangAnimation: function(element) {

            setTimeout(function(){
                element.css({opacity:0});
            }, 2000);

            setTimeout(function(){
                element.remove();
            }, 2500);

            return element;
        }

    });
});