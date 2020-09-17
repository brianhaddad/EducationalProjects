function SectionHandler(secName, internalObject, newSectionGenerator, elementNameText) {
    const sectionName = secName;
    const elemName = elementNameText;
    const InternalObject = internalObject;
    const blankSection = newSectionGenerator;
    const mainSectionContainer = createElement('div');
    let currentSectionIndex = 0;
    let sectionEntities = {};
    let sectionKeys = [];

    const setupSections = function (){
        const data = editor.getDataByPath(sectionName);
        sectionEntities = {};
        sectionKeys = Object.keys(data);
        for (const n in data){
            sectionEntities[n] = new InternalObject(data[n], sectionName + '.' + n);
        }
        if (currentSectionIndex >= sectionKeys.length){
            currentSectionIndex = sectionKeys.length - 1;
        }
    };

    const completeSectionsReset = function (){
        setupSections();
        renderSectionElement();
    };

    setupSections();

    const SECTION_NAV_BUTTON_DATA = {
        FIRST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<<',
            'action': () => {sectionNav(0, 0);},
            'tip': 'Go to first.'
        },
        PREVIOUS: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '<',
            'action': () => {sectionNav(-1);},
            'tip': 'Go to previous.'
        },
        NEXT: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '>',
            'action': () => {sectionNav(1);},
            'tip': 'Go to next.'
        },
        LAST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '>>',
            'action': () => {sectionNav(0, 1);},
            'tip': 'Go to last.'
        },
        ADD: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '+',
            'action': () => {newSection();},
            'tip': 'Add new.'
        },
        REMOVE: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '-',
            'action': () => {removeSection();},
            'tip': 'Delete current.'
        },
        MOVE_TO_FIRST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '|<<|',
            'action': () => {moveSection(0, 0);},
            'tip': 'Swap with first position.'
        },
        MOVE_TO_PREVIOUS: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '|<|',
            'action': () => {moveSection(-1);},
            'tip': 'Swap with previous position.'
        },
        MOVE_TO_NEXT: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '|>|',
            'action': () => {moveSection(1);},
            'tip': 'Swap with next position.'
        },
        MOVE_TO_LAST: {
            'type': BUTTON_TYPES.INPUT_TYPE_BUTTON,
            'text': '|>>|',
            'action': () => {moveSection(0, 1);},
            'tip': 'Swap with last position.'
        },
    };
    const navButtons = [];
    navButtons.push(createElement('h5', {}, elemName + ' Controls:'));
    for (const n in SECTION_NAV_BUTTON_DATA){
        navButtons.push(SECTION_NAV_BUTTON_DATA[n]);
    }
    const navBar = new ClickyButtonSet(navButtons);

    const newSection = function (){
        if (currentSectionIndex < sectionKeys.length - 1){
            shiftAll(currentSectionIndex, 1);
        }
        currentSectionIndex++;
        const newSection = blankSection();
        const newSectionName = (currentSectionIndex + 1).toString();
        editor.updateByPath(sectionName + '.' + newSectionName, newSection);
        completeSectionsReset();
    };

    const removeSection = function (){
        if (sectionKeys.length > 1 && confirm(`Are you sure you want to remove this ${elemName.toLowerCase()}? All of its data will be lost.`)){
            const removeSectionKey = sectionKeys[currentSectionIndex];
            editor.deleteDataByPath(sectionName + '.' + removeSectionKey);
            if (currentSectionIndex < sectionKeys.length -1){
                shiftAll(currentSectionIndex + 1, -1);
            }
            completeSectionsReset();
        }
    };

    const shiftAll = function (startIndex, delta){
        const applyAt = function (index){
            const oldKey = sectionKeys[index];
            const newKey = (parseInt(oldKey) + delta).toString();
            editor.updateByPath(sectionName + '.' + newKey, deepCopy(editor.getDataByPath(sectionName + '.' + oldKey)));
            editor.deleteDataByPath(sectionName + '.' + oldKey);
        };
        if (delta < 0){
            for (let i = startIndex; i < sectionKeys.length; i++){
                applyAt(i);
            }
        }
        else {
            for (let i = sectionKeys.length - 1; i > startIndex; i--){
                applyAt(i);
            }
        }
    };

    const moveSection = function (delta, absolute){
        const newSectionIndex = getCleanSectionIndex(delta, absolute);
        if (newSectionIndex !== currentSectionIndex){
            const newSectionKey = sectionKeys[newSectionIndex];
            const oldSectionKey = sectionKeys[currentSectionIndex];

            const tempData = deepCopy(editor.getDataByPath(sectionName + '.' + newSectionKey));
            editor.updateByPath(sectionName + '.' + newSectionKey, deepCopy(editor.getDataByPath(sectionName + '.' + oldSectionKey)));
            editor.updateByPath(sectionName + '.' + oldSectionKey, tempData);

            currentSectionIndex = newSectionIndex;
            completeSectionsReset();
        }
    };

    const sectionNav = function (delta, absolute){
        currentSectionIndex = getCleanSectionIndex(delta, absolute);
        renderSectionElement();
    };

    const getCleanSectionIndex = function (delta, absolute){
        let newSectionIndex = currentSectionIndex + delta;
        if (isNumber(absolute)){
            newSectionIndex = (absolute === 0) ? absolute : sectionKeys.length - 1;
        }
        if (newSectionIndex < 0){
            newSectionIndex = 0;
        }
        if (newSectionIndex > sectionKeys.length - 1){
            newSectionIndex = sectionKeys.length - 1;
        }
        return newSectionIndex;
    };

    const renderSectionElement = function (){
        mainSectionContainer.innerHTML = '';
        mainSectionContainer.appendChild(navBar.render());
        const sectionFieldset = makeFieldset(elemName + ': ' + sectionKeys[currentSectionIndex]);
        sectionFieldset.appendChild(sectionEntities[sectionKeys[currentSectionIndex]].render());
        mainSectionContainer.appendChild(sectionFieldset);
        evaluateNavBar();
    };

    const evaluateNavBar = function (){
        const disable = function (name){
            navBar.disable(SECTION_NAV_BUTTON_DATA[name]['text']);
        };
        const enable = function (name){
            navBar.enable(SECTION_NAV_BUTTON_DATA[name]['text']);
        };
        for (const n in SECTION_NAV_BUTTON_DATA){
            switch (SECTION_NAV_BUTTON_DATA[n]['text']){
                case SECTION_NAV_BUTTON_DATA.FIRST['text']:
                case SECTION_NAV_BUTTON_DATA.PREVIOUS['text']:
                case SECTION_NAV_BUTTON_DATA.MOVE_TO_FIRST['text']:
                case SECTION_NAV_BUTTON_DATA.MOVE_TO_PREVIOUS['text']:
                    if (currentSectionIndex === 0){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
                
                case SECTION_NAV_BUTTON_DATA.LAST['text']:
                case SECTION_NAV_BUTTON_DATA.NEXT['text']:
                case SECTION_NAV_BUTTON_DATA.MOVE_TO_LAST['text']:
                case SECTION_NAV_BUTTON_DATA.MOVE_TO_NEXT['text']:
                    if (currentSectionIndex >= sectionKeys.length - 1){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;

                case SECTION_NAV_BUTTON_DATA.REMOVE['text']:
                    if (sectionKeys.length <= 1){
                        disable(n);
                    }
                    else {
                        enable(n);
                    }
                    break;
            }
        }
    };

    this.render = function (){
        renderSectionElement();
        return mainSectionContainer;
    };
}

function Section(incomingData, incomingPath){
    const path = incomingPath;
    const data = deepCopy(incomingData);
    const nameObj = new ValidatedTextInput('Test Section Name', null, (val) => editor.updateByPath(path + '.name', val));
    nameObj.setValue(data['name']);

    const questionPool = new SectionHandler(path + '.question_pool', Question, () => editor.getBlankQuestion(), 'Question');

    const mainObject = createElement('div');
    mainObject.appendChild(nameObj.render());
    mainObject.appendChild(questionPool.render());

    this.render = function (){
        return mainObject;
    };
}

function Question(incomingData, incomingPath){
    const path = incomingPath;
    const data = deepCopy(incomingData);
    const questionText = new TextAreaInput('Test Question', (val) => editor.updateByPath(path + '.question', val));
    questionText.setValue(data['question']);
    const questionExplanation = new TextAreaInput('Question Explanation', (val) => editor.updateByPath(path + '.explanation', val));
    questionExplanation.setValue(data['explanation']);
    const questionSrc = new ValidatedTextInput('Answer Source', null, (val) => editor.updateByPath(path + '.source', val));
    questionSrc.setValue(data['source']);
    
    const optionsCollectionSet = new AddRemoveCollectionSet(
        'Answer Options',
        path + '.options',
        AnswerOption,
        'Answer',
        (p, v) => {editor.updateByPath(p, v);},
        true,
        path + '.answers'
        );
    optionsCollectionSet.setValue(data['options']);
    const imagesCollectionSet = new AddRemoveCollectionSet(
        'Images',
        path + '.images',
        ImageOption,
        'Image',
        (p, v) => {editor.updateByPath(p, v);}
        );
    imagesCollectionSet.setValue(data['images']);

    this.render = function (){
        const container = createElement('div');
        container.appendChild(questionText.render());
        
        container.appendChild(optionsCollectionSet.render());
        container.appendChild(imagesCollectionSet.render());

        container.appendChild(questionExplanation.render());
        container.appendChild(questionSrc.render());
        return container;
    };
}

function AddRemoveCollectionSet(displayName, incomingPath, newItemConstructor, itemName, onchangeCallback, shouldShowChecklist, checklistUpdatePath){
    const path = incomingPath;
    const itemConstructor = newItemConstructor;
    const showChecklist = shouldShowChecklist ?? false;
    const checklistPath = checklistUpdatePath;
    const callback = onchangeCallback;
    const collection = [];
    const container = makeFieldset(displayName);
    const collectionContainer = createElement('div');
    const checklistContainer = createElement('div');
    let checklist = {};
    container.appendChild(collectionContainer);
    if (showChecklist){
        container.appendChild(checklistContainer);
    }
    container.appendChild(makeButtonBar([
        inputButtonData('Remove ' + itemName, () => {removeElement()}),
        bigButtonData('Add ' + itemName, () => {addElement()}),
    ]));

    const executeCallback = function (){
        if (callback){
            callback(path, collection.reduce((acc, val) => Object.assign(acc, val.getValue()), {}));
        }
    };

    const updateChecklist = function (){
        if (showChecklist){
            const isSelected = (n) => previouslySelected.indexOf(n) > -1;
            const makeOpt = function (id) {
                const obj = {};
                obj[id] = {
                    'displayName': id,
                    'checked': isSelected(id),
                };
                return obj;
            };
            const previouslySelected = editor.getDataByPath(checklistPath);
            const options = collection.reduce((acc, val) => Object.assign(acc, makeOpt(val.getId())), {});
            checklist = new CheckBoxSet(options, () => {checklistCallback();});
            checklistContainer.innerHTML = '';
            checklistContainer.appendChild(createElement('h5', {}, 'Answer Key:'));
            checklistContainer.appendChild(checklist.render());
            checklistCallback();
        }
    };

    const checklistCallback = function (){
        if (callback){
            setTimeout(() => callback(checklistPath, checklist.getSelected()), 100);
        }
    };
    
    const addElement = function (data, name){
        const newItem = new itemConstructor(path, data, collection.length, callback, name);
        collection.push(newItem);
        collectionContainer.appendChild(newItem.render());
        if (!data){
            executeCallback();
        }
        updateChecklist();
    };

    const removeElement = function (){
        if (collection.length < 1){
            return false;
        }
        const removed = collection.pop();
        collectionContainer.removeChild(removed.render());
        executeCallback();
        updateChecklist();
    };

    this.setValue = function (incomingData){
        for (const n in incomingData){
            addElement(incomingData[n], n);
        }
    };

    this.render = function (){
        return container;
    };
}

function AnswerOption(incomingPath, incomingData, num, updateFunction){
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const id = num < alphabet.length ? alphabet.charAt(num) : num.toString();
    const path = incomingPath + '.' + id;
    const data = deepCopy(incomingData ?? '');
    const update = updateFunction;
    const container = createElement('div');
    const input = new TextAreaInput('Answer ' + id, () => {update(path, input.getValue())}, runValidation([VALIDATION_RULES.QUESTION_ANSWER_OPTION]));
    input.setValue(data);
    container.appendChild(input.render());
    this.getId = function (){
        return id;
    };
    this.getValue = function (){
        const obj = {};
        obj[id] = '';
        if (input.isValid()){
            obj[id] = input.getValue();
        }
        return obj;
    };
    this.render = function (){
        return container;
    };
}

function ImageOption(incomingPath, incomingData, num, updateFunction, incomingId){
    const id = incomingId ?? 'image' + (num + 1).toString();
    const path = incomingPath + '.' + id;
    const data = deepCopy(incomingData ?? '');
    const update = updateFunction;
    const container = createElement('div');
    const input = new ValidatedTextInput(id, runValidation([VALIDATION_RULES.FILENAME]),() => {update(path, input.getValue())});
    input.setValue(data);
    container.appendChild(input.render());
    this.getId = function (){
        return id;
    };
    this.getValue = function (){
        const obj = {};
        obj[id] = '';
        if (input.isValid()){
            obj[id] = input.getValue();
        }
        return obj;
    };
    this.render = function (){
        return container;
    };
}