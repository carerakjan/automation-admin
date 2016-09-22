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
            this.initForm();
        },

        initForm: function() {

            // Custom Selects
            this.$('.fui-select').select2();

            // Checkboxes and Radio buttons
            this.$('.fui-checkbox, .fui-radio').radiocheck();

            // Switches
            this.$('.fui-switch').bootstrapSwitch();

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