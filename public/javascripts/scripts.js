function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url; // Redirect to the URL provided by the server
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
}