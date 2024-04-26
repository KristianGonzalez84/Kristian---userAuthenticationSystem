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

function deleteUser() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        fetch('/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // User successfully deleted, redirect to the homepage or login page
                window.location.href = '/'; // Redirect to homepage
            } else {
                // Handle error response
                console.error('Error deleting user:', response.statusText);
                // Display an error message to the user
                alert('An error occurred while deleting your account. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            // Display an error message to the user
            alert('An error occurred while deleting your account. Please try again later.');
        });
    }
}