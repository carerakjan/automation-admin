define([
    'jquery',
    'socket',
    'underscore',
    'common/base.view',
    'text!templates/report-container.html'
], function($, socket, _, BaseView, reportTemplate){
    return BaseView.extend({

        el: $("#report-container"),

        _templateString: reportTemplate,

        events: {
            'click .report-head': 'toggleReport'
        },

        initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments);
            this.options.app && this.options.app.on('app:eraseReports', this.eraseReports.bind(this));
            socket.on('automation_report', this.render.bind(this));
        },

        render: function(data) {
            console.log(data);
            data && this.appendReport(this.template(data));
        },

        appendReport: function(reportHtml) {
            var children = this.$el.children();
            if(children.length) {
                var first = children[0];
                $(first).before($(reportHtml));
            } else {
                this.$el.append($(reportHtml));
            }
        },

        eraseReports: function() {
            this.$el.empty();
        },

        toggleReport: function(event) {

            event.preventDefault();
            var element = this.$(event.target);
            var tBody = element.closest('table').find('tbody');

            if(element.hasClass('report-show')) {
                element.removeClass('fui-triangle-up-small report-show');
                element.addClass('fui-triangle-down-small report-hide');
                tBody.fadeOut(200);
            } else {
                element.addClass('fui-triangle-up-small report-show');
                element.removeClass('fui-triangle-down-small report-hide');
                tBody.fadeIn(200);
            }
        }

    });
});