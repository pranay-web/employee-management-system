# 👥 Employee Management System - MERN Stack

A full-stack web application for managing employee records with photo upload functionality, built with **MongoDB, Express, React, and Node.js**.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v14+-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-supported-green)

## ✨ Features

- 📋 **CRUD Operations** - Create, Read, Update, Delete employees
- 📷 **Photo Upload** - Upload and store employee photos
- 🎨 **Beautiful UI** - Modern, responsive design with gradient backgrounds
- ✅ **Form Validation** - Real-time validation with error messages
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔍 **Employee Directory** - View all employees in a card-based layout
- 💼 **Professional Fields** - Name, email, phone, department, position, salary, join date
- ⚡ **Fast Performance** - Optimized React components and API calls
- 🔒 **Secure** - File type validation for photo uploads

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **Cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Next generation build tool
- **CSS3** - Modern styling with gradients
- **Fetch API** - HTTP requests

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (optional, for cloning)

## 🚀 Getting Started

### Option 1: Quickest Setup (Recommended)

```bash
# Follow the QUICK_START.md file for a 5-minute setup
cat QUICK_START.md
```

### Option 2: Detailed Setup

```bash
# 1. Clone or download this repository
git clone <repository-url>
cd employee-management

# 2. Follow SETUP_GUIDE.md for step-by-step instructions
cat SETUP_GUIDE.md
```

## 📂 Project Structure

```
employee-management/
├── backend/
│   ├── server.js                 # Express server setup
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example env file
│   └── uploads/                  # Directory for uploaded photos
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx  # Form for add/edit
│   │   │   ├── EmployeeForm.css  # Form styles
│   │   │   ├── EmployeeList.jsx  # Employee list display
│   │   │   └── EmployeeList.css  # List styles
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Base styles
│   ├── vite.config.js            # Vite configuration
│   ├── package.json              # Frontend dependencies
│   └── index.html                # HTML template
│
├── SETUP_GUIDE.md                # Detailed setup guide
├── QUICK_START.md                # 5-minute quick start
└── README.md                     # This file
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api`

### Employees

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/employees` | Get all employees | - |
| GET | `/employees/:id` | Get single employee | - |
| POST | `/employees` | Create new employee | Form Data |
| PUT | `/employees/:id` | Update employee | Form Data |
| DELETE | `/employees/:id` | Delete employee | - |

### Request/Response Examples

**Create Employee:**
```bash
POST /api/employees
Content-Type: multipart/form-data

name=John Doe
email=john@example.com
phone=9876543210
department=Engineering
position=Senior Developer
salary=80000
joinDate=2024-01-15
photo=<image-file>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "department": "Engineering",
  "position": "Senior Developer",
  "salary": 80000,
  "photo": "/uploads/1234567890.jpg",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Usage Guide

### 1. Viewing Employees
- Open the application
- All employees are displayed in a card layout
- Each card shows: photo, name, position, department, contact info, salary, and join date

### 2. Adding an Employee
1. Click "Add New Employee" button
2. Fill in all required fields (marked with *)
3. Upload an optional photo
4. Click "Add Employee" to save

### 3. Editing an Employee
1. Click "Edit" button on any employee card
2. Modify the information
3. Click "Update Employee" to save changes

### 4. Deleting an Employee
1. Click "Delete" button on any employee card
2. Confirm deletion in the dialog
3. Employee is removed from the system

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/employee-db

# Server
PORT=5000
NODE_ENV=development

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-db
```

### Frontend Configuration

API URL is configured in `App.jsx`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Change this if backend runs on a different port.

## 🧪 Testing the Application

1. **Test Create:**
   - Add a new employee with all details
   - Verify it appears in the list

2. **Test Update:**
   - Edit an employee's details
   - Change the photo
   - Verify changes are saved

3. **Test Delete:**
   - Delete an employee
   - Confirm it's removed from the list

4. **Test Photo Upload:**
   - Try uploading different image formats (JPG, PNG, GIF)
   - Verify photos display correctly

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Start MongoDB service or check connection string

**Port Already in Use**
```
Error: EADDRINUSE: address already in use :::5000
```
Solution: Change PORT in .env or kill the process using the port

**CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution: Ensure backend has CORS enabled (default in server.js)

**Photo Upload Fails**
```
Error: Images only (jpeg, jpg, png, gif)
```
Solution: Upload a valid image file in supported format

**Frontend Can't Connect to Backend**
```
Failed to fetch
```
Solution: Verify backend URL and port in App.jsx

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "dotenv": "^16.0.3"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## 🚢 Deployment

### Deploy Backend to Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Update API URL to production backend in `App.jsx`

## 🔒 Security Considerations

- File upload validation (image types only)
- File size limit (50MB)
- MongoDB injection prevention via Mongoose
- CORS enabled for controlled access
- Environment variables for sensitive data

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/employee-db
PORT=5000
NODE_ENV=development
```

### MongoDB Atlas
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 💡 Tips & Best Practices

1. **Always backup your MongoDB data**
2. **Use MongoDB Atlas for production** (secure cloud database)
3. **Keep sensitive data in .env files**
4. **Test file uploads with different sizes**
5. **Use HTTPS in production**
6. **Add authentication for production apps**
7. **Implement rate limiting for APIs**

## 🆘 Support & Help

- 📖 See `QUICK_START.md` for quick setup
- 📚 See `SETUP_GUIDE.md` for detailed instructions
- 🐛 Check browser console (F12) for errors
- 🔍 Check terminal console for server errors
- 💬 Review troubleshooting section above

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🚀 Future Enhancements

- [ ] User authentication & authorization
- [ ] Search and filter employees
- [ ] Export employee data to CSV/PDF
- [ ] Department-wise statistics
- [ ] Employee performance ratings
- [ ] Leave management system
- [ ] Attendance tracking
- [ ] Real-time notifications

## 📧 Contact

For questions or suggestions, please reach out or open an issue.

---

**Made with ❤️ using MERN Stack**

Happy coding! 🎉
