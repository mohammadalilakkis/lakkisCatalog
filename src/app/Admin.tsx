import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, LogOut, Upload, X, Star } from "lucide-react";
import {
  Product,
  fetchProducts,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
  getToken,
  clearToken,
  login,
} from "./api";

const CATEGORY_OPTIONS = ["Doors", "Drawers", "Wall Panels", "Decorative"];

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

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(!!getToken());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products);
    } catch {
      if (!getToken()) setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated, loadProducts]);

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
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-primary" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.3em" }}>
              CATALOG ADMIN
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600 }}>
              Manage Items
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              View site
            </Link>
            <button
              onClick={() => setEditing("new")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-background hover:bg-primary/90"
              style={{ fontSize: "11px", letterSpacing: "0.15em", fontWeight: 600 }}
            >
              <Plus size={14} /> ADD ITEM
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary text-muted-foreground">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
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
