

async function registerUser() {

    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    const newClient = { name, username, password, phone, email, address };

try{
        
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


async function submitChanges() {
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = document.getElementById('username').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    const updatedData = {
        id: currentUser.id, 
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
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            alert('Profile updated successfully!');
          
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
            localStorage.removeItem('currentUser'); 
            window.location.href = './Register.html'; 
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

async function bookService(serviceId) {
    const bookingDate = prompt("Enter a date for booking (YYYY-MM-DD):");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('You must be logged in to book a service.');
        return;
    }

    if (bookingDate) {
        try {
           
            const response = await fetch('http://localhost:5000/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id, 
                    service_id: serviceId, 
                    date: bookingDate, 
                    status: "booked" 
                }),
            });

            if (response.ok) {
                alert(`Service booked on ${bookingDate}`);
                displayOverview(); 
                
                fetchAndDisplayBills(); 
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


async function fetchClientBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in to view your services.');
        window.location.href = 'HomePage.html'; 
        return [];
    }

    try {
        const response = await fetch(`http://localhost:5000/bookings?user_id=${currentUser.id}`);
        if (response.ok) {
            const bookings = await response.json();
            console.log('Fetched bookings:', bookings); 
            return bookings;
        } else {
            console.error('Failed to fetch bookings.');
            return [];
        }
    } catch (err) {
        console.error('Error fetching bookings:', err);
        return [];
    }
}
async function displayOverview() {
    const futureServicesDiv = document.getElementById('futureServices');
    const pastServicesDiv = document.getElementById('pastServices');


    const bookings = await fetchClientBookings();

    if (!bookings ||bookings.length === 0) {
        futureServicesDiv.innerHTML = '<p>No future services booked.</p>';
        pastServicesDiv.innerHTML = '<p>No past services available.</p>';
        return;
    }
    const currentDate = new Date();
    bookings.forEach(booking => {
        const bookingDate = new Date(booking.date);
     
       const formattedDate = bookingDate.toLocaleDateString('en-CA'); 
        const serviceItem = document.createElement('div');
        serviceItem.classList.add('service-item');
        serviceItem.textContent = `${booking.service_name} on ${formattedDate}`;

        if (bookingDate >= currentDate) {
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
    fetchAndDisplayBills() 
}



async function fetchAndDisplayBills() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
   

    try {
      
        const response = await fetch(`http://localhost:5000/bills?user_id=${currentUser.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch bills.');
        }

        const bills = await response.json(); 
        renderBills(bills); 
    } catch (error) {
        console.error('Error fetching bills:', error);
        const billsList = document.getElementById('billsList');
        billsList.innerHTML = '<p>Unable to load bills. Please try again later.</p>';
    }
}


function renderBills(bills) {
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = ''; 

    if (bills.length === 0) {
        billsList.textContent = "No bills available.";
        return;
    }

    
    bills.forEach((bill) => {
        const billDiv = document.createElement('div');
        billDiv.classList.add('bill-item');
        billDiv.innerHTML = `
            <p>Service: ${bill.service_name}</p>
            <p>Amount: $${bill.amount.toFixed(2)}</p>
            <p>Status: ${bill.status}</p>
        `;
        billsList.appendChild(billDiv);
    });
}



document.addEventListener("DOMContentLoaded", fetchAndDisplayBills);


document.addEventListener("DOMContentLoaded", () => {
   
    if (document.getElementById('bookedServicesList')) displayBookedServices();
   
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
    
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
  
    if (document.getElementById('cancelServicesList')) displayCancelableServices();
});




async function fetchServices() {
    try {
        const response = await fetch('http://localhost:5000/services');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch services.');
            return [];
        }
    } catch (err) {
        console.error('Error fetching services:', err);
        return [];
    }
}


async function loadServices() {
    const serviceList = document.getElementById("serviceList");
    serviceList.innerHTML = "";

    const services = await fetchServices();
    services.forEach(service => {
        const serviceItem = document.createElement("div");
        serviceItem.innerHTML = `
            <input type="text" value="${service.name}" id="service_${service.id}">
            <textarea id="desc_${service.id}">${service.description}</textarea>
            <input type="number" value="${service.price}" id="price_${service.id}" placeholder="Enter price">
            <button onclick="modifyService(${service.id})">Save</button>
            <button onclick="deleteService(${service.id})">Delete</button>
        `;
        serviceList.appendChild(serviceItem);
    });
}

async function addService() {
    const name = document.getElementById("newService").value.trim();
    const description = document.getElementById("newDescription").value.trim();
    const price = document.getElementById("newPrice").value.trim(); 

    try {
        const response = await fetch('http://localhost:5000/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price }),
        });

        if (response.ok) {
            alert('Service added successfully.');
            loadServices();
            document.getElementById('newService').value = '';
            document.getElementById('newDescription').value = '';
            document.getElementById('newPrice').value = '';
        } else {
            alert('Failed to add service.');
        }
    } catch (err) {
        console.error('Error adding service:', err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    
    const addServiceButton = document.getElementById("addServiceButton");
    if (addServiceButton) {
        addServiceButton.addEventListener("click", addService);
    }

    
    if (document.getElementById("serviceList")) {
        loadServices();
    }
});

async function displayAvailableServices() {
    const availableServices = document.getElementById("availableServices");
    availableServices.innerHTML = "";

    const services = await fetchServices();
    services.forEach(service => {
        const serviceBlock = document.createElement("div");
        serviceBlock.classList.add("serviceblock");
        serviceBlock.innerHTML = `
            <p>${service.name}: ${service.description}</p>
            <p>Price: $${service.price}</p>
            <button onclick="bookService(${service.id})">Book Now</button>
        `;
        availableServices.appendChild(serviceBlock);
    });
}


async function modifyService(id) {
    
    const name = document.getElementById(`service_${id}`).value.trim();
    const description = document.getElementById(`desc_${id}`).value.trim();
    const price = document.getElementById(`price_${id}`).value.trim();

   
    if (!name || !description || !price) {
        alert("Please fill in all fields before saving.");
        return;
    }

    console.log("Modifying service with:", { id, name, description, price }); 

    try {
        
        const response = await fetch(`http://localhost:5000/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price }),
        });

        if (response.ok) {
            alert('Service updated successfully!');
            loadServices(); 
        } else {
            const error = await response.text();
            alert('Failed to update service: ' + error);
        }
    } catch (error) {
        console.error('Error updating service:', error);
        alert('An error occurred while updating the service.');
    }
}






async function deleteService(id) {
    const confirmation = confirm("Are you sure you want to delete this service?");
    if (!confirmation) return;

    console.log("Deleting service with ID:", id);
    try {
        const response = await fetch(`http://localhost:5000/services/${id}`, { 
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Service deleted successfully!');
            loadServices(); 
        } else {
            const error = await response.text();
            alert('Failed to delete service: ' + error);
        }
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}

async function fetchAndDisplayAdminBills() {
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = 'Loading bills...';

    try {
        const response = await fetch('http://localhost:5000/admin/bills'); 
        if (!response.ok) {
            throw new Error('Failed to fetch admin bills.');
        }

        const bills = await response.json();

        
        if (bills.length === 0) {
            billsList.textContent = 'No bills available.';
            return;
        }

        billsList.innerHTML = ''; 

        
        bills.forEach(bill => {
            const billDiv = document.createElement('div');
            billDiv.classList.add('bill-item');
            billDiv.innerHTML = `
                <p>Client: ${bill.client_name}</p>
                <p>Service: ${bill.service_name}</p>
                <p>Booking Date: ${bill.booking_date}</p>
                <p>Amount: $${bill.amount.toFixed(2)}</p>
                <p>Status: ${bill.status}</p>
            `;
            billsList.appendChild(billDiv);
        });
    } catch (error) {
        console.error('Error fetching admin bills:', error);
        billsList.innerHTML = '<p>Unable to load bills. Please try again later.</p>';
    }
}


document.addEventListener('DOMContentLoaded', fetchAndDisplayAdminBills);





let fetchedServices = [];


async function displayAvailableServices() {
    const availableServices = document.getElementById("availableServices");
    availableServices.innerHTML = "Loading services...";

    try {
        const response = await fetch("http://localhost:5000/services");
        if (response.ok) {
            fetchedServices = await response.json(); 
            renderServices(fetchedServices);
        } else {
            availableServices.innerHTML = "Failed to load services.";
        }
    } catch (error) {
        console.error("Error fetching services:", error);
        availableServices.innerHTML = "Error loading services. Please try again later.";
    }
}


function renderServices(services) {
    const availableServices = document.getElementById("availableServices");
    availableServices.innerHTML = ""; 

    if (services.length === 0) {
        availableServices.innerHTML = "<p>No services available.</p>";
        return;
    }

    services.forEach((service) => {
        const serviceBlock = document.createElement("div");
        serviceBlock.classList.add("serviceblock");
        serviceBlock.setAttribute("data-name", service.name.toLowerCase()); 
        serviceBlock.innerHTML = `
            <p><strong>${service.name}</strong>: ${service.description}</p>
            <p>Price: $${service.price}</p>
            <button id="booking" onclick="bookService(${service.id})">Book Now</button>
        `;
        availableServices.appendChild(serviceBlock);
    });
}


function filterServices() {
    const query = document.getElementById("searchBar").value.toLowerCase(); 
    const serviceBlocks = document.querySelectorAll(".serviceblock"); 

    serviceBlocks.forEach((block) => {
        const serviceName = block.getAttribute("data-name"); 
        if (serviceName.includes(query)) {
            block.style.display = ""; 
        } else {
            block.style.display = "none"; 
        }
    });
}


document.addEventListener("DOMContentLoaded", displayAvailableServices);
