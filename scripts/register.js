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
            alert('Registered succesfully. You can now log in.');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.status === 400) {
            const errorText = await response.text();
            alert(`Error when registering: ${errorText}`);
            return;
        }
        
        const errorText = await response.text();
        alert(`Unexpected error when registering: ${response.status} ${response.statusText}\n${errorText}`);
        
    } catch (err) {
        alert('An error has occurred: ' + err.message);
    }
});