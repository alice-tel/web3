import { fetchWithAuth, getToken } from './auth.js';
import { API_BASE_URL } from './config.js';

// Default preference values
export const DEFAULT_PREFERENCES = {
    api: 'placeholder',
    color_found: '#00ff00',
    color_closed: '#ff0000'
};

export async function loadPreferences() {
    try {
        const token = getToken();
        if (!token) {
            console.log('No authentication token, using default preferences');
            return DEFAULT_PREFERENCES;
        }

        const response = await fetchWithAuth(`${API_BASE_URL}/player/preferences`);
        
        if (response.status === 404) {
            console.log('No saved preferences found, using defaults');
            return DEFAULT_PREFERENCES;
        }
        
        if (!response.ok) {
            console.error('Failed to load preferences:', response.status);
            return DEFAULT_PREFERENCES;
        }

        const preferences = await response.json();
        
        return {
            ...DEFAULT_PREFERENCES,
            ...preferences
        };
        
    } catch (error) {
        console.error('Error loading preferences:', error);
        return DEFAULT_PREFERENCES;
    }
}

export async function savePreferences(preferences) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }

        const response = await fetchWithAuth(`${API_BASE_URL}/player/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferences)
        });

        if (!response.ok) {
            throw new Error(`Failed to save preferences: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error saving preferences:', error);
        throw error;
    }
}

export function mapApiPreferenceToUI(apiValue) {
    const mapping = {
        '0': 'character',
        '1': 'Dog',
        '2': 'Cat',
    };
    return mapping[apiValue] || apiValue;
}

export function mapUIToApiPreference(uiValue) {
    const mapping = {
        '0': 'placeholder',
        '1': 'Dog',
        '2': 'Cat',
    };
    return mapping[uiValue] || uiValue;
}

export function applyPreferencesToGameUI(preferences) {
    if (!preferences) return;

    try {
        if (preferences.api) {
            const imageSelect = document.getElementById('image_of_board_input');
            if (imageSelect) {
                const uiValue = mapApiPreferenceToUI(preferences.api);
                imageSelect.value = uiValue;
                
                const changeEvent = new Event('change', { bubbles: true });
                imageSelect.dispatchEvent(changeEvent);
            }
        }

        if (preferences.color_found) {
            const foundColorInput = document.querySelector('.colors__found--card');
            if (foundColorInput) {
                foundColorInput.value = preferences.color_found;
                
                const inputEvent = new Event('input', { bubbles: true });
                foundColorInput.dispatchEvent(inputEvent);
            }
        }

        if (preferences.color_closed) {
            const cardColorInput = document.querySelector('.colors__card--card');
            if (cardColorInput) {
                cardColorInput.value = preferences.color_closed;
                
                const inputEvent = new Event('input', { bubbles: true });
                cardColorInput.dispatchEvent(inputEvent);
            }
        }

        console.log('Applied preferences to game UI:', preferences);
        
    } catch (error) {
        console.error('Error applying preferences to UI:', error);
    }
}

export function getPreferencesFromUI() {
    const preferences = {};
    
    const imageSelect = document.getElementById('image_of_board_input');
    if (imageSelect && imageSelect.value) {
        preferences.api = mapUIToApiPreference(imageSelect.value);
    }
    
    const foundColorInput = document.querySelector('.colors__found--card');
    if (foundColorInput && foundColorInput.value) {
        preferences.color_found = foundColorInput.value;
    }
    
    const cardColorInput = document.querySelector('.colors__card--card');
    if (cardColorInput && cardColorInput.value) {
        preferences.color_closed = cardColorInput.value;
    }
    
    return preferences;
}

export function validatePreferences(preferences) {
    if (!preferences || typeof preferences !== 'object') {
        return false;
    }
    
    const validApis = ['placeholder', 'Dog', 'Cat'];
    if (preferences.api && !validApis.includes(preferences.api)) {
        console.warn('Invalid API preference:', preferences.api);
        return false;
    }
    
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    if (preferences.color_found && !hexColorRegex.test(preferences.color_found)) {
        console.warn('Invalid color_found preference:', preferences.color_found);
        return false;
    }
    
    if (preferences.color_closed && !hexColorRegex.test(preferences.color_closed)) {
        console.warn('Invalid color_closed preference:', preferences.color_closed);
        return false;
    }
    
    return true;
}