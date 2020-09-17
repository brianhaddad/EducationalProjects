function TestAdmin(){
    let mainContainer = {};
    let questions = [];
    let questionIndices = [];
    let questionIndexIndex = 0;
    let currentMode = TEST_MODES.NORMAL;
    let updatingQuestionBasedOnScroll = false;

    const NORMAL_BUTTON_DATA = {
        FIRST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<<',
            'action': () => {testAdmin.goToFirstQuestion();},
            'tip': 'Go to first question.'
        },
        PREVIOUS: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<',
            'action': () => {testAdmin.previousQuestion();},
            'tip': 'Go to previous question.'
        },
        PREVIOUS_UNANSWERED: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<_',
            'action': () => {testAdmin.previousUnansweredQuestion();},
            'tip': 'Go to previous unanswered question.'
        },
        PREVIOUS_REVIEW: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<?',
            'action': () => {testAdmin.previousMarkedQuestion();},
            'tip': 'Go to previous marked question.'
        },
        MARK: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '?',
            'action': () => {testAdmin.markQuestionForReview();},
            'tip': 'Mark the current question for review.'
        },
        NEXT_REVIEW: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '?>',
            'action': () => {testAdmin.nextMarkedQuestion();},
            'tip': 'Go to next marked question.'
        },
        NEXT_UNANSWERED: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '_>',
            'action': () => {testAdmin.nextUnansweredQuestion();},
            'tip': 'Go to next unanswered question.'
        },
        NEXT: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '>',
            'action': () => {testAdmin.nextQuestion();},
            'tip': 'Go to next question.'
        },
        LAST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '>>',
            'action': () => {testAdmin.goToLastQuestion();},
            'tip': 'Go to last question.'
        }
    };

    let bottomNavBar = {};
    let resultsNavBar = {};
    let testingDropdownNav = {};
    let resultsDropdownNav = {};
    let nonHardcoreTestButtons = {};

    //OPTIONS
    let showSource = false;

    const resetMainContainer = function (){
        mainContainer.innerHTML = '';
    };

    this.showHideCorrect = function (){
        if (questionIndices.length < questions.length){
            setQuestionIndices(RESULTS_QUESTION_DISPLAY_MODE.ALL);
        }
        else if (questionIndices.length === questions.length){
            setQuestionIndices(RESULTS_QUESTION_DISPLAY_MODE.INCORRECT);
            if (questionIndices.length < 1){
                setQuestionIndices(RESULTS_QUESTION_DISPLAY_MODE.ALL);
                userAlert('You got everything correct. Unable to hide correct answers.');
            }
        }
        questionIndexIndex = 0;
        displayResultsView();
    };
    
    const setQuestionIndices = function (reviewDisplayMode){
        questionIndices = [];
        switch (reviewDisplayMode){
            case RESULTS_QUESTION_DISPLAY_MODE.ALL:
                questions.forEach((_, i) => questionIndices[i] = i);
                break;
            case RESULTS_QUESTION_DISPLAY_MODE.INCORRECT:
                questions.forEach((v, i) => {
                    if (!v.isCorrect()){
                        questionIndices.push(i);
                    }
                });
                break;
        }
    };

    const unansweredQuestion = q => !q.isAnswered();
    const markedQuestion = q => q.isMarked();
    const correctAnswer = q => q.isCorrect();

    const makeNavOptions = function () {
        const navOptions = {};
        for (let i = 0; i < questionIndices.length; i++){
            const name = `# ${(questionIndices[i] + 1)}`;
            navOptions[name] = { 'value': questionIndices[i], 'class': 'nav_option_base' };
            if (i === 0){
                navOptions[name]['selected'] = true;
            }
        }
        return navOptions;
    };

    this.init = function (containerId, incomingTestQuestions, testOptions){
        currentMode = testOptions[NON_CHECKBOX_TEST_OPTIONS.TEST_MODE];
        let randomizeAnswers = false;
        for (const option of testOptions){
            switch (TEST_OPTIONS[option]){
                case TEST_OPTIONS.SHOW_SOURCE:
                    showSource = true;
                    break;
                case TEST_OPTIONS.RANDOMIZE_QUESTIONS:
                    incomingTestQuestions = shuffleArray(incomingTestQuestions);
                    break;
                case TEST_OPTIONS.RANDOMIZE_ANSWERS:
                    randomizeAnswers = true;
                    break;
            }
        }
        if (testOptions.hasOwnProperty(NON_CHECKBOX_TEST_OPTIONS.MAX_QUESTIONS) && testOptions[NON_CHECKBOX_TEST_OPTIONS.MAX_QUESTIONS] > 0){
            incomingTestQuestions = incomingTestQuestions.slice(incomingTestQuestions.length - testOptions[NON_CHECKBOX_TEST_OPTIONS.MAX_QUESTIONS]);
        }
        questions = incomingTestQuestions.map(n => new MultipleChoiceQuestion(n, randomizeAnswers));
        setQuestionIndices(RESULTS_QUESTION_DISPLAY_MODE.ALL);

        const navOptions = {};
        for (let i = 0; i < incomingTestQuestions.length; i++){
            const name = `# ${(i + 1)}`;
            navOptions[name] = { 'value': i, 'class': 'nav_option_base' };
            if (i === 0){
                navOptions[name]['selected'] = true;
            }
        }
        testingDropdownNav = new DropDownMenuSelector('Navigate', makeNavOptions(), () => testAdmin.navByDropdown());

        const navButtons = [];
        if (currentMode === TEST_MODES.HARDCORE){
            navButtons.push(inputButtonData('Reset', () => {reset(true);}));
            navButtons.push(inputButtonData('Return to Test Options', () => {returnToTestOptions();}));
            navButtons.push(inputButtonData('Restart Test', () => {loader.display(LOADER_STEPS.TEST_START);}));
            navButtons.push(inputButtonData('Mark for Review', () => {testAdmin.markQuestionForReview();}));
            navButtons.push(bigButtonData('Skip Question', () => {testAdmin.nextQuestion();}));
        }
        else{
            nonHardcoreTestButtons = makeButtonBar([
                inputButtonData('Reset', () => {reset();}),
                inputButtonData('Return to Test Options', () => {returnToTestOptions();}),
                inputButtonData('Restart Test', () => {loader.display(LOADER_STEPS.TEST_START);}),
                bigButtonData('Submit Test', () => {testAdmin.endTest();}),
            ]);
            navButtons.push(testingDropdownNav.render());
            for (const n in NORMAL_BUTTON_DATA){
                navButtons.push(NORMAL_BUTTON_DATA[n]);
            }
        }
        bottomNavBar = new ClickyButtonSet(navButtons);

        keyboardHandler.setMode(KEYBOARD_MODES.TESTING);
        mainContainer = document.getElementById(containerId);
        resetMainContainer();
        displayQuestion();
    };

    this.immediateFeedback = function () {
        //NOTE: The timeout is because in some cases the correct control hasn't got its new data yet when this fires.
        //To prevent reacting on the previous data prior to this immediateFeedback firing, we'll just delay a bit.
        const delay = 5;
        switch (currentMode){
            case TEST_MODES.REVIEW:
                setTimeout(() => {
                    questions[questionIndices[questionIndexIndex]].immediateFeedback();
                }, delay);
                break;
            case TEST_MODES.HARDCORE:
                setTimeout(() => {
                    if (questions[questionIndices[questionIndexIndex]].correctNumberOfSelections()){
                        this.nextQuestion();
                    }
                }, delay);
                break;
        }
    };

    this.navByDropdown = function () {
        const selected = parseInt(getDropdownNavSelection());
        if (!isNaN(selected) && selected > -1){
            const newIndex = questionIndices.indexOf(selected);
            if (newIndex > -1){
                questionIndexIndex = newIndex;
            }
        }
        switch (currentMode){
            case TEST_MODES.RESULTS:
                scrollToQuestion();
                break;
            default:
                displayQuestion();
        }
    };

    const getDropdownNavSelection = function (){
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.HARDCORE:
            case TEST_MODES.REVIEW:
                return testingDropdownNav.getSelected();
                break;
            case TEST_MODES.RESULTS:
                return resultsDropdownNav.getSelected();
                break;
            default:
                return '-1';
        }
    };

    this.showKeyboardOptions = function (){
        updatingQuestionBasedOnScroll = false;
        resetMainContainer();
        mainContainer.appendChild(keyboardHandler.showKeyboardSettings(() => testAdmin.returnToInterface()));
    };

    this.markQuestionForReview = function (){
        questions[questionIndices[questionIndexIndex]].markForReview();
        displayQuestion();
    };

    this.selectOrToggle = function (i){
        questions[questionIndices[questionIndexIndex]].selectOrToggle(i);
    };

    this.goToFirstQuestion = function (){
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                questionIndexIndex = 0;
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                questionIndexIndex = 0;
                scrollToQuestion();
                break;
        }
    };

    this.goToLastQuestion = function (){
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                questionIndexIndex = questionIndices.length - 1;
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                questionIndexIndex = questionIndices.length - 1;
                scrollToQuestion();
                break;
        }
    };

    const evaluateNavDropdownOptionStyles = function (){
        const optionElements = document.getElementsByClassName('nav_option_base');
        const markedClass = 'nav_option_marked';
        const answeredClass = 'nav_option_answered';
        for (let j = 0; j < optionElements.length; j++){
            const i = parseInt(optionElements[j].value);

            const marked = questions[i].isMarked();
            if (marked && !optionElements[j].classList.contains(markedClass)){
                optionElements[j].classList.add(markedClass);
            }
            if (!marked && optionElements[j].classList.contains(markedClass)){
                optionElements[j].classList.remove(markedClass);
            }

            const answered = questions[i].isAnswered();
            if (answered && !optionElements[j].classList.contains(answeredClass)){
                optionElements[j].classList.add(answeredClass);
            }
            if (!answered && optionElements[j].classList.contains(answeredClass)){
                optionElements[j].classList.remove(answeredClass);
            }
        }
    };

    const unansweredQuestionMoveOnCheck = function (){
        if (!questions[questionIndices[questionIndexIndex]].isAnswered()
            && !confirm('Proceed without answering this question?')){
            return false;
        }
        return true;
    };

    const findNext = function (condition){
        for (let i = questionIndexIndex + 1; i < questionIndices.length; i++){
            if (condition(questions[questionIndices[i]])) {
                return i;
            }
        }
        return -1;
    };

    const findPrevious = function (condition){
        for (let i = questionIndexIndex - 1; i >= 0; i--){
            if (condition(questions[questionIndices[i]])){
                return i;
            }
        }
        return -1;
    };

    this.nextMarkedQuestion = function (){
        const nextIndex = findNext(markedQuestion);
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                if (nextIndex > -1){
                    questionIndexIndex = nextIndex;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                if (nextIndex > -1){
                    questionIndexIndex = nextIndex;
                }
                scrollToQuestion();
                break;
        }
    };

    this.previousMarkedQuestion = function (){
        const previousIndex = findPrevious(markedQuestion);
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                if (previousIndex > -1){
                    questionIndexIndex = previousIndex;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                if (previousIndex > -1){
                    questionIndexIndex = previousIndex;
                }
                scrollToQuestion();
                break;
        }
    };

    this.previousUnansweredQuestion = function (){
        const previousIndex = findPrevious(unansweredQuestion);
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                if (previousIndex > -1){
                    questionIndexIndex = previousIndex;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                if (previousIndex > -1){
                    questionIndexIndex = previousIndex;
                }
                scrollToQuestion();
                break;
        }
    };

    this.nextUnansweredQuestion = function (){
        const nextIndex = findNext(unansweredQuestion);
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                if (nextIndex > -1){
                    questionIndexIndex = nextIndex;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                if (nextIndex > -1){
                    questionIndexIndex = nextIndex;
                }
                scrollToQuestion();
                break;
        }
    };

    this.nextQuestion = function (){
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                questionIndexIndex++;
                if (questionIndexIndex >= questionIndices.length){
                    questionIndexIndex = questionIndices.length - 1;
                }
                displayQuestion();
                break;
            case TEST_MODES.HARDCORE:
                if (!unansweredQuestionMoveOnCheck()){
                    return false;
                }
                else if (questionIndexIndex + 1 >= questionIndices.length){
                    finalizeTest();
                    return false;
                }
                questionIndexIndex++;
                if (questionIndexIndex >= questionIndices.length){
                    questionIndexIndex = questionIndices.length - 1;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                questionIndexIndex++;
                if (questionIndexIndex >= questionIndices.length){
                    questionIndexIndex = questionIndices.length - 1;
                }
                scrollToQuestion();
                break;
        }
    };

    this.previousQuestion = function (){
        switch (currentMode){
            case TEST_MODES.NORMAL:
            case TEST_MODES.REVIEW:
                questionIndexIndex--;
                if (questionIndexIndex < 0){
                    questionIndexIndex = 0;
                }
                displayQuestion();
                break;
            case TEST_MODES.RESULTS:
                questionIndexIndex--;
                if (questionIndexIndex < 0){
                    questionIndexIndex = 0;
                }
                scrollToQuestion();
                break;
        }
    };

    this.setCurrentResultViewQuestion = function (){
        if (updatingQuestionBasedOnScroll && currentMode === TEST_MODES.RESULTS){
            const newQuestionIndex = getCurrentlyViewedResultQuestion();
            if (newQuestionIndex > -1){
                const newIndex = questionIndices.indexOf(newQuestionIndex);
                if (newIndex > -1){
                    questionIndexIndex = newIndex;
                    evaluateNavBars();
                    if (currentMode !== TEST_MODES.RESULTS){
                        testingDropdownNav.setSelected(questionIndices[questionIndexIndex]);
                    }
                    else {
                        resultsDropdownNav.setSelected(questionIndices[questionIndexIndex]);
                    }
                }
            }
        }
    };

    this.returnToInterface = function (){
        switch (currentMode){
            case TEST_MODES.RESULTS:
                displayResultsView();
                break;
            default:
                displayQuestion();
        }
    };

    this.endTest = function (){
        if (currentMode === TEST_MODES.HARDCORE){
            return false;
        }
        finalizeTest();
    };

    const getCurrentlyViewedResultQuestion = function (){
        let min = 9999;
        let lastAbsOffset = min;
        let curMinIndex = -1;
        for (let i = 0; i < questionIndices.length; i++){
            const absOffset = Math.abs(questions[questionIndices[i]].topCoordinateOffset());
            const delta = lastAbsOffset - absOffset;
            lastAbsOffset = absOffset;
            if (absOffset < min){
                min = absOffset;
                curMinIndex = questionIndices[i];
            }
            if (delta < 0){
                // Exit early if possible: a negative delta means the values are getting
                // larger again and we've found the smallest one.
                return curMinIndex;
            }
        }
        return curMinIndex;
    };

    const finalizeTest = function (){
        const anyUnanswered = questions.some(unansweredQuestion);
        if (currentMode !== TEST_MODES.HARDCORE){
            if (anyUnanswered && !confirm('End the test with unanswered questions?')){
                return false;
            }
            else if (!anyUnanswered && !confirm('Are you satisfied with your answers?')) {
                // if its not hardcore mode, make user confirm submitting the test.
                return false;
            }
        }
        questionIndexIndex = 0;
        currentMode = TEST_MODES.RESULTS;
        keyboardHandler.setMode(KEYBOARD_MODES.RESULTS);
        setQuestionIndices(RESULTS_QUESTION_DISPLAY_MODE.ALL);
        displayResultsView();
    };

    const displayLegend = function (){
        const legendParts = [];
        legendParts.push(createElement('h1', {}, 'Legend'));
        legendParts.push(createElement('p', {'class': 'correct'}, 'You correctly selected this option.'));
        legendParts.push(createElement('p', {'class': 'incorrect'}, 'You selected this option but it was incorrect.'));
        legendParts.push(createElement('p', {'class': 'missed'}, 'This was correct, but you didn\'t select it.'));
        makeOKPopup(legendParts);
    };

    const percentString = function (numerator, divisor, numDigits = 2){
        return `${((numerator / divisor) * 100).toFixed(numDigits)}%`;
    };

    const displayOverview = function (){
        const numQuestions = questions.length;
        const numCorrect = questions.filter(correctAnswer).length;
        const numMarked = questions.filter(markedQuestion).length;
        const numUnanswered = questions.filter(unansweredQuestion).length;
        const overviewParts = [];
        overviewParts.push(createElement('h1', {}, 'Results Overview'));
        overviewParts.push(createElement('p', {}, `You got ${numCorrect} correct out of ${numQuestions}, or ${percentString(numCorrect, numQuestions)}.`));
        overviewParts.push(createElement('p', {}, `You marked ${numMarked} question${(numMarked === 1 ? '' : 's')} for review.`));
        if (numUnanswered > 0){
            overviewParts.push(createElement('p', {}, `You left ${numUnanswered}, or ${percentString(numUnanswered, numQuestions)} of the question${(numUnanswered === 1 ? '' : 's')} unanswered.`));
        }
        makeOKPopup(overviewParts);
    };

    const displayResultsView = function (){
        resetMainContainer();
        resultsDropdownNav = new DropDownMenuSelector('Navigate', makeNavOptions(), () => testAdmin.navByDropdown());
        const resultsNavButtons = [];
        for (const n in NORMAL_BUTTON_DATA){
            if (n !== 'MARK'){
                resultsNavButtons.push(NORMAL_BUTTON_DATA[n]);
            }
        }
        resultsNavButtons.splice(Math.floor(resultsNavButtons.length/2), 0, resultsDropdownNav.render());
        resultsNavBar = new ClickyButtonSet(resultsNavButtons);

        questionIndices.forEach((n) => mainContainer.appendChild(questions[n].render(n + 1, questions.length, true, currentMode)));

        const endReviewButtons = makeButtonBar([
            inputButtonData('Toggle Correct', () => {testAdmin.showHideCorrect();}),
            inputButtonData('Show Overview', () => {displayOverview();}),
            inputButtonData('Show Legend', () => {displayLegend();}),
            inputButtonData('Reset Application', () => {reset()}),
            inputButtonData('Return to Test Options', () => {returnToTestOptions();}),
            bigButtonData('Test Again', () => {loader.display(LOADER_STEPS.TEST_START);}),
        ]);

        const footerMenu = createElement('div', { 'class': 'review_nav_bar' });
        footerMenu.appendChild(resultsNavBar.render());
        footerMenu.appendChild(endReviewButtons);
        mainContainer.appendChild(footerMenu);

        const rect = footerMenu.getBoundingClientRect();
        const footerSpacer = createElement('div', {'style': `height:${(rect.height + 5)}px;`}, '&nbsp;');
        mainContainer.appendChild(footerSpacer);
        
        scrollToQuestion();
        updatingQuestionBasedOnScroll = true;
    };

    const scrollToQuestion = function () {
        const scrollOptions = {
            left: 0,
            top: window.scrollY + questions[questionIndices[questionIndexIndex]].topCoordinateOffset(),
            behavior: 'smooth'
        };
        evaluateNavBars();
        evaluateNavDropdownOptionStyles();
        if (currentMode !== TEST_MODES.RESULTS){
            testingDropdownNav.setSelected(questionIndices[questionIndexIndex]);
        }
        else {
            resultsDropdownNav.setSelected(questionIndices[questionIndexIndex]);
        }
        window.scrollTo(scrollOptions);
    };

    const displayQuestion = function (){
        updatingQuestionBasedOnScroll = false;
        resetMainContainer();
        if (currentMode !== TEST_MODES.HARDCORE){
            evaluateNavBars();
        }
        mainContainer.appendChild(questions[questionIndices[questionIndexIndex]].render(questionIndices[questionIndexIndex] + 1, questions.length, showSource, currentMode));
        mainContainer.appendChild(bottomNavBar.render());
        if (currentMode !== TEST_MODES.HARDCORE){
            mainContainer.appendChild(nonHardcoreTestButtons);
            evaluateNavDropdownOptionStyles();
            if (currentMode !== TEST_MODES.RESULTS){
                testingDropdownNav.setSelected(questionIndices[questionIndexIndex]);
            }
            else {
                resultsDropdownNav.setSelected(questionIndices[questionIndexIndex]);
            }
        }
    };

    const evaluateNavBars = function (){
        const disable = function (name){
            switch (currentMode){
                case TEST_MODES.RESULTS:
                    resultsNavBar.disable(NORMAL_BUTTON_DATA[name]['text']);
                    break;

                default:
                    bottomNavBar.disable(NORMAL_BUTTON_DATA[name]['text']);
            }
        };
        const enable = function (name){
            switch (currentMode){
                case TEST_MODES.RESULTS:
                    resultsNavBar.enable(NORMAL_BUTTON_DATA[name]['text']);
                    break;

                default:
                    bottomNavBar.enable(NORMAL_BUTTON_DATA[name]['text']);
            }
        };
        for (const n in NORMAL_BUTTON_DATA){
            switch (NORMAL_BUTTON_DATA[n]['text']) {
                case NORMAL_BUTTON_DATA.FIRST['text']:
                    if (questionIndexIndex === 0){
                        disable(n);
                    }
                    else{
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.PREVIOUS['text']:
                    if (questionIndexIndex === 0){
                        disable(n);
                    }
                    else{
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.PREVIOUS_UNANSWERED['text']:
                    if (findPrevious(unansweredQuestion) < 0){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.PREVIOUS_REVIEW['text']:
                    if (findPrevious(markedQuestion) < 0){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.NEXT_REVIEW['text']:
                    if (findNext(markedQuestion) < 0){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.NEXT_UNANSWERED['text']:
                    if (findNext(unansweredQuestion) < 0){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.NEXT['text']:
                    if (questionIndexIndex >= questionIndices.length - 1){
                        disable(n);
                    }
                    else{
                        enable(n);
                    }
                    break;
                case NORMAL_BUTTON_DATA.LAST['text']:
                    if (questionIndexIndex >= questionIndices.length - 1){
                        disable(n);
                    }
                    else{
                        enable(n);
                    }
                    break;
            }
        }
    };
}

const TEST_MODES = {
    NORMAL: 'Normal',
    HARDCORE: 'Hardcore',
    REVIEW: 'Review',
    RESULTS: 'Results',
};

let testAdmin = new TestAdmin();