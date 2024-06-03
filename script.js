const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const playWithAIBtn = document.getElementById('playWithAIBtn');
let isXNext = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isTwoPlayerMode = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

twoPlayerBtn.addEventListener('click', () => {
    isTwoPlayerMode = true;
    restartGame();
});

playWithAIBtn.addEventListener('click', () => {
    isTwoPlayerMode = false;
    restartGame();
});

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

restartBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cell = e.target;
    const currentClass = isXNext ? 'X' : 'O';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateStatus();
        if (!isTwoPlayerMode && !isXNext) {
            setTimeout(aiMove, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass;
    gameState[Array.from(cells).indexOf(cell)] = currentClass;
}

function swapTurns() {
    isXNext = !isXNext;
}

function aiMove() {
    let availableCells = [];
    cells.forEach((cell, index) => {
        if (!gameState[index]) {
            availableCells.push(cell);
        }
    });
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.click();
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentClass;
        });
    });
}

function isDraw() {
    return gameState.every(cell => cell !== '');
}

function endGame(draw) {
    if (draw) {
        statusText.textContent = 'Draw!';
    } else {
        statusText.textContent = `${isXNext ? 'X' : 'O'} Wins!`;
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

function updateStatus() {
    statusText.textContent = `Player ${isXNext ? 'X' : 'O'}'s turn`;
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    isXNext = true;
    statusText.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}
