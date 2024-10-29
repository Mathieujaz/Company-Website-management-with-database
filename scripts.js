//FOR LOGIN AND SIGN IN + CREATING ARRAY
console.log("JavaScript is loaded and running!");
// Array to hold all clients
let clients = JSON.parse(localStorage.getItem('clients')) || [];

// Function to register a new user
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    

    // Create a new client object
    let newClient = {
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        address: address
    };

    // Add the new client to the clients array
    clients.push(newClient);

    // Save the updated array in local storage
    localStorage.setItem('clients', JSON.stringify(clients));

    // Redirect to login page after registration
    window.location.href = './HomePage.html';
}

// Function to login a user
function loginUser() {
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    // Find the user in the clients array
    let foundUser = clients.find(client => 
        client.username === enteredUsername && client.password === enteredPassword);
    
    if (foundUser) {
        // Redirect to the client dashboard
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = './ClientDash.html';
    } else {
        alert('Invalid username or password.');
    }
}


// to edit account (client)
function submitChanges() {
    const updatedName = document.getElementById('name').value;
    const updatedUsername = document.getElementById('username').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;
    const updatedAddress = document.getElementById('address').value;

    // Get the currently logged-in user (could be stored during login)
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Assuming you store the logged-in user here

    // Get all clients from localStorage
    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    // Find the current client in the array
    let clientIndex = clients.findIndex(client => client.username === currentUser.username);

    if (clientIndex !== -1) {
        // Update the found client object with the new data
        clients[clientIndex] = {
            username: updatedUsername,
            password: clients[clientIndex].password, // Keep the same password
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone,
            address: updatedAddress
        };

        // Save the updated clients array back to localStorage
        localStorage.setItem('clients', JSON.stringify(clients));

        // Also update the currently logged-in user data
        localStorage.setItem('currentUser', JSON.stringify(clients[clientIndex]));

        // Notify the user and redirect to the dashboard
        alert('Account updated successfully!');
        window.location.href = './ClientDash.html';
    
}
}


//sign out 
function signOut() {
    // Clear user data from localStorage (or session data if you had that)
    localStorage.removeItem('user');

    // Redirect to the main page after signing out
    window.location.href = 'mainpage.html';
}

//delete account 
function deleteAccount() {
    // Get the currently logged-in user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // Ask for user confirmation
        const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (confirmation) {
            // Get all clients from localStorage
            let clients = JSON.parse(localStorage.getItem('clients')) || [];

            // Find the index of the current user in the clients array
            let clientIndex = clients.findIndex(client => client.username === currentUser.username);

            if (clientIndex !== -1) {
                // Remove the client from the array
                clients.splice(clientIndex, 1);

                // Save the updated clients array back to localStorage
                localStorage.setItem('clients', JSON.stringify(clients));

                // Clear the current user data
                localStorage.removeItem('currentUser');

                // Notify the user
                alert('Your account has been deleted successfully.');

                // Redirect to the main page or login page
                window.location.href = 'mainpage.html';
            } else {
                alert('Account not found.');
            }
        }
    } else {
        alert('No user is currently logged in.');
    }
}


// Function to book a service
function bookService(serviceName) {
    const bookingDate = prompt("Enter a date for booking (YYYY-MM-DD):");

    if (bookingDate) {
        const service = { name: serviceName, date: bookingDate };
        bookedServices.push(service);

        // Save the updated booked services list in localStorage
        localStorage.setItem('bookedServices', JSON.stringify(bookedServices));

        //displayBookedServices();
        alert(`${serviceName} booked on ${bookingDate}`);
        generateBillsFromBookings();
    

    }
}

// Function to display booked services on the Offered Services page
function displayBookedServices() {
    const bookedServicesList = document.getElementById('bookedServicesList');
    bookedServicesList.innerHTML = '';

    if (bookedServices.length === 0) {
        bookedServicesList.textContent = "No services booked.";
    } else {
        bookedServices.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.textContent = `${service.name} on ${service.date}`;
            bookedServicesList.appendChild(serviceItem);
        });
    }
}

