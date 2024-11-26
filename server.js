//THIS WILL CREATE A SERVER:

const mysql =require('mysql');
const express = require('express'); 

const cors = require('cors');
const app = express();

const PORT = 5000;
app.use(cors());
app.use(express.json());
//THIS WILL TEST 
app.get('/', (req, res) => {
    res.send('Server is running!');
});



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: "proj" // Replace with your actual database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

//START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


app.post('/register', (req, res) => {
    const { name, username, password, phone, email, address } = req.body;

    // Split the full name into first and last name
    //const [first_name, last_name] = name.split(' '); // Split on the first space
    // Split name into first and last name
    const parts = name.trim().split(' ');
    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ') || null;

    const query = `
        INSERT INTO users (first_name, last_name, username, password, phone, email, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [first_name, last_name, username, password, phone, email, address], (err, result) => {
        if (err) {
            console.error('Error inserting user into database:', err);
            res.status(500).send('Error registering user');
        } else {
            res.status(201).send('User registered successfully');
        }
    });

});

// validate username and password 
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging in.');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password.');
        }
        //res.status(200).json(results[0]); // Send user data back
        const user = results[0];
        res.status(200).json({
            id: user.id, // Include user ID
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    });
});
 

app.put('/users', (req, res) => {
    const { id, username, name, email, phone, address } = req.body;

    // Query to fetch current user data
    const fetchUserQuery = 'SELECT * FROM users WHERE id = ?';

    db.query(fetchUserQuery, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error updating user.');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found.');
        }

        const currentUser = results[0];
        const parts = name?.trim().split(' ') || [];
        const first_name = parts[0] || currentUser.first_name;
        const last_name = parts.slice(1).join(' ') || currentUser.last_name;

        // Update query to match database schema
        const updateQuery = `
            UPDATE users 
            SET username = ?, first_name = ?, last_name = ?, email = ?, phone = ?, address = ? 
            WHERE id = ?
        `;

        db.query(
            updateQuery,
            [username || currentUser.username, first_name, last_name, email || currentUser.email, phone || currentUser.phone, address || currentUser.address, id],
            (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).send('Error updating user.');
                }

                if (result.affectedRows === 0) {
                    return res.status(404).send('User not found.');
                }

                // Send updated user data back
                const updatedUser = { id, username, first_name, last_name, email, phone, address };
                res.status(200).json(updatedUser);
            }
        );
    });
});


app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting user.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send('User account deleted successfully.');
    });
});









app.get('/services', (req, res) => {
    const query = 'SELECT * FROM services';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching services:', err);
            return res.status(500).send('Failed to fetch services.');
        }
        res.status(200).json(results);
    });
});


app.put('/services/:id', (req, res) => {
    const { id } = req.params; // Fetch service ID from the URL
    const { name, description, price } = req.body; // Extract updated data from the request body

    if (!name || !description || !price) {
        return res.status(400).send('All fields are required.');
    }

    const query = 'UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?';

    db.query(query, [name, description, price, id], (err, result) => {
        if (err) {
            console.error('Error updating service:', err);
            return res.status(500).send('Failed to update service.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Service not found.');
        }

        res.status(200).send('Service updated successfully.');
    });
});


// Create a new service
app.post('/services', (req, res) => {
    const { name, description, price } = req.body; // Extract data from the request body

    // Validate input fields
    if (!name || !description || !price) {
        return res.status(400).send('All fields are required.');
    }

    const query = `
        INSERT INTO services (name, description, price)
        VALUES (?, ?, ?)
    `;

    db.query(query, [name, description, price], (err, result) => {
        if (err) {
            console.error('Error adding service:', err);
            return res.status(500).send('Failed to add service.');
        }

        res.status(201).send('Service added successfully.');
    });
});


app.delete('/services/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM services WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting service:', err);
            return res.status(500).send('Failed to delete service.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Service not found.');
        }
    
        res.status(200).send('Service deleted successfully.');

    });
});

/*
app.delete('/services/:id', (req, res) => {
    const serviceId = req.params.id;

    // Delete related bills
    const deleteBillsQuery = 'DELETE FROM bills WHERE service_id = ?';
    db.query(deleteBillsQuery, [serviceId], (err) => {
        if (err) {
            console.error('Error deleting bills:', err);
            return res.status(500).send('Failed to delete bills.');
        }

        // Delete related bookings
        const deleteBookingsQuery = 'DELETE FROM bookings WHERE service_id = ?';
        db.query(deleteBookingsQuery, [serviceId], (err) => {
            if (err) {
                console.error('Error deleting bookings:', err);
                return res.status(500).send('Failed to delete bookings.');
            }

            // Delete the service
            const deleteServiceQuery = 'DELETE FROM services WHERE id = ?';
            db.query(deleteServiceQuery, [id], (err) => {
                if (err) {
                    console.error('Error deleting service:', err);
                    return res.status(500).send('Failed to delete service.');
                }

                res.status(200).send('Service and related records deleted successfully.');
            });
        });
    });
});
*/
/*
// Create a new booking
app.post('/bookings', (req, res) => {
    const { user_id, service_id, date, status } = req.body;

    if (!user_id || !service_id || !date) {
        return res.status(400).send('user_id, service_id, and date are required.');
    }
    const bookingStatus = status || 'booked';
    //const status = 'booked';
    const query = 'INSERT INTO bookings (user_id, service_id, date, status) VALUES (?, ?, ?, ?)';
    db.query(query, [user_id, service_id, date, bookingStatus], (err, result) => {
        if (err) {
            console.error('Error creating booking:', err);
            return res.status(500).send('Failed to create booking.');
        }
        res.status(201).send('Booking created successfully.');
    });
});
*/
// Get all bookings or bookings by user_id
// Get all bookings or bookings by status
app.get('/bookings', (req, res) => {
    const status = req.query.status;

    let query = `
        SELECT bookings.id, users.username, services.name AS service_name, bookings.date, bookings.status
        FROM bookings
        JOIN users ON bookings.user_id = users.id
        JOIN services ON bookings.service_id = services.id
    `;

    const params = [];
    if (status) {
        query += ' WHERE bookings.status = ?';
        params.push(status);
    }

    query += ' ORDER BY bookings.date DESC';

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).send('Failed to fetch bookings.');
        }
        res.status(200).json(results);
    });
});





// Update a booking
app.put('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'confirmed'

    const query = 'UPDATE bookings SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating booking:', err);
            return res.status(500).send('Failed to update booking.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Booking not found.');
        }

        res.status(200).send('Booking updated successfully.');
    });
});



// Delete a booking
app.delete('/bookings/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM bookings WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting booking:', err);
            return res.status(500).send('Failed to delete booking.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Booking not found.');
        }

        res.status(200).send('Booking deleted successfully.');
    });
});



//FOR BILLS
app.post('/bookings', (req, res) => {
    const { user_id, service_id, date, status } = req.body;

    if (!user_id || !service_id || !date) {
        return res.status(400).send('Missing required fields.');
    }

    // Validate user_id and service_id manually
    const validateUserQuery = 'SELECT id FROM users WHERE id = ?';
    const validateServiceQuery = 'SELECT id, price FROM services WHERE id = ?';

    db.query(validateUserQuery, [user_id], (err, userResult) => {
        if (err || userResult.length === 0) {
            return res.status(400).send('Invalid user ID.');
        }

        db.query(validateServiceQuery, [service_id], (err, serviceResult) => {
            if (err || serviceResult.length === 0) {
                return res.status(400).send('Invalid service ID.');
            }

            const amount = serviceResult[0].price;

            // Insert booking
            const bookingQuery = 'INSERT INTO bookings (user_id, service_id, date, status) VALUES (?, ?, ?, ?)';
            db.query(bookingQuery, [user_id, service_id, date, status || 'booked'], (err, bookingResult) => {
                if (err) {
                    console.error('Error creating booking:', err);
                    return res.status(500).send('Failed to create booking.');
                }

                const booking_id = bookingResult.insertId;

                // Insert bill
                const billQuery = 'INSERT INTO bills (user_id, service_id, booking_id, amount, status) VALUES (?, ?, ?, ?, ?)';
                db.query(billQuery, [user_id, service_id, booking_id, amount, 'Unpaid'], (err) => {
                    if (err) {
                        console.error('Error creating bill:', err);
                        return res.status(500).send('Failed to generate bill.');
                    }

                    res.status(201).send('Booking and bill created successfully.');
                });
            });
        });
    });
});

app.get('/bills', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).send('User ID is required.');
    }

    const query = `
        SELECT bills.id, services.name AS service_name, bills.amount, bills.status
        FROM bills
        JOIN services ON bills.service_id = services.id
        WHERE bills.user_id = ?
        ORDER BY bills.id DESC
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching bills:', err);
            return res.status(500).send('Failed to fetch bills.');
        }
        res.status(200).json(results);
    });
});

/*
app.get('/bills', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).send('User ID is required.');
    }

    const query = `
        SELECT bills.id, bills.amount, bills.status, bookings.date AS booking_date, services.name AS service_name
        FROM bills
        JOIN bookings ON bills.booking_id = bookings.id
        JOIN services ON bills.service_id = services.id
        WHERE bills.user_id = ?
        ORDER BY bills.id DESC
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching bills:', err);
            return res.status(500).send('Failed to fetch bills.');
        }

        res.status(200).json(results);
    });
});
*/


app.get('/admin/bills', (req, res) => {
    const query = `
        SELECT 
            bills.id, 
            services.name AS service_name, 
            bills.amount, 
            bills.status, 
            bookings.date AS booking_date, 
            users.username AS client_name
        FROM bills
        JOIN bookings ON bills.booking_id = bookings.id
        JOIN services ON bills.service_id = services.id
        JOIN users ON bills.user_id = users.id
        ORDER BY bills.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching admin bills:', err);
            return res.status(500).send('Failed to fetch admin bills.');
        }

        res.status(200).json(results);
    });
});
