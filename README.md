👥 Employee Management System (MERN Stack)

A full-stack web application built with the MERN stack to manage an organization's employee directory. It features a modern, responsive UI, real-time search filtering, robust server-side validation, and secure API architecture.

🔗 Live Demo: View Application

🔗 Live API: View Backend Logs

✨ Features

Full CRUD Operations: Create, Read, Update, and Delete employee records.

Modern UI/UX: Styled completely with Tailwind CSS v4 for a clean, responsive, card-based layout.

Real-time Search: Instantly filter the employee directory by name, position, or department without refreshing the page.

Advanced State Management: Custom loading spinners, disabled button states during network requests, and self-clearing Toast Notifications for success/error feedback.

Custom Modals: Destructive actions (like deleting an employee) are guarded by a custom Tailwind overlay modal instead of intrusive browser alerts.

Server-Side Validation: The Express backend intercepts and sanitizes bad data (e.g., negative salaries, invalid MongoDB ID formats, missing fields) before it ever touches the database.

Secured API: CORS is strictly configured to only accept requests from the deployed Vercel frontend and local development environment.

🛠️ Tech Stack

Frontend:

React.js (Bootstrapped with Vite)

Tailwind CSS v4

Fetch API for network requests

Backend:

Node.js & Express.js

MongoDB & Mongoose (ODM)

CORS & Dotenv

Deployment:

Frontend hosted on Vercel

Backend hosted on Render

Database hosted on MongoDB Atlas

🚀 Local Installation & Setup

If you want to run this application on your local machine, follow these steps:

1. Clone the repository

git clone [https://github.com/adithyan-ds/employee-management-system.git]
cd employee-management-system


1. Backend Setup

Open a terminal and navigate to the backend folder:

cd backend
npm install


Create a .env file in the backend directory and add your MongoDB connection string and Port:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here


Start the backend server:

npm run dev


3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

cd frontend
npm install


Create a .env file in the frontend directory and add the local API URL:

VITE_API_URL=http://localhost:5000/employees


Start the Vite development server:

npm run dev


The application will now be running at http://localhost:5173.

📂 Project Structure

employee-management-system/
├── backend/                # Node.js/Express API
│   ├── controllers/        # Route logic & validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Entry point & CORS setup
│   └── .env                # Secret keys (ignored by Git)
│
└── frontend/               # React/Vite Application
    ├── src/
    │   ├── App.jsx         # Main UI, State, and API logic
    │   ├── main.jsx        # React DOM render
    │   └── index.css       # Tailwind entry point
    ├── vite.config.js      # Vite & Tailwind v4 plugin config
    └── .env                # API URL targeting (ignored by Git)


Built as a comprehensive full-stack portfolio project.