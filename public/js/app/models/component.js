define([ 'underscore' ], function(_) {

    function extend(Child, Parent) {
        var F = function() { };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    }

    var Field = function(data) {
        this.description = this.verifyString(data.description, '');
        this.name = this.verifyString(data.name, '');
        this.label = this.verifyString(data.label, '');
    };

    Object.defineProperty(Field.prototype, 'className', {
        get: function() {
            return this.constructor.name;
        }
    });

    Field.prototype.verifyString = function(string, def) {
        return _.isString(string) ? string : def;
    };

    Field.prototype.verifyBoolean = function(boolean, def) {
        return _.isBoolean(boolean) ? ( boolean ? 'on' : 'off' ) : def;
    };

    Field.prototype.verifyObject = function(object, properties, def) {
        if(!_.isObject(object)) return def;

        return properties.reduce(function(result, property) {
            var parsed = property.split(':');
            if(object.hasOwnProperty(parsed[0]) && typeof object[parsed[0]] === parsed[1]) {
                result[parsed[0]] = object[parsed[0]];
            }
            return result;

        }, {});

    };

    Field.prototype.isSelected = function(field) {
        return field.value === 'on';
    };

    Field.prototype.getTitle = function(field) {
        return field.label || field.text;
    };

    Field.prototype.parseGroup = function(group) {
        return _.chain(group).filter(this.isSelected).map(this.getTitle).value();
    };

    var RadioOption = function(data) {
        this.label = this.verifyString(data.label, '');
        this.value = this.verifyBoolean(data.checked, 'off');
    };

    var DropDownOption = function(data) {
        this.text = this.verifyString(data.text, '');
        this.value = this.verifyBoolean(data.selected, 'off');
    };

    var Input = function(data) {
        Field.call(this, data);
        this.type = this.verifyString(data.type, 'text');
        this.value = this.verifyString(data.default, '');
        this.validation = this.verifyObject(data.validation,
            ['min:number', 'max:number', 'regexp:string'], {});
    };

    var Checkbox = function(data) {
        Field.call(this, data);
        if(data.group && _.isArray(data.group)) {
            this.group = data.group.map(function(option) {
                return new RadioOption(option);
            });
            this.value = this.parseGroup(this.group);
        } else {
            this.value = this.verifyBoolean(data.checked, 'off');
        }
    };

    var Radio = function(data) {
        Field.call(this, data);
        if(data.group && _.isArray(data.group)) {
            this.group = data.group.map(function(option) {
                return new RadioOption(option);
            });
            this.setValue(this.parseGroup(this.group));
        } else {
            this.value = this.verifyBoolean(data.checked, 'off');
        }
    };

    var Select = function(data) {
        Field.call(this, data);
        if(data.groups && _.isArray(data.groups)) {

            this.groups = [];

            this.setValue(this.parseGroup(_.chain(data.groups).map(function(group) {

                this.groups.push({
                    label: this.verifyString(group.label, '')
                });

                var g = _.last(this.groups);

                if (group.options && _.isArray(group.options)) {
                    g.options = group.options.map(function(option) {
                        return new DropDownOption(option);
                    });
                } else g.options = [];

                return g.options;

            }.bind(this)).flatten().value()));

        } else if (data.options && _.isArray(data.options)){
            this.options = data.options.map(function(option) {
                return new DropDownOption(option);
            });
            this.setValue(this.parseGroup(this.options));
        } else {
            this.options = [];
        }
    };

    var Switch = function(data) {
        Field.call(this, data);
        this.value = this.verifyBoolean(data.checked, 'off');
        this.actionText = this.verifyObject(data.actionText,
            ['on:string', 'off:string'], {});
    };

    [
        Input,
        Radio,
        Select,
        Switch,
        Checkbox,
        RadioOption,
        DropDownOption
    ].forEach(function(child) {
        extend(child, Field);
    });

    Radio.prototype.setValue = function(value) {
        this.value = value.length ? _.last(value) : '';
    };

    Select.prototype.setValue = function(value) {
        this.value = value.length ? _.last(value) : '';
    };

    var Component = function(data) {

        this.type = data['component'];

        if(this.isInput) {
            return new Input(data);
        }

        if(this.isRadio) {
            return new Radio(data);
        }

        if(this.isCheckbox) {
            return new Checkbox(data);
        }

        if(this.isSwitch) {
            return new Switch(data);
        }

        if(this.isSelect) {
            return new Select(data);
        }
    };

    Object.defineProperties(Component.prototype, {
        'isInput': {
            get: function() {
                return this.type === 'input';
            }
        },

        'isRadio': {
            get: function() {
                return this.type === 'radio';
            }
        },

        'isCheckbox': {
            get: function() {
                return this.type === 'checkbox';
            }
        },

        'isSelect': {
            get: function() {
                return this.type === 'select';
            }
        },

        'isSwitch': {
            get: function() {
                return this.type === 'switch';
            }
        }
    });

    return Component;

});