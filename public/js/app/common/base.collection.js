define([
    'backbone'
], function(Backbone){

    return Backbone.Collection.extend({

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
