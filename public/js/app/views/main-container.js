define([
    'jquery',
    'underscore',
    'backbone',
    'dragula',
    'collections/suites',
    'text!templates/main-container.html'
], function($, _, Backbone, dragula, SuitesCollection, mainContainerTemplate){
    return Backbone.View.extend({

        el: $("#main-container"),

        initialize: function(){
            this.collection = new SuitesCollection(null, { view: this });
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