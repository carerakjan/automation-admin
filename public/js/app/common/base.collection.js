define([
    'backbone',
    'common/base.model'
], function(Backbone, BaseModel){

    return Backbone.Collection.extend({

        model: BaseModel,

        fetchError: function(data) {
            this.trigger('fetch:error', data.error);
        },

        fetchSuccess: function(data, options) {
            this.add(data, options);
            console.log(this.toJSON());
            this.trigger('fetch:success');
        },

        handleFetchingData: function(options) {
            return function(data) {
                if(data.error) this.fetchError(data, options);
                else this.fetchSuccess(data, options);
            }.bind(this);
        }

    });

});
