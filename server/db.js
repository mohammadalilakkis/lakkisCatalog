import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "catalog.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT,
    finish TEXT,
    dimensions TEXT,
    description TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT,
    message TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const epoxyResinProducts = [
  {
    id: "LAK-009",
    name: "Ocean Wave River Table",
    category: "Epoxy Resin Work",
    material: "Walnut Slab + Clear Epoxy",
    finish: "High-Gloss Polish",
    dimensions: "220 × 100 × 75 cm",
    description:
      "Live-edge walnut slab with hand-poured ocean-blue epoxy river. UV-stable resin with mirror finish and natural wood grain contrast.",
    image:
      "https://images.unsplash.com/photo-1741889836335-653b240f9fb3?w=600&h=750&fit=crop&auto=format",
    featured: 1,
    sort_order: 8,
  },
  {
    id: "LAK-010",
    name: "Blue River Coffee Table",
    category: "Epoxy Resin Work",
    material: "Oak + Pigmented Epoxy",
    finish: "Satin Gloss",
    dimensions: "120 × 60 × 45 cm",
    description:
      "Custom coffee table combining solid oak with flowing blue epoxy channels. Ideal for living rooms and reception areas.",
    image:
      "https://images.unsplash.com/photo-1617638924751-cc232f82ecf9?w=600&h=750&fit=crop&auto=format",
    featured: 0,
    sort_order: 9,
  },
  {
    id: "LAK-011",
    name: "Live Edge Resin Dining Table",
    category: "Epoxy Resin Work",
    material: "Natural Edge Wood + Epoxy",
    finish: "Crystal Clear Coat",
    dimensions: "240 × 110 × 78 cm",
    description:
      "Full-size dining table with preserved live edge and crystal-clear resin fill. Built for daily use with a durable protective top coat.",
    image:
      "https://images.unsplash.com/photo-1633435597188-27c1e70f329d?w=600&h=750&fit=crop&auto=format",
    featured: 0,
    sort_order: 10,
  },
  {
    id: "LAK-012",
    name: "Floral Inlay Epoxy Table",
    category: "Epoxy Resin Work",
    material: "Hardwood + Decorative Epoxy",
    finish: "Gloss Lacquer",
    dimensions: "180 × 90 × 75 cm",
    description:
      "Decorative epoxy inlay with embedded botanical detail over premium hardwood. A statement centerpiece for dining or hospitality spaces.",
    image:
      "https://images.unsplash.com/photo-1633435597643-601bb3efc197?w=600&h=750&fit=crop&auto=format",
    featured: 0,
    sort_order: 11,
  },
  {
    id: "LAK-013",
    name: "River Console Table",
    category: "Epoxy Resin Work",
    material: "Teak + Teal Epoxy",
    finish: "Hand-Rubbed Oil + Resin Top",
    dimensions: "160 × 45 × 85 cm",
    description:
      "Slim console with teal epoxy river running through natural teak. Perfect for entryways, corridors, and boutique interiors.",
    image:
      "https://images.unsplash.com/photo-1617638717732-a3ef01769ff2?w=600&h=750&fit=crop&auto=format",
    featured: 0,
    sort_order: 12,
  },
  {
    id: "LAK-014",
    name: "Custom Epoxy Countertop",
    category: "Epoxy Resin Work",
    material: "Wood Base + Epoxy Surface",
    finish: "Food-Safe Gloss (on request)",
    dimensions: "Custom sizing available",
    description:
      "Bespoke epoxy countertops and bar tops with wood integration. Heat-resistant, seamless finish for kitchens, cafés, and retail counters.",
    image:
      "https://images.unsplash.com/photo-1590529989936-f6efdf774c23?w=600&h=750&fit=crop&auto=format",
    featured: 0,
    sort_order: 13,
  },
];

function insertEpoxyResinProducts() {
  const epoxyInsert = db.prepare(`
    INSERT INTO products (id, name, category, material, finish, dimensions, description, image, featured, sort_order)
    VALUES (@id, @name, @category, @material, @finish, @dimensions, @description, @image, @featured, @sort_order)
  `);

  const seedEpoxy = db.transaction((products) => {
    for (const product of products) {
      const exists = db.prepare("SELECT id FROM products WHERE id = ?").get(product.id);
      if (!exists) {
        epoxyInsert.run(product);
      }
    }
  });

  seedEpoxy(epoxyResinProducts);
}

const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get();

