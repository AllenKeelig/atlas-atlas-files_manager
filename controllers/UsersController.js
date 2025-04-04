import dbClient from '../utils/db.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import redisClient from '../utils/redis.js';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

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

        return res.status(201).json({ id: newUser.insertedId, email });
    }

    static async getMe(req, res) {
        const token = req.header('X-Token');
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        return res.status(200).json({ id: user._id, email: user.email });
      }
    }
    


export default UsersController;
