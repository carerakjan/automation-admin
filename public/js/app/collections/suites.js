define([
    'socket',
    'underscore',
    'backbone',
    'models/suite'
], function(socket, _, Backbone, SuiteModel){

    var ProjectCollection = Backbone.Collection.extend({

        model: SuiteModel,

        initialize: function(models, options) {
            this.view = options.view;
        },

        sync: function(method, model) {
            switch (method) {
                case 'read': this.loadSuites();
            }
        },

        loadSuites: function() {
            socket.emit('list_of_test_suites', null, this.getListOfAutomation.bind(this));
        },

        getListOfAutomation: function(data) {
            if(data.error) {
                this.view.render(data.error);
            } else {
                this.add(data);
                this.view.render();
            }
        }
    });

    return ProjectCollection;
});