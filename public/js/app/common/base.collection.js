define([
    'backbone',
    'common/base.model'
], function(Backbone, BaseModel){

    return Backbone.Collection.extend({

        model: BaseModel,

        fetchError: function(data) {
            this.trigger('fetch:error', data.error);
        },

        fetchSuccess: function(data) {
            this.add(data);
            this.trigger('fetch:success');
        },

        handleFetchingData: function(data) {
            if(data.error) this.fetchError(data);
            else this.fetchSuccess(data);
        }

    });

});
