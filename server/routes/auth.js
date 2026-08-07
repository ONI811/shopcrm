const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, uuid, save } = require("../data/db");
const { JWT_SECRET, requireAuth } = require("../middleware/auth");

const router = express.Router();

// Common weak/breached passwords we refuse even if they pass the pattern
// checks below - the same idea Facebook/Google use ("this password is too
// common, choose another one").
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "12345678", "123456789",
  "qwerty123", "letmein1", "iloveyou1", "admin1234", "welcome123",
  "abc12345", "111111111", "123123123", "football1", "monkey123",
]);

// Facebook-style strength rule: 8+ characters, and at least 3 of the 4
// character classes (lowercase, uppercase, number, symbol). Returns null
// when the password is acceptable, or a user-facing reason string.
function passwordIssue(password) {
  if (!password || typeof password !== "string") return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (password.length > 128) return "Password is too long.";

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  if (classes < 3) {
    return "Password must include at least 3 of: lowercase letters, uppercase letters, numbers, symbols.";
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "That password is too common. Please choose a stronger one.";
  }
  if (/^(.)\1+$/.test(password)) {
    return "Password can't be a single repeated character.";
  }
  return null;
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Please enter your full name." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  const issue = passwordIssue(password);
  if (issue) {
    return res.status(400).json({ message: issue });
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }

  const user = {
    id: uuid(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: "customer",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  save(); // write to disk immediately so the account survives a server restart

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: toPublicUser(user) });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me - lets the client verify a saved token is still valid
router.get("/me", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Account no longer exists." });
  res.json({ user: toPublicUser(user) });
});

module.exports = router;
