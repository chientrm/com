document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/message');
        const data = await response.json();
        document.getElementById('message').textContent = data.message;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
