# Employee Management System - Complete Project Notes

Live site: https://employee-management-system-eight-zeta.vercel.app

GitHub repo: https://github.com/pranay-web/employee-management-system

## 1. One-Line Project Explanation

This is a MERN-style employee management system where users can add, view, search, filter, edit, and delete employee records through a React frontend, while an Express backend stores the data in MongoDB using Mongoose.

## 2. Tech Stack

- React: Builds the user interface.
- Vite: Runs and builds the React frontend quickly.
- Express: Creates the backend API routes.
- MongoDB Atlas: Stores employee records in the cloud database.
- Mongoose: Defines the employee schema and talks to MongoDB.
- Vercel: Hosts the deployed frontend and backend serverless API.
- CSS: Provides the dashboard, modal, card, table, dark/light theme, and toast styling.

## 3. Main Features

- Add a new employee with name, email, phone, department, position, monthly salary, join date, and optional photo.
- View all employees as cards or in a table.
- Search employees by name, email, or position.
- Filter employees by department.
- Sort employees by name, salary, or join date.
- Edit existing employee details.
- Delete employees with confirmation.
- View employee profile details in a modal.
- Dashboard statistics: total employees, departments, total monthly payroll, and average monthly salary.
- Toast notifications for success and error messages.
- Deployed backend writes to MongoDB, so data added on the website is saved permanently.

## 4. Project Folder Structure

```text
employee-management-system/
  api/
    index.js
  src/
    main.jsx
    App.jsx
    App.css
    components/
      EmployeeForm.jsx
      EmployeeForm.css
      EmployeeList.jsx
      EmployeeList.css
      EmployeeDetailModal.jsx
      EmployeeDetailModal.css
      Toast.jsx
      Toast.css
  server.js
  package.json
  vite.config.js
  vercel.json
  render.yaml
  index.html
  .gitignore
```

## 5. How The Whole App Works

1. User opens the deployed Vercel URL.
2. Vercel serves the React app from the `dist` build folder.
3. React starts from `src/main.jsx`, which renders `App.jsx`.
4. `App.jsx` calls `/api/employees` to load employee data.
5. Vercel rewrites `/api/*` requests to `api/index.js`.
6. `api/index.js` imports the Express app from `server.js`.
7. `server.js` connects to MongoDB using `MONGODB_URI`.
8. The matching Express route performs the database action.
9. MongoDB returns data to Express.
10. Express sends JSON back to React.
11. React updates the page immediately using state.

Example add flow:

```text
EmployeeForm submit
  -> App.jsx handleAddEmployee()
  -> POST /api/employees
  -> server.js app.post('/api/employees')
  -> new Employee(...).save()
  -> MongoDB stores record
  -> API returns saved employee
  -> React adds employee card to the screen
```

## 6. Important Runtime URLs

- Local frontend: `http://localhost:5173`
- Local backend: `http://localhost:5001`
- Local API health: `http://localhost:5001/api/health`
- Deployed site: `https://employee-management-system-eight-zeta.vercel.app`
- Deployed API health: `https://employee-management-system-eight-zeta.vercel.app/api/health`

## 7. package.json Explained

File: `package.json`

- Line 2, `"name"`: Project package name.
- Line 3, `"version"`: Current project version.
- Line 4, `"description"`: Says this is a MERN stack employee management system.
- Line 5, `"main": "server.js"`: Backend entry file for Node.
- Line 6, `"type": "commonjs"`: Allows `require()` and `module.exports` syntax.
- Line 8, `"start"`: Runs backend and frontend together using `concurrently`.
- Line 9, `"dev"`: Runs backend with `nodemon` and frontend with Vite for development.
- Line 10, `"server"`: Runs only the Express backend.
- Line 11, `"client"`: Runs only the Vite frontend.
- Line 12, `"build"`: Builds React app for production into `dist`.
- Line 13, `"preview"`: Previews the built frontend locally.
- Lines 25-32, `"dependencies"`: Packages needed in production.
- Lines 33-42, `"devDependencies"`: Packages mostly used during development/build.

Important packages:

