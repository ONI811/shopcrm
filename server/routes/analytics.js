const express = require("express");
const { orders, users, products } = require("../data/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/analytics -> CRM Analytics Dashboard summary metrics
router.get("/", (req, res) => {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const activeCustomers = users.filter((u) => u.role === "customer").length;
  const lowStock = products.filter((p) => p.stock <= 5).map((p) => ({ id: p.id, name: p.name, stock: p.stock }));

  const salesByStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalSales: Number(totalSales.toFixed(2)),
    totalOrders: orders.length,
    activeCustomers,
    lowStock,
    salesByStatus,
  });
});

module.exports = router;
