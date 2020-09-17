function MultipleChoiceQuestion(rawJSON, randomizeAnswers){
    const rawQuestionJSON = rawJSON;
    const answers = rawJSON['answers'];
    const images = rawJSON['images'] ?? {};
    let options = rawJSON['options'];
    const questionText = rawJSON['question'];
    
    const fromTest = rawJSON['testName'];
    const forCert = rawJSON['cert'];
    const fromSection = rawJSON['sectionName'];
    const originalQuestionNumber = rawJSON['questionNumber'];
    const answerExplanation = rawJSON['explanation'];
    const answerSource = rawJSON['source'];

    let markedForReview = false;
    let feedbackContainer = createElement('div', {});

    let container = {};

    let lastNum, lastTotal, lastShowInfo, lastTestMode;
    let dirtyData = false;

    const optionsFromRaw = function (rawOptions, randomizeAnswers, selected = []){
        if (randomizeAnswers){
            rawOptions = randomizeOptions(rawOptions);
        }
        const tempOptions = {};
        for (const n in rawOptions){
            tempOptions[n] = {
                'displayName': rawOptions[n]
            };
            if (selected.indexOf(n) > -1){
                tempOptions[n]['checked'] = true;
            }
        }
        return tempOptions;
    };

    const randomizeOptions = function (rawOptions){
        let keys = Object.keys(rawOptions);
        keys = shuffleArray(keys);
        const newAnswers = [];
        const newOptions = {};
        let i = 0;
        for (const n in rawOptions){
            newOptions[n] = rawOptions[keys[i]];
            const answerIndex = answers.indexOf(keys[i]);
            if (answerIndex > -1){
                newAnswers[answerIndex] = n;
            }
            i++;
        }
        for (i = 0; i < answers.length; i++){
            answers[i] = newAnswers[i];
        }
        options = newOptions;
        return newOptions;
    };

    const selectionSet = answers.length === 1
        ? new RadioButtonSet(optionsFromRaw(options, randomizeAnswers), () => testAdmin.immediateFeedback())
        : new CheckBoxSet(optionsFromRaw(options, randomizeAnswers), () => testAdmin.immediateFeedback());
    
    this.isCorrect = function (){
        return isAnsweredCorrectly();
    };

    this.immediateFeedback = function (){
        renderFeedback();
    };
    
    this.selectOrToggle = function (i){
        return selectionSet.select(i);
    };

    this.markForReview = function (){
        markedForReview = !markedForReview;
        dirtyData = true;
    };

    this.isMarked = function (){
        return markedForReview;
    };

    this.isAnswered = function (){
        const selections = selectionSet.getSelected();
        return selections.length > 0;
    };

    this.correctNumberOfSelections = function (){
        const selections = selectionSet.getSelected();
        return selections.length === answers.length;
    };

    this.topCoordinateOffset = function (){
        const rect = container.getBoundingClientRect();
        return rect.y;
    };

    this.render = function (num, total, showInfo, testMode){
        if (dirtyData
            || lastNum !== num
            || lastTotal !== total
            || lastShowInfo !== showInfo
            || lastTestMode !== testMode){
            lastNum = num;
            lastTotal = total;
            lastShowInfo = showInfo;
            lastTestMode = testMode;
            dirtyData = false;

            container = makeFieldset(`Question ${num} of ${total}`);

            const titleAttributes = {};
            if (testMode === TEST_MODES.RESULTS){
                if (isAnsweredCorrectly()){
                    titleAttributes['class'] = 'correct';
                }
                else {
                    titleAttributes['class'] = 'incorrect';
                }
            }
            const title = createElement('h3', titleAttributes, fromTest);
            container.appendChild(title);

            if (showInfo || testMode === TEST_MODES.RESULTS){
                const info = createElement('h4', {}, `For ${forCert}: Question ${originalQuestionNumber} from ${fromSection}`);
                container.appendChild(info);
            }

            if (markedForReview){
                const markedMessage = createElement('h4', { 'class': 'review' }, 'Marked for Review');
                container.appendChild(markedMessage);
            }

            const questionLines = formatQuestion(testMode);
            questionLines.forEach(n => container.appendChild(n));

            if (testMode === TEST_MODES.REVIEW){
                container.appendChild(feedbackContainer);
            }

            if (testMode !== TEST_MODES.RESULTS){
                const options = selectionSet.render();
                container.appendChild(options);
            }
            else {
                const responses = selectionSet.getSelected();
                for (const n in options){
                    const attr = {'class': 'answer_review'};
                    if (responses.indexOf(n) > -1){
                        if (answers.indexOf(n) > -1){
                            attr['class'] += ' correct';
                        }
                        else {
                            attr['class'] += ' incorrect';
                        }
                    }
                    else if (answers.indexOf(n) > -1){
                        attr['class'] += ' missed';
                    }
                    container.appendChild(createElement('p', attr, options[n]));
                }

                const explanation = createElement('p', {}, answerExplanation);
                container.appendChild(explanation);

                const source = createElement('p', {}, answerSource);
                container.appendChild(source);
            }
        }

        return container;
    };

    const renderFeedback = function () {
        //TODO: This should be done differently, and could even interact with the selectionSet
        //It's currently a placeholder for something better. Don't let me down!
        feedbackContainer.innerHTML = '';
        const text = isAnsweredCorrectly() ? rightAnswerMessage() : wrongAnswerMessage();
        const feedbackElement = createElement('h2', {}, text);
        feedbackContainer.appendChild(feedbackElement);
    };

    const rightAnswerMessage = function () {
        const rightAnswerMessages = [
            'Correct!',
            'That\'s right!',
            'You got it!',
            'Nicely done!',
            'True!',
            'That wasn\'t the wrong answer!',
            'You got it right!',
            'Impressive!',
            'Bingo!',
        ];
        return randomSelection(rightAnswerMessages);
    };
    const wrongAnswerMessage = function () {
        const wrongAnswerMessages = [
            'Are you sure?',
            'Try again.',
            'Do you want to try again?',
            'That doesn\'t look right to me.',
            'Are you sure that\'s right?',
            'Do any of the other answers look maybe <em>more</em> correct to you?',
            'Maybe you clicked on the wrong one by accident.',
            'That isn\'t correct.',
            'That\'s not right.',
            'Read the options again, this time more carefully.',
            'Is there an answer that is more correc than that?',
            'You can have another attempt, because I\'m feeling generous.',
        ];
        return randomSelection(wrongAnswerMessages);
    };
    const randomSelection = (array) => array[Math.floor(Math.random() * array.length)];

    const isAnsweredCorrectly = function () {
        const responses = selectionSet.getSelected();
        return (responses.length === answers.length)
            && responses.every(n => answers.indexOf(n) > -1);
    };

    const formatQuestion = function (testMode){
        let newText = questionText;
        for (const alias in images){
            newText = newText.replace('{' + alias + '}', `<img src="${images[alias]}">`);
        }
        const lines = newText.split(/(\r\n|\n|\r)/gm);
        const attr = { 'class': 'question_text' };
        if (testMode === TEST_MODES.RESULTS){
            attr['class'] = 'question_review';
        }
        return lines.map(n => createElement('p', attr, n));
    };
}