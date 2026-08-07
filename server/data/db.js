// Persistent JSON-file "database" for the assignment. Data now survives
// server restarts (this is what makes registered accounts "stick" so you
// can log back in later) by loading from and saving to store.json on disk.
// Swap this module for a real database (MongoDB/Postgres) later without
// touching route logic, since every route only talks to the functions
// exported here.
const fs = require("fs");
const path = require("path");
const { v4: uuidGen } = require("uuid");
const bcrypt = require("bcryptjs");

const DATA_FILE = path.join(__dirname, "store.json");

function buildSeed() {
  const adminPasswordHash = bcrypt.hashSync("Admin!2345", 10);
  const shopperPasswordHash = bcrypt.hashSync("Shopper!2345", 10);

  const users = [
    {
      id: uuidGen(),
      name: "Admin User",
      email: "admin@shopcrm.test",
      passwordHash: adminPasswordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidGen(),
      name: "Jordan Smith",
      email: "shopper@shopcrm.test",
      passwordHash: shopperPasswordHash,
      role: "customer",
      createdAt: new Date().toISOString(),
    },
  ];

  const catalog = [
    { name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 24, image: "🎧", description: "Over-ear wireless headphones with active noise cancellation." },
    { name: "Mechanical Keyboard", category: "Electronics", price: 129.0, stock: 12, image: "⌨️", description: "Hot-swappable mechanical keyboard with RGB backlighting." },
    { name: "Ceramic Coffee Mug", category: "Home", price: 14.5, stock: 60, image: "☕", description: "12oz hand-glazed ceramic mug, dishwasher safe." },
    { name: "Running Shoes", category: "Sportswear", price: 74.0, stock: 8, image: "👟", description: "Lightweight running shoes with breathable mesh upper." },
    { name: "Desk Lamp", category: "Home", price: 32.99, stock: 3, image: "💡", description: "Adjustable LED desk lamp with 3 brightness levels." },
    { name: "Backpack", category: "Accessories", price: 54.0, stock: 17, image: "🎒", description: "Water-resistant 20L backpack with laptop sleeve." },
    { name: "Yoga Mat", category: "Sportswear", price: 21.0, stock: 30, image: "🧘", description: "Non-slip 6mm yoga mat with carry strap." },
    { name: "Bluetooth Speaker", category: "Electronics", price: 45.5, stock: 2, image: "🔊", description: "Portable speaker with 12-hour battery life." },
  ];

  const products = catalog.map((p) => ({ id: uuidGen(), ...p, createdAt: new Date().toISOString() }));

  return { users, products, orders: [], carts: {}, tickets: [] };
}

function loadState() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users)) return parsed;
    } catch (err) {
      console.error("[db] Could not read store.json, reseeding from scratch:", err.message);
    }
  }
  return null;
}

function saveState() {
  const snapshot = { users, products, orders, carts, tickets };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(snapshot, null, 2));
  } catch (err) {
    console.error("[db] Failed to persist store.json:", err.message);
  }
}

const initial = loadState() || buildSeed();

// These arrays/objects are mutated in place by the route handlers (push,
// splice, property assignment, etc). Every handler that mutates them calls
// save() afterwards so the change is written to store.json immediately.
const users = initial.users;
const products = initial.products;
const orders = initial.orders;
const carts = initial.carts;
const tickets = initial.tickets;

// Persist immediately on first boot so a fresh checkout already has a file.
if (!fs.existsSync(DATA_FILE)) saveState();

module.exports = { uuid: uuidGen, users, products, orders, carts, tickets, save: saveState };
