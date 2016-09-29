define([
    'underscore',
    'models/component',
    'common/base.model'
], function(_, Component, BaseModel){
    return BaseModel.extend({
        parse: function(suite) {
            var data = {};
            data.name = suite.id;
            if(suite.metaData) {
                if(suite.metaData.title) {
                    data.title = suite.metaData.title;
                }
                var customFields = suite.metaData.customFields;
                if(customFields && _.isArray(customFields)) {
                    data.form =
                        _.chain(customFields)
                        .map(function(item) {
                            return new Component(item);
                        }).filter(function(field) {
                            return !(field instanceof Component);
                        }).value();
                }
            }
            return data;
        }
    });
});