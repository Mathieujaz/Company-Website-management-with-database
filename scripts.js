
//OLD WAY FOR REGISTERUSER()
/*let clients = JSON.parse(localStorage.getItem('clients')) || [];


function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    let newClient = {
        username: username,ok
        password: password,
        name: name,
        email: email,
        phone: phone,
        address: address
    };

    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));

    window.location.href = './HomePage.html';
}

*/
//BACKEND FOR REGISTERUSER():
async function registerUser() {

    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    const newClient = { name, username, password, phone, email, address };

try{
        //send a post request to the backend
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient),
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = './HomePage.html';
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (err) {
        console.error(err);
        alert('Failed to register. Please try again later.');
    }
}



async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const user = await response.json();
           localStorage.setItem('currentUser', JSON.stringify(user));
           alert('Login successful!');
            localStorage.setItem('authToken', user.token);
            window.location.href = './ClientDash.html';
        } else {
            const error = await response.text();
            alert('Login failed: ' + error);
        }
    } catch (err) {
        console.error(err);
        alert('Failed to login. Please try again later.');
    }
}
/*
function submitChanges() {
    const updatedName = document.getElementById('name').value;
    const updatedUsername = document.getElementById('username').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;
    const updatedAddress = document.getElementById('address').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const clientIndex = clients.findIndex(client => client.username === currentUser.username);

    if (clientIndex !== -1) {
        clients[clientIndex] = {
            ...clients[clientIndex],
            username: updatedUsername,
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone,
            address: updatedAddress
        };

        localStorage.setItem('clients', JSON.stringify(clients));
        localStorage.setItem('currentUser', JSON.stringify(clients[clientIndex]));

        alert('Account updated successfully!');
        window.location.href = './ClientDash.html';
    }
}

*/
/*
async function submitChanges() {
    const updatedName = document.getElementById('name').value;
    const updatedUsername = document.getElementById('username').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;
    const updatedAddress = document.getElementById('address').value;

    // Get current user ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const updatedData = {
        id: currentUser.id, // Send the user's ID to identify them in the backend
        username: updatedUsername,
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone,
        address: updatedAddress,
    };

    try {
        const response = await fetch('http://localhost:5000/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            const updatedUser = await response.json();

            // Update localStorage with the new user data
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            alert('Account updated successfully!');
            window.location.href = './ClientDash.html';
        } else {
            const errorMessage = await response.text();
            alert('Error updating account: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating your account.');
    }
}
*/
// Update user information
async function submitChanges() {
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = document.getElementById('username').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    const updatedData = {
        id: currentUser.id, // Use the logged-in user's ID
        username,
        name,
        email,
        phone,
        address
    };

    try {
        const response = await fetch('http://localhost:5000/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            // Update local storage with the new user data
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            alert('Profile updated successfully!');
           // window.location.reload(); // Reload to reflect changes
           window.location.href = './ClientDash.html';
        } else {
            const error = await response.text();
            alert('Error updating profile: ' + error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again later.');
    }
}

// Delete user account
async function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('User not logged in');
        console.error('No user found in localStorage');
        return;
    }

    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Account deleted successfully.');
            localStorage.removeItem('currentUser'); // Clear local storage
            window.location.href = './Register.html'; // Redirect to the registration page
        } else {
            const error = await response.text();
            alert('Error deleting account: ' + error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again later.');
    }
}


function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'mainpage.html';
}

