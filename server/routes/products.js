const express = require("express");
const { products, uuid, save } = require("../data/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/products?search=&category=&maxPrice=
// Public catalog browsing used by the storefront Product Catalog feature.
router.get("/", (req, res) => {
  const { search, category, maxPrice } = req.query;
  let results = [...products];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== "All") {
    results = results.filter((p) => p.category === category);
  }
  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  res.json(results);
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

// POST /api/products  (admin - Inventory Control)
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, category, price, stock, image, description } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: "name, price and stock are required." });
  }
  const product = {
    id: uuid(),
    name,
    category: category || "General",
    price: Number(price),
    stock: Number(stock),
    image: image || "📦",
    description: description || "",
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  save();
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin - Inventory Control)
router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  const { name, category, price, stock, image, description } = req.body;
  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (image !== undefined) product.image = image;
  if (description !== undefined) product.description = description;

  save();
  res.json(product);
});

// DELETE /api/products/:id  (admin - Inventory Control)
router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found." });
  const [removed] = products.splice(index, 1);
  save();
  res.json({ message: "Product deleted.", product: removed });
});

module.exports = router;
