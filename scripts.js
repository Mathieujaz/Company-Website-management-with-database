function registerUser() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('adress').value;

    // Create a user object
    const user = {
        name: name,
        username: username,
        password: password,
        phone: phone,
        email: email,
        address: address
    };

    // Save user object in local storage
    localStorage.setItem(username, JSON.stringify(user));

    // Optionally redirect to the login page
    window.location.href = './HomePage.html'; // Redirect to homepage or login page
}

function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Retrieve user data from local storage
    const user = JSON.parse(localStorage.getItem(username));

    // Check if user exists and password matches
    if (user && user.password === password) {
        alert("Login successful!");
        // Redirect to client dashboard or home page
        window.location.href = './clientdash.html'; 
    } else {
        alert("Invalid username or password.");
    }
}
