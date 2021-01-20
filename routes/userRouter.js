import express from 'express';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import JWT from "jsonwebtoken";
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // validate fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Not all fields have been entered.' });
    } else if (password.length < 8) {
      res.status(400).json({ error: 'Password should be of 8 characters atleast.' });
    }
    // check if email pre-exists
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists.' });
    }

    // hashing password for security reasons
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating user object
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      balance: 10000
    })

    // writing user to DB
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    // get fields and validate them
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Not all fields have been entered.' });
    } else if (password.length < 8) {
      res.status(400).json({ error: 'Password should be of 8 characters atleast.' });
    }

    // get user from db of that email
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      res.status(400).json({ error: 'No User found with this email.' });
    }

    console.log('user found', existingUser);

    // & compare passwords
    const passwordsMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordsMatch) {
      res.status(400).json({ error: 'Wrong password entered.' });
    }

    // create a jwt
    const token = JWT.sign({id: existingUser._id}, process.env.JWT_SECRET_KEY);
    res.json({ 
      token,
      user: {
        name: existingUser.name
      }
    })

  } catch {
    res.status(500).json({ error: err.message });
  }
})
export default userRouter;