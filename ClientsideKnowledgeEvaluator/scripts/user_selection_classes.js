function CheckBoxSet(options, callbackFunction){
    const callback = callbackFunction ?? (() => {});
    const container = createElement('div');
    for (const n in options){
        const checkbox = makeCheckbox(n, options[n]['displayName'], options[n]['checked'], callbackFunction);
        container.appendChild(checkbox);
    }
    this.render = function (){
        return container;
    };
    this.select = function (i) {
        if (i < 0 || i >= container.children.length) {
            return false;
        }
        const checkbox = Array.from(container.children[i].getElementsByTagName('input'))
            .find(n => n.type.toLowerCase() === 'checkbox');
        checkbox.checked = !checkbox.checked;
        callback();
    };
    this.getSelected = function (){
        const selected = [];
        for (let i = 0; i < container.children.length; i++){
            const checkbox = Array.from(container.children[i].getElementsByTagName('input'))
                .find(n => n.type.toLowerCase() === 'checkbox');
            if (checkbox.checked){
                selected.push(checkbox.id.split(':')[0]);
            }
        }
        return selected;
    };
}

function RadioButtonSet(options, callbackFunction){
    const callback = callbackFunction ?? (() => {});
    const container = createElement('div');
    for (const n in options){
        container.appendChild(makeRadioButton('options', n, options[n]['displayName'], options[n]['checked'], callback));
    }
    this.render = function (){
        return container;
    };
    this.select = function (i){
        if (i < 0 || i >= container.children.length) {
            return false;
        }
        const radioButton = Array.from(container.children[i].getElementsByTagName('input'))
            .find(n => n.type.toLowerCase() === 'radio');
        radioButton.checked = true;
        callback();
    };
    this.getSelected = function (){
        const selected = [];
        const options = Array.from(container.getElementsByTagName('input'))
            .filter(n => n.type.toLowerCase() === 'radio');
        const s = options.find(n => n.checked);
        if (s) {
            selected.push(s.value);
        }
        return selected;
    };
}

function DropDownMenuSelector(displayName, options, onchangeFunc){
    const container = createElement('div', { 'class': 'center_cell_pairs' });
    container.appendChild(createElement('label', { 'for': displayName }, displayName + ':&nbsp;'));
    const selector = createElement('select', { 'id': displayName });
    if (onchangeFunc){
        selector.onchange = onchangeFunc;
    }
    for (const n in options){
        selector.appendChild(createElement('option', options[n], n));
    }
    container.appendChild(selector);
    this.render = function (){
        return container;
    };
    this.getSelected = function (){
        return selector.value;
    };
    this.setSelected = function (value){
        selector.value = value;
    };
}

function ValidatedTextInput(displayName, onchangeValidation, onchangeCallback){
    const validation = onchangeValidation;
    const callback = onchangeCallback;
    const error = 'error_input';
    const container = createElement('div', { 'class': 'center_cell_pairs' });
    container.appendChild(createElement('label', { 'for': displayName }, displayName + ':&nbsp;'));
    const input = createElement('input', { 'id': displayName, 'type': 'text' });
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
    this.render = function (){
        return container;
    };
    this.getValue = function (){
        return input.value;
    };
    this.setValue = function (newVal){
        input.value = newVal;
    };
    this.isValid = function (){
        return validation(input.value);
    };
}

function TextAreaInput(displayName, onchangeCallback, onchangeValidation){
    const callback = onchangeCallback;
    const validation = onchangeValidation;
    const error = 'error_input';
    const container = createElement('div');
    container.appendChild(createElement('label', { 'for': displayName }, displayName));
    const input = createElement('textarea', { 'id': displayName });
    input.oninput = () => {
        if (validation){
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
    this.render = function (){
        return container;
    };
    this.getValue = function (){
        return input.value;
    };
    this.setValue = function (newVal){
        input.value = newVal;
    };
    this.isValid = function (){
        return validation(input.value);
    };
}

function ClickyButtonSet(buttonDatas){
    const container = createElement('div', { 'class': 'button_bar' });
    const buttons = {};
    for (let i = 0; i < buttonDatas.length; i++){
        buttons[buttonDatas[i]['text']] = makeButton(buttonDatas[i]);
        container.appendChild(buttons[buttonDatas[i]['text']]);
    }
    this.render = function (){
        return container;
    };
    this.disable = function (name){
        if (buttons.hasOwnProperty(name)) {
            buttons[name].disabled = true;
        }
    };
    this.enable = function (name){
        if (buttons.hasOwnProperty(name)) {
            buttons[name].disabled = false;
        }
    };
}