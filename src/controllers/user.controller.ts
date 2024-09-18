import UserModel from '@src/models/user.model';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const createUser = async (req, res) => {
  const email = req.body.email;
  const isUserExists = await UserModel.findOne({ email });
  if (isUserExists)
    return res.status(400).json({
      message: 'User already exists',
      success: false,
    });
  const newUser = await UserModel.create({ ...req.body });
  return res.status(201).json({
    message: 'User created successfully',
    data: { id: newUser._id, email: newUser.email, token: generateToken(newUser._id) },
    success: true,
  });
};

// Login user
export const login = async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ success: true, token, data: { id: user._id, name: user.email, roles: user.roles } });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await UserModel.find().select('-password');
  return res.status(200).json({
    message: 'Successfully fetched all users',
    data: users,
    success: true,
  });
};

export const getUserById = async (req, res) => {
  const user = await UserModel.findById(req.params.id).select('-password');
  if (!user)
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  return res.status(200).json({
    message: 'User found',
    data: user,
    success: true,
  });
};

export const updateUser = async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user)
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  return res.status(200).json({
    message: 'User updated successfully',
    data: user,
    success: true,
  });
};

export const deleteUser = async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'User deleted successfully',
    success: true,
  });
};