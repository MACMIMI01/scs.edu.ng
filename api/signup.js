const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// This uses the SAME Environment Variable as your login.js file.
// Vercel will provide this secret key to all functions in your project.
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // We only want to allow POST requests for creating new users
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Only POST requests are allowed' });
    }

    try {
        // Get the new user's data from the front-end request
        const { name, username, password, role, gender, profilePicture } = req.body;

        // Basic validation: ensure required fields are present
        if (!name || !username || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        await client.connect();
        const database = client.db("scs_cbt_db"); // Your database name
        const usersCollection = database.collection("users"); // Your collection name

        // Check if the username already exists to prevent duplicates
        const existingUser = await usersCollection.findOne({ username: username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username already exists.' });
        }

        // --- Critical Security Step: Hash the password ---
        const salt = await bcrypt.genSalt(10); // Generate a "salt" for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create the new user object to be inserted into the database
        const newUser = {
            id: `user_${Date.now()}`, // Create a simple unique ID
            name: name,
            username: username,
            password: hashedPassword, // Store the SECURE, HASHED password
            role: role,
            gender: gender,
            class: "N/A", // You can add a default class or get it from the form
            profilePicture: profilePicture,
            "date of birth": "" // Add a default or get it from the form
        };
        
        // Insert the new user into the database
        await usersCollection.insertOne(newUser);

        // Send a success response back to the front-end
        res.status(201).json({ success: true, message: 'User created successfully!' });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred on the server.' });
    } finally {
        // Ensure the client connection is closed when the function ends
        await client.close();
    }
};