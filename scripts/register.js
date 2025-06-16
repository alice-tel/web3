import { API_BASE_URL } from './config.js';
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/memory/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.status === 201) {
            alert('Registratie gelukt! Je kunt nu inloggen.');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.status === 400) {
            const errorText = await response.text();
            alert(`Fout bij registreren: ${errorText}`);
            return;
        }
        
        const errorText = await response.text();
        alert(`Onverwachte fout bij registreren: ${response.status} ${response.statusText}\n${errorText}`);
        
    } catch (err) {
        alert('Er is een fout opgetreden: ' + err.message);
    }
});