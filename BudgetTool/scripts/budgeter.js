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
    const frequencyDropdownOptions = {};
    for (const n in FREQUENCIES){
        const opt = FREQUENCIES[n];
        frequencyDropdownOptions[opt['name']] = {'value': opt['value']};
    }
    const output = document.getElementById(divId);
    const analysisOutputs = {};
    let fileName = '';
    let budgetData = {
        'earnings': [],
        'expenses': [],
    };
    const blankLineItem = {
        'name':'',
        'amount':0.0,
        'frequency': FREQUENCIES.MONTHLY['value'],
        'include': true,
    };

    const redrawInterface = function (){
        output.innerHTML = '';
        const analysis = createAnalysis();
        output.appendChild(analysis);
        //TODO: filename is editable?
        const earnings = createLineItemSectionHTML('earnings', 'Earnings', 'Add Income Item');
        output.appendChild(earnings);
        const expenses = createLineItemSectionHTML('expenses', 'Expenses', 'Add Expense Item');
        output.appendChild(expenses);
        updateAnalysisOutputs();
    };

    const sumByUnit = function (category, unit){
        let total = 0;
        for (let i = 0; i < budgetData[category].length; i++){
            if (budgetData[category][i]['include']){
                total += (budgetData[category][i]['amount'] * budgetData[category][i]['frequency']) / unit;
            }
        }
        return total;
    };

    const createAnalysis = function (){
        const container = makeFieldset('Analysis');
        const summaryElements = function() {
            return {
            'income': createElement('span'),
            'expenses': createElement('span'),
            'remaining': createElement('span'),
            };
        };
        analysisOutputs['daily'] = summaryElements();
        analysisOutputs['paycheck'] = summaryElements();
        analysisOutputs['monthly'] = summaryElements();

        const innerContainer = createElement('div', {'class': 'report'});

        innerContainer.appendChild(createSummaryTable('Daily', 'daily'));
        innerContainer.appendChild(createSummaryTable('Biweekly', 'paycheck'));
        innerContainer.appendChild(createSummaryTable('Monthly', 'monthly'));

        container.appendChild(innerContainer);
        
        return container;
    };

    const createSummaryTable = function (title, elementsCategory){
        const layout = createElement('table');
        const header = createElement('thead');
        const theadRow = createElement('tr');
        theadRow.appendChild(createElement('th', { 'colspan': 2 }, title));
        header.appendChild(theadRow);
        layout.appendChild(header);
        const incomeRow = createSummaryTableRow(elementsCategory, 'income', 'Income');
        layout.appendChild(incomeRow);
        const expensesRow = createSummaryTableRow(elementsCategory, 'expenses', 'Expenses');
        layout.appendChild(expensesRow);
        const remainingRow = createSummaryTableRow(elementsCategory, 'remaining', 'Remaining');
        const tfoot = createElement('tfoot');
        tfoot.appendChild(remainingRow);
        layout.appendChild(tfoot);
        return layout;
    };

    const createSummaryTableRow = function (elementsCategory, elementsSubcategory, title){
        const row = createElement('tr');
        row.appendChild(createElement('td', {}, title));
        const td = createElement('td', {});
        td.appendChild(analysisOutputs[elementsCategory][elementsSubcategory]);
        row.appendChild(td);
        return row;
    };

    const updateAnalysisOutputs = function () {
        const unit = 365;
        const monthlyConverter = unit / FREQUENCIES.MONTHLY['value'];
        const biweeklyConverter = unit / FREQUENCIES.BIWEEKLY['value'];
        let incomePerDay = sumByUnit('earnings', unit);
        let expensesPerDay = sumByUnit('expenses', unit);

        const monthlyIncome = incomePerDay * monthlyConverter;
        const monthlyExpenses = expensesPerDay * monthlyConverter;

        const paycheckIncome = incomePerDay * biweeklyConverter;
        const paycheckExpenses = expensesPerDay * biweeklyConverter;


        updateAnalysisOutput('daily', 'income', incomePerDay);
        updateAnalysisOutput('daily', 'expenses', expensesPerDay);
        updateAnalysisOutput('daily', 'remaining', incomePerDay - expensesPerDay);

        updateAnalysisOutput('monthly', 'income', monthlyIncome);
        updateAnalysisOutput('monthly', 'expenses', monthlyExpenses);
        updateAnalysisOutput('monthly', 'remaining', monthlyIncome - monthlyExpenses);

        updateAnalysisOutput('paycheck', 'income', paycheckIncome);
        updateAnalysisOutput('paycheck', 'expenses', paycheckExpenses);
        updateAnalysisOutput('paycheck', 'remaining', paycheckIncome - paycheckExpenses);
    };

    const updateAnalysisOutput = function (section, category, value) {
        const negativeClass = 'negative_number';
        analysisOutputs[section][category].innerHTML = dollarAmount(value);
        if (value < 0){
            analysisOutputs[section][category].classList.add(negativeClass);
        }
        else{
            analysisOutputs[section][category].classList.remove(negativeClass);
        }
    };

    const createLineItemSectionHTML = function (category, title, addButton) {
        const interface = makeFieldset(title);
        for (let i = 0; i < budgetData[category].length; i++){
            const id = category + '_' + i;
            const line = createLineItemHTML(category, id, budgetData[category][i]);
            interface.appendChild(line);
        }
        interface.appendChild(makeButton.button(addButton, () => addLineItem(category)));
        return interface;
    };

    const createLineItemHTML = function (category, id, item){
        const container = createElement('div', { 'class': 'button_bar' });
        container.appendChild(ValidatedTextInput('Name', id + '_name', item['name'], runValidation([]), () => updateLineItem(category, id, 'name')));
        container.appendChild(ValidatedTextInput('Amount', id + '_amount', item['amount'].toFixed(2), runValidation([VALIDATION_RULES.NON_EMPTY, VALIDATION_RULES.FLOAT]), () => updateLineItem(category, id, 'amount')));
        container.appendChild(DropDownMenuSelector('Frequency', id + '_frequency', item['frequency'], frequencyDropdownOptions, () => updateLineItem(category, id, 'frequency')));
        container.appendChild(Checkbox(id + '_include', 'Include', item['include'], () => updateLineItem(category, id, 'include')));
        container.appendChild(makeButton.input('X', () => removeLineItem(id, category), 'Remove Item'));
        return container;
    };

    const updateLineItem = function (category, id, field){
        const index = indexFromId(id, category);
        const value = field === 'include'
            ? document.getElementById(id + '_' + field).checked
            : document.getElementById(id + '_' + field).value;
        if (field === 'amount'){
            budgetData[category][index][field] = parseFloat(value);
        }
        else if (field === 'frequency'){
            budgetData[category][index][field] = parseInt(value);
        }
        else{
            budgetData[category][index][field] = value;
        }
        updateAnalysisOutputs();
    };

    const removeLineItem = function (id, category){
        const index = indexFromId(id, category);
        budgetData[category].splice(index, 1);
        redrawInterface();
    };

    const indexFromId = (id, category) => parseInt(id.replace(category + '_', ''));

    const addLineItem = function (category, data){
        if (data == null) {
            data = deepCopy(blankLineItem);
        }
        budgetData[category].push(data);
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