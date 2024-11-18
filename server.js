//THIS WILL CREATE A SERVER:

const mysql = require("mysql");
const express = require('express'); 
const app = express();

const PORT = 5000;

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






app.use(express.json());

//REGISTER A NEW USER
app.post('/register', (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;

   
    // Insert the user into the database
    const query = 'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [first_name, last_name, email, phone, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error registering user');
        } else {
            res.status(201).send('User registered successfully');
        }
    });
});
