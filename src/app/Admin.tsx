import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, LogOut, Upload, X, Star, Mail, BarChart3, Package, Check, RefreshCw } from "lucide-react";
import {
  Product,
  Inquiry,
  SiteAnalytics,
  fetchProducts,
  fetchInquiries,
  fetchAnalytics,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
  deleteInquiry,
  markInquiryRead,
  getToken,
  clearToken,
  login,
  verifySession,
} from "./api";

const CATEGORY_OPTIONS = ["Doors", "Drawers", "Wall Panels", "Decorative", "Epoxy Resin Work"];
type AdminTab = "catalog" | "inquiries" | "analytics";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const emptyForm = {
  id: "",
  name: "",
  category: "Doors",
  material: "",
  finish: "",
  dimensions: "",
  description: "",
  featured: false,
};

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-border bg-card p-10">
        <p className="text-primary mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.3em" }}>
          LAKKIS
        </p>
        <h1 className="mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 600 }}>
          Catalog Admin
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-50"
            style={{ fontSize: "11px", letterSpacing: "0.25em", fontWeight: 600 }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
        <Link to="/" className="block text-center mt-6 text-muted-foreground hover:text-primary text-sm">
          ← Back to catalog
        </Link>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Partial<Product> | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isNew = !product?.id;
  const [form, setForm] = useState({ ...emptyForm, ...product });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let savedId = form.id;

      if (isNew) {
        const { product: created } = await createProduct({
          name: form.name,
          category: form.category,
          material: form.material,
          finish: form.finish,
          dimensions: form.dimensions,
          description: form.description,
          featured: form.featured,
        });
        savedId = created.id;
      } else {
        await updateProduct(form.id, {
          name: form.name,
          category: form.category,
          material: form.material,
          finish: form.finish,
          dimensions: form.dimensions,
          description: form.description,
          featured: form.featured,
        });
      }

      if (imageFile && savedId) {
        await uploadProductImage(savedId, imageFile);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl border border-border bg-card p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600 }}>
            {isNew ? "Add New Item" : "Edit Item"}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>NAME</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>CATEGORY</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>MATERIAL</label>
              <input
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>FINISH</label>
              <input
                value={form.finish}
                onChange={(e) => setForm({ ...form, finish: e.target.value })}
                className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>DIMENSIONS</label>
            <input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary"
              placeholder="e.g. 210 × 90 cm"
            />
          </div>

          <div>
            <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-muted border border-border px-4 py-2.5 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>PHOTO</label>
            <div className="flex items-start gap-4">
              {preview && (
                <img src={preview} alt="Preview" className="w-24 h-32 object-cover border border-border" />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 border border-border hover:border-primary cursor-pointer transition-colors">
                <Upload size={14} />
                <span style={{ fontSize: "12px" }}>{imageFile ? imageFile.name : "Choose image"}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-primary"
            />
            <span className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-primary" /> Featured item
            </span>
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-background hover:bg-primary/90 disabled:opacity-50"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              {saving ? "SAVING..." : isNew ? "ADD ITEM" : "SAVE CHANGES"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-border hover:border-primary transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InquiriesPanel({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries();
      setInquiries(data.inquiries);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        onSessionExpired();
        return;
      }
      alert(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleMarkRead = async (id: number) => {
    try {
      await markInquiryRead(id, true);
      await loadInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update inquiry");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    setDeleting(id);
    try {
      await deleteInquiry(id);
      await loadInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground text-center py-20">Loading inquiries...</p>;
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-20 border border-border bg-card">
        <Mail size={32} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No inquiries yet.</p>
        <p className="text-muted-foreground text-sm mt-2">Messages from the contact form will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground text-sm">
          {inquiries.filter((i) => !i.read).length} unread · {inquiries.length} total
        </p>
        <button
          onClick={loadInquiries}
          className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary text-sm text-muted-foreground"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className={`border bg-card p-6 ${inquiry.read ? "border-border" : "border-primary/50"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600 }}>
                  {inquiry.firstName} {inquiry.lastName}
                </h3>
                {!inquiry.read && (
                  <span className="bg-primary text-background px-2 py-0.5 text-xs" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.15em" }}>
                    NEW
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{inquiry.email}</p>
              <p className="text-muted-foreground text-xs mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                {formatDate(inquiry.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              {!inquiry.read && (
                <button
                  onClick={() => handleMarkRead(inquiry.id)}
                  className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary text-sm"
                >
                  <Check size={14} /> Mark read
                </button>
              )}
              <button
                onClick={() => handleDelete(inquiry.id)}
                disabled={deleting === inquiry.id}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-red-400 hover:text-red-400 text-sm disabled:opacity-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {inquiry.projectType && (
            <p className="mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "var(--primary)" }}>
              PROJECT: {inquiry.projectType.toUpperCase()}
            </p>
          )}
          {inquiry.message ? (
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          ) : (
            <p className="text-muted-foreground italic text-sm">No message provided.</p>
          )}
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-border bg-card p-6">
      <p className="text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}>
        {label}
      </p>
      <p className="text-primary mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 700 }}>
        {value}
      </p>
      {hint && <p className="text-muted-foreground text-sm">{hint}</p>}
    </div>
  );
}

function AnalyticsPanel({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [analytics, setAnalytics] = useState<SiteAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data.analytics);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        onSessionExpired();
        return;
      }
      alert(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading || !analytics) {
    return <p className="text-muted-foreground text-center py-20">Loading analytics...</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Overview of catalog, inquiries, and storage</p>
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary text-sm text-muted-foreground"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div>
        <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600 }}>
          Catalog
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="TOTAL PRODUCTS" value={analytics.catalog.totalProducts} />
          <StatCard label="FEATURED" value={analytics.catalog.featuredProducts} />
          <StatCard label="WITH IMAGES" value={analytics.catalog.withImage} />
          <StatCard label="MISSING IMAGES" value={analytics.catalog.withoutImage} />
        </div>
      </div>

      <div>
        <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600 }}>
          Inquiries
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="TOTAL INQUIRIES" value={analytics.inquiries.total} />
          <StatCard label="UNREAD" value={analytics.inquiries.unread} />
          <StatCard label="CATEGORIES" value={analytics.catalog.categories.length} hint={analytics.catalog.categories.join(", ") || "None"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
            Products by category
          </h3>
          {analytics.catalog.productsByCategory.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {analytics.catalog.productsByCategory.map((row) => (
                <li key={row.category} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                  <span>{row.category}</span>
                  <span className="text-primary">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
            Inquiries by project type
          </h3>
          {analytics.inquiries.byProjectType.length === 0 ? (
            <p className="text-muted-foreground text-sm">No inquiries yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {analytics.inquiries.byProjectType.map((row) => (
                <li key={row.projectType} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                  <span>{row.projectType}</span>
                  <span className="text-primary">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600 }}>
          Storage & site
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="UPLOADED FILES" value={analytics.storage.uploadsCount} />
          <StatCard label="UPLOADS SIZE" value={formatBytes(analytics.storage.uploadsSizeBytes)} />
          <StatCard label="DATABASE SIZE" value={formatBytes(analytics.storage.databaseSizeBytes)} />
          <StatCard
            label="ENVIRONMENT"
            value={analytics.site.environment}
            hint={analytics.site.hasCustomAdminPassword ? "Custom admin password set" : "Using default admin password"}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard label="HOSTED IMAGES" value={analytics.catalog.uploadedImages} hint="Stored on server" />
          <StatCard label="EXTERNAL IMAGES" value={analytics.catalog.externalImages} hint="URLs (e.g. Unsplash)" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
            Recent products
          </h3>
          {analytics.catalog.recentProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {analytics.catalog.recentProducts.map((product) => (
                <li key={product.id} className="text-sm border-b border-border pb-2 last:border-0">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground"> · {product.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
            Recent inquiries
          </h3>
          {analytics.inquiries.recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No inquiries yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {analytics.inquiries.recent.map((inquiry) => (
                <li key={inquiry.id} className="text-sm border-b border-border pb-2 last:border-0">
                  <span className="font-medium">{inquiry.firstName} {inquiry.lastName}</span>
                  <span className="text-muted-foreground"> · {inquiry.projectType || "No type"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(!!getToken());
  const [activeTab, setActiveTab] = useState<AdminTab>("catalog");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleSessionExpired = useCallback(() => {
    clearToken();
    setAuthenticated(false);
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    verifySession().catch(() => handleSessionExpired());
  }, [handleSessionExpired]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        handleSessionExpired();
        return;
      }
      if (!getToken()) setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (authenticated && activeTab === "catalog") loadProducts();
  }, [authenticated, activeTab, loadProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Raleway', sans-serif" }}>
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-primary" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.3em" }}>
                CATALOG ADMIN
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600 }}>
                {activeTab === "catalog" && "Manage Items"}
                {activeTab === "inquiries" && "Inquiries"}
                {activeTab === "analytics" && "Site Analysis"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                View site
              </Link>
              {activeTab === "catalog" && (
                <button
                  onClick={() => setEditing("new")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-background hover:bg-primary/90"
                  style={{ fontSize: "11px", letterSpacing: "0.15em", fontWeight: 600 }}
                >
                  <Plus size={14} /> ADD ITEM
                </button>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary text-muted-foreground">
                <LogOut size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-0 border border-border w-fit">
            {([
              { id: "catalog" as const, label: "Catalog", icon: Package },
              { id: "inquiries" as const, label: "Inquiries", icon: Mail },
              { id: "analytics" as const, label: "Analysis", icon: BarChart3 },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 border-r border-border last:border-r-0 transition-colors ${
                  activeTab === id
                    ? "bg-primary text-background"
                    : "bg-transparent text-foreground/60 hover:text-primary"
                }`}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em" }}
              >
                <Icon size={14} />
                {label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "inquiries" && <InquiriesPanel onSessionExpired={handleSessionExpired} />}
        {activeTab === "analytics" && <AnalyticsPanel onSessionExpired={handleSessionExpired} />}
        {activeTab === "catalog" && (
          <>
        {loading ? (
          <p className="text-muted-foreground text-center py-20">Loading catalog...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No items yet.</p>
            <button
              onClick={() => setEditing("new")}
              className="px-6 py-3 bg-primary text-background"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              ADD YOUR FIRST ITEM
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-border bg-card overflow-hidden">
                <div className="relative aspect-[4/5] bg-muted">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-primary text-background px-2 py-0.5 text-xs" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.15em" }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-primary/60 mb-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}>
                    {product.id} · {product.category.toUpperCase()}
                  </p>
                  <h3 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-border hover:border-primary transition-colors"
                      style={{ fontSize: "11px", letterSpacing: "0.1em" }}
                    >
                      <Pencil size={12} /> EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-border hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </main>

      {editing !== null && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onSave={() => {
            setEditing(null);
            loadProducts();
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
