
const pairsFoundLabel = document.getElementById('pairs-found');
let totalPairsFound = 0;
let totalPairsInGame = 0;

export function initializeGame(cards) {

    totalPairsFound = 0;
    totalPairsInGame = cards.length / 2;
    pairsFoundLabel.innerText = totalPairsFound.toString();
}

export function addOneToPairsFound(){
    totalPairsFound++;
    pairsFoundLabel.innerText = totalPairsFound.toString();

    checkForWin();
}

// Won check
function checkForWin() {
    if (totalPairsFound === totalPairsInGame) {
        showWinState();
    }
}

function showWinState() {
    const winMessage = document.createElement('div');
    winMessage.id = 'win-message';
    winMessage.className = 'win-message';
    winMessage.innerHTML = `
        <h2>Congratulations!</h2>
        <p>You've found all ${totalPairsFound} pairs.</p>
        <button id="play-again-btn">Play Again</button>
        `

    winMessage.style.position = 'fixed';
    winMessage.style.top = '50%';
    winMessage.style.left = '50%';
    winMessage.style.transform = 'translate(-50%, -50%)';
    winMessage.style.backgroundColor = '#333';
    winMessage.style.padding = '20px';
    winMessage.style.borderRadius = '10px';
    winMessage.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    winMessage.style.zIndex = '100';
    winMessage.style.textAlign = 'center';

    document.body.appendChild(winMessage);

    document.getElementById('play-again-btn').addEventListener('click', resetGame);
}

function resetGame() {
     const winMessage = document.getElementById('win-message');
    if (winMessage) {
        winMessage.remove();
    }

    totalPairsFound = 0;
    pairsFoundLabel.innerText = totalPairsFound.toString();

    resetAllCards();
}

function resetAllCards() {
    //simple solution is to just reload the window. This can be changed later
    window.location.reload();
}

// todo: elapsed time

// todo: remaining time and progressbar

// todo: board size set

export { totalPairsInGame, checkForWin };