- `express`: Backend framework.
- `mongoose`: MongoDB object modeling.
- `cors`: Allows frontend/backend requests during local development.
- `dotenv`: Reads `.env` variables locally.
- `react` and `react-dom`: Frontend UI.
- `vite`: Frontend dev/build tool.
- `concurrently`: Runs frontend and backend in one command.
- `nodemon`: Restarts backend automatically during development.

## 8. Backend: server.js Explained

File: `server.js`

### Imports and App Setup

- Line 1: Imports Express to create the backend server.
- Line 2: Imports Mongoose to connect to MongoDB and define models.
- Line 3: Imports CORS middleware for cross-origin requests.
- Line 4: Imports dotenv to load `.env` locally.
- Line 5: Imports `path` for safe filesystem paths.
- Line 7: Runs `dotenv.config()` so local `.env` values become `process.env`.
- Line 9: Creates the Express app.

### Middleware

- Line 12: Enables CORS.
- Line 13: Allows JSON request bodies up to 50 MB. This is useful because photos are stored as base64 strings.
- Line 14: Allows URL-encoded form data up to 50 MB.

### MongoDB Connection Cache

- Lines 20-23: Creates a global connection cache.

Why this exists:

Vercel serverless functions can start many times. Reusing a cached MongoDB connection avoids opening a new database connection on every API request.

- Line 25: Defines `connectDB()`, an async function that connects to MongoDB.
- Lines 26-28: If there is already an active Mongoose connection, reuse it.
- Line 30: Reads `MONGODB_URI` from environment variables and fixes a known typo, changing `w=majorit7` to `w=majority`.

Important note about line 30:

MongoDB connection strings can include `w=majority`, which means writes should be acknowledged by the majority of replica set members. A typo like `majorit7` causes the error: `No write concern mode named 'majorit7' found`. This line prevents that deployed error.

- Lines 32-36: If no URI exists on Vercel, log an error and return `null`.
- Lines 38-43: In local development, first try local MongoDB at `mongodb://localhost:27017/employee-db`.
- Lines 44-50: If local MongoDB is not running, use `mongodb-memory-server` as a fallback.
- Lines 54-66: If there is no cached connection promise, create one with `mongoose.connect()`.
- Lines 56-57: Set connection timeouts so failed database connections do not hang forever.
- Lines 58-60: Log success and return the Mongoose connection.
- Lines 61-65: Clear the cached promise and throw the error if connection fails.
- Lines 68-73: Await the connection promise and store it in `cached.conn`.
- Line 75: Return the active database connection.

### API Database Middleware

- Line 79: Runs middleware for every `/api` route.
- Line 81: Connects to the database before route code runs.
- Line 82: Calls `next()` so the actual API route continues.
- Line 84: Sends HTTP 503 if the database connection fails.

### Employee Schema

- Line 89: Creates a Mongoose schema named `employeeSchema`.
- Line 90: `name` is required text.
- Line 91: `email` is required and must be unique.
- Line 92: `phone` is required text.
- Line 93: `department` is required text.
- Line 94: `position` is required text.
- Line 95: `salary` is required number.
- Line 96: `photo` is optional and defaults to `null`.
- Line 97: `joinDate` is required date.
- Line 98: `createdAt` defaults to current time.
- Line 99: `updatedAt` defaults to current time.
- Line 102: Creates or reuses the `Employee` model.

Why line 102 uses `mongoose.models.Employee || ...`:

In serverless environments, code may be loaded more than once. Reusing an existing model prevents Mongoose's "Cannot overwrite model once compiled" error.

### API Routes

#### GET `/api/employees`

- Line 109: Defines the route to fetch all employees.
- Line 111: Finds all employees and sorts newest first.
- Line 112: Sends employees as JSON.
- Lines 113-115: Sends HTTP 500 if something fails.

#### GET `/api/employees/:id`

- Line 119: Defines route to fetch one employee by ID.
- Line 121: Looks up employee by MongoDB `_id`.
- Line 122: Returns 404 if employee is not found.
- Line 123: Sends the employee JSON.
- Lines 124-126: Sends HTTP 500 on error.

