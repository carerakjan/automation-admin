define([
    'jquery',
    'socket',
    'underscore',
    'common/base.view',
    'text!templates/suite-settings.html',
    'text!templates/form-component.html'
], function($, socket, _, BaseView, suiteSettingsTemplate, formTemplate){
    return BaseView.extend({

        _templateString: suiteSettingsTemplate,

        events: {
            'submit form': 'submitForm'
        },

        render: function(options) {
            this.model = options.model;
            this.form = this.model.get('customFields');
            this.$el = $(this.template({
                templateFn: _.template(formTemplate),
                form: this.form
            }));
            options.container.append(this.$el);
            this.initForm();
            return this;
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

        validateForm: function(form) {
            this.form.forEach(this.unMarkError());
            return form.reduce(function(isValid, field) {

                var ff = _.find(this.form, {name:field.name});
                var validation = ff['validation'];

                if(!validation) {
                    field.validate = true;
                    return isValid && field.validate;
                } else if(validation.regexp) {
                    field.validate = new RegExp(validation.regexp).test(field.value);
                    return isValid && field.validate;
                }

                field.validate = true;
                return isValid && field.validate;

            }.bind(this), true);
        },

        submitForm: function(event) {
            event.preventDefault();
            var form = $(event.target).serializeArray();
            this.validateForm(form) &&
            (this.updateModel(form) || this.hideForm()) || this.showError(form);
        },

        updateModel: function(form) {
            this.form.forEach(this.unMarkError());
            this.form.forEach(this.mergeData(form));
        },

        markError: function() {
            return function(field) {
                if(!field.validate) {
                    var errorMessage = field.name + ' validation error';
                    this.options.app.trigger('app:notify', { connection: [null, 'error', errorMessage] });
                    this.$('[name="' + field.name + '"]').closest('.form-group').addClass('has-error');
                }
            }.bind(this);
        },

        unMarkError: function() {
            return function (field) {
                this.$('[name="' + field.name + '"]')
                    .closest('.form-group').removeClass('has-error');
            }.bind(this);
        },

        groupByName: function(form) {
            return _.chain(form).groupBy('name').map(function(array, name) {
                var value = _.pluck(array, 'value');
                value = value.length > 1 ? value : value[0];
                return { name: name, value: value };
            }).value();
        },

        mergeData: function(form) {
            var _form = this.groupByName(form);
            return function(field) {
                var ff = _.find(_form, {name: field.name});
                if(/^checkbox|radio|switch$/.test(field['component']) && !ff) {
                    return field.value = 'off';
                } else if(!ff) {
                    return;
                }
                field.value = ff.value;
            }.bind(this);
        },

        showError: function(form) {
            form.forEach(this.markError());
        },

        hideForm: function() {
            delete this.model.settingsView;
            this.remove();
        }

    });
});