const output = document.getElementById('main');

output.appendChild(createCard(1));

function createCard(content) {
    const outsideAttributes = {
        class: 'card',
    };
    const cardElement = createElement('div', outsideAttributes);
    
    const insideAttributes = {
        class: 'card contents front',
    };
    const cardContents = createElement('div', insideAttributes, content);

    cardElement.appendChild(cardContents);
    return cardElement;
}

function createElement(type, attributes, innerHTML) {
    const element = document.createElement(type);
    for (let a in attributes) {
        element.setAttribute(a, attributes[a]);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}