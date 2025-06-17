import { fetchWithAuth, getToken, removeToken } from './auth.js';
import { API_BASE_URL } from './config.js';

let preferencesLoaded = false;

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

async function loadUserPreferences() {
    try {
        const token = getToken();
        if (!token) {
            return null;
        }

        const response = await fetchWithAuth(`${API_BASE_URL}/player/preferences`);
        
        if (response.status === 404) {
            return null;
        }
        
        if (!response.ok) {
            console.error('Failed to load preferences:', response.status);
            return null;
        }

        const preferences = await response.json();
        return preferences;
        
    } catch (error) {
        console.error('Error loading user preferences:', error);
        return null;
    }
}

function mapApiToUIValue(apiValue) {
    return apiValue;
}

function applyPreferencesToUI(preferences) {
    if (!preferences) return;

    const apiPref = preferences.api || preferences.preferred_api;

    try {
        const waitForElement = (selector, callback, maxAttempts = 50) => {
            let attempts = 0;
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                    return true;
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkElement, 100);
                } else {
                    console.warn(`Element ${selector} not found after ${maxAttempts} attempts`);
                }
                return false;
            };
            checkElement();
        };

        if (apiPref) {
            waitForElement('#image_of_board_input', (imageSelect) => {
                const mappedValue = mapApiToUIValue(apiPref);
                const optionExists = Array.from(imageSelect.options).some(option => option.value === mappedValue);
                if (optionExists) {
                    imageSelect.value = mappedValue;
                    imageSelect.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.warn('Mapped API value not found in select options:', mappedValue);
                }
            });
        }

        if (preferences.color_found) {
            waitForElement('.colors__found--card', (foundColorInput) => {
                foundColorInput.value = preferences.color_found;
                foundColorInput.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }

        if (preferences.color_closed) {
            waitForElement('.colors__card--card', (cardColorInput) => {
                cardColorInput.value = preferences.color_closed;
                cardColorInput.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }

        
    } catch (error) {
        console.error('Error applying preferences to UI:', error);
    }
}

export async function initializeUserPreferences() {
    if (preferencesLoaded) {
        return;
    }

    try {
        const preferences = await loadUserPreferences();
        if (preferences) {
            applyPreferencesToUI(preferences);
            preferencesLoaded = true;
        }
    } catch (error) {
        console.error('Error initializing preferences:', error);
    }
}

document.addEventListener('preferencesUpdated', (event) => {
    applyPreferencesToUI(event.detail);
});

window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'preferencesUpdated') {
        applyPreferencesToUI(event.data.preferences);
    }
});

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
        const response = await fetchWithAuth(`${API_BASE_URL}/game/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        });

        if (response.ok) {
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
    
    const token = getToken();
    if (!token) {
        return;
    }

    if (!gameCompleted) {
        return;
    }

    try {
        const playerId = extractPlayerIdFromToken(token);
        if (!playerId) {
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

        const success = await saveGameScore(gameData);
        
        if (success) {
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
        const uiToApiMapping = {
            '0': 'placeholder',
            '1': 'Dog',
            '2': 'Cat',
        };
        settings.api = uiToApiMapping[imageSelect.value] || imageSelect.value;
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
    let userDisplay = document.querySelector('.user-display');

    if (!token) {
        if (!userDisplay) {
            userDisplay = document.createElement('div');
            userDisplay.className = 'user-display';
            userDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
            `;
            document.body.appendChild(userDisplay);
        }
        userDisplay.innerHTML = `
            <span>You are not logged in.</span>
            <a href="login.html" style="
                background: #2196F3; 
                color: white; 
                text-decoration: none;
                padding: 4px 8px; 
                border-radius: 3px; 
                font-size: 12px;
                transition: background 0.2s;
            " onmouseover="this.style.background='#1976D2'" onmouseout="this.style.background='#2196F3'">
                Login / Register
            </a>
        `;
        return;
    }

    try {
        const playerInfo = await getPlayerInfo();
        if (!playerInfo) return;

        if (!userDisplay) {
            userDisplay = document.createElement('div');
            userDisplay.className = 'user-display';
            userDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
            `;
            document.body.appendChild(userDisplay);
        }
        
        userDisplay.innerHTML = `
            <span>Welcome, <strong>${playerInfo.username || 'Player'}</strong>!</span>
            <a href="preferences.html" style="
                background: #4CAF50; 
                color: white; 
                text-decoration: none;
                padding: 4px 8px; 
                border-radius: 3px; 
                font-size: 12px;
                transition: background 0.2s;
            " onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">
                Preferences
            </a>
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
    
    const userDisplay = document.querySelector('.user-display');
    if (userDisplay) {
        userDisplay.remove();
    }
    
    preferencesLoaded = false;
    
    window.location.reload();
};


document.addEventListener('DOMContentLoaded', async () => {    

    await displayUserInfo();
        setTimeout(async () => {
        await initializeUserPreferences();
    }, 200);
    
    setInterval(displayUserInfo, 5000);
});

(async () => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            setTimeout(async () => {
                await initializeUserPreferences();
            }, 300);
        });
    } else {
        setTimeout(async () => {
            await initializeUserPreferences();
        }, 100);
    }
})();