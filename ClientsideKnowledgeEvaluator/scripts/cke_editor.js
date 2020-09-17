function CKEEditor(mainId) {
    const mainContainer = document.getElementById(mainId);
    const objHelper = new ObjectHelper();
    const validator = new QuestionValidator();
    let mainObj = {};
    let errorContainer = createElement('div');
    let outstandingErrors = 0;
    let fileName = '';

    let fileNameGetter = {};
    let entities = {};

    const topLevelEntityGenerator = {
        'name': function (data) {
            //TODO: do we want any validation for this?
            const obj = new ValidatedTextInput('Test Name', null, () => updateByEntity('name'));
            obj.setValue(data);
            return obj;
        },
        'cert': function (data) {
            //TODO: do we want any validation for this?
            const obj = new ValidatedTextInput('Certification', null, () => updateByEntity('cert'));
            obj.setValue(data);
            return obj;
        },
        'sections': function (data) {
            return new SectionHandler('sections', Section, () => deepCopy(blankSection), 'Section');
        },
    };

    const fileSavePopupMessages = [];
    fileSavePopupMessages.push(createElement('h1', {}, 'File Saved'));
    fileSavePopupMessages.push(createElement('p', {}, 'Your .json file has been downloaded. Please make sure you put it in the "sets" directory in an appropriately named subdirectory.'));
    fileSavePopupMessages.push(createElement('p', {}, 'If this file is meant to replace another file you will have to make sure you overwrite the old file with this new one. Be sure to keep a backup of the old file in case of errors.'));
    fileSavePopupMessages.push(createElement('p', {}, 'Finally, if you have saved this file multiple times you may end up with "filename (1).json" or "filename (2).json" etc. if you do not remove the old download each time you save. You can choose to either remove the download from the default download folder each time or you can simply remove the incrementation within the parenthesis from the filename before putting the file in the appropriate directory.'));
    const editorMainButtonBar = makeButtonBar([
        inputButtonData('Reset Application', () => {reset();}),
        inputButtonData('New File', () => {editor.startNewFile();}),
        inputButtonData('Load File', () => {
            if (isEmpty(mainObj) || confirm('Are you sure you want to lose all progress and load a new file?')){
                startLoader();
            }
        }),
        bigButtonData('Save', () => {
            if (outstandingErrors > 0 && !confirm(`Save with ${outstandingErrors} outstanding error` + (outstandingErrors === 1 ? '' : 's') + '?')){
                return false;
            }
            initiateDownload(fileName, mainObj);
            makeOKPopup(fileSavePopupMessages);
        }),
    ]);

    const exampleOption = {
        "a": ""
    };

    const blankQuestionWithoutImage = {
        "question": "",
        "options": exampleOption,
        "answers": [],
        "explanation": "",
        "source": ""
    };

    const blankSection = {
        "name": "",
        "question_pool": {
            "1": blankQuestionWithoutImage
        }
    };

    const blankFile = {
        "name": "",
        "cert": "",
        "sections": {
            "1": blankSection,
        },
    };

    this.getBlankQuestion = function () {
        return deepCopy(blankQuestionWithoutImage);
    };

    const updateByEntity = function (eName){
        if (eName === 'sections'){
            return false;
        }
        else {
            updateSection(eName, entities[eName].getValue());
        }
    };

    this.updateByPath = function (path, value){
        updateSection(path, value);
    };

    this.getDataByPath = function (path){
        return getSection(path);
    };

    this.deleteDataByPath = function (path){
        deleteSection(path);
    };

    this.beginEditing = function(filename, startingData){
        startEditing(filename, startingData);
    };

    this.startNewFile = function (){
        if (!isEmpty(mainObj) && !confirm('Are you sure you want to lose all progress and start a new file?')){
            return false;
        }
        fileNameGetter = new ValidatedTextInput('File Name', runValidation([VALIDATION_RULES.FILENAME]));
        resetMainContainer();
        mainContainer.appendChild(fileNameGetter.render());
        mainContainer.appendChild(makeOKCancelButtonBar(bigButtonData('OK', () => acceptFilename()), inputButtonData('Cancel', () => showLoadOrNew())));
    };

    const acceptFilename = function (){
        if (fileNameGetter.isValid()){
            let name = fileNameGetter.getValue();
            if (!fileNameEndsIn(name, '.json')){
                name += '.json';
            }
            startEditing(name, blankFile);
        }
        else {
            userAlert('Invalid filename. Check to ensure you are not using any invalid special characters or forbidden filenames.');
        }
    };

    const startEditing = function (filename, startingData){
        fileName = filename;
        mainObj = deepCopy(startingData);
        renderEditorInterface();
    };

    const renderEditorInterface = function (){
        resetMainContainer();
        mainContainer.appendChild(editorMainButtonBar);
        mainContainer.appendChild(createElement('h1', {}, fileName));
        for (const n in mainObj){
            entities[n] = topLevelEntityGenerator[n](mainObj[n]);
            mainContainer.appendChild(entities[n].render());
        }
        evaluateErrors();
        mainContainer.appendChild(errorContainer);
    };

    const resetMainContainer = function (){
        mainContainer.innerHTML = '';
    };

    const evaluateErrors = function (){
        errorContainer.innerHTML = '';
        validator.validateTestSections(mainObj['sections']);
        errorContainer.appendChild(validator.getHTMLValidationResults());
        outstandingErrors = validator.getNumberOfErrors();
    };

    const initiateDownload = function(fileName, obj){
        const json = JSON.stringify(obj, null, 4);
        const lines = json.split(/[\n\r]/g);
        const newLines = lines.map(n => n + '\n');
        const file = new File(newLines, fileName);
        const fileReader = new FileReader();
        fileReader.addEventListener('load', function (result) {
            const link = createElement('a', { 'href': result.currentTarget.result, 'download': fileName }, fileName);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        fileReader.readAsDataURL(file);
    };
    
    const updateSection = function (propPath, value) {
        mainObj = objHelper.updateSection(mainObj, propPath, value);
        evaluateErrors();
    };

    const getSection = function (propPath){
        return objHelper.getSection(mainObj, propPath);
    };

    const deleteSection = function (removePath){
        mainObj = objHelper.deleteSection(mainObj, removePath);
        evaluateErrors();
    };

    const isEmpty = function (obj){
        return objHelper.isEmpty(obj);
    };
}