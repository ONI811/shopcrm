const express = require("express");
const { users, orders } = require("../data/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/customers  -> CRM Customer Profiles: every shopper + purchase summary
router.get("/", (req, res) => {
  const customers = users
    .filter((u) => u.role === "customer")
    .map((u) => {
      const customerOrders = orders.filter((o) => o.userId === u.id);
      const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        orderCount: customerOrders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
      };
    });
  res.json(customers);
});

// GET /api/customers/:id  -> single customer profile with full order history
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id && u.role === "customer");
  if (!user) return res.status(404).json({ message: "Customer not found." });

  const customerOrders = orders.filter((o) => o.userId === user.id);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    orders: customerOrders,
  });
});

module.exports = router;
