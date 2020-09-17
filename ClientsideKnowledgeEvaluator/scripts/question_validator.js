function QuestionValidator() {
    let validationResults = {};

    const QUESTION_VALIDATION_RULES = {
        'Question text cannot be blank.': (q) => {
            return q['question'] && q['question'].length > 0;
        },
        'Cannot have blank answer option text.': (q) => {
            for (const n in q['options']){
                const opt = q['options'][n];
                if (!opt || opt === '' || opt.length < 1){
                    return false;
                }
            }
            return true;
        },
        'Question must have at least one answer option for the user.': (q) => {
            const keys = Object.keys(q['options']);
            return keys.length > 0;
        },
        'Must have at least one answer marked as correct and all correct answers must be one of the options.': (q) => {
            if (q['answers'].length < 1){
                return false;
            }
            for (let i = 0; i < q['answers'].length; i++){
                if (!q['options'][q['answers'][i]]){
                    return false;
                }
            }
            return true;
        },
        'Image error. Please make sure images are properly inserted into the question with the ID between curly braces: {image1}.': (q) => {
            if (q['images']) {
                for (const id in q['images']){
                    if (q['question'].indexOf(`{${id}}`) < 0){
                        return false;
                    }
                }
            }
            return true;
        },
        'Image error. Please ensure any referenced image IDs in the question are also found in the image list.': (q) => {
            const expectedImages = q['question'].match(/\{(.*?)\}/g);
            if (!expectedImages){
                return true;
            }
            if (expectedImages.length > 0 && !q['images']){
                return false;
            }
            for (let i = 0; i < expectedImages.length; i++){
                const id = expectedImages[i].replace(/[\{\}]/g, '');
                if (!q['images'][id]){
                    return false;
                }
            }
            return true;
        },
    };

    const validate = function (question, id) {
        for (const desc in QUESTION_VALIDATION_RULES){
            if (!QUESTION_VALIDATION_RULES[desc](question)){
                addError(desc, id);
            }
        }
    };

    const addError = function (error, id){
        if (!validationResults[id]){
            validationResults[id] = [];
        }
        validationResults[id].push(error);
    };

    const validatePool = function (questionPool, section){
        const s = section + '.' ?? '';
        for (const n in questionPool){
            validate(questionPool[n], s + n);
        }
    };

    this.validateQuestion = function (question) {
        validationResults = {};
        validate(question, 'Question');
    };

    this.validateQuestionCollection = function (questionPool) {
        validationResults = {};
        validatePool(questionPool);
    };

    this.validateTestSections = function (sections){
        validationResults = {};
        for (const n in sections){
            validatePool(sections[n]['question_pool'], n);
        }
    };

    this.getNumberOfErrors = function () {
        let errorCount = 0;
        for (const n in validationResults){
            errorCount += validationResults[n].length;
        }
        return errorCount;
    };

    this.getValidationResults = function () {
        return validationResults;
    };

    this.getHTMLValidationResults = function(title) {
        const container = makeFieldset(title ?? 'Validation Results');
        let errors = 0;
        for (const n in validationResults){
            errors++;
            const questionData = makeFieldset(n);
            const errorPool = createElement('ul');
            for (let i = 0; i < validationResults[n].length; i++){
                errorPool.appendChild(createElement('li', {}, validationResults[n][i]));
            }
            questionData.appendChild(errorPool);
            container.appendChild(questionData);
        }
        if (errors < 1){
            container.appendChild(createElement('h4', {}, 'No errors.'));
        }
        return container;
    };
}