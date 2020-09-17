function ObjectHelper(){

    this.updateSection = function (mainObj, propPath, value){
        return insertValue(mainObj, propPath.split('.'), value);
    }

    this.getSection = function (mainObj, getPath) {
        return getValue(mainObj, getPath.split('.'));
    };

    this.deleteSection = function (mainObj, removePath) {
        removeValue(mainObj, removePath.split('.'));
        return mainObj;
    };
	
    this.isEmpty = function (obj) {
        return isEmpty(obj);
    }

    const insertValue = function (obj, props, value) {
        if (props.length > 1) {
            const prop = props.shift();
            obj[prop] = insertValue(obj[prop] || {}, props, value);
            return obj;
        }
        else {
            obj[props[0]] = value;
            return obj;
        }
    };

    const getValue = function (obj, props) {
        if (props.length === 0) {
            return obj;
        }
        const prop = props.shift();
        if (obj.hasOwnProperty(prop)) {
            return getValue(obj[prop], props);
        }
        return null;
    };

    const removeValue = function (obj, props) {
        const prop = props.shift();
        if (obj.hasOwnProperty(prop) && (props.length === 0 || removeValue(obj[prop], props))) {
            delete obj[prop];
        }
        return isEmpty(obj);
    };

    const isEmpty = function (obj) {
        for (const o in obj) {
            return false;
        }
        return true;
    };
}