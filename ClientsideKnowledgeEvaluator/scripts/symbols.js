const BUTTON_TYPES = {
    BIG_BUTTON: Symbol('Big Button'),
    INPUT_TYPE_BUTTON: Symbol('Input Type Button'),
};

const TEST_OPTIONS = {
    SHOW_SOURCE: Symbol('Show Source'),
    RANDOMIZE_QUESTIONS: Symbol('Randomize Questions'),
    RANDOMIZE_ANSWERS: Symbol('Randomize Answers'),
};

const NON_CHECKBOX_TEST_OPTIONS = {
    MAX_QUESTIONS: Symbol('Max Questions'),
    TEST_MODE: Symbol('Test Mode'),
};

const RESULTS_QUESTION_DISPLAY_MODE = {
    ALL: Symbol('All'),
    INCORRECT: Symbol('Incorrect'),
};

const LOADER_STEPS = {
    INITIALIZATION: Symbol('Initialization'),
    MULTI_FILE_SELECTION: Symbol('Multiple File Selection'),
    SINGLE_FILE_SELECTION: Symbol('Single File Selection'),
    TEST_FILE_LOAD: Symbol('File Load & Test Options'),
    EDIT_FILE_LOAD: Symbol('Edit File Load'),
    TEST_START: Symbol('Test Start'),
};

const LOADER_MODES = {
    TEST: Symbol('Test'),
    EDITOR: Symbol('Editor'),
};