function debuggerAlert(message){
    console.log(message);
    debugger;
}

function userAlert(message, windowTitle) {
    const children = [];
    children.push(createElement('h1', {}, windowTitle ?? 'Alert'));
    children.push(createElement('p', {}, message));
    return makeOKPopup(children);
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
    container.appendChild(makeButton.button('OK', action));
    return container;
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

const makeButton = {
    input: function (displayText, javascriptAction, toolTip) {
        const attributes = { 'type': 'button', 'value': displayText };
        if (toolTip && toolTip.length > 0){
            attributes['title'] = toolTip;
        }
        const button = createElement('input', attributes);
        button.onclick = javascriptAction;
        return button;
    },
    button: function (displayText, javascriptAction, toolTip) {
        const attributes = {};
        if (toolTip && toolTip.length > 0){
            attributes['title'] = toolTip;
        }
        const button = createElement('button', attributes, displayText);
        button.onclick = javascriptAction;
        return button;
    }
};

function makeButtonGroup(buttons){
    const container = createElement('div', { 'class': '' });
    for (let i = 0; i < buttons.length; i++){
        container.appendChild(buttons[i]);
    }
    return container;
}

function makeButtonBar(buttons){
    const container = createElement('div', { 'class': 'button_bar' });
    for (let i = 0; i < buttons.length; i++){
        container.appendChild(buttons[i]);
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