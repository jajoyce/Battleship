// jQuery DOM constants

const $playerCells = $(".player-cell");
const $enemyCells = $(".enemy-cell");
const $playerShipsKey = $(".player-ships");
const $enemyShipsKey = $(".enemy-ships");
const $message1 = $("#message-1");
const $message2 = $("#message-2");
const $message3 = $("#message-3");
const $restart = $("#restart");

// Global game vairables

let gameOver = false;
let turn = 0;
let sides = [
  { name: "Player", shipsLeft: 5, shipsKey: $playerShipsKey },
  { name: "Enemy", shipsLeft: 5, shipsKey: $enemyShipsKey },
];

// Gameplay timeouts

let enemyTurnTimeout;
let enemyHitMissTimeout;
let sunkAfterHitTimeout;
let sunkHighlightKeyTimeout;
let gameOverTimeout;

// Add X Y coordinates to cells

function addXYCoordinates(cells) {
  for (let i = 0; i < cells.length; i++) {
    if (i < 10) {
      cells[i].y = "A";
      cells[i].x = `${i + 1}`;
    } else if (i < 20) {
      cells[i].y = "B";
      cells[i].x = `${i - 9}`;
    } else if (i < 30) {
      cells[i].y = "C";
      cells[i].x = `${i - 19}`;
    } else if (i < 40) {
      cells[i].y = "D";
      cells[i].x = `${i - 29}`;
    } else if (i < 50) {
      cells[i].y = "E";
      cells[i].x = `${i - 39}`;
    } else if (i < 60) {
      cells[i].y = "F";
      cells[i].x = `${i - 49}`;
    } else if (i < 70) {
      cells[i].y = "G";
      cells[i].x = `${i - 59}`;
    } else if (i < 80) {
      cells[i].y = "H";
      cells[i].x = `${i - 69}`;
    } else if (i < 90) {
      cells[i].y = "I";
      cells[i].x = `${i - 79}`;
    } else if (i < 100) {
      cells[i].y = "J";
      cells[i].x = `${i - 89}`;
    }
    cells[i].yx = `${cells[i].y}${cells[i].x}`;
    cells[i].ySpaceX = `${cells[i].y} ${cells[i].x}`;
  }
}

addXYCoordinates($enemyCells);
addXYCoordinates($playerCells);

// Event listeners

$enemyCells.on("click", playerClickFire);
$playerCells.on("click", enemyClickFire);
$restart.on("click", () => location.reload());
// To-do: add actual game reset function, just reloading for MVP for now

// Ship class

class Ship {
  constructor(
    side,
    className,
    displayName,
    cellLength,
    direction,
    cellsOccupied
  ) {
    this.side = side;
    this.className = className;
    this.displayName = displayName;
    this.cellLength = cellLength;
    this.direction = direction;
    this.cellsOccupied = cellsOccupied;
    this.hitsTaken = 0;
    this.sunk = false;
    this.placeOnBoard();
  }
  placeOnBoard() {
    if (this.side) {
      for (let cell of this.cellsOccupied) {
        $enemyCells[cell].occupied = true;
        $enemyCells[cell].shipHere = this;
      }
    } else {
      for (let cell of this.cellsOccupied) {
        $playerCells[cell].occupied = true;
        $playerCells[cell].shipHere = this;
        $playerCells[cell].style.backgroundColor = "#333";
      }
    }
  }
  takeHit() {
    this.hitsTaken++;
    this.checkSunk();
  }
  checkSunk() {
    if (this.hitsTaken === this.cellLength) {
      this.sunk = true;
      sides[this.side].shipsLeft--;
      renderSunkShip(this);
      if (!sides[this.side].shipsLeft) {
        gameOver = true;
        renderGameOver(this.side);
      }
    }
  }
}

// Placeholder simple static ships for now

let playerCarrier = new Ship(
  0,
  "carrier",
  "Aircraft Carrier",
  5,
  "vertical",
  [28, 38, 48, 58, 68]
);
let playerBattleship = new Ship(
  0,
  "battleship",
  "Battleship",
  4,
  "horizontal",
  [81, 82, 83, 84]
);
let playerDestroyer = new Ship(
  0,
  "destroyer",
  "Destroyer",
  3,
  "vertical",
  [32, 42, 52]
);
let playerSubmarine = new Ship(
  0,
  "submarine",
  "Submarine",
  3,
  "horizontal",
  [13, 14, 15]
);
let playerPatrol = new Ship(
  0,
  "patrol",
  "Patrol Boat",
  2,
  "horizontal",
  [55, 56]
);

let enemyCarrier = new Ship(
  1,
  "carrier",
  "Aircraft Carrier",
  5,
  "vertical",
  [28, 38, 48, 58, 68]
);
let enemyBattleship = new Ship(
  1,
  "battleship",
  "Battleship",
  4,
  "horizontal",
  [81, 82, 83, 84]
);
let enemyDestroyer = new Ship(
  1,
  "destroyer",
  "Destroyer",
  3,
  "vertical",
  [32, 42, 52]
);
let enemySubmarine = new Ship(
  1,
  "submarine",
  "Submarine",
  3,
  "horizontal",
  [13, 14, 15]
);
let enemyPatrol = new Ship(
  1,
  "patrol",
  "Patrol Boat",
  2,
  "horizontal",
  [55, 56]
);

