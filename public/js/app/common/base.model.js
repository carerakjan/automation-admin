define([
    'hashids',
    'backbone'
], function(HashIds, Backbone){

    var hashids = new HashIds("this is salt for base model");

    return Backbone.Model.extend({
        initialize: function() {
            this.set('_id', hashids.encode(this.generateNumber()));
        },
        generateNumber: function() {
            return parseInt(Date.now() * Math.random());
        }
    });

});