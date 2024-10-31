
/*
let clients = JSON.parse(localStorage.getItem('clients')) || [];

function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    let newClient = {
        username: username,
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

function loginUser() {
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    let foundUser = clients.find(client => 
        client.username === enteredUsername && client.password === enteredPassword);

    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = './ClientDash.html';
    } else {
        alert('Invalid username or password.');
    }
}

function submitChanges() {
    const updatedName = document.getElementById('name').value;
    const updatedUsername = document.getElementById('username').value;
    const updatedEmail = document.getElementById('email').value;
    const updatedPhone = document.getElementById('phone').value;
    const updatedAddress = document.getElementById('address').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let clientIndex = clients.findIndex(client => client.username === currentUser.username);

    if (clientIndex !== -1) {
        clients[clientIndex] = {
            username: updatedUsername,
            password: clients[clientIndex].password,
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

function signOut() {
    localStorage.removeItem('user');
    window.location.href = 'mainpage.html';
}

function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (confirmation) {
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            let clientIndex = clients.findIndex(client => client.username === currentUser.username);

            if (clientIndex !== -1) {
                clients.splice(clientIndex, 1);
                localStorage.setItem('clients', JSON.stringify(clients));
                localStorage.removeItem('currentUser');

                alert('Your account has been deleted successfully.');
                window.location.href = 'mainpage.html';
            } else {
                alert('Account not found.');
            }
        }
    } else {
        alert('No user is currently logged in.');
    }
}

function bookService(serviceName) {
    const bookingDate = prompt("Enter a date for booking (YYYY-MM-DD):");

    if (bookingDate) {
        let bookedServices = JSON.parse(localStorage.getItem('bookedServices')) || [];
        const service = { name: serviceName, date: bookingDate };
        bookedServices.push(service);

        localStorage.setItem('bookedServices', JSON.stringify(bookedServices));
        alert(`${serviceName} booked on ${bookingDate}`);

        generateBillsFromBookings();
        displayOverview();
    }
}

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

function displayOverview() {
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

function displayCancelableServices() {
    bookedServices = JSON.parse(localStorage.getItem('bookedServices')) || [];
    const cancelServicesList = document.getElementById('cancelServicesList');
    const noServicesMessage = document.getElementById('noServicesMessage');
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
    const canceledService = bookedServices.splice(index, 1)[0];
    alert(`${canceledService.name} on ${canceledService.date} has been canceled.`);
    localStorage.setItem('bookedServices', JSON.stringify(bookedServices));

    let bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills = bills.filter(bill => !(bill.service === canceledService.name && bill.date === canceledService.date));
    localStorage.setItem('bills', JSON.stringify(bills));

    displayCancelableServices();
}

if (document.getElementById('billsList')) {
    displayBills();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('availableServices')) displayAvailableServices();
    if (document.getElementById('bookedServicesList')) displayBookedServices();
    if (document.getElementById('futureServices')) displayOverview();
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
    if (document.getElementById('billsList')) displayBills();
});

function generateBillsFromBookings() {
    const bookedServices = JSON.parse(localStorage.getItem('bookedServices')) || [];
    const bills = bookedServices.map(service => ({
        date: service.date,
        service: service.name,
        amount: `$${Math.floor(Math.random() * 50 + 100)}`,
        status: "Unpaid"
    }));

    localStorage.setItem('bills', JSON.stringify(bills));

    if (document.getElementById('billsList')) {
        displayBills();
    }
}

function displayBills() {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = '';

    if (bills.length === 0) {
        billsList.textContent = "No bills available.";
    } else {
        bills.forEach(bill => {
            const billDiv = document.createElement('div');
            billDiv.style.backgroundColor = '#f0c3a2';
            billDiv.style.color = '#333333';
            billDiv.style.padding = '15px';
            billDiv.style.borderRadius = '10px';
            billDiv.style.margin = '10px 0';

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
    const service1Desc = document.getElementById("service1Desc");
    const service2Desc = document.getElementById("service2Desc");

    const service1Text = localStorage.getItem("service1");
    const service2Text = localStorage.getItem("service2");

    if (service1Text) service1Desc.textContent = service1Text;
    if (service2Text) service2Desc.textContent = service2Text;
});

*/


let clients = JSON.parse(localStorage.getItem('clients')) || [];


function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    let newClient = {
        username: username,
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


function loginUser() {
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    const foundUser = clients.find(client => 
        client.username === enteredUsername && client.password === enteredPassword);

    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = './ClientDash.html';
    } else {
        alert('Invalid username or password.');
    }
}


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

function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'mainpage.html';
}


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
