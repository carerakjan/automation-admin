define([
    'jquery',
    'underscore',
    'common/base.view',
    'text!templates/navbar-container.html'
], function($, _, BaseView, navBarContainerTemplate){
    return BaseView.extend({

        el: $("#navbar-container"),

        events: {
            'submit #formRunBs' : 'submitForm',
            'click #runBs' : 'submitForm'
        },

        _templateString: navBarContainerTemplate,

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.render();
        },

        render: function() {
            this.$el.html(this.template({}));
        },

        submitForm: function() {}



    });
});