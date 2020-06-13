function Typist(templateDatas, container){
    var stories = [];
    var currentStory = 0;
    var container = {};

    this.start = function (outputContainer){
        container = outputContainer;
        for (var i = 0; i < templateDatas.length; i++) {
            stories.push(new Story(templateDatas[i], i, container));
        }
        update();
    };

    var update = function (){
        var timeout = stories[currentStory].update();
        if (timeout == 0){
            currentStory++;
            timeout = 2000;
        }
        window.scrollTo(0,document.body.scrollHeight);
        if (currentStory < stories.length){
            setTimeout(update, timeout);
        }
    };
}

function Story(templateData, storyId, outputContainer){
    var attachedStory = false;
    var id = storyId;
    var storyParagraphs = templateData.string.split(/(\r\n|\n|\r)/gm);
    var container = outputContainer;
    var currentParagraph = 0;

    var paragraphs = [];
    paragraphs.push(new Paragraph('Story ' + (id + 1), createElement('h1')));
    paragraphs.push(new Paragraph('From: ' + templateData.name, createElement('h3')));
    for (var i=0; i<storyParagraphs.length; i++){
        paragraphs.push(new Paragraph(storyParagraphs[i], createElement('p')));
    }

    var story = createElement('div', { 'class': 'story' });

    this.update = function (){
        if (!attachedStory){
            container.appendChild(story);
            attachedStory = true;
        }
        
        if (!paragraphs[currentParagraph].attached) {
            story.appendChild(paragraphs[currentParagraph].container);
        }

        var timeout = paragraphs[currentParagraph].update();
        if (timeout === 0){
            currentParagraph++;
            timeout = 1000;
        }
        if (currentParagraph < paragraphs.length){
            return timeout;
        }
        else {
            return 0;
        }
    };
}

function Paragraph(text, outputContainer){
    var variation = 100;
    var letters = text.split('');
    var currentLetter = 0;
    this.container = outputContainer;

    this.attached = false;

    this.update = function (){
        this.container.innerHTML += letters[currentLetter];
        currentLetter++;
        if (currentLetter < letters.length){
            return Math.max(1, Math.floor((msPerLetter()) + (Math.random() * 2 * variation) - variation));
        }
        else {
            return 0;
        }
    };
}

function msPerLetter(){
    var wpm = 80;
    var avgWordLength = 4.7;
    return 1000 * (60 / (avgWordLength * wpm));;
}