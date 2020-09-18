function Budgeter(divId){
    const FREQUENCIES = {
        ANNUALLY: {'name': 'Annually', 'value': 1},
        QUARTERLY: {'name': 'Quarterly', 'value': 4},
        MONTHLY: {'name': 'Monthly', 'value': 12},
        SEMIMONTHLY: {'name': 'Semimonthly', 'value': 24},
        BIWEEKLY: {'name': 'Biweekly', 'value': 26},
        WEEKLY: {'name': 'Weekly', 'value': 52},
        DAILY: {'name': 'Daily', 'value': 365},
    };
    const EXPENSE_ID_PREFIX = 'expense_';
    const INCOME_ID_PREFIX = 'income_';
    const output = document.getElementById(divId);
    let fileName = '';
    let budgetData = {
        'earnings': [],
        'expenses': [],
    };
    const blankLineItem = {
        'name':'',
        'amount':0.0,
        'frequency': FREQUENCIES.MONTHLY['value'],
    };

    const redrawInterface = function (){
        output.innerHTML = '';
        //TODO: filename is editable?
        const interface = makeFieldset(noFileName() ? 'Budgeter Interface' : fileName);
        interface.appendChild(createElement('p', {}, 'Interface test. TODO: actually populate an interface based on the data.'));
        for (let i = 0; i < budgetData['expenses'].length; i++){
            //TODO: need a line item constructor of some kind
            //this item needs to have inputs for the user to make changes that are then tracked
            //maybe bring back validation and rules for things like the amount?
            //how to represent the recurring schedule information?
            //number of times per year?
            const id = EXPENSE_ID_PREFIX + i;
            const line = createElement('p', { 'id': id }, `${i}: ${dollarAmount(budgetData['expenses'][i]['amount'])}`);
            //TODO: this shouldn't be onclick, it should be a little delete button for the line
            line.onclick = () => removeExpense(id);
            interface.appendChild(line);
        }
        interface.appendChild(makeButton.button('Add Expense Item', () => addExpense()));
        output.appendChild(interface);
    };

    const updateExpenseItem = function (id){
        const index = indexFromId(id);
    };

    const removeExpense = function (id){
        const index = indexFromId(id);
        budgetData['expenses'].splice(index, 1);
        redrawInterface();
    };

    const indexFromId = (id) => parseInt(id.replace(EXPENSE_ID_PREFIX, ''));

    const addExpense = function (data){
        if (data == null) {
            data = deepCopy(blankLineItem);
            //TODO: temp, remove this (it was just for some visual variety while testing)
            data['amount'] = (Math.floor(Math.random() * 9900) + 100) / 100;
        }
        budgetData['expenses'].push(data);
        redrawInterface();
    };

    const noFileName = () => (fileName == null || fileName === '');

    this.setBudgetData = function (_budgetData, _fileName) {
        budgetData = deepCopy(_budgetData);
        fileName = _fileName;
        redrawInterface();
    };
    this.getBudgetData = function (){
        return budgetData;
    };

    this.getFileName = function () {
        if (noFileName()){
            return 'budget_data_' + getDateNowString().replace(/\W/g, '') + '.json';
        }
        return fileName;
    };

    redrawInterface();
}