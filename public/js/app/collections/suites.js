define([
    'socket',
    'underscore',
    'Backbone',
    'models/suite'
], function(socket, _, Backbone, SuiteModel){

    var ProjectCollection = Backbone.Collection.extend({

        model: SuiteModel,

        sync: function(method, model, options) {

            options.success && (this.successLoading = options.success);
            options.error && (this.errorLoading = options.error);

            switch (method) {
                case 'read': this.loadSuites();
            }
        },

        loadSuites: function() {
            socket.emit('list_of_test_suites', null, this.getListOfAutomation.bind(this));
        },

        successLoading: function() {},

        errorLoading: function() {},

        getListOfAutomation: function(data) {

            if(data.error) return this.errorLoading(data);

            this.add(data);

            this.successLoading(this);
        }
    });

    return ProjectCollection;
});
