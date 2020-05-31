function main(templateDatas) {
    var container = document.getElementById('main');
    var linebreak = '[linebreak]';

    for (var i = 0; i < templateDatas.length; i++) {
        var templateData = templateDatas[i];
        if (!templateData.inputs || templateData.inputs.length < 1) {
            alert('Error: This template appears to be invalid. Please select a valid template file for the game.');
            return null;
        }

        for (var j = 0; j < templateData.inputs.length; j++) {
            var element = templateData.inputs[j];
            var answer = '';
            var attempts = 0;
            do {
                attempts++;
                if (attempts > 2) {
                    alert('You must enter a value for ' + element + ' to proceed.');
                }
                answer = prompt('Story ' + (i + 1) + '/' + templateDatas.length + ': Blank ' + (j + 1) + '/' + templateData.inputs.length + '\nPlease input a ' + element)
            }
            while (!answer || answer.length == 0);
            templateData.string = templateData.string.replace(element, answer);
        }

        var story = createElement('div', { 'class': 'story' });
        var title = createElement('h2', {}, 'Story ' + (i + 1));
        story.appendChild(title);

        templateData.string = templateData.string.replace(/(\r\n|\n|\r)/gm, linebreak);
        var lines = templateData.string.split(linebreak);
        for (var j = 0; j < lines.length; j++) {
            var p = createElement('p', {}, lines[j]);
            story.appendChild(p);
        }
        
        container.appendChild(story);
    }
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