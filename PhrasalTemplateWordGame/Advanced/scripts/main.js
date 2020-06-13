function main(templateDatas, id) {
    var container = document.getElementById(id);
    var scramblePromptOrder = true;
    var formContainerName = 'ptwgFormContainer';

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

    //Phase 2a: Prepare form to collect user input.
    if (scramblePromptOrder){
        scrambleArray(userPrompts);
    }

    var formContainer = document.getElementById(formContainerName);
    if (!formContainer){
        formContainer = createElement('div', {'id':formContainerName});
        container.appendChild(formContainer);
    }
    formContainer.innerHTML = '';

    var form = createElement('form', {});
    form.addEventListener('submit', event => {
        event.preventDefault();
        receiveInput(formContainerName, id, userPrompts, templateDatas);
    });
    for (var i = 0; i < userPrompts.length; i++){
        var inputDiv = createElement('div');
        var inputLabel = createElement('label', {'for':userPrompts[i].id}, 'Please input a ' + userPrompts[i].prompt);
        var input = createElement('input', {'type':'text', 'name':userPrompts[i].id});
        inputDiv.appendChild(inputLabel);
        inputDiv.appendChild(input);
        form.appendChild(inputDiv);
    }
    var submit = createElement('input', {'type':'submit', 'value':'Submit'});
    form.appendChild(submit);
    formContainer.appendChild(form);

    container.style.display = 'block';
}

function receiveInput(inId, outId, userPrompts, templateDatas){
    var formContainer = document.getElementById(inId);
    var container = document.getElementById(outId);

    var form = formContainer.children[0];
    var highlightUserWords = false;
    
    var typeEffect = true;

    if (highlightUserWords && typeEffect){
        console.log('The type effect is currently incompatible with underlining words.');
    }

    //Phase 2b: Collect user input from form and validate that the user entered values.
    var missingData = false;
    for (var i = 0; i < userPrompts.length; i++){
        var answer = form[userPrompts[i].id].value;
        if (!answer || answer.length == 0){
            missingData = true;
            form[userPrompts[i].id].style.backgroundColor = '#ffaaaa';
        }
        else{
            form[userPrompts[i].id].style.backgroundColor = '';
            if (highlightUserWords){
                answer = '<span class="user_answer">' + answer + '</span>';
            }
            userPrompts[i].userResponse = answer;
        }
    }
    if (missingData){
        return;
    }
    //If successfully pulled all answers:
    formContainer.innerHTML = '';

    //Phase 3: Substitute the user responses into the template.
    for (var i = 0; i < userPrompts.length; i++) {
        templateDatas[userPrompts[i].storyIndex].string =
            templateDatas[userPrompts[i].storyIndex].string.replace(userPrompts[i].id, userPrompts[i].userResponse);
    }

    //Phase 4: Assemble the stories for output.
    if (typeEffect){
        var typist = new Typist(templateDatas);
        typist.start(container);
    }
    else{
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
    }
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

//Based on information from here:
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function scrambleArray(a){
    for (var i = a.length-1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}