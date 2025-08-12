// This script acts as an "Authentication Guard" for all protected pages.
// It should be included in every HTML file inside your /pages/ directory.

(function() {
    // --- CHECK 1: Is anyone logged in at all? ---
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
        // If no user ID is found, they are not logged in.
        // Redirect them to the login page immediately.
        // We use '../' to go UP from the '/pages/' directory to the root where login.html is.
        console.log("Auth Guard: No user ID found. Redirecting to login.");
        window.location.href = '../login.html';
        return; // Stop the script here.
    }

    // --- CHECK 2: Is this a temporary user with an expired session? ---
    const expirationTime = localStorage.getItem('sessionExpiration');
    if (expirationTime) {
        // This key only exists for users who signed up for temporary access.
        // Check if the current time is past the expiration time.
        if (Date.now() > parseInt(expirationTime, 10)) {
            // The session has expired.
            console.log("Auth Guard: Temporary session expired. Logging out.");
            
            // Clear all temporary session data
            localStorage.removeItem('loggedInUserId');
            localStorage.removeItem('loggedInUserRole');
            localStorage.removeItem('loggedInUsername');
            localStorage.removeItem('sessionExpiration');

            // Show a message and redirect to the login page with a special reason
            alert('Your temporary 60-minute session has expired.');
            window.location.href = '../pages/login.html?reason=unregistered';
            return; // Stop the script here.
        }
    }

    // If the script reaches this point, the user is properly logged in and can view the page.
    console.log("Auth Guard: User is authenticated.");
})();