#### POST `/api/employees`

- Line 130: Defines route to create a new employee.
- Line 132: Pulls fields out of `req.body`.
- Lines 134-136: Validates that required fields exist.
- Lines 138-142: Creates a new `Employee` object.
- Line 144: Saves that object into MongoDB.
- Line 145: Returns HTTP 201 with the saved employee.
- Lines 147-149: Handles duplicate email errors.
- Line 150: Sends HTTP 400 for validation or save errors.

This is the route used when you click "Add Employee" on the deployed website.

#### PUT `/api/employees/:id`

- Line 155: Defines route to update an employee.
- Line 157: Reads new values from request body.
- Line 159: Finds existing employee by ID.
- Line 160: Returns 404 if it does not exist.
- Lines 162-169: Updates only the fields that were sent.
- Line 171: Updates the `updatedAt` timestamp.
- Line 172: Saves changes to MongoDB.
- Line 173: Returns updated employee JSON.
- Lines 175-177: Handles duplicate email errors.
- Line 178: Sends HTTP 400 for other update errors.

#### DELETE `/api/employees/:id`

- Line 183: Defines route to delete an employee.
- Line 185: Deletes employee by MongoDB `_id`.
- Line 186: Returns 404 if the employee does not exist.
- Line 187: Sends success message.
- Line 189: Sends HTTP 500 on delete error.

#### GET `/api/health`

- Line 194: Defines a health-check route.
- Line 195: Returns whether the backend is running and whether MongoDB is connected.

Example response:

```json
{"status":"ok","db":"connected"}
```

### Production Static Serving

- Lines 199-204: If running locally in production mode, Express serves files from `dist`.
- This does not run on Vercel because Vercel serves frontend files separately.

### Export and Local Server Start

- Line 206: Exports the Express app so Vercel can use it through `api/index.js`.
- Lines 209-222: Starts a local backend server when not running on Vercel.
- Line 210: Uses `PORT` from `.env` or falls back to `5001`.
- Lines 214-220: If the port is busy, tries the next port.

## 9. Vercel Backend Entry: api/index.js

File: `api/index.js`

```js
const app = require('../server.js');

module.exports = app;
```

Meaning:

- Imports the Express app from `server.js`.
- Exports it so Vercel can run it as a serverless function.
- Because `server.js` checks `if (!process.env.VERCEL)`, it does not call `app.listen()` on Vercel. Vercel handles the serverless function execution.

## 10. Frontend Entry: src/main.jsx

File: `src/main.jsx`

- Line 1: Imports React.
- Line 2: Imports ReactDOM so React can render into the HTML page.
- Line 3: Imports the main `App` component.
- Line 4: Imports global CSS.
- Line 6: Finds the HTML element with ID `root`.
- Lines 6-10: Renders `<App />` inside React Strict Mode.

In simple words: this file starts the React application.

## 11. Main Frontend Logic: src/App.jsx

File: `src/App.jsx`

### State Variables

- `employees`: List of employee records from MongoDB.
- `selectedEmployee`: Employee currently being edited.
- `showForm`: Controls whether add/edit modal is visible.
- `loading`: Shows loading state while employees are fetched.
- `toast`: Stores notification message and type.
- `theme`: Stores `dark` or `light`.

### API URL

```js
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

Meaning:

- If `VITE_API_URL` exists, use it.
- Otherwise, use `/api`.
- On Vercel, `/api` is rewritten to the deployed backend.
- Locally, Vite proxies `/api` to `http://localhost:5001`.

### showNotification()

Shows a toast message, then removes it after 4 seconds.

### fetchEmployees()

Purpose:

Loads all employees from the backend.

Important behavior:

- Sets loading to true.
- Uses `AbortController` to cancel request after 8 seconds.
- Retries up to 3 times.
- On success, stores employee list in `employees`.
- On failure, shows a toast error.

### useEffect()

```js
useEffect(() => {
  fetchEmployees();
}, []);
```

Meaning:

Run `fetchEmployees()` once when the app first loads.

### stats useMemo()

Calculates dashboard values:

