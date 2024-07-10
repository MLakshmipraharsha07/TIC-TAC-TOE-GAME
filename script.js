const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

const message = document.getElementById('message');

const turnMessage = document.getElementById('turn-message');

const winnerMessage = document.getElementById('winner-message');


let BLANK = 0,
    X = 1,
    O = -1;

const cellSize = 100;

var map = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

var winPattern = [
    0b111000000, 0b000111000, 0b000000111, //rows
    0b100100100, 0b010010010, 0b001001001, //columns
    0b100010001, 0b001010100 //diagonal
];

var mouse = {
    x: -1,
    y: -1
};

let currentPlayer = X;
let gameOver = false;

canvas.width = canvas.height = 3 * cellSize;

canvas.addEventListener('mouseout', function() {
    mouse.x = mouse.y = -1;
});

canvas.addEventListener('mousemove', function(e) {
    let x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop;

    mouse.x = x;
    mouse.y = y;
});

canvas.addEventListener('click', function(e) {
    play(getCellByCoords(mouse.x, mouse.y));
})

displayTurn();

function displayTurn(){
    if (!gameOver) {
        turnMessage.textContent = (currentPlayer == X ? 'X' : 'O') + "'s turn'" ;
    }
}

function play(cell){
    if (gameOver) {
        return;
    }

    if (map[cell] != BLANK) {
        message.textContent = "Position is taken. Try another box";
        return;
    }

    map[cell] = currentPlayer;

    let winCheck = checkWin(currentPlayer);

    if (winCheck != 0){
        gameOver = true;
        winnerMessage.textContent = (winCheck == X ? 'X' : 'O') + " wins!";
        turnMessage.textContent = "";
    }else if(map.indexOf(BLANK) == -1){
        gameOver = true;
        winnerMessage.textContent = "It's a tie!";
        turnMessage.textContent = "";

        return;
    }

    currentPlayer = currentPlayer * -1;

    displayTurn();

}


function checkWin(player){
    let playerMapBitMask = 0;

    for(let i = 0; i < map.length; i++){
        playerMapBitMask <<= 1;

        if(map[i] == player) {
            playerMapBitMask += 1;
        }
    }

    for(let i = 0; i < winPattern.length; i++){
        if((playerMapBitMask & winPattern[i]) == winPattern[i]){
            return player;
        }
    }
    return 0;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard();
    fillBoard();

    function drawBoard() {
        context.strokeStyle = 'white';
        context.lineWidth = 10;

        context.beginPath();
        context.moveTo(cellSize, 0);
        context.lineTo(cellSize, canvas.height);
        context.stroke();

        context.beginPath();
        context.moveTo(cellSize * 2, 0)
        context.lineTo(cellSize * 2, canvas.height);
        context.stroke();

        context.beginPath();
        context.moveTo(0, cellSize);
        context.lineTo(canvas.width, cellSize);
        context.stroke();

        context.beginPath();
        context.moveTo(0, cellSize * 2);
        context.lineTo(canvas.width, cellSize * 2);
        context.stroke();

    }

    function fillBoard(){
        context.strokeStyle = 'white';
        context.lineWidth = 10;

        for(let i = 0; i < map.length; i++){
            let coords = getCellCoords(i);

            context.save();

            context.translate(coords.x + cellSize / 2, coords.y + cellSize/ 2); 

            if (map[i] == X){
                drawX();
            } else if(map[i] == O){
                drawO();
            }
            
            context.restore();
        }
    }


    function drawX(){
        context.beginPath();
        context.moveTo(-cellSize / 3, -cellSize / 3);
        context.lineTo(cellSize / 3, cellSize / 3);
        context.moveTo(cellSize / 3, -cellSize / 3);
        context.lineTo(-cellSize / 3, cellSize / 3);
        context.stroke();
    
    }
    
    function drawO(){
        context.beginPath();
        context.arc(0, 0, cellSize / 3, 0, Math.PI * 2)
        context.stroke();
    }
    
    requestAnimationFrame(draw);
}

function getCellCoords(cell){
    let x = (cell % 3) * cellSize,
        y = Math.floor(cell / 3) * cellSize;
    return {
        x,y
    };
}

function getCellByCoords(x,y){
    return (Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3;
}

draw();