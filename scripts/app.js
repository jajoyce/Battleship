const $enemyCells = $('.enemy-cell');
const $playerCells = $('.player-cell');
const $message1 = $('#message-1');
const $message2 = $('#message-2');
const $restart = $('#restart');

let enemyCells = $enemyCells;
let playerCells = $playerCells;

function addXYCoordinates(cells) {
    for (let i = 0; i < cells.length; i++) {
        if (i < 10) {
            cells[i].y = 'A';
            cells[i].x = `${i+1}`;
        } else if (i < 20) {
            cells[i].y = 'B';
            cells[i].x = `${i-9}`;
        } else if (i < 30) {
            cells[i].y = 'C';
            cells[i].x = `${i-19}`;
        } else if (i < 40) {
            cells[i].y = 'D';
            cells[i].x = `${i-29}`;
        } else if (i < 50) {
            cells[i].y = 'E';
            cells[i].x = `${i-39}`;
        } else if (i < 60) {
            cells[i].y = 'F';
            cells[i].x = `${i-49}`;
        } else if (i < 70) {
            cells[i].y = 'G';
            cells[i].x = `${i-59}`;
        } else if (i < 80) {
            cells[i].y = 'H';
            cells[i].x = `${i-69}`;
        } else if (i < 90) {
            cells[i].y = 'I';
            cells[i].x = `${i-79}`;
        } else if (i < 100) {
            cells[i].y = 'J';
            cells[i].x = `${i-89}`;
        }
    }
}

addXYCoordinates(enemyCells);
addXYCoordinates(playerCells);

$enemyCells.on('click', enemyCellClick);

// Placeholder for demo
$playerCells.on('click', enemyCellClick)

function enemyCellClick() {
    $message1.text(`Firing at ${this.y}${this.x}...`);
    $message1.css({fontSize: '26px'});
    if (this.occupied) {
        $(this).text('X');
        $(this).css({color: '#b44', backgroundColor: '#222'});
        $message2.text('HIT!');
        $message2.css({fontSize: '60px', color: '#b44'});
        console.log('hit');
    } else {
        $(this).text('/');
        $(this).css({backgroundColor: '#aaf'});
        $message2.text('MISS');
        $message2.css({fontSize: '60px', color: '#88d'});
        console.log('miss');
    }
    console.log(`Cell coordinates: ${this.y} ${this.x}`)
}

class Ship {
    constructor(cellLength, direction, cellsOccupied) {
        this.cellLength = cellLength;
        this.direction = direction;
        this.cellsOccupied = cellsOccupied;
    }
    placeOnPlayerBoard() {
        for (let cell of this.cellsOccupied) {
            playerCells[cell].occupied = true;
            playerCells[cell].style.backgroundColor = '#333';
        }
    }
    placeOnEnemyBoard() {
        for (let cell of this.cellsOccupied) {
            enemyCells[cell].occupied = true;
        }
    }
}

// Placeholder simple static ships for now

let carrier = new Ship (5, 'vertical', [28, 38, 48, 58, 68]);
let battleship = new Ship (4, 'horizontal', [81, 82, 83, 84]);
let destroyer = new Ship (3, 'vertical', [32, 42, 52]);
let submarine = new Ship (3, 'horizontal', [13, 14, 15]);
let patrol = new Ship (2, 'horizontal', [55, 56]);


carrier.placeOnPlayerBoard();
carrier.placeOnEnemyBoard();
battleship.placeOnPlayerBoard();
battleship.placeOnEnemyBoard();
destroyer.placeOnPlayerBoard();
destroyer.placeOnEnemyBoard();
submarine.placeOnPlayerBoard();
submarine.placeOnEnemyBoard();
patrol.placeOnPlayerBoard();
patrol.placeOnEnemyBoard();


