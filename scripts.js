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

/*
// Array to hold all offered services
const services = [
    { id: 1, name: "Residential Cleaning", description: "Thorough cleaning of your home, including dusting, vacuuming, and sanitizing surfaces." },
    { id: 2, name: "Commercial Cleaning", description: "Professional cleaning services for offices and businesses to maintain a clean work environment." },
    { id: 3, name: "Deep Cleaning", description: "Intensive cleaning that covers all areas, including those often overlooked." },
    { id: 4, name: "Move-In/Move-Out Cleaning", description: "Cleaning services tailored for moving, ensuring spaces are spotless." },
    { id: 5, name: "Carpet Cleaning", description: "Deep cleaning of carpets using specialized equipment and solutions." },
    { id: 6, name: "Window Cleaning", description: "Professional cleaning of windows, both inside and out." },
    { id: 7, name: "Post-Construction Cleaning", description: "Cleaning services to remove debris and dust after construction work." },
    { id: 8, name: "Green Cleaning", description: "Eco-friendly cleaning services that use sustainable products." },
];

// Function to display offered services
function displayOfferedServices() {
    const servicesContainer = document.getElementById('services-list');
    if (!servicesContainer) return; // Check if the element exists

    servicesContainer.innerHTML = ''; // Clear existing content

    services.forEach(service => {
        const serviceInfo = `${service.name}: ${service.description}`;
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('service-item');
        serviceItem.textContent = serviceInfo;

        servicesContainer.appendChild(serviceItem);
    });
}


// Call the function when the page loads
window.onload = function() {
   displayOfferedServices(); // Call function only on the offered services page
    }
*/
// Array of offered services (this can be extended or modified easily)
/*const services = [
    { id: 1, name: "Residential Cleaning", description: "Thorough cleaning of your home, including dusting, vacuuming, and sanitizing surfaces." },
    { id: 2, name: "Commercial Cleaning", description: "Professional cleaning services for offices and businesses to maintain a clean work environment." },
    { id: 3, name: "Deep Cleaning", description: "Intensive cleaning that covers all areas, including those often overlooked." },
    { id: 4, name: "Move-In/Move-Out Cleaning", description: "Cleaning services tailored for moving, ensuring spaces are spotless." },
    { id: 5, name: "Carpet Cleaning", description: "Deep cleaning of carpets using specialized equipment and solutions." },
    { id: 6, name: "Window Cleaning", description: "Professional cleaning of windows, both inside and out." },
    { id: 7, name: "Post-Construction Cleaning", description: "Cleaning services to remove debris and dust after construction work." },
    { id: 8, name: "Green Cleaning", description: "Eco-friendly cleaning services that use sustainable products." }
];

// Function to display the offered services
function displayOfferedServices() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = ''; // Clear the list before populating it

    // Loop through the services array
    services.forEach(service => {
        // Create a div to hold each service's details
        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('service-item');

        // Create a heading for the service name
        const serviceName = document.createElement('h3');
        serviceName.textContent = service.name;

        // Create a paragraph for the service description
        const serviceDescription = document.createElement('p');
        serviceDescription.textContent = service.description;

        // Create a button to schedule the service
        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = 'Schedule';
        scheduleButton.onclick = () => selectService(service.name); // Pass service name to selectService

        // Append name, description, and button to the service div
        serviceDiv.appendChild(serviceName);
        serviceDiv.appendChild(serviceDescription);
        serviceDiv.appendChild(scheduleButton);

        // Append the service div to the servicesList div
        servicesList.appendChild(serviceDiv);
    });
}

// Function to handle service selection for scheduling
let selectedServiceName = null;

function selectService(serviceName) {
    // Save the selected service name
    selectedServiceName = serviceName;

    // Show the scheduling section and display the selected service name
    document.getElementById('selectedService').textContent = `You selected: ${serviceName}`;
    document.getElementById('scheduleSection').style.display = 'block';
}

// Function to confirm scheduling of a service
function scheduleService() {
    const scheduleDate = document.getElementById('scheduleDate').value;
    
    if (!scheduleDate) {
        alert('Please select a date to schedule the service.');
        return;
    }

    // Display confirmation message (this can be replaced with any further logic you want to add)
    alert(`Service "${selectedServiceName}" has been scheduled for ${scheduleDate}.`);

    // Reset the scheduling section
    document.getElementById('scheduleSection').style.display = 'none';
    document.getElementById('scheduleDate').value = '';
}

// Call this function to display the services when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayOfferedServices();

    // Add event listener for the confirm schedule button
    document.getElementById('confirmSchedule').addEventListener('click', scheduleService);
});
*/
// Array of offered services

// Array of offered services (static, hardcoded in the frontend)
const services = [
    { id: 1, name: "Residential Cleaning", description: "Thorough cleaning of your home, including dusting, vacuuming, and sanitizing surfaces." },
    { id: 2, name: "Commercial Cleaning", description: "Professional cleaning services for offices and businesses to maintain a clean work environment." }
   
];

// Function to display the offered services dynamically
function displayOfferedServices() {
    const servicesList = document.getElementById('servicesList');
 
    servicesList.innerHTML = ''; // Clear any existing content

    // Loop through the services array and create HTML elements for each service
    services.forEach(service => {
        console.log(`Creating service for: ${service.name}`); // Debugging message

        const serviceDiv = document.createElement('div');
        serviceDiv.classList.add('service-item');

        const serviceName = document.createElement('h3');
        serviceName.textContent = service.name; // Set service name

        const serviceDescription = document.createElement('p');
        serviceDescription.textContent = service.description; // Set service description

        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = `Select ${service.name}`; // Button label
        scheduleButton.onclick = () => selectService(service.name); // Attach click event to button

        // Append name, description, and button to the service div
        serviceDiv.appendChild(serviceName);
        serviceDiv.appendChild(serviceDescription);
        serviceDiv.appendChild(scheduleButton);

        // Append the service div to the servicesList div
        servicesList.appendChild(serviceDiv);
    });
}

// Function to handle service selection
function selectService(serviceName) {
    console.log(`Service selected: ${serviceName}`);
    document.getElementById('selectedService').textContent = `You selected: ${serviceName}`; // Display the selected service
    document.getElementById('scheduleSection').style.display = 'block'; // Show the schedule section
}

function confirmScheduling(){
    const selectedService = localStorage.getItem('selectedService');
    const selectedDate = document.getElementById('scheduleDate').value
    alert(`${selectedService} successfully scheduled on ${selectedDate}!`);

    // Store the scheduled service in local storage
    const scheduledServices = JSON.parse(localStorage.getItem('scheduledServices')) || [];
    scheduledServices.push({ serviceName: selectedService, date: selectedDate });
    localStorage.setItem('scheduledServices', JSON.stringify(scheduledServices));

    // Reset the scheduling form
    document.getElementById('scheduleSection').style.display = 'none';
    document.getElementById('scheduleDate').value = ''; 
}
function displayScheduledServices() {
    const scheduledServices = JSON.parse(localStorage.getItem('scheduledServices')) || [];
    const serviceOverview = document.getElementById('serviceOverview');

    if (scheduledServices.length === 0) {
        serviceOverview.textContent = "No services scheduled.";
        return;
    }

    serviceOverview.innerHTML = ''; // Clear any existing content

    scheduledServices.forEach((scheduledService) => {
        const serviceItem = document.createElement('div');
        serviceItem.textContent = `${scheduledService.serviceName} on ${scheduledService.date}`;
        serviceOverview.appendChild(serviceItem);
    });
}


// Ensure the services are displayed after the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, running displayOfferedServices...");
    displayOfferedServices();
});




