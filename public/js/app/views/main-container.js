define([
    'jquery',
    'underscore',
    'common/base.view',
    'dragula',
    'collections/suites',
    'text!templates/main-container.html'
], function($, _, BaseView, dragula, SuitesCollection, mainContainerTemplate){
    return BaseView.extend({

        el: $("#main-container"),

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.collection = new SuitesCollection();
            this.listenTo(this.collection, 'fetch:error fetch:success', this.render.bind(this));
            this.collection.fetch();
        },

        render: function(error) {
            if(error) {
                this.$el.html(this.template({ data: { error: error} }));
            } else {
                this.$el.html(this.template({ data: this.collection.models }));
                this.initDragAndDrop();
            }
        },

        template: function(data) {
            return _.template(mainContainerTemplate)(data);
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
                    $(el).find('[class^=fui]')
                        .removeClass('fui-arrow-right')
                        .addClass('fui-cross')
                        .on('click', function() {
                            $(this).closest('div.palette').remove();
                        });
                }

            });
        }

    });
});