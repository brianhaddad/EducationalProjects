const budgeter = new Budgeter('budgeter');

async function loadState(filePickerId){
    const files = document.getElementById(filePickerId).files;
    if (files.length < 1){
        userAlert('Error: You must select a file first.');
        return null;
    }
    const fileTexts = await readFileArray(files);
    const allData = {};
    fileTexts.map(n => JSON.parse(n['content'])).forEach(n => Object.assign(allData, n));
    budgeter.setBudgetData(allData, fileTexts[0]['filename']);
}

function saveState(){
    const fileName = budgeter.getFileName();
    const obj = budgeter.getBudgetData();
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
}

async function readFileArray(fileArray) {
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
}