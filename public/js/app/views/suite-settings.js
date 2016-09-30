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
            this.form = this.model.get('form');
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
            this.form.forEach(this.unMarkError.bind(this));
            return form.reduce(function(isValid, field) {

                var ff = _.find(this.form, {name:field.name});
                var validation = ff['validation'];

                if(validation && validation.regexp) {
                    field.validate = new RegExp(validation.regexp).test(field.value);
                    isValid = isValid && field.validate;
                } else {
                    field.validate = true;
                    isValid = isValid && field.validate;
                }

                if(field.hasOwnProperty('validate') && !field.validate) {
                    delete field.validate;
                    this.markError(field);
                }

                return isValid;

            }.bind(this), true);
        },

        submitForm: function(event) {
            event.preventDefault();
            var form = $(event.target).serializeArray();
            this.validateForm(form) && (this.updateModel(form) || this.hideForm());
        },

        updateModel: function(form) {
            this.form.forEach(this.mergeData(form));
        },

        getField: function(field) {
            return this.$('[name="' + field.name + '"]');
        },

        markError: function(field) {
            var errorMessage = field.name + ' validation error';
            this.options.app.trigger('app:notify', { connection: [null, 'error', errorMessage] });
            this.getField(field).closest('.form-group').addClass('has-error');
        },

        unMarkError: function (field) {
            this.getField(field).closest('.form-group').removeClass('has-error');
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
                if(/^Checkbox|Radio|Switch$/.test(field.className) && !ff) {
                    return field.value = 'off';
                } else if(!ff) {
                    return;
                }
                field.value = ff.value;
            }.bind(this);
        },

        hideForm: function() {
            delete this.model.settingsView;
            this.remove();
        }

    });
});