const pairsFoundLabel = document.getElementById('pairs-found');
const elapsedTimeLabel = document.getElementById('elapsed-time');
const remainingTimeLabel = document.getElementById('remaining-time');
const progressBar = document.querySelector('.info__time__progressbar--bar');

let totalPairsFound = 0;
let totalPairsInGame = 0;

const GAME_DURATION = 2; // 300 seconds (5 minutes)
// const GAME_DURATION = 10; // 10 seconds for testing
let gameStartTime = 0;
let elapsedTime = 0;
let remainingTime = GAME_DURATION;
let gameTimer = null;
let gameActive = false;
let gameStarted = false;

function createNewGameButton() {
    const newGameButton = document.createElement('button');
    newGameButton.id = 'new-game-btn';
    newGameButton.className = 'new-game-button';
    newGameButton.innerText = 'New Game';
    
    newGameButton.addEventListener('click', startNewGame);
    
    const progressBarContainer = document.querySelector('.info__time__progressbar');
    progressBarContainer.parentNode.insertBefore(newGameButton, progressBarContainer.nextSibling);
    
    return newGameButton;
}

document.addEventListener('DOMContentLoaded', () => {
    const justStartedGame = localStorage.getItem('memoryGameJustStarted');
    if (justStartedGame === 'true') {
        gameStarted = true;
        localStorage.removeItem('memoryGameJustStarted'); // Clean up
    }
    
    createNewGameButton();
    resetTimerDisplay();
    
    const newGameBtn = document.getElementById('new-game-btn');
    if (gameStarted) {
        newGameBtn.innerText = 'Restart';
    }
});

function startNewGame() {
    const newGameBtn = document.getElementById('new-game-btn');
    
    if (!gameStarted) {
        gameStarted = true;
        newGameBtn.innerText = 'Restart';
        
        startGameTimer();
    } else {
        localStorage.setItem('memoryGameJustStarted', 'true');
        
        totalPairsFound = 0;
        pairsFoundLabel.innerText = totalPairsFound.toString();
        
        const winMessage = document.getElementById('win-message');
        const timeUpMessage = document.getElementById('time-up-message');
        if (winMessage) winMessage.remove();
        if (timeUpMessage) timeUpMessage.remove();
        
        gameActive = false;
        if (gameTimer) {
            clearInterval(gameTimer);
        }
        
        window.location.reload();
    }
}

export function initializeGame(cards) {
    totalPairsInGame = cards.length / 2;
    
    totalPairsFound = 0;
    pairsFoundLabel.innerText = totalPairsFound.toString();
    
    if (gameStarted) {
        startGameTimer();
    } else {
        resetTimerDisplay();
    }
}

function resetTimerDisplay() {
    elapsedTime = 0;
    remainingTime = GAME_DURATION;
    elapsedTimeLabel.innerText = formatTime(elapsedTime);
    remainingTimeLabel.innerText = formatTime(remainingTime);
    progressBar.style.width = '90%'; 
    progressBar.style.backgroundColor = 'var(--color-text)';
}

function startGameTimer() {
    gameStartTime = Date.now();
    elapsedTime = 0;
    remainingTime = GAME_DURATION;
    gameActive = true;
    
    updateTimerDisplay();
    
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    gameTimer = setInterval(() => {
        if (!gameActive) {
            clearInterval(gameTimer);
            return;
        }
        
        elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
        remainingTime = Math.max(0, GAME_DURATION - elapsedTime);
        
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            gameTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    elapsedTimeLabel.innerText = formatTime(elapsedTime);
    
    remainingTimeLabel.innerText = formatTime(remainingTime);
    
    const progressPercentage = (remainingTime / GAME_DURATION) * 100;
    progressBar.style.width = `${Math.max(0, progressPercentage * 0.9)}%`; // 0.9 to match the 90% max width from CSS
    
    if (remainingTime <= 30) {
        progressBar.style.backgroundColor = '#ff4444'; // red when less than 30 seconds
    } else if (remainingTime <= 60) {
        progressBar.style.backgroundColor = '#ffaa44'; // orange when less than 1 minute
    } else {
        progressBar.style.backgroundColor = 'var(--color-text)'; // default color
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function gameTimeUp() {
    gameActive = false;
    clearInterval(gameTimer);
    
    showTimeUpMessage();
}

function showTimeUpMessage() {
    const timeUpMessage = document.createElement('div');
    timeUpMessage.id = 'time-up-message';
    timeUpMessage.className = 'time-up-message';
    timeUpMessage.innerHTML = `
        <h2>Time's Up!</h2>
        <p>You found ${totalPairsFound} out of ${totalPairsInGame} pairs.</p>
        <p>Final time: ${formatTime(elapsedTime)}</p>
        <button id="play-again-time-up-btn">Play Again</button>
    `;

    document.body.appendChild(timeUpMessage);

    document.getElementById('play-again-time-up-btn').addEventListener('click', resetGame);
}

export function addOneToPairsFound(){
    if (!gameStarted) return;
    
    totalPairsFound++;
    pairsFoundLabel.innerText = totalPairsFound.toString();

    checkForWin();
}

// Won check
function checkForWin() {
    if (totalPairsFound === totalPairsInGame) {
        gameActive = false;
        clearInterval(gameTimer);
        
        handleGameEnd(true);
        
        showWinState();
    }
}

async function handleGameEnd(gameCompleted) {
    try {
        const { onGameEnd, getCurrentGameSettings } = await import('../script.js');
        const gameSettings = getCurrentGameSettings();

        await onGameEnd(elapsedTime, gameCompleted, gameSettings);
                
    } catch (error) {
        console.error('Error handling game end:', error);
    }
}

function showWinState() {
    const winMessage = document.createElement('div');
    winMessage.id = 'win-message';
    winMessage.className = 'win-message';
    winMessage.innerHTML = `
        <h2>Congratulations!</h2>
        <p>You've found all ${totalPairsFound} pairs.</p>
        <p>Final time: ${formatTime(elapsedTime)}</p>
        <p>Time remaining: ${formatTime(remainingTime)}</p>
        <button id="play-again-btn">Play Again</button>
        `

    document.body.appendChild(winMessage);

    document.getElementById('play-again-btn').addEventListener('click', resetGame);
}

function resetGame() {
    const winMessage = document.getElementById('win-message');
    const timeUpMessage = document.getElementById('time-up-message');
    
    if (winMessage) {
        winMessage.remove();
    }
    if (timeUpMessage) {
        timeUpMessage.remove();
    }

    totalPairsFound = 0;
    pairsFoundLabel.innerText = totalPairsFound.toString();
    
    gameActive = false;
    gameStarted = false; 
    
    if (gameTimer) {
        clearInterval(gameTimer);
    }

    resetAllCards();
}

function resetAllCards() {
    //simple solution is to just reload the window. This can be changed later
    window.location.reload();
}

export function stopGameTimer() {
    gameActive = false;
    if (gameTimer) {
        clearInterval(gameTimer);
    }
}

export function getGameTimeInfo() {
    return {
        elapsedTime,
        remainingTime,
        gameActive,
        gameStarted,
        totalDuration: GAME_DURATION
    };
}

// Export the gameStarted flag so other modules can check it
export function isGameActive() {
    return gameActive;
}

// todo: board size set

export { totalPairsInGame, checkForWin };