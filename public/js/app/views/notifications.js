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

        events: {
            'click .palette': 'removeNotification'
        },

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.options.app, 'app:notify', this.showNotification.bind(this));
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

            !element[0].timeouts && (element[0].timeouts = []);

            element[0].timeouts.push(setTimeout(function(){
                element.css({opacity:0});
            }, 2000));

            element[0].timeouts.push(setTimeout(function(){
                element.remove();
            }, 2500));

            return element;
        },

        removeAnimation: function(element) {
            _.each(element.timeouts, function(timeoutId){
                clearTimeout(timeoutId);
            });
            return element;
        },

        removeNotification: function(event) {
            event.preventDefault();
            $(this.removeAnimation(event.target)).remove();
        }

    });
});