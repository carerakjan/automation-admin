define([
    'jquery',
    'underscore',
    'common/base.view',
    'dragula',
    'collections/suites',
    'views/suite-settings',
    'text!templates/main-container.html'
], function($, _, BaseView, dragula, SuitesCollection, SuiteSettingsView, mainContainerTemplate){
    return BaseView.extend({

        el: $("#main-container"),

        _templateString: mainContainerTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection = new SuitesCollection();
            this.listenTo(this.collection, 'fetch:error fetch:success', this.render.bind(this));
            this.options.app && this.options.app.on('app:useAutomation', this.toggleElement.bind(this));
            this.collection.fetch();
            this.postInitialize();
        },

        postInitialize: function(delay) {
            setTimeout(this._postInit.bind(this), delay || 1);
        },

        _postInit: function() {
            this.getRunSuitesCollection();
        },

        getRunSuitesCollection: function() {
            var navBarView = this.options.app.views.get({id:'navbar'}).get('view');
            this.collectionForRun = navBarView.model.get('suites');
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

        updateIndexNumber: function() {
            [].forEach.call($('#right-scripts').children(), function(el, index) {
                el.dataset['index'] = index;
                var uniqueId = el.dataset['uniqueId'];
                this.collectionForRun.find({_id: uniqueId}).set('index', el.dataset['index']);
            }.bind(this));
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

                if(container && container.id === 'right-scripts') {
                    if(arguments[1] !== arguments[2]) {
                        this.addSuite(el);

                        $(el).find('.fui-arrow-right')
                            .removeClass('fui-arrow-right')
                            .addClass('fui-trash')
                            .on('click', this.removeSuite.bind(this));

                        $(el).find('.fui-gear')
                            .removeClass('hide')
                            .on('click', this.showSuiteSettings.bind(this));
                    }

                    this.updateIndexNumber();
                }

            }.bind(this));
        },

        addSuite: function(el) {
            var suiteId = el.dataset['suiteId'];
            var model = this.collection.find(this.findModel(suiteId));

            this.collectionForRun.add(this.convertModel(this.deepCopy(model.toJSON())));
            model = this.collectionForRun.at(this.collectionForRun.length - 1);
            el.dataset['uniqueId'] = model.get('_id');
        },

        deepCopy: function(obj) {
            //this is not ideal variant
            return JSON.parse(JSON.stringify(obj))
        },

        convertModel: function(model) {
            var result = {};
            result.name = model.id;
            model.metaData && model.metaData.customFields &&
            (result.customFields = model.metaData.customFields.map(this.setDefault));
            return result;
        },

        setDefault: function(field) {
            switch (field['component']) {
                case 'input':
                    field.default && (field.value = field.default);
                    break;

                case 'switch':
                    field.value = field.checked ? 'on' : 'off';
                    break;

                case 'select':
                    var selectedOption = field.options && field.options.filter(function(option) {
                        return option.selected;
                    }) || [];
                    if(selectedOption.length) {
                        field.value = selectedOption[0].text;
                    } else {
                        field.groups && field.groups.filter(function(group) {
                            selectedOption = group.options && group.options.filter(function(option) {
                                return option.selected;
                            }) || [];
                        });

                        if(selectedOption.length) {
                            field.value = selectedOption[0].text;
                        }
                    }
                    break;
                case 'checkbox': case 'radio':
                    if(!field.group) {
                        field.value = field.checked ? 'on' : 'off'
                    } else {
                        if(field['component'] === 'radio') {
                            field.group.forEach(function(radio) {
                                if(radio.checked) field.value = radio.label;
                            });
                        } else {
                            field.group.forEach(function(checkbox) {
                                if(checkbox.checked) {
                                    !field.value && (field.value = []);
                                    field.value.push(checkbox.label);
                                }
                            });
                            if(field.value.length === 1) {
                                field.value = field.value[0];
                            }
                        }
                    }
                    break;
            }
            return field;
        },

        removeSuite: function(event) {
            event.preventDefault();

            var element = $(event.target).closest('.palette-item');
            var uniqueId = element[0].dataset['uniqueId'];
            var model = this.collectionForRun.find({_id: uniqueId});

            element.remove();
            this.collectionForRun.remove(model);
            this.updateIndexNumber();
        },

        findModel: function(id) {
            return function(model) {
              return model.get('id') === id;
            };
        },

        showSuiteSettings: function(event) {
            event.preventDefault();
            var container = $(event.target).closest('.palette-item');
            var uniqueId = container[0].dataset['uniqueId'];
            var model = this.collectionForRun.find({_id: uniqueId});

            if(model.settingsView) {
                return model.settingsView.hideForm();
            }

            model.settingsView = this.createSettingsView().render({
                model: model,
                container: container
            });
        },

        createSettingsView: function() {
            return new SuiteSettingsView({
                app: this.options.app
            });
        }

    });
});