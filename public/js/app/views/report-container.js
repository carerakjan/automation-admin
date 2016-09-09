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
            var container = element.closest('.collapsible');

            if(element.hasClass('report-show')) {
                element.removeClass('report-show').addClass('report-hide');
                container.addClass('narrow-down');
            } else {
                element.addClass('report-show').removeClass('report-hide');
                container.removeClass('narrow-down');
            }
        }

    });
});