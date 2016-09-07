define([
    'socket',
    'collections/suites'
], function(socket, SuitesCollection){
    var initialize = function(){
        socket.connect();

        var suites = new SuitesCollection();

        suites.fetch({
            success: function(data){
                console.log(data);
            }, error: function(data){
                console.log(data);
            }
        });
    };

    return {
        initialize: initialize
    };
});