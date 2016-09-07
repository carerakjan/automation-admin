require.config({
    paths: {
        jquery: '../vendor/jquery.min',
        underscore: '../vendor/underscore.min',
        backbone: '../vendor/backbone.min',
        dragula: '../vendor/dragula.min',
        text: '../vendor/require-text.min'
    }
});

require([
    'app'
], function(App){

    App.initialize();

});