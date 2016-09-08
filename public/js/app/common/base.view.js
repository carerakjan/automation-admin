define([
    'backbone'
], function(Backbone){
    return Backbone.View.extend({

        /**
         * Should be overrided
         */
        _templateString: "",

        initialize: function(options) {
            this.options = options;
        },

        template: function(data) {
            return _.template(this._templateString)(data);
        }

    });
});