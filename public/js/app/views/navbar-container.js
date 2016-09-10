define([
    'jquery',
    'underscore',
    'backbone',
    'socket',
    'common/base.view',
    'text!templates/navbar-container.html'
], function($, _, Backbone, socket, BaseView, navBarContainerTemplate){
    return BaseView.extend({

        el: $("#navbar-container"),

        model: new (Backbone.Model.extend({
            defaults: {
                useAutomation: true,
                activePlatform: 'all'
            }
        }))(),

        events: {
            'submit #formRunBs' : 'submitForm',
            'click #runBs' : 'submitForm',
            'click #platform .dropdown-menu li a' : 'changePlatform',
            'change #useAutomation': 'toggleUsingAutomation'
        },

        _templateString: navBarContainerTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.listenTo(this.options.app, 'app:updateSuites', this.updateSuites.bind(this));
            this.render();
        },

        updateSuites: function(suites) {
            this.model.set('suites', suites);
        },

        render: function() {
            this.$el.html(this.template({
                platforms:  ['all', 'mobile', 'tablet', 'desktop']
            }));
        },

        isValidUrl: function(url) {
            try {
                var re = /^\s*(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.([a-z]{2,6})(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*\s*$/;
                if(!url) throw Error('URL is required');
                if(!re.test(url)) throw Error('URL validation error');
                return true;
            } catch (e) {
                return this.options.app.trigger('app:notify', {
                    connection: [null, 'error', e.message]
                }) && false;
            }
        },

        submitForm: function(event) {
            event.preventDefault();
            if(this.isValidUrl(this.$('#urlInput').val())) {
                this.options.app.trigger('app:eraseReports');
                this.model.set('url', this.$('#urlInput').val());
                socket.emit('run_bs', this.model.toJSON());
            }
        },

        changePlatform: function(event) {
            event.preventDefault();
            this.resetDropDown();
            this.$(event.target).closest('li').addClass('active');
            this.model.set('activePlatform', $(event.target).html());
            this.$('[data-toggle="dropdown"] .value').html(this.model.get('activePlatform'));
        },

        resetDropDown: function() {
            this.$('#platform .dropdown-menu li').removeClass('active');
        },

        toggleUsingAutomation: function(event) {
            event.preventDefault();
            this.model.set('useAutomation', event.target.checked);
            this.options.app.trigger('app:useAutomation', event.target.checked);
        }

    });
});