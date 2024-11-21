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
 


/*
app.put('/users', (req, res) => {
    const { id, username, name, email, phone, address } = req.body;

    const parts = name.trim().split(' ');
    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ') || null;

    // Update the user in the database
    const query = `
        UPDATE users 
        SET username = ?,first_name = ?, last_name = ?, email = ?, phone = ?, address = ? 
        WHERE id = ?
    `;

    db.query(query, [username, first_name, last_name, email, phone, address, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating user.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('User not found.');
        }

        // Send the updated user data back
        const updatedUser = { id, username, first_name, last_name, email, phone, address };
        res.status(200).json(updatedUser);
    });
});
*/



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