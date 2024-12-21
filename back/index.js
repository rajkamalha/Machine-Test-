const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const UserModel = require('./models/User.js'); // Import the model

const app = express();
const upload = multer(); // For handling multipart/form-data
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Cards')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Endpoints

// Create Employee
app.post('/employees', upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, email, department, designation, dateOfJoining, salary } = req.body;

    // Check for unique email
    const existingEmployee = await UserModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newEmployee = new UserModel({
      firstName,
      lastName,
      email,
      department,
      designation,
      dateOfJoining,
      salary,
      image: req.file ? req.file.buffer.toString('base64') : null,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Get All Employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await UserModel.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get Employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employee = await UserModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Update Employee
app.put('/employees/:id', upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, email, department, designation, dateOfJoining, salary } = req.body;
    const updates = {
      firstName,
      lastName,
      email,
      department,
      designation,
      dateOfJoining,
      salary,
    };
    if (req.file) {
      updates.image = req.file.buffer.toString('base64');
    }

    const updatedEmployee = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete Employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
