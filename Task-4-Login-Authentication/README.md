# OIBSIP Level 2 - Task 4

## Login Authentication System

A secure and responsive Login Authentication System built as part of the Oasis Infobyte Internship (OIBSIP) Level 2 Task 4.

## Features

* User registration
* User login
* User logout
* Password hashing using bcrypt
* Session-based authentication
* Protected dashboard
* Email validation
* Password validation
* Confirm password validation
* Duplicate email prevention
* MySQL database integration
* Environment variables using dotenv
* Responsive and professional UI
* Password show/hide functionality
* Authentication error handling

## Tech Stack

### Frontend

* HTML
* CSS
* EJS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Authentication & Security

* bcrypt
* express-session
* dotenv

## Project Structure

```text
Task-4-Login-Authentication/
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   └── dashboard.ejs
│
├── .env
├── .gitignore
├── db.js
├── server.js
├── package.json
└── README.md
```

## Installation

Clone the repository or open the project folder.

Install dependencies:

```bash
npm install
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE oibsip_auth;
```

Select the database:

```sql
USE oibsip_auth;
```

Create the users table:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=oibsip_auth

SESSION_SECRET=your_super_secret_session_key
```

Do not upload `.env` to GitHub.

## Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Authentication Flow

1. User opens the registration page.
2. User creates an account.
3. Password is hashed using bcrypt.
4. User information is stored in MySQL.
5. User logs in using email and password.
6. bcrypt verifies the password.
7. A secure session is created.
8. User is redirected to the protected dashboard.
9. User can logout and destroy the session.

## Security

The application uses:

* bcrypt password hashing
* HTTP-only session cookies
* Server-side authentication
* Environment variables for sensitive configuration
* Parameterized SQL queries

## Internship

**Organization:** Oasis Infobyte

**Program:** OIBSIP

**Level:** Level 2

**Task:** Task 4 - Login Authentication System

## Author

**Ankit Meena**

GitHub: `https://github.com/ankitmeenamp`
