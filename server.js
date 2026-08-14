const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================================
// MongoDB Connection — Vercel-optimized with global caching
// Uses global.mongoose to persist connection across warm starts
// ============================================================
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.VERCEL) {
      console.error('❌ MONGODB_URI is not set in Vercel Environment Variables');
      return null;
    }
    // Local dev fallback
    try {
      cached.conn = await mongoose.connect('mongodb://localhost:27017/employee-db', {
        serverSelectionTimeoutMS: 2000
      });
      console.log('✅ MongoDB connected to local instance');
      return cached.conn;
    } catch (err) {
      console.log('ℹ️ Local MongoDB not available, using in-memory server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      cached.conn = await mongoose.connect(mongod.getUri());
      console.log('✅ MongoDB connected to MongoMemoryServer');
      return cached.conn;
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    }).then((m) => {
      console.log('✅ MongoDB Atlas connected!');
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// DB middleware — runs before every API request
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database connection failed. Please try again.' });
  }
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  photo: { type: String, default: null },
  joinDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// ============================================================
// API Routes
// ============================================================

// GET all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joinDate, photo } = req.body;

    if (!name || !email || !phone || !department || !position || !salary || !joinDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const employee = new Employee({
      name, email, phone, department, position, salary,
      photo: photo || null,
      joinDate
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// UPDATE employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joinDate, photo } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (department) employee.department = department;
    if (position) employee.position = position;
    if (salary) employee.salary = salary;
    if (joinDate) employee.joinDate = joinDate;
    if (photo !== undefined) employee.photo = photo;

    employee.updatedAt = new Date();
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Serve frontend in production (local only, Vercel handles static files itself)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

module.exports = app;

// Start server locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, trying ${Number(PORT) + 1}...`);
      app.listen(Number(PORT) + 1, () => {
        console.log(`Server running on port ${Number(PORT) + 1}`);
      });
    }
  });
}