- Total employees.
- Total monthly payroll.
- Average monthly salary.
- Number of active departments.

`useMemo` avoids recalculating unless `employees` changes.

### handleAddEmployee()

Purpose:

Sends new employee data to backend.

Flow:

1. Receives form payload from `EmployeeForm`.
2. Removes photo if it is larger than 2 MB.
3. Sends `POST /api/employees`.
4. If successful, adds the returned employee to React state.
5. Closes the form.
6. Shows success toast.
7. Retries on temporary timeout or server issue.

### handleUpdateEmployee()

Purpose:

Sends edited employee data to backend.

Flow:

1. Sends `PUT /api/employees/:id`.
2. Replaces old employee in state with updated employee.
3. Closes modal/form.
4. Shows success/error toast.

### handleDeleteEmployee()

Purpose:

Deletes an employee.

Flow:

1. Finds employee name for confirmation.
2. Shows browser confirm box.
3. Sends `DELETE /api/employees/:id`.
4. Removes employee from frontend state.
5. Shows toast.

### JSX Render

The returned JSX builds:

- Page wrapper with selected theme class.
- Header with logo, theme toggle, and add button.
- Four dashboard stat cards.
- `EmployeeList` component for cards/table/search/filter/sort.
- `EmployeeForm` modal when adding or editing.
- `Toast` notification when needed.

## 12. Employee Form: src/components/EmployeeForm.jsx

Purpose:

This component displays the add/edit employee modal and validates input before sending data to `App.jsx`.

Important parts:

- `formData`: Stores name, email, phone, department, position, monthly salary, and join date.
- `photoFile`: Stores selected file object. It is not directly sent to backend.
- `photoPreview`: Stores base64 image data used for preview and saving.
- `errors`: Stores validation messages.

### Edit Mode

The `useEffect` checks if an `employee` prop exists.

If yes:

- It fills the form with that employee's existing details.
- It converts MongoDB date format into HTML date input format.
- It shows existing photo if available.

### handleChange()

Runs whenever a text/date/number input changes.

It:

- Reads `name` and `value` from the input.
- Updates the matching field in `formData`.
- Clears the error for that field.

### selectDepartment()

Runs when a department pill is clicked.

It:

- Sets `formData.department`.
- Clears department error.

### handlePhotoChange()

Runs when user uploads a profile photo.

It:

- Reads the chosen file.
- Uses `FileReader`.
- Converts image to base64.
- Stores it in `photoPreview`.

### validateForm()

Checks:

- Name is not empty.
- Email is not empty and has valid format.
- Phone is not empty.
- Department is selected.
- Position is not empty.
- Salary is positive.
- Join date exists.

If validation passes, it returns `true`.

### handleSubmit()

Runs when form is submitted.

It:

1. Prevents browser page reload.
2. Runs validation.
3. Builds payload object.
4. Converts salary to a number.
5. Includes photo as base64 or `null`.
6. Calls `onSubmit(payload)`.

`onSubmit` is supplied by `App.jsx`, so the same form can add or edit employees.

## 13. Employee List: src/components/EmployeeList.jsx

Purpose:

Displays employees, search/filter/sort controls, grid/table toggle, and opens employee detail modal.

State variables:

- `searchTerm`: Search text typed by user.
- `selectedDept`: Current department filter.
- `sortBy`: Current sort option.
- `viewMode`: `grid` or `table`.
- `viewingEmployee`: Employee currently opened in detail modal.

### departments useMemo()

Creates department filter buttons from the employee data.

Example:

```text
All, Engineering, Human Resources
```

### filteredEmployees useMemo()

This is the main list logic.

It:

1. Filters by search text.
2. Filters by selected department.
3. Sorts by name, salary, or join date.

Search checks:

- Employee name.
- Employee email.
- Employee position.

### Loading State

If `loading` is true, the component shows a loading card instead of the list.

### Controls Bar

Includes:

- Search input.
- Department tabs.
- Sort dropdown.
- Grid/table toggle.

### Grid View

Shows each employee as a card.

Each card includes:

