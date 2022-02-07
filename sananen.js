window.onload = (event) => {
    //get words from the file and add them to array
    window.wordsArray = readTextFile("words.txt");
    //choose the solution
    window.solutionWord = getRandomWord(wordsArray);
    console.log(solutionWord);

    window.activeRow = 1;
};

function getRandomWord(words) {
    //max value is the number of words
    let max = words.length;
    //generate a random number
    let randomInt = Math.floor(Math.random() * max);
    //assign a random word
    let selectedWord = words[randomInt];
    return selectedWord;
}

//get word from gameboard and check if it is valid
function getWord(){
    //get letters from current row
    let row = document.getElementById('row' + activeRow);
    let letters = row.querySelectorAll(":scope > .tile");

    var empty = false;
    var word = '';
    //add each letter to word
    letters.forEach(element => {
        if(element.value == '' || element.value == ' '){
            empty = true;
        }
        else{
            //make sure word is lowercase
            word += element.value.toLowerCase();
        }
    })
    //if empty return null
    if(empty == true){
        document.getElementById("warning").innerHTML = "Tarkista että kaikissa laatikoissa on kirjain!";
        return null;
    }
    //is word is not valid and doesn't exists in list of possible words return null
    else if(wordsArray.indexOf(word) == -1){
        document.getElementById("warning").innerHTML = "Käyttämäsi sana ei ole validi!";
        return null;
    }
    //if word is not empty return word
    else if(empty == false){
        return word;
    }
    //if word is empty return null
    else{
        document.getElementById("warning").innerHTML = "Tarkista sanasi!";
        return null;
    }
    
}

//check if player's guess is correct
function testAnswer(guess, solution) {
    let result = new Array(0);
    //iterate over guess and mark the correct letters colors
    for( let i = 0; i < guess.length; i++ ){
        let guessLetter = guess[i];
        let solutionLetter = solution[i];
        if (guessLetter === solutionLetter){
            result.push("green");
        }
        //checking if letter exists in solution
        else if (solution.indexOf(guessLetter) != -1){
            result.push("yellow");
        }
        else {
            result.push("grey");
        }
    }
    return result;
}

//apply colors to the tiles on the row
function applyColours(result){
    let row = document.getElementById('row' + activeRow);
    for( let i = 0; i < result.length; i++ ){
        row.children[i].style.backgroundColor = result[i];
    }
}

//move the active row down one row
function moveRowSelection(){
    let row = document.getElementById('row' + activeRow);
    let rowLength = row.childElementCount;
    
    //iterate over tiles in current row and disable them
    for( let i = 0; i < rowLength; i++ ){
        row.children[i].disabled = true;
    }
    activeRow++;

    //iterate over next row and enable tiles
    row = document.getElementById('row' + activeRow);
    for( let i = 0; i < rowLength; i++ ){
        row.children[i].disabled = false;
    }
    //change focus to first tile of the next row
    row.firstElementChild.focus();
}

//transform string to an array
function stringToArray(input){
    return result = input.split("");
}

//runs when player enters word
function checkWord(){
    //clear warning
    document.getElementById("warning").innerHTML = " ";
    //get word from input fields
    let inputWord = getWord();
    //if null, return from function
    if(inputWord == null){
        return;
    }

    //turn words into arrays and test if answer is correct
    let answer = testAnswer(stringToArray(inputWord),stringToArray(solutionWord));

    //apply colors to tiles 
    applyColours(answer);
    //move row selection down one
    moveRowSelection();

    //TODO: add a victory screen and stuff
}

//read the txt file containing words
function readTextFile(file){
    let wordsArr = new Array();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                wordsArr = allText.split("\r\n");
            }
        }
    }
    rawFile.send(null);
    return wordsArr;
}

//keyboard movement
//TODO: fix movement
function moveTileSelection(e) {
    if (e.keyCode != 8 && e.srcElement.nextElementSibling) {
        e.srcElement.nextElementSibling.focus();
    }
}

document.querySelectorAll(".tile").forEach(element => {
    element.addEventListener("keyup", moveTileSelection);
});