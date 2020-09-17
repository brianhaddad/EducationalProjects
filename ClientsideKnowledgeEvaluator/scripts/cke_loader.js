function CKELoader(containerId, mode) {
    const loadMode = mode;
    // NOTE: for future upgrades some of the properties we're accessing will be stored here with comments.
    // In the future if any of these change we can hopefully just adjust their names here.
    // If a simple name change doesn't do the trick, hopefully it won't be too difficult to refactor the code.

    // PATH PROPERTY:
    // This is used to access the relative path based on the original directory selected by the user.
    // This is subsequently split by the forward slash '/' and each folder name is extracted from there.
    const PATH_PROPERTY = 'webkitRelativePath';

    // NAME PROPERTY:
    // This one is unlikely to change, but I've included it here just in case. :)
    const NAME_PROPERTY = 'name';

    // The items array pulled from the file picker for future loading.
    let items = [];
    let itemSelector = {};
    let sectionSelectors = {};

    // This is the container for all of the loaded test data.
    let allTestData = {};

    // This is the testing options block:
    let testOptionsBlock = {};

    // The main container is where we populate all of our interface stuff.
    const mainContainer = document.getElementById(containerId);

    let picker = {};
    let currentStep = LOADER_STEPS.INITIALIZATION;
    let fixedImagePaths = false;

    // Special Dropdowns
    let testModeDropdown = {};
    let maxQuestionsDropdown = {};

    const selectableMaxQuestions = {
        'All': { 'value': 0, 'selected': true },
        '10': { 'value': 10 },
        '25': { 'value': 25 },
        '50': { 'value': 50 },
        '75': { 'value': 75 },
        '100': { 'value': 100 },
        '200': { 'value': 200 },
    };

    const resetMainContainer = function (){
        mainContainer.innerHTML = '';
    };

    this.display = (nextStep) => internalLoaderDisplay(nextStep);

    const internalLoaderDisplay = function (nextStep){
        switch (nextStep){
            case LOADER_STEPS.INITIALIZATION:
                init();
                break;

            case LOADER_STEPS.MULTI_FILE_SELECTION:
                //TODO: What conditions should be met before executing?
                selectFiles();
                break;

            case LOADER_STEPS.SINGLE_FILE_SELECTION:
                //TODO: What conditions should be met before executing?
                selectFiles(true);
                break;

            case LOADER_STEPS.TEST_FILE_LOAD:
                //TODO: What conditions should be met before executing?
                loadFiles();
                break;

            case LOADER_STEPS.EDIT_FILE_LOAD:
                //TODO: What conditions should be met before executing?
                editFile();
                break;

            case LOADER_STEPS.TEST_START:
                //TODO: What conditions should be met before executing?
                startTests();
                break;

            default:
                userAlert('Something went wrong. No behavior has been defined for that step.');
                return false;
        }
        //if we survived this far, we can set the current step to the next step:
        currentStep = nextStep;
        return true;
    };

    const init = function (){
        fixedImagePaths = false;
        items = [];
        itemSelector = {};
        sectionSelectors = {};
        allTestData = {};
        resetMainContainer();
        picker = createElement('input', {
            'type': 'file',
            'accept': '.json',
            'webkitdirectory': true,
        });
        switch (loadMode){
            case LOADER_MODES.TEST:
                picker.onchange = () => {internalLoaderDisplay(LOADER_STEPS.MULTI_FILE_SELECTION);};
                break;
            case LOADER_MODES.EDITOR:
                picker.onchange = () => {internalLoaderDisplay(LOADER_STEPS.SINGLE_FILE_SELECTION);};
                break;
        }
        mainContainer.appendChild(picker);
        if (loadMode === LOADER_MODES.EDITOR){
            mainContainer.appendChild(makeInputButtonWithJavascriptAction('Reset', () => reset()));
        }
    };

    const selectFiles = function(singleFile){
        fixedImagePaths = false;
        items = Array.from(picker.files);
        resetMainContainer();
        const options = {};
        for (const item of items){
            if (isJsonFile(item[NAME_PROPERTY])){
                options[item[NAME_PROPERTY]] = {
                    'displayName': `Load ${item[NAME_PROPERTY]}`,
                    'checked': false
                };
            }
        }
        const container = makeFieldset(`Load which JSON file${(singleFile ? '' : 's')}?`);
        itemSelector = singleFile ? new RadioButtonSet(options) : new CheckBoxSet(options);
        container.appendChild(itemSelector.render());
        const buttons = [
            inputButtonData('Reset', () => {reset();})
        ];
        switch (loadMode){
            case LOADER_MODES.TEST:
                buttons.push(bigButtonData('Load These Files', () => {internalLoaderDisplay(LOADER_STEPS.TEST_FILE_LOAD);}));
                break;

            case LOADER_MODES.EDITOR:
                buttons.push(bigButtonData('Edit This File', () => {internalLoaderDisplay(LOADER_STEPS.EDIT_FILE_LOAD);}));
                break;
        }
        container.appendChild(makeButtonBar(buttons));
        mainContainer.appendChild(container);
    };

    const editFile = async function (){
        const selection = itemSelector.getSelected();
        if (selection.length < 1){
            userAlert('You must select a JSON file to load.');
            return false;
        }
        const loadTheseJSONs = items.filter(n => selection.indexOf(n[NAME_PROPERTY]) > -1);
        const files = await readFileArray(loadTheseJSONs);
        files.map(n => parseJSON(n)).forEach(n => Object.assign(allTestData, n));
        const fileName = selection[0];
        editor = new CKEEditor(mainContainer.id);
        editor.beginEditing(fileName, allTestData[fileName]);
    };

    const loadFiles = async function (){
        fixedImagePaths = false;
        const selections = itemSelector.getSelected();
        if (selections.length < 1){
            userAlert('You must select at least one JSON file to load.');
            return false;
        }
        const loadTheseJSONs = items.filter(n => selections.indexOf(n[NAME_PROPERTY]) > -1);
        const files = await readFileArray(loadTheseJSONs);
        files.map(n => parseJSON(n)).forEach(n => Object.assign(allTestData, n));

        const validator = new QuestionValidator();
        const errors = [];

        sectionSelectors = {};
        const container = makeFieldset('Work on which sections?');
        for (const filename in allTestData){
            const data = allTestData[filename];
            validator.validateTestSections(data['sections']);
            if (validator.getNumberOfErrors() > 0){
                if (errors.length < 1){
                    errors.push(createElement('h1', {}, 'File Errors'));
                }
                errors.push(validator.getHTMLValidationResults(filename));
            }
            const errorData = validator.getValidationResults();
            const errorSections = Object.keys(errorData).map(n => n.split('.')[0]);

            const test = makeFieldset(data['name'] + ' Sections');
            const options = {};
            for (const n in data['sections']){
                const containsErrors = errorSections.indexOf(n) > -1;
                const numQuestions = Object.keys(data['sections'][n]['question_pool']).length;
                options[n] = {
                    'displayName': data['sections'][n]['name'] + ': ' + numQuestions + ' question' + ((numQuestions === 1) ? '' : 's')
                };
                if (!containsErrors){
                    options[n]['checked'] = true;
                }
                else {
                    options[n]['displayName'] += ' (contains errors)';
                }
            }
            sectionSelectors[filename] = new CheckBoxSet(options);
            test.appendChild(sectionSelectors[filename].render());
            container.appendChild(test);
        }
        if (errors.length > 0){
            makeOKPopup(errors);
        }
        container.appendChild(renderTestOptionsBlock());
        const buttons = [
            inputButtonData('Reset', () => {reset();}),
            bigButtonData('Begin Testing', () => {internalLoaderDisplay(LOADER_STEPS.TEST_START);}),
        ];
        container.appendChild(makeButtonBar(buttons));
        resetMainContainer();
        mainContainer.appendChild(container);
    };

    const renderTestOptionsBlock = function (){
        const selectableTestModes = {
            'Normal': { 'value': TEST_MODES.NORMAL, 'selected': true },
            'Hardcore': { 'value': TEST_MODES.HARDCORE },
            'Review': { 'value': TEST_MODES.REVIEW }
        };
        const container = makeFieldset('Testing Options');
        const options = {};
        for (const n in TEST_OPTIONS){
            switch (TEST_OPTIONS[n]){
                case TEST_OPTIONS.SHOW_SOURCE:
                    options[n] = {
                        'displayName': 'Show Source (source information will show while testing)',
                        'checked': true
                    };
                    break;
                case TEST_OPTIONS.RANDOMIZE_QUESTIONS:
                    options[n] = {
                        'displayName': 'Randomize Questions (question order will be shuffled)',
                        'checked': true
                    };
                    break;
                case TEST_OPTIONS.RANDOMIZE_ANSWERS:
                    options[n] = {
                        'displayName': 'Randomize Answers (answer ordering will be different each time)',
                        'checked': true
                    };
                    break;
            }
        }
        testOptionsBlock = new CheckBoxSet(options);
        container.appendChild(testOptionsBlock.render());

        testModeDropdown = new DropDownMenuSelector('Test Mode', selectableTestModes);
        container.appendChild(testModeDropdown.render());

        maxQuestionsDropdown = new DropDownMenuSelector('Max Questions', selectableMaxQuestions);
        container.appendChild(maxQuestionsDropdown.render());

        return container;
    };

    const parseJSON = function (file){
        const obj = {};
        obj[file['filename']] = JSON.parse(file['content']);
        return obj;
    };

    const startTests = function (){
        const questions = [];
        for (const filename in sectionSelectors){
            const selections = sectionSelectors[filename].getSelected();
            if (selections.length > 0){
                const testData = allTestData[filename];
                const mainMergeIn = {
                    'cert': testData['cert'],
                    'testName': testData['name']
                };
                for (const selection of selections){
                    const section = testData['sections'][selection];
                    const sectionMergeIn = { 'sectionName': section['name'] };
                    const sectionQuestions = section['question_pool'];
                    for (const n in sectionQuestions){
                        if (sectionQuestions[n].hasOwnProperty('images') && !fixedImagePaths){
                            for (const imgAlias in sectionQuestions[n]['images']){
                                //TODO: could verify that the images are referenced properly by checking for the alias within the question text
                                const item = items.find(itm => itm[NAME_PROPERTY] === filename);
                                sectionQuestions[n]['images'][imgAlias] = item[PATH_PROPERTY].replace(item[NAME_PROPERTY], 'images/') + sectionQuestions[n]['images'][imgAlias];
                            }
                        }
                        questions.push(Object.assign(sectionQuestions[n], mainMergeIn, sectionMergeIn, { 'questionNumber': n }));
                    }
                }
            }
        }
        if (questions.length < 1){
            userAlert('No test sections selected. Please select at least one valid test section.');
            return false;
        }
        const testOptions = testOptionsBlock.getSelected();
        testOptions[NON_CHECKBOX_TEST_OPTIONS.TEST_MODE] = testModeDropdown.getSelected();
        testOptions[NON_CHECKBOX_TEST_OPTIONS.MAX_QUESTIONS] = maxQuestionsDropdown.getSelected();
        fixedImagePaths = true;
        testAdmin = new TestAdmin();
        testAdmin.init(mainContainer.id, deepCopy(questions), testOptions);
    };

    this.showKeyboardOptions = function (){
        resetMainContainer();
        mainContainer.appendChild(keyboardHandler.showKeyboardSettings(() => internalLoaderDisplay(currentStep)));
    };
    
    const isJsonFile = (fn) => fileNameEndsIn(fn, '.json');

    //This is based off things I learned at the following links:
    //https://stackoverflow.com/questions/44438560/read-json-file-data-on-client-side-with-pure-javascript
    //https://blog.shovonhasan.com/using-promises-with-filereader/
    const readFileArray = async function (fileArray) {
        const readFileAsText = (inputFile) => {
            const temporaryFileReader = new FileReader();
            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };
                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result);
                };
                temporaryFileReader.readAsText(inputFile, 'UTF-8');
            });
        };
        let files = [];
        for (let i=0; i<fileArray.length; i++) {
            try {
                let file = await readFileAsText(fileArray[i]);
                files.push({'filename': fileArray[i].name, 'content': file});
            } catch (e) {
                console.warn(e.message)
            }
        }
        return files;
    };
}