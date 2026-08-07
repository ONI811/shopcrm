const express = require("express");
const { orders, carts, products, users, uuid, save } = require("../data/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// POST /api/orders  -> Checkout Flow: turns the current cart into an order.
router.post("/", (req, res) => {
  const { shippingAddress } = req.body;
  const cart = carts[req.user.id] || [];

  if (cart.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }
  if (!shippingAddress || !shippingAddress.trim()) {
    return res.status(400).json({ message: "Shipping address is required." });
  }

  const items = [];
  for (const line of cart) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) continue;
    if (product.stock < line.quantity) {
      return res.status(409).json({ message: `${product.name} is out of stock.` });
    }
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
    });
  }

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = {
    id: uuid(),
    userId: req.user.id,
    items,
    total: Number(total.toFixed(2)),
    shippingAddress,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  carts[req.user.id] = []; // clear cart after checkout
  save();

  res.status(201).json(order);
});

// GET /api/orders  -> Order History (customer) or all orders (admin)
router.get("/", (req, res) => {
  if (req.user.role === "admin") {
    const enriched = orders.map((order) => {
      const customer = users.find((u) => u.id === order.userId);
      return { ...order, customerName: customer ? customer.name : "Unknown", customerEmail: customer ? customer.email : "" };
    });
    return res.json(enriched);
  }
  res.json(orders.filter((o) => o.userId === req.user.id));
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to view this order." });
  }
  res.json(order);
});

// PUT /api/orders/:id/status  (admin - Order Management)
router.put("/:id/status", requireAdmin, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }
  order.status = status;
  save();
  res.json(order);
});

module.exports = router;
