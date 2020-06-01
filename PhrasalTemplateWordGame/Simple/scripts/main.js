function main(templateData){
    for (var i = 0; i < templateData.inputs.length; i++){
        var answer = prompt('Please input a ' + templateData.inputs[i]);
        templateData.string = templateData.string.replace(templateData.inputs[i], answer);
    }
    document.getElementById('main').innerHTML = templateData.string;
}