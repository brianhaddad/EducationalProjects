const VALIDATION_RULES = {
    FILENAME: (txt) => {
        //NOTE: rg1 seems to test that none of the forbidden characters are present, so does not need to be negated.
        const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        const rg2 = /^\./; // cannot start with dot (.)
        const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(txt) && !rg2.test(txt) && !rg3.test(txt);
    },
    FLOAT: (txt) => {
        const rg1 = /^[-+]?[0-9]+\.[0-9]+$/;
        return rg1.test(txt);
    },
    NON_EMPTY: (txt) => {
        if (!txt || txt.length < 1){
            return false;
        }
        return true;
    },
};

function runValidation(rules){
    const myRules = rules;
    return function runValidation(value) {
        for(const rule of myRules){
            if (!rule(value)){
                return false;
            }
        }
        return true;
    };
}

function ValidatedTextInput(displayName, id, value, onchangeValidation, onchangeCallback){
    const validation = onchangeValidation;
    const callback = onchangeCallback;
    const error = 'error_input';
    const container = createElement('div', { 'class': 'center_cell_pairs' });
    container.appendChild(createElement('label', { 'for': id }, displayName + ':&nbsp;'));
    const input = createElement('input', { 'id': id, 'type': 'text', 'value': value || '' });
    input.oninput = () => {
        if (validation) {
            if (!validation(input.value)){
                input.classList.add(error);
            }
            else {
                input.classList.remove(error);
            }
        }
        if (callback){
            callback(input.value);
        }
    };
    container.appendChild(input);
    return container;
}

function DropDownMenuSelector(displayName, id, value, options, onchangeFunc){
    const container = createElement('div', { 'class': 'center_cell_pairs' });
    container.appendChild(createElement('label', { 'for': id }, displayName + ':&nbsp;'));
    const selector = createElement('select', { 'id': id });
    if (onchangeFunc){
        selector.onchange = onchangeFunc;
    }
    for (const n in options){
        const opt = createElement('option', options[n], n);
        if (options[n]['value'] === value){
            opt.selected = true;
        }
        selector.appendChild(opt);
    }
    container.appendChild(selector);
    return container;
}

function Checkbox(id, displayText, checked, callback){
    const container = createElement('div', { 'class': 'answer_option clickable' });
    const options = { 'type': 'checkbox', 'id': id };
    if (checked){
        options['checked'] = checked;
    }
    const checkbox = createElement('input', options);
    const label = createElement('label', { 'for': id }, displayText + ':&nbsp;');
    if (callback){
        checkbox.onchange = callback;
    }
    container.appendChild(label);
    container.appendChild(checkbox);
    return container;
}