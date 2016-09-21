define([
    'jquery',
    'socket',
    'underscore',
    'common/base.view',
    'text!templates/suite-settings.html'
], function($, socket, _, BaseView, suiteSettingsTemplate){
    return BaseView.extend({

        _templateString: suiteSettingsTemplate,

        events: {
            'click .btn': 'submitForm'
        },

        render: function(options) {
            this.model = options.model;
            this.$el = $(this.template({
                templateFn: options.templateFn,
                data: this.model.toJSON()
            }));
            options.container.append(this.$el);
            this.delegateEvents();
        },

        validateForm: function() {},

        submitForm: function(event) {
            event.preventDefault();
            this.validateForm();
            this.$el.remove();
        }

    });
});