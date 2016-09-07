require.config({
    paths: {
        $: 'vendor/jquery.min',
        _: 'vendor/underscore.min',
        Backbone: 'vendor/backbone.min',
        dragula: 'vendor/dragula.min'
    }
});

require([
    'app'
], function(App){

    App.initialize();

});