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
            socket.on('notification', this.render.bind(this));
        },

        handleReceivedNotification: function(data) {
            var options = {};

            if(data.connection) {
                if(data.connection[1] === 'connect') {
                    options.message = 'New connection';
                    options.cls = 'pumpkin';
                } else if(data.connection[1] === 'reconnect') {
                    options.message = 'Connection reloaded';
                    options.cls = 'belize-hole';
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