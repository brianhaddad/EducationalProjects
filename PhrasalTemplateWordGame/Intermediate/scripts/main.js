function main(templateData){
    if (!templateData.inputs || templateData.inputs.length < 1){
        alert('Error: This template appears to be invalid. Please select a valid template file for the game.');
        return null;
    }
    for (var i=0; i<templateData.inputs.length; i++){
        var element = templateData.inputs[i];
        var answer = '';
        var attempts = 0;
        do {
            attempts++;
            if (attempts > 2){
                alert('You must enter a value for ' + element + ' to proceed.');
            }
            answer = prompt('Please input a ' + element)
        }
        while (!answer || answer.length == 0);
        templateData.string = templateData.string.replace(element, answer);
    }
    var container = document.getElementById('main');
    container.innerHTML = templateData.string;
    container.style.display = 'block';
}