function Budgeter(divId){
    const output = document.getElementById(divId);
    let fileName = '';
    let budgetData = {
        'expenses': [],
    };

    const redrawInterface = function (){
        output.innerHTML = '';
        const interface = makeFieldset('Budgeter Interface');
        interface.appendChild(createElement('p', {}, 'Interface test. TODO: actually populate an interface based on the data.'));
        output.appendChild(interface);
    };

    this.setBudgetData = function (_budgetData, _fileName) {
        budgetData = deepCopy(_budgetData);
        fileName = _fileName;
        redrawInterface();
    };
    this.getBudgetData = function (){
        return budgetData;
    };

    this.getFileName = function () {
        if (fileName == null || fileName === ''){
            return 'budget_data_' + getDateNowString().replace(/\W/g, '') + '.json';
        }
        return fileName;
    };

    redrawInterface();
}