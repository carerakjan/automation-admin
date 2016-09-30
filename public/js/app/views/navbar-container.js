define([
    'jquery',
    'underscore',
    'common/base.model',
    'common/base.collection',
    'socket',
    'common/base.view',
    'text!templates/navbar-container.html'
], function($, _, BaseModel, BaseCollection, socket, BaseView, navBarContainerTemplate){
    return BaseView.extend({

        el: $("#navbar-container"),

        model: new BaseModel({
            useAutomation: true,
            activePlatform: 'all',
            suites: new BaseCollection()
        }),

        events: {
            'submit #formRunBs' : 'submitForm',
            'click #runBs' : 'submitForm',
            'click #platform .dropdown-menu li a' : 'changePlatform',
            'change #useAutomation': 'toggleUsingAutomation'
        },

        _templateString: navBarContainerTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.render();
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
                socket.emit('run_bs', this.prepareData(this.model.toJSON()), this.submitFormCallback.bind(this));
            }
        },

        submitFormCallback: function(response) {
            if(response.error) {
                this.options.app.trigger('app:notify', {
                    connection: [null, 'error', response.error]
                });
            }
        },

        prepareData: function(model) {
            var result = {};
            var _model = this.deepCopy(model);
            result.url = model.url;
            result.platform = model.activePlatform;
            _model.useAutomation && _model.suites.length &&
            (result.suites = this.parseMetaData(this.removeIDs(_model.suites)));
            return result;
        },

        deepCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        removeIDs: function(collection) {
            return collection.map(function(model) {
                model._id && delete model._id;
                return model;
            });
        },

        parseMetaData: function(collection) {
            return collection.map(function(model) {
                if(!model.form) return model;
                var form = model.form;
                delete model.form;

                return form.reduce(function(metaData, field){
                    metaData[field.name] = field.value;
                    return metaData;
                }, model.metaData = {}) && model;
            });
        },

        changePlatform: function(event) {
            event.preventDefault();
            this.resetDropDown();
            this.$(event.target).closest('li').addClass('active');
            this.model.set('activePlatform', $(event.target).html());
            this.$('[data-toggle="dropdown"] .value').find('b').html(this.model.get('activePlatform'));
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