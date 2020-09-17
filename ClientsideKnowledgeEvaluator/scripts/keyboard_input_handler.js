function KeyboardInputHandler(initialMode){
    let mode = initialMode;
    let oldMode = KEYBOARD_MODES.KEYBAORD_SETUP;
    let remapper = {};
    const mapping = {};
    let returnFromSetupAction = () => null;

    const KEYS = {
        BACKSPACE: '8',
        TAB: '9',
        ENTER: '13',
        SHIFT: '16',
        CTRL: '17',
        ALT: '18',
        PAUSE_BREAK: '19',
        CAPS_LOCK: '20',
        ESCAPE: '27',
        SPACE: '32',
        PAGE_UP: '33',
        PAGE_DOWN: '34',
        END: '35',
        HOME: '36',
        ARROW_LEFT: '37',
        ARROW_UP: '38',
        ARROW_RIGHT: '39',
        ARROW_DOWN: '40',
        INSERT: '45',
        DELETE: '46',
        ZERO: '48',
        ONE: '49',
        TWO: '50',
        THREE: '51',
        FOUR: '52',
        FIVE: '53',
        SIX: '54',
        SEVEN: '55',
        EIGHT: '56',
        NINE: '57',
        SEMI_COLON: '59',
        EQUALS: '61',
        A: '65',
        B: '66',
        C: '67',
        D: '68',
        E: '69',
        F: '70',
        G: '71',
        H: '72',
        I: '73',
        J: '74',
        K: '75',
        L: '76',
        M: '77',
        N: '78',
        O: '79',
        P: '80',
        Q: '81',
        R: '82',
        S: '83',
        T: '84',
        U: '85',
        V: '86',
        W: '87',
        X: '88',
        Y: '89',
        Z: '90',
        F1: '112',
        F2: '113',
        F3: '114',
        F4: '115',
        F5: '116',
        F6: '117',
        F7: '118',
        F8: '119',
        F9: '120',
        F10: '121',
        F11: '122',
        F12: '123',
        EQUALS: '187',
        COMMA: '188',
        MINUS: '189',
        PERIOD: '190',
        FORWARD_SLASH: '191',
        GRAVE_ACCENT: '192',
        LEFT_BRACKET: '219',
        BACK_SLASH: '220',
        RIGHT_BRACKET: '221',
        APOSTROPHE: '222'
    };

    //These are keys that cannot be user input for the application and that will retain their default behavior.
    const EXCEPTIONS = [
        KEYS.F1,
        KEYS.F12
    ];

    const scrollSpeed = 64;
    const scrollDelay = 100;
    let scrollTimer = 0;
    let lastScrollTick = Date.now();

    this.scrollEvent = function (){
        testAdmin.setCurrentResultViewQuestion();
    };

    const smoothScrollBy = function (y){
        let thisScrollTick = Date.now();
        scrollTimer += thisScrollTick - lastScrollTick;
        lastScrollTick = thisScrollTick;
        if (scrollTimer > scrollDelay){
            scrollTimer = 0;
            const scrollOptions = {
                left: 0,
                top: window.scrollY + y,
                behavior: 'smooth'
            };
            window.scrollTo(scrollOptions);
        }
    };

    const handlers = {
        'Setup': {
            'keyup': {
                'Keyboard Options': function (e) {loader.showKeyboardOptions();}
            },
            'keydown': {}
        },
        'Testing': {
            'keyup': {
                'Keyboard Options': function (e) {testAdmin.showKeyboardOptions();},
                'First Question': function (e) {testAdmin.goToFirstQuestion();},
                'Previous Question': function (e) {testAdmin.previousQuestion();},
                'Previous Unanswered Question': function (e) {testAdmin.previousUnansweredQuestion();},
                'Previous Marked Question': function (e) {testAdmin.previousMarkedQuestion();},
                'Mark for Review': function (e) {testAdmin.markQuestionForReview();},
                'Next Marked Question': function (e) {testAdmin.nextMarkedQuestion();},
                'Next Unanswered Question': function (e) {testAdmin.nextUnansweredQuestion();},
                'Next Question': function (e) {testAdmin.nextQuestion();},
                'Last Question': function (e) {testAdmin.goToLastQuestion();},
                'Submit Test': function (e) {testAdmin.endTest();},
                'Answer 1': function (e) {testAdmin.selectOrToggle(0);},
                'Answer 2': function (e) {testAdmin.selectOrToggle(1);},
                'Answer 3': function (e) {testAdmin.selectOrToggle(2);},
                'Answer 4': function (e) {testAdmin.selectOrToggle(3);},
                'Answer 5': function (e) {testAdmin.selectOrToggle(4);},
                'Answer 6': function (e) {testAdmin.selectOrToggle(5);},
                'Answer 7': function (e) {testAdmin.selectOrToggle(6);},
                'Answer 8': function (e) {testAdmin.selectOrToggle(7);},
                'Answer 9': function (e) {testAdmin.selectOrToggle(8);},
                'Answer 10': function (e) {testAdmin.selectOrToggle(9);},
            },
            'keydown': {}
        },
        'Results': {
            'keyup': {
                'Keyboard Options': function (e) {testAdmin.showKeyboardOptions();},
                'First Question': function (e) {testAdmin.goToFirstQuestion();},
                'Previous Question': function (e) {testAdmin.previousQuestion();},
                'Previous Unanswered Question': function (e) {testAdmin.previousUnansweredQuestion();},
                'Previous Marked Question': function (e) {testAdmin.previousMarkedQuestion();},
                'Next Marked Question': function (e) {testAdmin.nextMarkedQuestion();},
                'Next Unanswered Question': function (e) {testAdmin.nextUnansweredQuestion();},
                'Next Question': function (e) {testAdmin.nextQuestion();},
                'Last Question': function (e) {testAdmin.goToLastQuestion();},
            },
            'keydown': {
                'Scroll Up': function (e) {smoothScrollBy(-scrollSpeed);},
                'Scroll Down': function (e) {smoothScrollBy(scrollSpeed);},
            }
        },
        'Review': {
            'keyup': {},
            'keydown': {}
        }
    };
    
    const mappingDefaults = {
        'Setup': {
            'keyup': {
                'Keyboard Options': KEYS.ESCAPE
            }
        },
        'Testing': {
            'keyup': {
                'Keyboard Options': KEYS.ESCAPE,
                'First Question': KEYS.HOME,
                'Previous Question': KEYS.ARROW_LEFT,
                'Previous Unanswered Question': KEYS.BACKSPACE,
                'Previous Marked Question': KEYS.COMMA,
                'Mark for Review': KEYS.ARROW_UP,
                'Next Marked Question': KEYS.PERIOD,
                'Next Unanswered Question': KEYS.SPACE,
                'Next Question': KEYS.ARROW_RIGHT,
                'Last Question': KEYS.END,
                'Submit Test': KEYS.ENTER,
                'Answer 1': KEYS.ONE,
                'Answer 2': KEYS.TWO,
                'Answer 3': KEYS.THREE,
                'Answer 4': KEYS.FOUR,
                'Answer 5': KEYS.FIVE,
                'Answer 6': KEYS.SIX,
                'Answer 7': KEYS.SEVEN,
                'Answer 8': KEYS.EIGHT,
                'Answer 9': KEYS.NINE,
                'Answer 10': KEYS.ZERO,
            }
        },
        'Results': {
            'keyup': {
                'Keyboard Options': KEYS.ESCAPE,
                'First Question': KEYS.HOME,
                'Previous Question': KEYS.ARROW_LEFT,
                'Previous Unanswered Question': KEYS.BACKSPACE,
                'Previous Marked Question': KEYS.COMMA,
                'Next Marked Question': KEYS.PERIOD,
                'Next Unanswered Question': KEYS.SPACE,
                'Next Question': KEYS.ARROW_RIGHT,
                'Last Question': KEYS.END,
            },
            'keydown': {
                'Scroll Up': KEYS.ARROW_UP,
                'Scroll Down': KEYS.ARROW_DOWN,
            }
        }
    };

    const returnFromSetup = function (){
        mode = oldMode;
        oldMode = KEYBOARD_MODES.KEYBAORD_SETUP;
        returnFromSetupAction();
    };

    const loadDefaultMappings = function (){
        loadIn(mapping, mappingDefaults);
    };

    const loadIn = (intoObj, fromObj) => {
        for (const key in fromObj){
            if (typeof fromObj[key] !== 'object' || fromObj[key] === null){
                intoObj[key] = fromObj[key];
            }
            else{
                intoObj[key] = {};
                loadIn(intoObj[key], fromObj[key]);
            }
        }
    };

    loadDefaultMappings();

    const getEvent = function (map, keyCode){
        for (const event in map){
            if (map[event].indexOf(keyCode) > -1){
                return event;
            }
        }
        return null;
    };

    const setDefaultsFromInterface = function (){
        loadDefaultMappings();
        if (mode === KEYBOARD_MODES.KEYBAORD_SETUP){
            returnFromSetup();
        }
    };

    const acceptSettings = function () {
        const newMapping = {};
        for (const keyboardMode in remapper){
            newMapping[keyboardMode] = {};
            for (const eventType in remapper[keyboardMode]){
                newMapping[keyboardMode][eventType] = {};
                const keysUsed = [];
                for (const command in remapper[keyboardMode][eventType]){
                    const selection = remapper[keyboardMode][eventType][command].getSelected();
                    if (keysUsed.indexOf(selection) < 0){
                        keysUsed.push(selection);
                        newMapping[keyboardMode][eventType][command] = selection;
                    }
                    else {
                        userAlert('Cannot use the same key twice. Check your selections.');
                        //TODO: highlight the offender(s)?
                        return false;
                    }
                }
            }
        }
        loadIn(mapping, newMapping);
        returnFromSetup();
    };

    this.showKeyboardSettings = function (returnAction){
        window.scrollTo(0, 0);
        returnFromSetupAction = returnAction;
        oldMode = mode;
        mode = KEYBOARD_MODES.KEYBAORD_SETUP;
        remapper = {};
        const container = createElement('div');
        for (const keyboardMode in mapping){
            remapper[keyboardMode] = {};
            const fieldset = makeFieldset(keyboardMode);
            let count = 0;
            for (const eventType in mapping[keyboardMode]) {
                if (count > 0){
                    fieldset.appendChild(createElement('hr'));
                }
                count++;
                remapper[keyboardMode][eventType] = {};
                for (const command in mapping[keyboardMode][eventType]){
                    const currentSelection = mapping[keyboardMode][eventType][command];
                    const options = {};
                    for (const name in KEYS){
                        if (EXCEPTIONS.indexOf(KEYS[name]) < 0){
                            options[name] = {
                                'value': KEYS[name]
                            };
                            if (KEYS[name] === currentSelection){
                                options[name]['selected'] = true;
                            }
                        }
                    }
                    remapper[keyboardMode][eventType][command] = new DropDownMenuSelector(command, options);
                    fieldset.appendChild(remapper[keyboardMode][eventType][command].render());
                }
            }
            container.appendChild(fieldset);
        }
        const buttons = [
            makeButtonGroup([
                inputButtonData('Cancel', () => returnFromSetup()),
                inputButtonData('Restore Defaults', () => setDefaultsFromInterface()),
            ]),
            bigButtonData('Accept Changes', () => acceptSettings()),
        ];
        container.appendChild(makeButtonBar(buttons));
        return container;
    };

    this.setMode = function (newMode){
        mode = newMode;
    };

    this.handle = function (e){
        e = e || event;
        const keyCode = e.keyCode.toString(10);
        if (EXCEPTIONS.indexOf(keyCode) > -1){
            return false;
        }
        e.preventDefault();
        const eventType = e.type;
        const popups = document.getElementsByClassName('popup_class');
        if (popups.length > 0){
            if (eventType === 'keyup' && (keyCode === KEYS.ENTER || keyCode === KEYS.ESCAPE)){
                document.children[0].removeChild(popups[popups.length - 1]);
            }
            return true;
        }
        if (mode === KEYBOARD_MODES.KEYBAORD_SETUP && mapping[oldMode] && mapping[oldMode][eventType]){
            const mappedEvent = getEvent(mapping[oldMode][eventType], keyCode);
            if (mappedEvent === 'Keyboard Options') {
                returnFromSetup();
                return true;
            }
        }
        if (mapping[mode] && mapping[mode][eventType]){
            const mappedEvent = getEvent(mapping[mode][eventType], keyCode);
            if (mappedEvent && handlers[mode] && handlers[mode][eventType] && handlers[mode][eventType][mappedEvent]){
                handlers[mode][eventType][mappedEvent](e);
                return true;
            }
        }
    };
}

const KEYBOARD_MODES = {
    KEYBAORD_SETUP: '',
    SETUP: 'Setup',
    TESTING: 'Testing',
    RESULTS: 'Results',
    REVIEW: 'Review',
};

let keyboardHandler = new KeyboardInputHandler(KEYBOARD_MODES.SETUP);
const keyboard = e => keyboardHandler.handle(e);

window.onload = function () {
    if (document.addEventListener) { document.addEventListener('keyup', keyboard, true); document.addEventListener('keydown', keyboard, true); }
    else if (document.attachEvent) { document.attachEvent('onkeyup', keyboard, true); document.attachEvent('onkeydown', keyboard, true); }
    else { document.keyup = keyboard; document.keydown = keyboard; }

    window.onscroll = () => keyboardHandler.scrollEvent();
}