- Department tag.
- Edit button.
- Delete button.
- Photo or first initial.
- Name.
- Position.
- Email.
- Phone.
- Salary.
- Join date.

Clicking a card opens `EmployeeDetailModal`.

### Table View

Shows employees in a table with columns:

- Employee.
- Department.
- Position.
- Contact.
- Salary.
- Join date.
- Actions.

## 14. Employee Detail Modal: src/components/EmployeeDetailModal.jsx

Purpose:

Shows detailed employee profile information when a card/table row is clicked.

Important behavior:

- If no employee exists, it returns `null`.
- Clicking backdrop closes modal.
- Clicking inside modal does not close because `e.stopPropagation()` stops the click from reaching the backdrop.
- Shows photo or first initial.
- Shows email as `mailto:` link.
- Shows phone as `tel:` link.
- Shows monthly salary formatted with commas.
- Shows formatted join date.
- Edit button closes modal and opens edit form.
- Delete button closes modal and runs delete function.

## 15. Toast: src/components/Toast.jsx

Purpose:

Shows small notification messages.

Props:

- `message`: Text to display.
- `type`: `success`, `error`, or `info`.
- `onClose`: Function to close toast.

Important logic:

- If no message exists, returns `null`.
- CSS class changes depending on toast type.
- Icon changes depending on type.

## 16. Vite Config: vite.config.js

File: `vite.config.js`

- Line 1: Imports Vite config helper.
- Line 2: Imports React plugin.
- Line 5: Exports Vite configuration.
- Line 6: Enables React support.
- Line 8: Local frontend runs on port `5173`.
- Line 9: If port is busy, Vite may try another port.
- Line 10: Browser does not open automatically.
- Lines 11-20: Proxy local `/api` and `/uploads` requests to backend on port `5001`.
- Line 23: Production build output goes to `dist`.
- Line 24: Source maps are disabled.
- Line 25: Uses esbuild for minification.

Why proxy is needed:

During local development, React runs on port 5173 and Express runs on port 5001. The proxy lets frontend code call `/api/employees` instead of hardcoding `http://localhost:5001/api/employees`.

## 17. Vercel Config: vercel.json

File: `vercel.json`

- Line 2: Vercel runs `npm run build` during deployment.
- Line 3: Built frontend files are in `dist`.
- Lines 4-8: Defines `api/index.js` as a serverless function with max duration 10 seconds.
- Lines 9-18: Rewrites routes.
- Lines 11-12: Any `/api/*` request goes to backend function `api/index.js`.
- Lines 15-16: Any other route returns the React app `index.html`.

Why rewrites matter:

Without rewrites, refreshing a React route or calling `/api/employees` might return 404 on Vercel. Rewrites tell Vercel what should handle each path.

## 18. Database Details

Collection:

Mongoose uses the `Employee` model. MongoDB usually stores this in a collection named `employees`.

Document fields:

