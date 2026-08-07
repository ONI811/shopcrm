const express = require("express");
const { carts, products, save } = require("../data/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function getCart(userId) {
  if (!carts[userId]) carts[userId] = [];
  return carts[userId];
}

function serializeCart(userId) {
  const cart = getCart(userId);
  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean);
}

// GET /api/cart
router.get("/", (req, res) => {
  res.json(serializeCart(req.user.id));
});

// POST /api/cart  { productId, quantity }
router.post("/", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found." });

  const cart = getCart(req.user.id);
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.push({ productId, quantity: Number(quantity) });
  }
  save();
  res.status(201).json(serializeCart(req.user.id));
});

// PUT /api/cart/:productId  { quantity }
router.put("/:productId", (req, res) => {
  const cart = getCart(req.user.id);
  const item = cart.find((i) => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ message: "Item not in cart." });

  item.quantity = Math.max(1, Number(req.body.quantity));
  save();
  res.json(serializeCart(req.user.id));
});

// DELETE /api/cart/:productId
router.delete("/:productId", (req, res) => {
  const cart = getCart(req.user.id);
  const next = cart.filter((i) => i.productId !== req.params.productId);
  carts[req.user.id] = next;
  save();
  res.json(serializeCart(req.user.id));
});

module.exports = router;
