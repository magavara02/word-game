var USER_WORD = "";
var USER_WORD_DEFENITION = "";
var GRID_SIZE = 0;
var USER_WORD_ARRAY = [];
var gameWon = false;
var GRID_ROWS = 7;
var PUT_WORDS_ON_NEXT_ROW = true;
var cantype = true;
var hintPrice = 4;
var winPoints = 2;
const addScore = document.querySelector(".score-add");

if(!localStorage.getItem("score")){
    localStorage.setItem("score", 5);
}

const score = document.querySelector(".score-score");
score.innerText = localStorage.getItem("score");

var links = [
    "https://random-words-api.herokuapp.com/w?n=1"];

var link = links[Math.floor(Math.random() * links.length)];



document.getElementById("nextRow").addEventListener("change", function(){
    if(PUT_WORDS_ON_NEXT_ROW == false){
        PUT_WORDS_ON_NEXT_ROW = true
    }else{
        PUT_WORDS_ON_NEXT_ROW = false;
    }
})

function keyboard(event) {
    var x = event.key;
    if(x.length == 1){
        keyPress(x.toUpperCase());
    }else if(x == "Backspace"){
        alert("Does not work yet :(");
    }
    
  }

function get_defenition(){
    // fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${USER_WORD}`)
    fetch(`https://dictionaryapi.com/api/v3/references/sd4/json/${USER_WORD}?key=2e403c51-237a-4a2f-bbc1-e4a2c59b5ab9`)
    .then((result) => result.json())
    .then((data) => {
        link = links[Math.floor(Math.random() * links.length)];
        if(USER_WORD.length >= 10){
            console.log("Word was too long. Getting new word hehehehhehehehehehehaoiudhjaoisdhuas")
            get_word();
            return;
        }
        try {
            document.querySelector(".defenition").innerHTML = data[0].shortdef[0];
        } catch (error) {
            get_word();
            return;
        }

        USER_WORD = USER_WORD.toUpperCase();
        GRID_SIZE = USER_WORD.length;
        for(var i = 0; i < USER_WORD.length; i++){
            USER_WORD_ARRAY.push(USER_WORD[i]);
        }
        console.log("The word is " + USER_WORD + " dumbass....");
        
        start_game()
    })
}

function get_word(){
    fetch(link)
    .then((result) => result.json())
    .then((data) => {
        USER_WORD = data[0];
        // USER_WORD = "emerald";
        
       get_defenition();
    })
}






function createKeyboard(){

    const keyboardRows = document.querySelectorAll(".keyboard .row");
    const keyboardRow1 = keyboardRows[0];
    const keyboardRow2 = keyboardRows[1];
    const keyboardRow3 = keyboardRows[2];

    keyboardRow1.innerHTML = ""
    keyboardRow2.innerHTML = ""
    keyboardRow3.innerHTML = ""

    const keyboardRow1Keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const keyboardRow2Keys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const keyboardRow3Keys = ["Z", "X", "C", "V", "B", "N", "M"];

    for(var i = 0; i < keyboardRow1Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow1Keys[i];
        key.setAttribute("onclick", `keyPress('${keyboardRow1Keys[i]}')`);
        keyboardRow1.append(key);
    }

    for(var i = 0; i < keyboardRow2Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow2Keys[i];
        key.setAttribute("onclick", `keyPress('${keyboardRow2Keys[i]}')`);
        keyboardRow2.append(key);
    }

    for(var i = 0; i < keyboardRow3Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow3Keys[i];
        key.setAttribute("onclick", `keyPress('${keyboardRow3Keys[i]}')`);
        keyboardRow3.append(key);
    }

}


function create_grid(){
    document.querySelector(".grid").innerHTML = "";
    for(var i = 0; i < GRID_ROWS; i++){
        const row = document.createElement("div");
        row.classList.add("row");
        document.querySelector(".grid").append(row);
    }

    const gridRows = document.querySelectorAll(".grid .row");
    for(var i = 0; i < gridRows.length; i++){
        gridRows[i].innerHTML = "";
        gridRows[i].style.setProperty("--grid-size", `${GRID_SIZE}`);
        for(var x = 0; x < GRID_SIZE; x++){
            const field = document.createElement("div");
            field.classList.add("field");
            field.id = `${i}${x}`;
            field.innerHTML = "";
            gridRows[i].append(field);
        }
    }
    for(var i = 0; i < USER_WORD.length; i++){
        const currentField = document.getElementById(`${currentRow}${i}`);
        currentField.classList.add("hint-field");
        currentField.setAttribute("onclick", `hint('${currentRow}${i}')`);
    }
}

function hint(field){
    if(gameWon == false && cantype == true){
        const hintField = document.getElementById(field);
        if(hintField.innerHTML != ""){

        }else{
            if(localStorage.getItem("score") - hintPrice > 0){
                localStorage.setItem("score", localStorage.getItem("score") - hintPrice);
                score.innerHTML = localStorage.getItem("score");
                hintField.innerHTML = USER_WORD[field[1]];
                hintField.classList.remove("hint-field");
                words++;
                if(words == GRID_SIZE){
                    checkWord();
                }
            }else{
                hintField.style.animation = "shake 1s";
                hintField.addEventListener("animationend", ()=>{
                    hintField.style.animation = null;
                })
                console.log("No points")
            }
        }
        
    }
}


