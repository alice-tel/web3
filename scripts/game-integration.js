import { fetchWithAuth, getToken, removeToken } from './auth.js';
import { API_BASE_URL } from './config.js';

async function getPlayerInfo() {
    try {
        const token = getToken();
        if (!token) return null;

        const response = await fetchWithAuth(`${API_BASE_URL}/player/`);
        if (response.ok) {
            const playerInfo = await response.json();
            return playerInfo;
        }
    } catch (error) {
        console.error('Error getting player info:', error);
    }
    return null;
}

function extractPlayerIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.id;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

export async function saveGameScore(gameData) {
    try {
        console.log('Saving game score:', gameData);
        
        const response = await fetchWithAuth(`${API_BASE_URL}/game/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        });

        if (response.ok) {
            console.log('Game score saved successfully');
            return true;
        } else {
            const errorText = await response.text();
            console.error('Failed to save game score:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.error('Error saving game score:', error);
        return false;
    }
}

export async function onGameEnd(elapsedTime, gameCompleted, gameSettings = {}) {
    console.log('Game ended:', { elapsedTime, gameCompleted, gameSettings });
    
    const token = getToken();
    if (!token) {
        console.log('User not logged in, game score not saved');
        return;
    }

    if (!gameCompleted) {
        console.log('Game not completed, score not saved');
        return;
    }

    try {
        const playerId = extractPlayerIdFromToken(token);
        if (!playerId) {
            console.error('Could not get player ID from token');
            return;
        }

        const gameData = {
            id: parseInt(playerId), 
            score: Math.round(elapsedTime) 
        };

        if (gameSettings.api) {
            gameData.api = gameSettings.api;
        }
        if (gameSettings.colorFound) {
            gameData.color_found = gameSettings.colorFound;
        }
        if (gameSettings.colorClosed) {
            gameData.color_closed = gameSettings.colorClosed;
        }

        console.log('Prepared game data:', gameData);

        const success = await saveGameScore(gameData);
        
        if (success) {
            console.log('Score saved, refreshing leaderboard...');
            setTimeout(() => {
                if (window.leaderboard) {
                    window.leaderboard.refresh();
                }
            }, 1000);
        }

    } catch (error) {
        console.error('Error in onGameEnd:', error);
    }
}

export function getCurrentGameSettings() {
    const settings = {};
    
    const imageSelect = document.getElementById('image_of_board_input');
    if (imageSelect && imageSelect.value) {
        settings.api = imageSelect.value;
    }
    
    const foundColorInput = document.querySelector('.colors__found--card');
    if (foundColorInput && foundColorInput.value) {
        settings.colorFound = foundColorInput.value;
    }
    
    const cardColorInput = document.querySelector('.colors__card--card');
    if (cardColorInput && cardColorInput.value) {
        settings.colorClosed = cardColorInput.value;
    }
    
    return settings;
}

export async function displayUserInfo() {
    const token = getToken();
    if (!token) {
        const userDisplay = document.querySelector('.user-display');
        if (userDisplay) {
            userDisplay.remove();
        }
        return;
    }

    try {
        const playerInfo = await getPlayerInfo();
        if (!playerInfo) return;

        let userDisplay = document.querySelector('.user-display');
        if (!userDisplay) {
            userDisplay = document.createElement('div');
            userDisplay.className = 'user-display';
            document.body.appendChild(userDisplay);
        }
        
        userDisplay.innerHTML = `
            <span>Welcome, <strong>${playerInfo.username || 'Player'}</strong>!</span>
            <button onclick="logout()" style="
                background: #ff4444; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            " onmouseover="this.style.background='#ff6666'" onmouseout="this.style.background='#ff4444'">
                Logout
            </button>
        `;
    } catch (error) {
        console.error('Error displaying user info:', error);
    }
}

window.logout = function() {
    removeToken();
    
    // Remove user display
    const userDisplay = document.querySelector('.user-display');
    if (userDisplay) {
        userDisplay.remove();
    }
    
    window.location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo();
    
    setInterval(displayUserInfo, 5000);
});