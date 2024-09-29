 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'


const adminConfig = {
  email: "admin@gmail.com",
  password: "1234567", 
};









export const register = async (req, res) => {

    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
      const user = await User.create({ name, email, password, });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };




  


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email === adminConfig.email && password === adminConfig.password) {


    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET);
    return res.json({ message: 'Admin login successful', token });
  }

  return res.status(400).json({ message: 'Invalid email or password' });
};