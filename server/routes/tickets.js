const express = require("express");
const { tickets, users, uuid, save } = require("../data/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// POST /api/tickets  { subject, message }  -> customer opens a support ticket
router.post("/", (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required." });
  }
  const ticket = {
    id: uuid(),
    userId: req.user.id,
    subject,
    message,
    status: "open",
    replies: [],
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  save();
  res.status(201).json(ticket);
});

// GET /api/tickets  -> customer sees their own tickets, admin sees all
router.get("/", (req, res) => {
  if (req.user.role === "admin") {
    const enriched = tickets.map((t) => {
      const customer = users.find((u) => u.id === t.userId);
      return { ...t, customerName: customer ? customer.name : "Unknown" };
    });
    return res.json(enriched);
  }
  res.json(tickets.filter((t) => t.userId === req.user.id));
});

// POST /api/tickets/:id/reply  (admin support reply)
router.post("/:id/reply", requireAdmin, (req, res) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found." });

  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Reply message is required." });

  ticket.replies.push({ from: "support", message, at: new Date().toISOString() });
  ticket.status = "answered";
  save();
  res.json(ticket);
});

// PUT /api/tickets/:id/status  (admin - close/reopen)
router.put("/:id/status", requireAdmin, (req, res) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found." });
  ticket.status = req.body.status || ticket.status;
  save();
  res.json(ticket);
});

module.exports = router;
