async function goGoGadgetFileReader(id) {
    const files = document.getElementById(id).files;
    let fileTexts = await readFileArray(files);
    //console.log(fileTexts);
    let fileText = fileTexts[0]; //For now we'll just worry about the first one, can't select more than one in the file picker anyway.
    //Need to grab out the things in square brackets.
    //Learned basics here:
    //https://stackoverflow.com/questions/12059284/get-text-between-two-rounded-brackets
    let matches = fileText.match(/\[(.*?)\]/g);
    console.log(matches);
}

//This is based off things I learned at the following links:
//https://stackoverflow.com/questions/44438560/read-json-file-data-on-client-side-with-pure-javascript
//https://blog.shovonhasan.com/using-promises-with-filereader/
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
    for (var i=0; i<fileArray.length; i++) {
        try {
            let file = await readFileAsText(fileArray[i]);
            files.push(file);
        } catch (e) {
            console.warn(e.message)
        }
    }
    return files;
}