define([
    'socket',
    'underscore',
    'common/base.collection',
    'models/suite'
], function(socket, _, BaseCollection, SuiteModel){

    return BaseCollection.extend({

        model: SuiteModel,

        sync: function(method) {
            switch (method) {
                case 'read': this.loadSuites();
            }
        },

        loadSuites: function() {
            socket.emit('list_of_test_suites', null, this.getListOfAutomation.bind(this));
        },

        getListOfAutomation: function(data) {
            if(data.error) this.fetchError(data);
            else this.fetchSuccess(data);
        }
    });

});
