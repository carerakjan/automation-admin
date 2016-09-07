require.config({
    paths: {
        jquery: 'vendor/jquery.min',
        underscore: 'vendor/underscore.min',
        Backbone: 'vendor/backbone.min',
        dragula: 'vendor/dragula.min'
    }
});

require([
    'app'
], function(App){

    App.initialize();

});