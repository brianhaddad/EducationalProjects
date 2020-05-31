function main(templateDatas){
    var templateData = templateDatas[0]; //Temporary
    //TODO: handle all files in a loop.
    if (!templateData.inputs || templateData.inputs.length < 1){
        alert('Error: This template appears to be invalid. Please select a valid template file for the game.');
        return null;
    }
    for (var i=0; i<templateData.inputs.length; i++){
        var element = templateData.inputs[i];
        var answer = '';
        var attempts = 0;
        do {
            attempts++;
            if (attempts > 2){
                alert('You must enter a value for ' + element + ' to proceed.');
            }
            answer = prompt('(' + (i + 1) + '/' + templateData.inputs.length + ') Please input a ' + element)
        }
        while (!answer || answer.length == 0);
        templateData.string = templateData.string.replace(element, answer);
    }
    var container = document.getElementById('main');
    var linebreak = '[linebreak]';
    templateData.string = templateData.string.replace(/(\r\n|\n|\r)/gm, linebreak);
    var lines = templateData.string.split(linebreak);
    var story = createElement('div', {'class':'story'});
    var title = createElement('h2', {}, 'Story');
    story.appendChild(title);
    for (var i=0; i<lines.length; i++){
        var p = createElement('p', {}, lines[i]);
        story.appendChild(p);
    }
    container.appendChild(story);
    container.style.display = 'block';
}

function createElement(type, attributes, innerHTML) {
    var element = document.createElement(type);
    for (var a in attributes) {
        element.setAttribute(a, attributes[a]);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
};