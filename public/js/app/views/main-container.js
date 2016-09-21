define([
    'jquery',
    'underscore',
    'common/base.view',
    'dragula',
    'collections/suites',
    'views/suite-settings',
    'text!templates/main-container.html',
    'text!templates/form-component.html'
], function($, _, BaseView, dragula, SuitesCollection, SuiteSettingsView, mainContainerTemplate, formTemplate){
    return BaseView.extend({

        el: $("#main-container"),

        _templateString: mainContainerTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection = new SuitesCollection();
            this.listenTo(this.collection, 'fetch:error fetch:success', this.render.bind(this));
            this.options.app && this.options.app.on('app:useAutomation', this.toggleElement.bind(this));
            this.collection.fetch();
        },

        toggleElement: function(isUseAutomation) {
            this.$el[isUseAutomation ? 'removeClass' : 'addClass']('disable');
        },

        render: function(error) {
            if(error) {
                this.$el.html(this.template({ data: { error: error} }));
            } else {
                this.$el.html(this.template({ data: this.collection.models }));
                this.initDragAndDrop();
            }
        },

        initDragAndDrop: function() {
            dragula([].slice.call($('[id$="-scripts"]')),{

                copy: function (el, source) {
                    return source === document.getElementById('left-scripts');
                },
                accepts: function (el, target) {
                    return target !== document.getElementById('left-scripts')
                }

            }).on('drop', function (el, container) {

                if(container && container.id === 'right-scripts' && arguments[1] !== arguments[2]) {
                    $(el).find('.fui-arrow-right')
                        .removeClass('fui-arrow-right')
                        .addClass('fui-trash')
                        .on('click', this.removeSuite.bind(this));

                    $(el).find('.fui-gear')
                        .removeClass('hide')
                        .on('click', this.showSuiteSettings.bind(this))
                }

            }.bind(this));
        },

        removeSuite: function(event) {
            event.preventDefault();
            $(event.target).closest('.palette-item').remove();
            this.options.app.trigger('app:updateSuites', []);
        },

        findModel: function(id) {
            return function(model) {
              return model.get('id') === id;
            };
        },

        showSuiteSettings: function(event) {
            event.preventDefault();

            var suiteId = event.target.dataset['suiteId'];
            var model = this.collection.find(this.findModel(suiteId));

            new SuiteSettingsView({
                app: this.options.app
            }).render({
                model: model,
                container: $(event.target).closest('.palette-item'),
                templateFn: _.template(formTemplate)
            });

            //this.options.app.trigger('app:notify', {
            //    connection:[null, 'error', 'Setting is not available']
            //});
        }

    });
});