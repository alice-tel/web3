import { saveToken } from './auth.js';
import { API_BASE_URL } from './config.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const response = await fetch(`${API_BASE_URL}/memory/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Invalid username or password. Please try again.');
      } else {
        const errorText = await response.text();
        alert(`Login failed: ${response.status} ${response.statusText}\n${errorText}`);
      }
      return;
    }

    // Parse JSON response
    const json = await response.json();
    
    if (json.token) {
      saveToken(json.token);
      window.location.href = 'preferences.html';
    } else {
      alert('Login failed. No token given.');
    }
  } catch (err) {
    alert('An error has occurred: ' + err.message);
  }
});