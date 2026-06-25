import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  generateProductId,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
      ? ext
      : ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.get("/", (req, res) => {
  const category = req.query.category;
  const products = getAllProducts(category);
  res.json({ products, categories: getCategories() });
});

router.get("/categories", (_req, res) => {
  res.json({ categories: getCategories() });
});

router.get("/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ product });
});

router.post("/", requireAuth, (req, res) => {
  const { name, category, material, finish, dimensions, description, image, featured } =
    req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  const id = req.body.id || generateProductId();

  if (getProductById(id)) {
    return res.status(409).json({ error: "Product ID already exists" });
  }

  const product = createProduct({
    id,
    name,
    category,
    material,
    finish,
    dimensions,
    description,
    image,
    featured: Boolean(featured),
  });

  res.status(201).json({ product });
});

router.put("/:id", requireAuth, (req, res) => {
  const existing = getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  const product = updateProduct(req.params.id, req.body);
  res.json({ product });
});

router.post("/:id/image", requireAuth, upload.single("image"), (req, res) => {
  const existing = getProductById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "Product not found" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  if (existing.image?.startsWith("/uploads/")) {
    const oldPath = path.join(__dirname, "..", "..", existing.image);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const product = updateProduct(req.params.id, { image: imageUrl });
  res.json({ product });
});

router.delete("/:id", requireAuth, (req, res) => {
  const existing = getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (existing.image?.startsWith("/uploads/")) {
    const imagePath = path.join(__dirname, "..", "..", existing.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  deleteProduct(req.params.id);
  res.json({ success: true });
});

export default router;
