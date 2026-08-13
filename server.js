const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not configured");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("✅ MongoDB connected successfully to database!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();

// Fallback local or in-memory connection
try {
  const localUri = 'mongodb://localhost:27017/employee-db';
  await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
  console.log(`✅ MongoDB connected to local instance (${localUri})`);
} catch (err) {
  console.log('ℹ️ Local MongoDB not reachable, starting in-memory MongoDB server...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected to MemoryServer at ${mongoUri}`);
  } catch (memErr) {
    console.error('❌ Failed to start MongoMemoryServer:', memErr);
  }
}
;
connectDB();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only (jpeg, jpg, png, gif)');
    }
  }
});

const uploadPhoto = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.warn('Multer upload warning:', err);
      // Gracefully continue without uploaded file on non-critical stream issue
      return next();
    }
    next();
  });
};

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

const Employee = mongoose.model('Employee', employeeSchema);

// Routes

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
app.post('/api/employees', uploadPhoto, async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joinDate } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !department || !position || !salary || !joinDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const employee = new Employee({
      name,
      email,
      phone,
      department,
      position,
      salary,
      photo: photoPath,
      joinDate
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email address already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// UPDATE employee
app.put('/api/employees/:id', uploadPhoto, async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joinDate } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (department) employee.department = department;
    if (position) employee.position = position;
    if (salary) employee.salary = salary;
    if (joinDate) employee.joinDate = joinDate;

    // Update photo if new one is uploaded
    if (req.file) {
      employee.photo = `/uploads/${req.file.filename}`;
    }

    employee.updatedAt = new Date();
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email address already exists.' });
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
  res.json({ status: 'Server is running' });
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is in use. Trying port ${Number(PORT) + 1}...`);
    app.listen(Number(PORT) + 1, () => {
      console.log(`Server running on fallback port ${Number(PORT) + 1}`);
    });
  } else {
    console.error('Server startup error:', err);
  }
});
