

const cells = document.querySelectorAll('.board .cell');
const board = document.getElementById("board");
const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1;
const player1text = "P1 (X)";
const player2text = "P2 (O)";
var initialTurns = 6;
var p1color = "#4c94d7";
var p2color = "#43dbba";
var dragCell = document.getElementById("dragCell");
const p1Turns = document.getElementById("p1Turns");
const p2Turns = document.getElementById("p2Turns");

const p1Wins = document.getElementById("p1Wins");
const p2Wins = document.getElementById("p2Wins");

document.getElementById("turn").innerHTML = player1text;


//add event listeners to cells to make them clickable
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//allow cell to be dropped
function allowDrop(ev) {
    ev.preventDefault();
}


//drop cell on board
function drop(ev) {
    ev.preventDefault();
    //get the cell being dragged
    var data = ev.dataTransfer.getData("text");
    var cell = document.getElementById(data);
    var validMove = makeMove(ev);
    if (validMove) {
        initialTurns--;
    }
    if (initialTurns == 0) {

        document.getElementById("initialT").style.display = "none";

        addCellDrops();
    }
    else if (initialTurns > 0) {
        cell.innerHTML = currentPlayer;
        cell.style.color = currentPlayer == player1 ? p1color : p2color;

        if (validMove) {
            p1Turns.innerHTML = currentPlayer == player1 ? p1Turns.innerHTML : p1Turns.innerHTML - 1;
            p2Turns.innerHTML = currentPlayer == player2 ? p2Turns.innerHTML : p2Turns.innerHTML - 1;
        }

    }
    console.log(ev.target);
}

//make move on board
function makeMove(event) {
    const cell = event.target;
    const originalCell = document.getElementById(event.dataTransfer.getData("text"));
    if (checkSurrounded(originalCell)) {
        return false;
    }
    if (cell.innerHTML != 'X' && cell.innerHTML != 'O') {
        if (currentPlayer === player1 && originalCell.innerText === player1) {
            cell.textContent = player1;
            cell.style.color = p1color;
        }
        else if (currentPlayer === player2 && originalCell.innerText === player2) {
            cell.textContent = player2;
            cell.style.color = p2color;
        }
        else {
            return false;
        }
        if (initialTurns <= 0) {
            originalCell.innerHTML = '';
        }
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        document.getElementById("turn").innerHTML = currentPlayer === player1 ? player1text : player2text;
        if (checkWinner(player1)) {
            document.getElementById("turn").innerHTML = "Finished (Player 1 won)";
            p1Wins.innerHTML = parseInt(p1Wins.innerHTML) + 1;
            // alert("Player 1 won");
            disableBoard();
            return;
        }
        if (checkWinner(player2)) {
            document.getElementById("turn").innerHTML = "Finished (Player 2 won)"
            p2Wins.innerHTML = parseInt(p2Wins.innerHTML) + 1;
            // alert("Player 2 won");
            disableBoard();
            return;
        }

        if (checkDraw()) {
            document.getElementById("message").innerHTML = ""
            document.getElementById("turn").innerHTML = "Draw"
            alert("Draw");
            disableBoard();
            return;
        }
        return true;
    }
    return false;
}

//check if cell is surrounded by opponent
function checkSurrounded(cell) {

    //find cell index
    var cellIndex = 0;
    for (let i = 0; i < 9; i++) {
        if (cells[i] == cell) {
            cellIndex = i;
            break;
        }
    }

    var opponent = currentPlayer == player1 ? player2 : player1;

    var left = cellIndex % 3 == 0 ? opponent : cells[cellIndex - 1].textContent;
    var right = cellIndex % 3 == 2 ? opponent : cells[cellIndex + 1].textContent;
    var top = cellIndex < 3 ? opponent : cells[cellIndex - 3].textContent;
    var bottom = cellIndex > 5 ? opponent : cells[cellIndex + 3].textContent;
    var topLeft = cellIndex < 3 || cellIndex % 3 == 0 ? opponent : cells[cellIndex - 4].textContent;
    var topRight = cellIndex < 3 || cellIndex % 3 == 2 ? opponent : cells[cellIndex - 2].textContent;
    var bottomLeft = cellIndex > 5 || cellIndex % 3 == 0 ? opponent : cells[cellIndex + 2].textContent;
    var bottomRight = cellIndex > 5 || cellIndex % 3 == 2 ? opponent : cells[cellIndex + 4].textContent;

    if (left == opponent && right == opponent && top == opponent && bottom == opponent && topLeft == opponent && topRight == opponent && bottomLeft == opponent && bottomRight == opponent) {
        return true;
    }



    return false;
}

function disableBoard() {
    for (let i = 0; i < 9; i++) {
        cells[i].draggable = false;
        cells[i].removeEventListener('dragstart', drag);
        cells[i].removeEventListener('click', makeMove);
    }
}

//check if player has won
function checkWinner(player) {
    //check possible winning combinations
    for (let i = 0; i < 3; i++) {
        //row
        if (cells[i * 3].textContent == player && cells[i * 3 + 1].textContent == player && cells[i * 3 + 2].textContent == player) {
            return true;
        }

        if (cells[i].textContent == player && cells[i + 3].textContent == player && cells[i + 6].textContent == player) {
            return true;
        }
    }
    //diagonal
    if (cells[0].textContent == player && cells[4].textContent == player && cells[8].textContent == player) {
        return true;
    }
    if (cells[2].textContent == player && cells[4].textContent == player && cells[6].textContent == player) {
        return true;
    }
    return false;


}

//check if game is a draw
function checkDraw() {
    for (let i = 0; i < 9; i++) {
        if (cells[i].textContent == '') {
            return false;
        }
    }
    return true;
}


//reset game
function replay() {
    for (let i = 0; i < 9; i++) {
        cells[i].textContent = '';
        cells[i].draggable = false;
        cells[i].removeEventListener('dragstart', drag);
        cells[i].addEventListener('click', makeMove);
    }
    currentPlayer = player1;
    document.getElementById("turn").innerHTML = player1text;
    initialTurns = 6;

    document.getElementById("initialT").style.display = "flex";
    document.getElementById("dragCell").innerHTML = player1;
    p1Turns.innerHTML = 3;
    p2Turns.innerHTML = 3;
    document.getElementById("dragCell").style.color = p1color;



}

//add event listeners to cells to make them draggable
function addCellDrops() {
    for (let i = 0; i < 9; i++) {
        cells[i].draggable = true;
        cells[i].addEventListener('dragstart', drag);
        cells[i].removeEventListener('click', makeMove);
    }

}