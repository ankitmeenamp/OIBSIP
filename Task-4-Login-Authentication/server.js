const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Make user available in all EJS files
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Home
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.redirect("/login");
});

// LOGIN

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("login", {
    error: null,
    success: null
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "Please enter email and password.",
        success: null
      });
    }

    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.render("login", {
        error: "Invalid email or password.",
        success: null
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.render("login", {
        error: "Invalid email or password.",
        success: null
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login Error:", error);

    res.render("login", {
      error: "Something went wrong. Please try again.",
      success: null
    });
  }
});

// REGISTER

app.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("register", {
    error: null,
    success: null
  });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.render("register", {
        error: "Please fill in all fields.",
        success: null
      });
    }

    if (name.trim().length < 2) {
      return res.render("register", {
        error: "Name must contain at least 2 characters.",
        success: null
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.render("register", {
        error: "Please enter a valid email address.",
        success: null
      });
    }

    if (password.length < 6) {
      return res.render("register", {
        error: "Password must contain at least 6 characters.",
        success: null
      });
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        error: "Passwords do not match.",
        success: null
      });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.render("register", {
        error: "An account with this email already exists.",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), normalizedEmail, hashedPassword]
    );

    res.render("login", {
      error: null,
      success: "Account created successfully. Please login."
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.render("register", {
      error: "Something went wrong. Please try again.",
      success: null
    });
  }
});

// AUTH MIDDLEWARE

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

// DASHBOARD

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

// LOGOUT

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout Error:", error);
      return res.status(500).send("Unable to logout.");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});