// Function to display future and past services on the Overview page
function displayOverview() {
    // Reload booked services from localStorage to ensure data is up-to-date
    bookedServices = JSON.parse(localStorage.getItem('bookedServices')) || [];

    const futureServicesDiv = document.getElementById('futureServices');
    const pastServicesDiv = document.getElementById('pastServices');
    futureServicesDiv.innerHTML = '';
    pastServicesDiv.innerHTML = '';

    const currentDate = new Date();

    bookedServices.forEach(service => {
        const serviceDate = new Date(service.date);
        const serviceItem = document.createElement('div');
        serviceItem.textContent = `${service.name} on ${service.date}`;

        if (serviceDate >= currentDate) {
            futureServicesDiv.appendChild(serviceItem);
        } else {
            pastServicesDiv.appendChild(serviceItem);
        }
    });

    if (!futureServicesDiv.hasChildNodes()) {
        futureServicesDiv.textContent = "No future services booked.";
    }
    if (!pastServicesDiv.hasChildNodes()) {
        pastServicesDiv.textContent = "No past services available.";
    }
}

// Function to display and manage cancelable services on the Cancel Service page
function displayCancelableServices() {
    const cancelServicesList = document.getElementById('cancelServicesList');
    cancelServicesList.innerHTML = '';

    if (bookedServices.length === 0) {
        cancelServicesList.textContent = "No services available to cancel.";
    } else {
        bookedServices.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.innerHTML = `
                <p>${service.name} on ${service.date}</p>
                <button onclick="cancelService(${index})">Cancel Service</button>
            `;
            cancelServicesList.appendChild(serviceItem);
        });
    }
}

// Function to cancel a service
function cancelService(index) {
    const canceledService = bookedServices.splice(index, 1)[0];
    alert(`${canceledService.name} on ${canceledService.date} has been canceled.`);

    // Update the localStorage with the modified booked services list
    localStorage.setItem('bookedServices', JSON.stringify(bookedServices));
    let bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills = bills.filter(bill => !(bill.service === canceledService.name && bill.date === canceledService.date));

    // Save the updated bills in localStorage
    localStorage.setItem('bills', JSON.stringify(bills));
    displayCancelableServices();  // Refresh the list after canceling
}
// Refresh the bills list if on the ViewBills page
if (document.getElementById('billsList')) {
    displayBills();
}

// Call functions on specific pages based on their elements
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('availableServices')) displayAvailableServices();
    if (document.getElementById('bookedServicesList')) displayBookedServices();
    if (document.getElementById('futureServices')) displayOverview();
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
    if (document.getElementById('billsList')) displayBills(); 
});






// Array to hold all booked services (initialize from local storage or as an empty array)



function generateBillsFromBookings() {
    const bookedServices = JSON.parse(localStorage.getItem('bookedServices')) || [];
    const bills = bookedServices.map(service => ({
        date: service.date,
        service: service.name,
        amount: `$${Math.floor(Math.random() * 50 + 100)}`, // Random price between $100 and $150
        status:  "Unpaid" // Randomly assign "Paid" or "Unpaid"
    }));

    localStorage.setItem('bills', JSON.stringify(bills)); // Save bills in local storage
}



function displayBills() {
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = ''; // Clear any existing content

    const bills = JSON.parse(localStorage.getItem('bills')) || [];

    if (bills.length === 0) {
        billsList.textContent = "No bills available.";
    } else {
        bills.forEach(bill => {
            const billDiv = document.createElement('div');
            billDiv.classList.add('bill-item');
            billDiv.innerHTML = `
                <p>Date: ${bill.date}</p>
                <p>Service: ${bill.service}</p>
                <p>Amount: ${bill.amount}</p>
                <p>Status: ${bill.status}</p>
            `;
            billsList.appendChild(billDiv);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('availableServices')) displayAvailableServices();
    if (document.getElementById('billsList')) displayBills();
});



document.addEventListener("DOMContentLoaded", () => {
    const service1Desc = document.getElementById("service1Desc");
    const service2Desc = document.getElementById("service2Desc");

    // Retrieve custom descriptions from localStorage if they exist
    const service1Text = localStorage.getItem("service1");
    const service2Text = localStorage.getItem("service2");

    // Update descriptions if custom text is found
    if (service1Text) service1Desc.textContent = service1Text;
    if (service2Text) service2Desc.textContent = service2Text;
});