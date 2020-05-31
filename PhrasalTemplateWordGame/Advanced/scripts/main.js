function main(templateDatas, id) {
    var container = document.getElementById(id);
    var linebreak = '[linebreak]';
    var highlightUserWords = true;

    var userPrompts = [];

    //Phase 1: Process template, gather prompt data, and modify template.
    for (var i = 0; i < templateDatas.length; i++) {
        var templateData = templateDatas[i];
        if (!templateData.inputs || templateData.inputs.length < 1) {
            alert('Error: This template appears to be invalid. Please select a valid template file for the game.');
            return null;
        }

        for (var j = 0; j < templateData.inputs.length; j++) {
            var element = templateData.inputs[j];
            userPrompts.push(UserPromptFromText(i, j, element));
            templateData.string = templateData.string.replace(element, userPrompts[userPrompts.length - 1].id);
        }
    }

    //Phase 2: Collect user input.
    for (var i=0; i<userPrompts.length; i++){
        var answer = '';
        var attempts = 0;
        do {
            attempts++;
            if (attempts > 2) {
                alert('You must enter a value for ' + userPrompts[i].prompt + ' to proceed.');
            }
            answer = prompt('Item ' + (i + 1) + '/' + userPrompts.length + '\nPlease input a ' + userPrompts[i].prompt)
        }
        while (!answer || answer.length == 0);
        if (highlightUserWords){
            answer = '<span class="user_answer">' + answer + '</span>';
        }
        userPrompts[i].userResponse = answer;
    }

    //Phase 3: Add the user responses into the text.
    for (var i = 0; i < userPrompts.length; i++) {
        templateDatas[userPrompts[i].storyIndex].string =
            templateDatas[userPrompts[i].storyIndex].string.replace(userPrompts[i].id, userPrompts[i].userResponse);
    }

    //Phase 4: Assemble the stories for output.
    for (var i = 0; i < templateDatas.length; i++) {
        var templateData = templateDatas[i];
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
}

function UserPrompt(storyIndex, id, prompt, userResponse){
    this.storyIndex = storyIndex;
    this.id = id;
    this.prompt = prompt;
    this.userResponse = userResponse;
}

function UserPromptFromText(storyIndex, promptIndex, promptText){
    var id = '[' + 's:' + storyIndex + ',p:' + promptIndex + ']';
    return new UserPrompt(storyIndex, id, promptText, '');
}