import dbClient from '../utils/db.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check if email is missing
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        // Check if password is missing
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const usersCollection = dbClient.db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        const newUser = await usersCollection.insertOne({
            email,
            password: hashedPassword,
        });

        // Respond with the new user info (excluding the password)
        return res.status(201).json({ id: newUser.insertedId, email });
    }
}

export default UsersController;