```json
{
  "_id": "MongoDB generated ID",
  "name": "Employee name",
  "email": "Unique email",
  "phone": "Phone number",
  "department": "Department name",
  "position": "Job title",
  "salary": 250000,
  "photo": "Base64 image string or null",
  "joinDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

The deployed site saves real employee data to MongoDB Atlas through the deployed API.

## 19. CRUD Mapping

CRUD means Create, Read, Update, Delete.

| Feature | Frontend function | Backend route | MongoDB action |
| --- | --- | --- | --- |
| Add employee | `handleAddEmployee` | `POST /api/employees` | `employee.save()` |
| Get all employees | `fetchEmployees` | `GET /api/employees` | `Employee.find()` |
| Get one employee | Detail API route | `GET /api/employees/:id` | `Employee.findById()` |
| Edit employee | `handleUpdateEmployee` | `PUT /api/employees/:id` | `employee.save()` |
| Delete employee | `handleDeleteEmployee` | `DELETE /api/employees/:id` | `Employee.findByIdAndDelete()` |

## 20. Common Questions And Answers

### What is this project?

It is an employee management dashboard where employee records can be created, displayed, filtered, edited, and deleted. The frontend is React and the backend is Express with MongoDB.

### Is the backend deployed?

Yes. Vercel hosts the backend through `api/index.js`, which exports the Express app from `server.js`.

### Does adding an employee save to the database?

Yes. The form calls `POST /api/employees`, the backend creates a Mongoose `Employee`, and `employee.save()` stores it in MongoDB.

### Why is MongoDB connected inside middleware?

Because every API route needs a database connection. The middleware ensures the connection is ready before route logic runs.

### Why use Mongoose?

Mongoose gives a schema, validation, model methods like `find`, `findById`, `save`, and easier MongoDB interaction.

### Why use `useState`?

React `useState` stores values that change on the screen, like employees, loading state, selected employee, and theme.

### Why use `useEffect`?

`useEffect` runs code after the component renders. Here it loads employees when the app first opens.

### Why use `useMemo`?

`useMemo` caches calculated values like dashboard stats and filtered employee lists so they only recalculate when needed.

### What is `req.body`?

It is the JSON data sent from the frontend to the backend in POST or PUT requests.

### What is `req.params.id`?

It is the employee ID from the URL, such as `/api/employees/abc123`.

### What is `res.json()`?

It sends a JSON response back to the frontend.

### Why is email unique?

The schema sets `email` as unique so two employees cannot have the same email address.

### Why does the app use `/api` instead of full backend URL?

Locally, Vite proxies `/api` to the backend. On Vercel, rewrites send `/api` to the serverless function. This keeps frontend code the same in local and production.

### Why is there a health route?

`/api/health` quickly confirms that the backend is running and whether MongoDB is connected.

### Why are photos stored as base64?

The app converts uploaded images to base64 and stores them as text in the employee document. This avoids needing separate file hosting, but large images can make database records bigger.

### What was fixed after deployment?

The deployed MongoDB URI had a write concern typo: `w=majorit7`. The backend now corrects that to `w=majority` before connecting, so create/update/delete operations work.

## 21. How To Run Locally

Install dependencies:

```bash
npm install
```

Run frontend and backend:

```bash
npm start
```

Open:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5001
```

Health check:

```text
http://localhost:5001/api/health
```

## 22. How To Build

```bash
npm run build
```

This creates a production frontend build inside `dist`.

## 23. How It Was Deployed

The project was deployed to Vercel.

Steps performed:

1. Built locally using `npm run build`.
2. Linked local folder to a Vercel project.
3. Confirmed `MONGODB_URI` exists in Vercel environment variables.
4. Deployed with `npx vercel deploy --prod --yes`.
5. Verified frontend returned HTTP 200.
6. Verified backend `/api/health` returned `db: "connected"`.
7. Verified database writes by creating and deleting a temporary employee through the deployed API.

## 24. GitHub Update

Latest pushed commit:

```text
15d5632 Fix deployed MongoDB write concern
```

This commit includes:

- Backend fix in `server.js`.
- `.gitignore` update so `.env`, `.env.local`, and `.vercel/` are not committed.

## 25. Security Notes

- Do not commit `.env` files.
- Do not share the MongoDB URI publicly.
- Vercel stores `MONGODB_URI` as a hidden/sensitive environment variable.
- The public website URL is safe to share.
- The GitHub repo should not contain database passwords.

## 26. Simple Explanation For Manager Or Examiner

This project has a React frontend and Express backend. The frontend collects employee details and sends them to backend API routes. The backend validates the data and uses Mongoose to save it in MongoDB Atlas. Vercel hosts both the built React app and the serverless backend API. The same deployed link can be shared with others, and any employee added there is stored in the cloud database.

## 27. Short Code Flow To Memorize

```text
main.jsx
  renders App.jsx

App.jsx
  stores employees in state
  fetches /api/employees
  sends add/edit/delete requests

EmployeeForm.jsx
  collects and validates input

EmployeeList.jsx
  displays, searches, filters, sorts employees

EmployeeDetailModal.jsx
  shows full employee details

server.js
  connects to MongoDB
  defines schema
  defines CRUD API routes

api/index.js
  exposes Express app to Vercel

vercel.json
  routes frontend and API requests on deployment
```
