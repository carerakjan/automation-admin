define([
    'socket',
    'underscore',
    'common/base.collection',
    'models/suite'
], function(socket, _, BaseCollection, SuiteModel){

    return BaseCollection.extend({

        model: SuiteModel,

        sync: function(method, collection, options) {
            switch (method) {
                case 'read': this.loadSuites(options);
            }
        },

        loadSuites: function(options) {
            socket.emit('list_of_test_suites', null, this.handleFetchingData.bind(this)(options));
        }

    });

});
