import { fetchWithAuth, getToken } from "./auth.js";
import { API_BASE_URL } from "./config.js";

const BACKEND_URL = API_BASE_URL;

const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const successDiv = document.getElementById('success-message');
const form = document.getElementById('preferencesForm');
const saveButton = document.getElementById('saveButton');

const emailInput = document.getElementById('email');
const apiSelect = document.getElementById('api');
const colorFound = document.getElementById('color_found');
const colorClosed = document.getElementById('color_closed');

const foundPreview = document.getElementById('foundPreview');
const closedPreview = document.getElementById('closedPreview');

function extractPlayerIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.id;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

function getPlayerId() {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const playerId = extractPlayerIdFromToken(token);
  if (!playerId) {
    throw new Error('Could not extract player ID from token');
  }
  
  return parseInt(playerId);
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  successDiv.style.display = 'none';
}

function showSuccess(message) {
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
}

function hideMessages() {
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
}

function updateColorPreviews() {
  foundPreview.style.backgroundColor = colorFound.value;
  closedPreview.style.backgroundColor = colorClosed.value;
}

colorFound.addEventListener('input', updateColorPreviews);
colorClosed.addEventListener('input', updateColorPreviews);

function setupApiSelect() {
  if (apiSelect.options.length > 0) return;

  const apiOptions = [
    { value: '0', text: 'Placeholder Images' },
    { value: '1', text: 'Dog Images' },
    { value: '2', text: 'Cat Images' },
  ];
  
  apiOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    apiSelect.appendChild(optionElement);
  });
}

async function loadPreferences() {
  try {
    loadingDiv.style.display = 'block';
    form.style.display = 'none';
    hideMessages();

    setupApiSelect();

    const prefsResponse = await fetchWithAuth(`${BACKEND_URL}/player/preferences`);
    if (prefsResponse.status === 404) {
      console.log("No existing preferences found, using defaults");
    } else if (!prefsResponse.ok) {
      throw new Error(`Failed to load preferences: ${prefsResponse.status}`);
    } else {
      const prefs = await prefsResponse.json();
      
      apiSelect.value = prefs.api || "placeholder";
      colorFound.value = prefs.color_found || "#00ff00";
      colorClosed.value = prefs.color_closed || "#ff0000";
    }

    const emailResponse = await fetchWithAuth(`${BACKEND_URL}/player/email`);
    if (emailResponse.status === 404) {
      console.log("No email found for player");
    } else if (!emailResponse.ok) {
      throw new Error(`Failed to load email: ${emailResponse.status}`);
    } else {
      const emailJson = await emailResponse.json();
      emailInput.value = emailJson.email || "";
    }

    if (!apiSelect.value) apiSelect.value = "placeholder";
    if (!colorFound.value) colorFound.value = "#00ff00";
    if (!colorClosed.value) colorClosed.value = "#ff0000";

    updateColorPreviews();

    document.dispatchEvent(new CustomEvent("preferencesUpdated", {
      detail: {
        api: apiSelect.value,
        color_found: colorFound.value,
        color_closed: colorClosed.value,
        email: emailInput.value
      }
    }));

    loadingDiv.style.display = 'none';
    form.style.display = 'flex';

  } catch (error) {
    console.error("Error loading preferences or email:", error);
    loadingDiv.style.display = 'none';
    form.style.display = 'flex';
    showError(`Could not load preferences: ${error.message}`);
    
    apiSelect.value = "placeholder";
    colorFound.value = "#00ff00";
    colorClosed.value = "#ff0000";
    updateColorPreviews();
  }
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';
  hideMessages();

  try {
    const playerId = getPlayerId();
    
    const prefsData = {
      id: playerId,
      api: apiSelect.value,
      color_found: colorFound.value,
      color_closed: colorClosed.value
    };

    const prefsSave = await fetchWithAuth(`${BACKEND_URL}/player/preferences`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prefsData)
    });

    if (prefsSave.status === 404) {
      throw new Error("Player not found");
    }
    if (!prefsSave.ok) {
      const errorText = await prefsSave.text();
      throw new Error(`Failed to save preferences: ${prefsSave.status} - ${errorText}`);
    }

    if (emailInput.value.trim()) {
      const emailSave = await fetchWithAuth(`${BACKEND_URL}/player/email`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailInput.value })
      });

      if (emailSave.status === 404) {
        throw new Error("Player not found for email update");
      }
      if (emailSave.status !== 204) {
        const errorText = await emailSave.text();
        throw new Error(`Failed to update email: ${emailSave.status} - ${errorText}`);
      }
    }

    showSuccess("Preferences saved successfully.");

    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'preferencesUpdated',
          preferences: {
            email: emailInput.value,
            ...prefsData
          }
        }, window.location.origin);
      }
      
      document.dispatchEvent(new CustomEvent("preferencesUpdated", {
        detail: {
          email: emailInput.value,
          ...prefsData
        }
      }));
      
    } catch (error) {
      console.log('Could not notify parent window:', error);
    }

  } catch (error) {
    console.error("Error saving preferences:", error);
    showError(`Error saving preferences: ${error.message}`);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Save Preferences';
  }
});

function checkAuthentication() {
  const token = getToken();
  if (!token) {
    showError('You must be logged in to access preferences. Please log in first.');
    form.style.display = 'none';
    loadingDiv.style.display = 'none';
    
    const loginLink = document.createElement('div');
    loginLink.innerHTML = '<a href="login.html" style="color: #4CAF50; text-decoration: underline;">Go to Login Page</a>';
    document.querySelector('.preferences-container').appendChild(loginLink);
    
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (checkAuthentication()) {
    loadPreferences();
  }
});

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'requestPreferencesReload') {
    loadPreferences();
  }
});