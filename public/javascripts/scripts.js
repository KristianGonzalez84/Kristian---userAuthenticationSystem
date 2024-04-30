function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            console.log('Logout response:', response);
            if (response.redirected) {
                console.log('Redirecting to:', response.url);
                window.location.href = response.url; // Redirect to the URL provided by the server
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }
}