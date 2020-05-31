function main(templateDatas, id) {
    var container = document.getElementById(id);
    var linebreak = '[linebreak]';
    var highlightUserWords = true;

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
            if (highlightUserWords){
                answer = '<span class="user_answer">' + answer + '</span>';
            }
            templateData.string = templateData.string.replace(element, answer);
        }

        var story = createElement('div', { 'class': 'story' });
        var title = createElement('h1', {}, 'Story ' + (i + 1));
        var subtitle = createElement('h3', {}, 'From: ' + templateData.name);
        story.appendChild(title);
        story.appendChild(subtitle);

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

function clearOutput(id){
    var container = document.getElementById(id);
    container.style.display = 'none';
    container.innerHTML = '';
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