const $playerCells = $('.player-cell');
const $enemyCells = $('.enemy-cell');
const $message1 = $('#message-1');
const $message2 = $('#message-2');
const $message3 = $('#message-3');
const $restart = $('#restart');

let gameOver = false;
let sides = [
    {name: "Player", shipsLeft: 5}, 
    {name: "Enemy", shipsLeft: 5}
];
let playerCells = $playerCells;
let enemyCells = $enemyCells;

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
    if (!gameOver) {
        if (this.shotAt) {
            $message1.removeAttr('style');
            $message1.text("Select a an open square!");
            $message2.removeAttr('style');
            $message2.text("You can't fire at the same square twice.");
        } else {
            this.shotAt = true;
            $message1.text(`Firing at ${this.y}${this.x}...`);
            $message1.css({fontSize: '26px'});
            if (this.occupied) {
                $(this).text('X');
                $(this).css({color: '#b44', backgroundColor: '#222'});
                $message2.text('HIT!');
                $message2.css({fontSize: '60px', color: '#b44'});
                this.shipHere.takeHit();
                console.log(`hit ${this.shipHere.name}`);
            } else {
                $(this).text('/');
                $(this).css({backgroundColor: '#aaf'});
                $message2.text('MISS');
                $message2.css({fontSize: '60px', color: '#88d'});
                console.log('miss');
            }
        }
        console.log(`Cell coordinates: ${this.y} ${this.x}`);
    }
}

class Ship {
    constructor(side, name, cellLength, direction, cellsOccupied) {
        this.side = side;
        this.name = name;
        this.cellLength = cellLength;
        this.direction = direction;
        this.cellsOccupied = cellsOccupied;
        this.hitsTaken = 0;
        this.sunk = false;
    }
    placeOnBoard() {
        if (this.side) {
            for (let cell of this.cellsOccupied) {
                enemyCells[cell].occupied = true;
                enemyCells[cell].shipHere = this;
            }
        } else {
            for (let cell of this.cellsOccupied) {
                playerCells[cell].occupied = true;
                playerCells[cell].shipHere = this;
                playerCells[cell].style.backgroundColor = '#333';
            }
        }
    }
    takeHit() {
        this.hitsTaken++;
        this.checkSunk();
        console.log(`${this.name} takes hit, has taken ${this.hitsTaken} hits total.`);
    }
    checkSunk() {
        if (this.hitsTaken === this.cellLength) {
            this.sunk = true;
            sides[this.side].shipsLeft--;
            $message3.css({fontSize: '26px'});
            $message3.text(`You sank the enemy's ${this.name}!`);
            console.log(`SANK ${this.name}`);
            if (!sides[this.side].shipsLeft) {
                gameOver = true;
                $message1.css({fontSize: "30px"});
                $message1.text('Game Over, YOU WIN!');
                console.log('GAME OVER, YOU WIN!');
            }
        }
    }
}

// Placeholder simple static ships for now

let playerCarrier = new Ship (0, 'Aircraft Carrier', 5, 'vertical', [28, 38, 48, 58, 68]);
let playerBattleship = new Ship (0, 'Battleship', 4, 'horizontal', [81, 82, 83, 84]);
let playerDestroyer = new Ship (0, 'Destroyer', 3, 'vertical', [32, 42, 52]);
let playerSubmarine = new Ship (0, 'Submarine', 3, 'horizontal', [13, 14, 15]);
let playerPatrol = new Ship (0, 'Patrol Boat', 2, 'horizontal', [55, 56]);

let enemyCarrier = new Ship (1, 'Aircraft Carrier', 5, 'vertical', [28, 38, 48, 58, 68]);
let enemyBattleship = new Ship (1, 'Battleship', 4, 'horizontal', [81, 82, 83, 84]);
let enemyDestroyer = new Ship (1, 'Destroyer', 3, 'vertical', [32, 42, 52]);
let enemySubmarine = new Ship (1, 'Submarine', 3, 'horizontal', [13, 14, 15]);
let enemyPatrol = new Ship (1, 'Patrol Boat', 2, 'horizontal', [55, 56]);

playerCarrier.placeOnBoard();
enemyCarrier.placeOnBoard();
playerBattleship.placeOnBoard();
enemyBattleship.placeOnBoard();
playerDestroyer.placeOnBoard();
enemyDestroyer.placeOnBoard();
playerSubmarine.placeOnBoard();
enemySubmarine.placeOnBoard();
playerPatrol.placeOnBoard();
enemyPatrol.placeOnBoard();