var currentRow = 0;
var currentCol = 0;
var letters = [];
var words = 0;
function keyPress(pressed){
    if(gameWon == false && cantype == true){
        var currentField = document.getElementById(`${currentRow}${currentCol}`);

        var isEmpty = true;
        var nextCol = currentCol + 1;
        if(currentField.innerHTML != ""){
            isEmpty = false;
        }

        while(isEmpty == false){
            var nextField = document.getElementById(`${currentRow}${nextCol}`);
            if(nextField.innerHTML == ""){
                isEmpty = true;
                currentField = nextField;
            }
            
            currentCol = nextCol;
            nextCol++;
        }

        currentField.innerText = pressed;
        words++;
        //letters.push(pressed);
        currentCol++;
        if(words == GRID_SIZE){
            checkWord();
        }
    }
}

function restart(){
    currentCol = 0;
    currentRow = 0;
    letters = [];
    endWrong = [];
    USER_WORD_ARRAY = [];
    gameWon = false;
    cantype = true;
    get_word();
}


function end_game(type, delay){
    if(type == "win"){
        for(var i = 0; i < USER_WORD.length; i++){
            const currentField = document.getElementById(`${currentRow}${i}`);
            currentField.style.setProperty("animation", `correct 1s forwards`);
        }
        gameWon = true;
        setTimeout(() => {
            addScore.style.display = "block";
            addScore.style.animation = "fade-in 3s";
            localStorage.setItem("score", parseInt(localStorage.getItem("score")) + winPoints);
            score.innerHTML = localStorage.getItem("score");
            addScore.addEventListener("animationend", ()=>{
                addScore.style.display = "none";
                addScore.style.animation = null;
            })
            restart();
        }, 2000);
    }else if(type == "lose"){
        gameWon = false;
       setTimeout(() => {
           restart();
       }, delay + 2000);
    }
}

function checkWord(){
    cantype = false;
    words = 0;

    for(var i = 0; i < GRID_SIZE; i++){
        letters.push(document.getElementById(`${currentRow}${i}`).innerHTML);
    }

    var win = true;
    for(i = 0; i < USER_WORD_ARRAY.length; i++){
        if(letters[i] != USER_WORD_ARRAY[i]){
            win = false;
            break;
        }
    }

    if(win == true){
         end_game("win");
         return;
     }

    
    var delay = 0;
    var endWrong = [];
    for(var i = 0; i < USER_WORD.length; i++){
        if(USER_WORD[i] == letters[i]){
            const currentField = document.getElementById(`${currentRow}${i}`);
            currentField.style.setProperty("animation", `correct 1s ${delay}ms forwards`);
            if(PUT_WORDS_ON_NEXT_ROW == true && (currentRow + 1) != GRID_ROWS && win == false){
                const nextField = document.getElementById(`${currentRow + 1}${i}`);
                nextField.innerHTML = letters[i];
                nextField.style.setProperty("color", "transparent");
                nextField.style.setProperty("animation", `correct 1s ${delay}ms forwards`);
                words++;
            }
            delay += 500;
        }else if(USER_WORD_ARRAY.includes(letters[i]) && USER_WORD[i] != letters[i]){
            const currentField = document.getElementById(`${currentRow}${i}`);
            currentField.style.setProperty("animation", `partial 1s ${delay}ms forwards`);
            delay += 500;
            if ((currentRow + 1) == GRID_ROWS){
                endWrong.push(i);
            }
        }else{
            const currentField = document.getElementById(`${currentRow}${i}`);
            currentField.style.setProperty("animation", `wrong 1s ${delay}ms forwards`);
            delay += 500;
            if ((currentRow + 1) == GRID_ROWS){
                endWrong.push(i);
            }
        }
    }

    setTimeout(() => {
        cantype = true;
    }, delay + 500);

    

    if ((currentRow + 1) == GRID_ROWS){

        setTimeout(() => {
            for(var i = 0; i < endWrong.length; i++){
                const currentField = document.getElementById(`${currentRow - 1}${endWrong[i]}`);
                currentField.style.setProperty("animation","end 1s forwards");
                currentField.innerHTML = USER_WORD_ARRAY[endWrong[i]];
            }
            end_game("lose", 1000);
            return;
        }, delay + 1000);

        
    }

    currentRow++;
    currentCol = 0;
    letters = [];
    for(var i = 0; i < USER_WORD.length; i++){
        const currentField = document.getElementById(`${currentRow}${i}`);
        if(currentField.innerHTML == ""){
            currentField.classList.add("hint-field");
            currentField.setAttribute("onclick", `hint('${currentRow}${i}')`);
        }
        
    }

    for(var i = 0; i < USER_WORD.length; i++){
        const currentField = document.getElementById(`${currentRow -1}${i}`);
        currentField.classList.remove("hint-field");
        currentField.removeAttribute("onclick");
    }
}

function start_game(){
    create_grid();
    createKeyboard();
}

get_word();