/*
function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmation) {
            const clientIndex = clients.findIndex(client => client.username === currentUser.username);
            if (clientIndex !== -1) {
                clients.splice(clientIndex, 1);
                localStorage.setItem('clients', JSON.stringify(clients));
                localStorage.removeItem('currentUser');
                localStorage.removeItem(`scheduledServices_${currentUser.username}`);
                alert('Your account has been deleted successfully.');
                window.location.href = 'mainpage.html';
            }
        }
    }
}
*/
/*
async function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.id) {
        const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Clear session data
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem(`scheduledServices_${currentUser.username}`);
                    alert('Your account has been deleted successfully.');
                    window.location.href = 'mainpage.html'; // Redirect to main page
                } else {
                    const error = await response.text();
                    alert('Error deleting account: ' + error);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred while deleting your account.');
            }
        }
    } else {
        alert('No user is currently logged in.');
    }
}
*/
/*
function bookService(serviceName) {
    const bookingDate = prompt("Enter a date for booking (YYYY-MM-DD):");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;

    if (bookingDate) {
        let bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];
        bookedServices.push({ name: serviceName, date: bookingDate });

        localStorage.setItem(userKey, JSON.stringify(bookedServices));
        alert(`${serviceName} booked on ${bookingDate}`);

        generateBillsFromBookings();
        displayOverview();
    }
}
*/
async function bookService(serviceName) {
    const bookingDate = prompt("Enter a date for booking (YYYY-MM-DD):");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('You must be logged in to book a service.');
        return;
    }

    if (bookingDate) {
        try {
            // Make an API call to create a new booking
            const response = await fetch('http://localhost:5000/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id, // The user's ID from the logged-in session
                    service_name: serviceName, // Name of the service being booked
                    date: bookingDate, // Date provided by the user
                }),
            });

            if (response.ok) {
                alert(`${serviceName} booked on ${bookingDate}`);
                displayOverview(); // Refresh the overview after successful booking
            } else {
                const error = await response.text();
                alert('Error booking service: ' + error);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to book the service. Please try again.');
        }
    }
}



function displayBookedServices() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;
    const bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];

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

function displayOverview() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;
    const bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];

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


function displayCancelableServices() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;
    const bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];

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


function cancelService(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;
    const bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];

    const canceledService = bookedServices.splice(index, 1)[0];
    localStorage.setItem(userKey, JSON.stringify(bookedServices));

    alert(`${canceledService.name} on ${canceledService.date} has been canceled.`);
    displayCancelableServices();
    displayBills(); 
}


function generateBillsFromBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userKey = `scheduledServices_${currentUser.username}`;
    const bookedServices = JSON.parse(localStorage.getItem(userKey)) || [];

   
    const billsKey = `bills_${currentUser.username}`;
    let bills = JSON.parse(localStorage.getItem(billsKey)) || [];

    bookedServices.forEach(service => {
        const existingBill = bills.find(bill => bill.service === service.name && bill.date === service.date);
        if (!existingBill) {
            bills.push({
                date: service.date,
                service: service.name,
                amount: `$${Math.floor(Math.random() * 50 + 100)}`,
                status: "Unpaid"
            });
        }
    });

    localStorage.setItem(billsKey, JSON.stringify(bills));
    displayBills(); 
}

function displayBills() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const bills = JSON.parse(localStorage.getItem(`bills_${currentUser.username}`)) || [];

    const billsList = document.getElementById('billsList');
    billsList.innerHTML = '';

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

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('availableServices')) displayAvailableServices();
    if (document.getElementById('bookedServicesList')) displayBookedServices();
    if (document.getElementById('futureServices')) displayOverview();
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
    if (document.getElementById('billsList')) displayBills();
}
)


function displayAllClientBills() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = '';

    if (clients.length === 0) {
        billsList.textContent = "No clients available.";
        return;
    }

    clients.forEach(client => {
        const clientBills = JSON.parse(localStorage.getItem(`bills_${client.username}`)) || [];

        if (clientBills.length > 0) {
            const clientHeader = document.createElement('h3');
            clientHeader.textContent = `Bills for ${client.username}`;
            billsList.appendChild(clientHeader);

            clientBills.forEach(bill => {
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
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = document.getElementById('billsList') && document.title.includes("Admin");
    if (isAdminPage) {
        displayAllClientBills();
    } else if (document.getElementById('billsList')) {
        displayBills();
    }
    if (document.getElementById('availableServices')) displayAvailableServices();
    if (document.getElementById('bookedServicesList')) displayBookedServices();
    if (document.getElementById('futureServices')) displayOverview();
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
});