// Functions for event handling and gameplay control

function playerClickFire() {
  if (!gameOver && turn % 2 === 0) {
    if (this.firedAt) {
      renderAlreadyFiredAt();
    } else {
      this.firedAt = true;
      turn++;
      renderPlayerFire(this);
      if (this.occupied) {
        this.shipHere.takeHit();
        renderHit(this);
        if (this.shipHere.sunk) {
          enemyTurnTimeout = setTimeout(enemyTimeFire, 5400);
        } else {
          enemyTurnTimeout = setTimeout(enemyTimeFire, 2400);
        }
      } else {
        renderMiss(this);
        enemyTurnTimeout = setTimeout(enemyTimeFire, 2400);
      }
    }
  }
}

function enemyTimeFire() {
  if (!gameOver) {
    let targetCellIndices = [];
    $playerCells.each(function (index) {
      if (!this.firedAt) {
        targetCellIndices.push(index);
      }
    });
    let randomIndex =
      targetCellIndices[Math.floor(Math.random() * targetCellIndices.length)];
    $playerCells[randomIndex].click();
  }
}

// Can click for the computer for presentation demo and testing

function enemyClickFire() {
  clearTimeout(enemyTurnTimeout);
  if (!gameOver && turn % 2) {
    if (this.firedAt) {
      renderAlreadyFiredAt();
    } else {
      this.firedAt = true;
      turn++;
      renderEnemyFire(this);
      enemyHitMissTimeout = setTimeout(() => {
        if (this.occupied) {
          renderHit(this);
          this.shipHere.takeHit();
        } else {
          renderMiss(this);
        }
      }, 1200);
    }
  }
}

// Display rendering functions

function renderPlayerFire(cell) {
  $message1.text(`Firing at ${cell.yx}...`);
  $message1.css({ fontSize: "26px" });
  $message2.css({ display: "none" });
  $message3.css({ display: "none" });
}

function renderEnemyFire(cell) {
  $message1.text("Enemy firing...");
  $message1.css({ fontSize: "26px" });
  $message2.css({ display: "none" });
  $message3.css({ display: "none" });
}

function renderHit(cell) {
  $(cell).text("X");
  $(cell).css({
    color: "#922",
    zIndex: 1,
    fontSize: "200px",
  });
  $(cell).animate({ fontSize: "28px" }, 400, function () {
    $(cell).css({
      zIndex: 0,
      backgroundColor: "#222",
    });
    if (turn % 2 === 0) {
      $message1.text(`Enemy fires at ${cell.yx}`);
    }
    $message2.text("HIT!");
    $message2.css({ fontSize: "60px", color: "#922" });
    $message2.fadeIn();
  });
}

function renderMiss(cell) {
  $(cell).text("/");
  $(cell).css({
    zIndex: 1,
    fontSize: "200px",
  });
  $(cell).animate({ fontSize: "28px" }, 400, function () {
    $(cell).css({
      zIndex: 0,
      backgroundColor: "#aaf",
    });
    if (turn % 2 === 0) {
      $message1.text(`Enemy fires at ${cell.yx}`);
    }
    $message2.text("MISS");
    $message2.css({ fontSize: "60px", color: "#88d" });
    $message2.fadeIn();
  });
}

function renderAlreadyFiredAt() {
  $message1.removeAttr("style");
  $message1.text("Select an open square!");
  $message2.removeAttr("style");
  $message2.text("You can't fire at the same square twice.");
  $message3.css({ display: "none" });
}

function renderSunkShip(ship) {
  let shipInKeyList = sides[ship.side].shipsKey.find(`.${ship.className}`);
  sunkAfterHitTimeout = setTimeout(() => {
    shipInKeyList.css({
      textDecoration: "line-through",
      color: "#c33",
      fontWeight: "bold",
    });
    sunkHighlightKeyTimeout = setTimeout(() => {
      shipInKeyList.css({
        color: "#611",
        fontWeight: "",
      });
      $message3.css({ fontSize: "26px" });
      if (ship.side) {
        $message3.text(`You sank the Enemy's ${ship.displayName}!`);
      } else {
        $message3.text(`The Enemy sank your ${ship.displayName}!`);
      }
      $message3.fadeIn();
    }, 1000);
  }, 400);
}

function renderGameOver(losingSide) {
  gameOverTimeout = setTimeout(() => {
    $message1.css({ display: "none", fontSize: "30px" });
    if (losingSide) {
      $message1.text("GAME OVER! YOU WIN!");
    } else {
      $message1.text("GAME OVER! ENEMY WINS!");
    }
    $message1.fadeIn();
  }, 1400);
}
