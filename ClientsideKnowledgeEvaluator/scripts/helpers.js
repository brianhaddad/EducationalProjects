//Global helper functions the might be better off somewhere else but I'm putting them here to be stubborn.

function userAlert(message, windowTitle) {
    const children = [];
    children.push(createElement('h1', {}, windowTitle ?? 'Alert'));
    children.push(createElement('p', {}, message));
    return makeOKPopup(children);
}

function uc(str) {
    return str.toUpperCase();
}
function fileNameEndsIn(fn, ext){
    return uc(fn).indexOf(uc(ext)) === uc(fn).replace(uc(ext), '').length;
}

const VALIDATION_RULES = {
    FILENAME: (txt) => {
        //NOTE: rg1 seems to test that none of the forbidden characters are present, so does not need to be negated.
        const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        const rg2 = /^\./; // cannot start with dot (.)
        const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(txt) && !rg2.test(txt) && !rg3.test(txt);
    },
    QUESTION_ANSWER_OPTION: (txt) => {
        if (!txt || txt.length < 1){
            return false;
        }
        const rg1 = /\n/;
        return !rg1.test(txt);
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

function makeOKPopup(children){
    const popupId = 'popup' + getDateNowString();
    const popupContainer = createElement('div', { 'class': 'popup_class', 'id': popupId });
    const popup = createElement('div');
    const scrollable = createElement('div', { 'class': 'popup_contents' });
    let firstChild = true;
    for (const child of children){
        if (firstChild && child.tagName.toUpperCase() === 'H1'){
            popup.appendChild(child);
        }
        else {
            scrollable.appendChild(child);
        }
        firstChild = false;
    }
    popup.appendChild(scrollable);
    popup.appendChild(makeOKButtonBar(() => {document.children[0].removeChild(document.getElementById(popupId));}));
    popupContainer.appendChild(popup);
    document.children[0].appendChild(popupContainer);
}

function makeOKButtonBar(action){
    const container = createElement('div', { 'class': 'ok_button_bar' });
    container.appendChild(makeButton(bigButtonData('OK', action)));
    return container;
}

function makeOKCancelButtonBar(incomingOKButtonData, incomingCancelButtonData){
    const container = createElement('div', { 'class': 'ok_button_bar' });
    container.appendChild(makeButtonGroup([incomingCancelButtonData, incomingOKButtonData]));
    return container;
}

function debuggerAlert(message){
    console.log(message);
    debugger;
}

function createElement(type, attributes, innerHTML) {
    const element = document.createElement(type);
    for (const a in attributes) {
        element.setAttribute(a, attributes[a]);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}

function makeFieldset(legendText){
    const fieldset = createElement('fieldset');
    const legend = createElement('legend', {}, legendText);
    fieldset.appendChild(legend);
    return fieldset;
}

function makeCheckbox(id, displayText, checked, callback){
    const fullId = id + ':' + ((displayText) ? displayText.replace(/[\W_]+/g, '') : getDateNowString());
    const container = createElement('div', { 'class': 'answer_option clickable' });
    const options = { 'type': 'checkbox', 'id': fullId };
    if (checked){
        options['checked'] = checked;
    }
    const checkbox = createElement('input', options);
    const label = createElement('label', { 'for': fullId }, displayText ?? id);
    if (callback){
        container.onmouseup = callback;
    }
    container.appendChild(checkbox);
    container.appendChild(label);
    return container;
}

function makeRadioButton(setName, optionValue, displayText, selected, callback){
    const fullId = optionValue + ':' + ((displayText) ? displayText.replace(/[\W_]+/g, '') : getDateNowString());
    const container = createElement('div', { 'class': 'answer_option clickable' });
    const options = { 'type': 'radio', 'id': fullId, 'value': optionValue, 'name': setName};
    if (selected){
        options['checked'] = selected;
    }
    const radioButton = createElement('input', options);
    const label = createElement('label', { 'for': fullId }, displayText ?? optionValue);
    if (callback){
        container.onmouseup = callback;
    }
    container.appendChild(radioButton);
    container.appendChild(label);
    return container;
}

function makeInputButtonWithJavascriptAction(displayText, javascriptAction, toolTip){
    const attributes = { 'type': 'button', 'value': displayText };
    if (toolTip && toolTip.length > 0){
        attributes['title'] = toolTip;
    }
    const button = createElement('input', attributes);
    button.onclick = javascriptAction;
    return button;
}

function makeButtonWithJavascriptAction(javascriptAction, optionalDisplayText, toolTip){
    const attributes = {};
    if (toolTip && toolTip.length > 0){
        attributes['title'] = toolTip;
    }
    const button = createElement('button', attributes, optionalDisplayText);
    button.onclick = javascriptAction;
    return button;
}

function makeButton(buttonData){
    switch (buttonData['type']){
        case BUTTON_TYPES.BIG_BUTTON:
            return makeButtonWithJavascriptAction(buttonData['action'], buttonData['text'], buttonData['tip']);
            break;

        case BUTTON_TYPES.INPUT_TYPE_BUTTON:
            return makeInputButtonWithJavascriptAction(buttonData['text'], buttonData['action'], buttonData['tip']);
            break;

        default:
            return buttonData;
    }
}

function bigButtonData(buttonText, buttonAction, toolTip){
    return buttonData(BUTTON_TYPES.BIG_BUTTON, buttonText, buttonAction, toolTip);
}

function inputButtonData(buttonText, buttonAction, toolTip){
    return buttonData(BUTTON_TYPES.INPUT_TYPE_BUTTON, buttonText, buttonAction, toolTip);
}

function buttonData(buttonType, buttonText, buttonAction, toolTip){
    return {'type': buttonType, 'text': buttonText, 'action': buttonAction, 'tip': toolTip};
}

function makeButtonGroup(buttons){
    const container = createElement('div', { 'class': '' });
    for (let i = 0; i < buttons.length; i++){
        container.appendChild(makeButton(buttons[i]));
    }
    return container;
}

function makeButtonBar(buttons){
    const container = createElement('div', { 'class': 'button_bar' });
    for (let i = 0; i < buttons.length; i++){
        container.appendChild(makeButton(buttons[i]));
    }
    return container;
}

function deepCopy(originalObject){
    if (typeof originalObject !== 'object' || originalObject === null){
        return originalObject;
    }
    const newObject = Array.isArray(originalObject) ? [] : {};
    for (const key in originalObject){
        newObject[key] = deepCopy(originalObject[key]);
    }
    return newObject;
}

function shuffleArray(array){
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function isNumber(num) {
    return (num || num === 0) && !isNaN(num);
}

function getDateNow(){
    return new Date(Date.now());
}

function getDateNowString(){
    return getDateNow().toISOString();
}