if (productCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (id, name, category, material, finish, dimensions, description, image, featured, sort_order)
    VALUES (@id, @name, @category, @material, @finish, @dimensions, @description, @image, @featured, @sort_order)
  `);

  const seedProducts = [
    {
      id: "LAK-001",
      name: "Regal Entry Door",
      category: "Doors",
      material: "Solid Oak",
      finish: "Dark Walnut Stain",
      dimensions: "210 × 90 cm",
      description:
        "Hand-carved geometric panels with CNC precision detailing. Classical motifs reimagined for contemporary luxury interiors.",
      image:
        "https://images.unsplash.com/photo-1776064986923-20516105fb85?w=600&h=750&fit=crop&auto=format",
      featured: 1,
      sort_order: 0,
    },
    {
      id: "LAK-002",
      name: "Venetian Double Door",
      category: "Doors",
      material: "Walnut Veneer",
      finish: "Satin Natural",
      dimensions: "220 × 180 cm",
      description:
        "CNC-routed floral medallions with hand-finished edges. Paired brass hardware available on request.",
      image:
        "https://images.unsplash.com/photo-1760385737098-0b555a75b2ba?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 1,
    },
    {
      id: "LAK-003",
      name: "Arabesque Wall Panel",
      category: "Wall Panels",
      material: "MDF Premium",
      finish: "Antique White",
      dimensions: "120 × 60 cm",
      description:
        "Intricate geometric arabesque pattern CNC-routed at 0.5mm precision. Installs flush against any wall surface.",
      image:
        "https://images.unsplash.com/photo-1704423896061-b0a1057e20a3?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 2,
    },
    {
      id: "LAK-004",
      name: "Heritage Drawer Set",
      category: "Drawers",
      material: "Solid Oak",
      finish: "Brushed Bronze",
      dimensions: "Set of 6 — 60 × 20 cm each",
      description:
        "Dovetail joinery meets CNC-carved drawer fronts. Soft-close mechanism included. Custom sizing available.",
      image:
        "https://images.unsplash.com/photo-1561666200-e39dc07c989a?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 3,
    },
    {
      id: "LAK-005",
      name: "Lattice Privacy Screen",
      category: "Decorative",
      material: "Teak",
      finish: "Raw Teak Oil",
      dimensions: "200 × 100 cm",
      description:
        "Precision CNC geometric lattice work. Functions as a room divider, headboard, or architectural installation.",
      image:
        "https://images.unsplash.com/photo-1598581415509-af28687de862?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 4,
    },
    {
      id: "LAK-006",
      name: "Wave Drawer Unit",
      category: "Drawers",
      material: "MDF Premium",
      finish: "Matte Black Lacquer",
      dimensions: "4 drawers — 80 × 60 cm",
      description:
        "Flowing sculptural fronts crafted by 3-axis CNC routing. Seamless drawer faces with concealed push-open mechanism.",
      image:
        "https://images.unsplash.com/photo-1604478579007-70de3dee20cb?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 5,
    },
    {
      id: "LAK-007",
      name: "Carved Wardrobe Doors",
      category: "Doors",
      material: "Walnut",
      finish: "Deep Ebony",
      dimensions: "Pair — 220 × 60 cm each",
      description:
        "Classical acanthus leaf motifs scaled for modern proportions. Available as sliding or hinged configuration.",
      image:
        "https://images.unsplash.com/photo-1664188371127-3a53ce32daaa?w=600&h=750&fit=crop&auto=format",
      featured: 0,
      sort_order: 6,
    },
    {
      id: "LAK-008",
      name: "Ornamental Frame Panel",
      category: "Decorative",
      material: "MDF + Gold Leaf",
      finish: "Gold Leaf Detail",
      dimensions: "90 × 120 cm",
      description:
        "Layered relief work combining CNC routing with hand-applied gold leaf. Statement piece for reception or living areas.",
      image:
        "https://images.unsplash.com/photo-1705508766487-8354da88503b?w=600&h=750&fit=crop&auto=format",
      featured: 1,
      sort_order: 7,
    },
    ...epoxyResinProducts,
  ];

  const seedMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product);
    }
  });

  seedMany(seedProducts);
}

export function rowToProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    material: row.material,
    finish: row.finish,
    dimensions: row.dimensions,
    description: row.description,
    image: row.image,
    featured: Boolean(row.featured),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllProducts(category) {
  let rows;
  if (category && category !== "All") {
    rows = db
      .prepare(
        "SELECT * FROM products WHERE category = ? ORDER BY sort_order ASC, created_at DESC"
      )
      .all(category);
  } else {
    rows = db
      .prepare("SELECT * FROM products ORDER BY sort_order ASC, created_at DESC")
      .all();
  }
  return rows.map(rowToProduct);
}

export function getProductById(id) {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return rowToProduct(row);
}

export function getCategories() {
  const rows = db
    .prepare("SELECT DISTINCT category FROM products ORDER BY category ASC")
    .all();
  return ["All", ...rows.map((r) => r.category)];
}

export function createProduct(data) {
  const maxOrder = db.prepare("SELECT MAX(sort_order) as max FROM products").get();
  const sortOrder = (maxOrder?.max ?? -1) + 1;

  db.prepare(
    `INSERT INTO products (id, name, category, material, finish, dimensions, description, image, featured, sort_order)
     VALUES (@id, @name, @category, @material, @finish, @dimensions, @description, @image, @featured, @sort_order)`
  ).run({
    id: data.id,
    name: data.name,
    category: data.category,
    material: data.material || "",
    finish: data.finish || "",
    dimensions: data.dimensions || "",
    description: data.description || "",
    image: data.image || "",
    featured: data.featured ? 1 : 0,
    sort_order: sortOrder,
  });

  return getProductById(data.id);
}

export function updateProduct(id, data) {
  const existing = getProductById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE products SET
      name = @name,
      category = @category,
      material = @material,
      finish = @finish,
      dimensions = @dimensions,
      description = @description,
      image = @image,
      featured = @featured,
      updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id,
    name: data.name ?? existing.name,
    category: data.category ?? existing.category,
    material: data.material ?? existing.material,
    finish: data.finish ?? existing.finish,
    dimensions: data.dimensions ?? existing.dimensions,
    description: data.description ?? existing.description,
    image: data.image ?? existing.image,
    featured: data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured ? 1 : 0,
  });

  return getProductById(id);
}

export function deleteProduct(id) {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

export function generateProductId() {
  const count = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
  return `LAK-${String(count + 1).padStart(3, "0")}`;
}

function rowToInquiry(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    projectType: row.project_type || "",
    message: row.message || "",
    read: Boolean(row.read),
    createdAt: row.created_at,
  };
}

export function createInquiry(data) {
  const result = db
    .prepare(
      `INSERT INTO inquiries (first_name, last_name, email, project_type, message)
       VALUES (@firstName, @lastName, @email, @projectType, @message)`
    )
    .run({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      projectType: data.projectType || "",
      message: data.message || "",
    });

  return getInquiryById(result.lastInsertRowid);
}

export function getInquiryById(id) {
  const row = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id);
  return rowToInquiry(row);
}

export function getAllInquiries() {
  const rows = db
    .prepare("SELECT * FROM inquiries ORDER BY created_at DESC")
    .all();
  return rows.map(rowToInquiry);
}

export function deleteInquiry(id) {
  const result = db.prepare("DELETE FROM inquiries WHERE id = ?").run(id);
  return result.changes > 0;
}

export function markInquiryRead(id, read = true) {
  const result = db
    .prepare("UPDATE inquiries SET read = ? WHERE id = ?")
    .run(read ? 1 : 0, id);
  return result.changes > 0 ? getInquiryById(id) : null;
}

function getUploadsStats() {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    return { count: 0, totalBytes: 0 };
  }

  let count = 0;
  let totalBytes = 0;
  for (const file of fs.readdirSync(uploadsDir)) {
    const filePath = path.join(uploadsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      count += 1;
      totalBytes += stat.size;
    }
  }

  return { count, totalBytes };
}

export function getSiteAnalytics() {
  const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
  const featuredProducts = db
    .prepare("SELECT COUNT(*) as count FROM products WHERE featured = 1")
    .get().count;
  const withImage = db
    .prepare("SELECT COUNT(*) as count FROM products WHERE image IS NOT NULL AND image != ''")
    .get().count;
  const withoutImage = totalProducts - withImage;
  const uploadedImages = db
    .prepare("SELECT COUNT(*) as count FROM products WHERE image LIKE '/uploads/%'")
    .get().count;
  const externalImages = withImage - uploadedImages;

  const productsByCategory = db
    .prepare(
      "SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC"
    )
    .all()
    .map((row) => ({ category: row.category, count: row.count }));

  const totalInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries").get().count;
  const unreadInquiries = db
    .prepare("SELECT COUNT(*) as count FROM inquiries WHERE read = 0")
    .get().count;
  const inquiriesByProjectType = db
    .prepare(
      `SELECT COALESCE(NULLIF(project_type, ''), 'Unspecified') as project_type, COUNT(*) as count
       FROM inquiries GROUP BY project_type ORDER BY count DESC`
    )
    .all()
    .map((row) => ({ projectType: row.project_type, count: row.count }));

  const recentInquiries = getAllInquiries().slice(0, 5);
  const recentProducts = getAllProducts().slice(0, 5);
  const categories = getCategories().filter((c) => c !== "All");
  const uploads = getUploadsStats();

  const dbStat = fs.existsSync(dbPath) ? fs.statSync(dbPath) : null;

  return {
    catalog: {
      totalProducts,
      featuredProducts,
      withImage,
      withoutImage,
      uploadedImages,
      externalImages,
      productsByCategory,
      categories,
      recentProducts,
    },
    inquiries: {
      total: totalInquiries,
      unread: unreadInquiries,
      byProjectType: inquiriesByProjectType,
      recent: recentInquiries,
    },
    storage: {
      uploadsCount: uploads.count,
      uploadsSizeBytes: uploads.totalBytes,
      databaseSizeBytes: dbStat?.size ?? 0,
    },
    site: {
      environment: process.env.NODE_ENV || "development",
      hasCustomAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    },
  };
}

export default db;

const epoxyResinCount = db
  .prepare("SELECT COUNT(*) as count FROM products WHERE category = 'Epoxy Resin Work'")
  .get().count;

if (epoxyResinCount === 0) {
  insertEpoxyResinProducts();
}
