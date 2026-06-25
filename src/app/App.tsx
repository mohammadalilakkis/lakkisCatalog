import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, ChevronRight, Phone, Mail, MapPin, Star } from "lucide-react";
import { fetchProducts, type Product } from "./api";

const PROCESS_STEPS = [
  { number: "01", title: "Consultation", body: "We meet to understand your space, style, and functional needs. Every project begins with listening." },
  { number: "02", title: "Design & Drafting", body: "Our designers produce detailed CAD files and 3D renderings for your approval before any cutting begins." },
  { number: "03", title: "CNC Precision Cutting", body: "State-of-the-art 3-axis and 5-axis CNC machines execute designs with sub-millimetre accuracy." },
  { number: "04", title: "Finishing & Assembly", body: "Master craftsmen apply stains, lacquers, and hand-finishing to every piece before final assembly." },
];

const MATERIALS = [
  { name: "Solid Oak", origin: "European Oak", trait: "Exceptional durability and grain character. Ages beautifully.", icon: "◆" },
  { name: "Black Walnut", origin: "American Walnut", trait: "Rich dark tones with fine, straight grain. The prestige choice.", icon: "◈" },
  { name: "Premium MDF", origin: "Moisture-resistant", trait: "Ideal for painted or lacquered finishes. Perfect CNC surface.", icon: "◇" },
];

const TESTIMONIALS = [
  {
    quote: "The entry doors Lakkis created for our villa are beyond anything we imagined. The CNC work is absolutely flawless — every guest asks where they came from.",
    author: "Khalid Al-Rashid",
    title: "Private Residence, Dubai",
    rating: 5,
  },
  {
    quote: "We outfitted an entire hotel lobby with their wall panels and custom doors. On time, perfect quality, and the team was a pleasure to work with throughout.",
    author: "Elena Vasquez",
    title: "Interior Designer, Madrid",
    rating: 5,
  },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All", "Doors", "Drawers", "Wall Panels", "Decorative"]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
      })
      .catch(console.error)
      .finally(() => setCatalogLoading(false));
  }, []);

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

      {/* ── Navigation ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.3em", opacity: 0.7 }}>EST. 2009</span>
            <div className="w-px h-4 bg-primary/30" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, letterSpacing: "0.12em" }}>
              LAKKIS
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {["Catalog", "Process", "Materials", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/70 hover:text-primary transition-colors duration-200"
                style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 500 }}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 500 }}
            >
              REQUEST QUOTE
            </a>
          </div>

          <button
            className="lg:hidden text-foreground/70 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-card border-t border-border px-6 py-8 flex flex-col gap-6">
            {["Catalog", "Process", "Materials", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/70 hover:text-primary transition-colors"
                style={{ fontSize: "13px", letterSpacing: "0.2em", fontWeight: 500 }}
                onClick={() => setMenuOpen(false)}
              >
                {item.toUpperCase()}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              REQUEST QUOTE
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden bg-card">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1776064986923-20516105fb85?w=1800&h=1200&fit=crop&auto=format"
            alt="Ornate CNC-carved wooden doors with gold geometric patterns"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 w-full">
          <div className="max-w-3xl">
            <p className="text-primary mb-6" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.35em" }}>
              CUSTOM CNC WOODWORK — PRECISION & ARTISTRY
            </p>
            <h1 className="mb-8 leading-[0.92]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 700, color: "#F0E6CC" }}>
              Where Wood<br />
              <em style={{ fontStyle: "italic", color: "#C9A96E" }}>Becomes Art</em>
            </h1>
            <p className="text-foreground/60 mb-12 max-w-lg leading-relaxed" style={{ fontSize: "16px", fontWeight: 300 }}>
              Bespoke doors, drawers, wall panels, and decorative pieces crafted with CNC precision and the hand of a master artisan. Each piece is made to last generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="flex items-center gap-3 px-8 py-4 bg-primary text-background hover:bg-primary/90 transition-all duration-300 group"
                style={{ fontSize: "11px", letterSpacing: "0.25em", fontWeight: 600 }}
              >
                VIEW CATALOG
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#process"
                className="flex items-center gap-3 px-8 py-4 border border-foreground/30 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-300"
                style={{ fontSize: "11px", letterSpacing: "0.25em", fontWeight: 500 }}
              >
                OUR PROCESS
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-12 hidden lg:flex flex-col items-center gap-3 text-foreground/40">
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", writingMode: "vertical-rl" }}>SCROLL</span>
          <div className="w-px h-12 bg-primary/40" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years of Craft" },
              { value: "840+", label: "Projects Delivered" },
              { value: "12", label: "Countries Served" },
              { value: "100%", label: "Bespoke Made" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left border-r border-border last:border-r-0 pr-8 last:pr-0">
                <div className="text-primary mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.25em" }}>
                  {stat.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalog ── */}
      <section id="catalog" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <p className="text-primary mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em" }}>
                OUR WORK
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.1 }}>
                The Collection
              </h2>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-0 border border-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-3 transition-all duration-200 border-r border-border last:border-r-0 ${
                    activeCategory === cat
                      ? "bg-primary text-background"
                      : "bg-transparent text-foreground/60 hover:text-primary"
                  }`}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em" }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {catalogLoading ? (
            <div className="text-center py-24 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.2em" }}>
              LOADING COLLECTION...
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-card group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-background/70 flex items-center justify-center transition-opacity duration-300 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}>
                    <a
                      href="#contact"
                      className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200"
                      style={{ fontSize: "10px", letterSpacing: "0.25em", fontWeight: 600 }}
                    >
                      REQUEST QUOTE <ArrowRight size={12} />
                    </a>
                  </div>
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-primary text-background px-3 py-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                      FEATURED
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 text-foreground/40" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}>
                    {product.id}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary/60" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                      {product.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-3 text-sm leading-relaxed" style={{ fontWeight: 300 }}>
                    {product.description}
                  </p>
                  <div className="flex flex-col gap-1 pt-3 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}>MATERIAL</span>
                      <span className="text-foreground/80" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px" }}>{product.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em" }}>SIZE</span>
                      <span className="text-foreground/80" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px" }}>{product.dimensions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {!catalogLoading && filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.2em" }}>
              NO ITEMS IN THIS CATEGORY
            </div>
          )}
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em" }}>
                HOW WE WORK
              </p>
              <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, lineHeight: 1.1 }}>
                Craft Meets<br />
                <em style={{ fontStyle: "italic", color: "#C9A96E" }}>Precision</em>
              </h2>
              <p className="text-foreground/60 mb-12 leading-relaxed" style={{ fontWeight: 300, fontSize: "15px" }}>
                Every Lakkis piece follows a rigorous journey — from the first conversation to the moment it is installed in your space. We never cut corners, only wood.
              </p>

              <div className="flex flex-col gap-8">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.number} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 border border-primary/40 flex items-center justify-center">
                      <span className="text-primary" style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 500 }}>
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600 }}>
                        {step.title}
                      </h4>
                      <p className="text-foreground/60 leading-relaxed" style={{ fontWeight: 300, fontSize: "14px" }}>
                        {step.body}
                      </p>
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="absolute left-6 mt-14 w-px h-6 bg-border hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1704423896061-b0a1057e20a3?w=800&h=1067&fit=crop&auto=format"
                  alt="Close-up of CNC wood carving pattern showing intricate detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 border border-border bg-background p-6 hidden lg:block">
                <p className="text-primary mb-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "28px", fontWeight: 500 }}>0.5mm</p>
                <p className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>CNC ACCURACY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Materials ── */}
      <section id="materials" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-primary mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em" }}>
              SOURCED WITH CARE
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600 }}>
              Premium Materials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {MATERIALS.map((mat) => (
              <div key={mat.name} className="bg-card p-10 group hover:bg-muted transition-colors duration-300">
                <div className="text-primary mb-6" style={{ fontSize: "32px" }}>{mat.icon}</div>
                <h3 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600 }}>
                  {mat.name}
                </h3>
                <p className="text-primary/70 mb-4" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em" }}>
                  {mat.origin.toUpperCase()}
                </p>
                <p className="text-foreground/60 leading-relaxed" style={{ fontWeight: 300, fontSize: "14px" }}>
                  {mat.trait}
                </p>
                <div className="mt-8 w-8 h-px bg-primary/40 group-hover:w-16 transition-all duration-500" />
              </div>
            ))}
          </div>

          <div className="mt-px bg-card">
            <div className="relative overflow-hidden h-64 lg:h-96 bg-muted">
              <img
                src="https://images.unsplash.com/photo-1561666200-e39dc07c989a?w=1800&h=600&fit=crop&auto=format"
                alt="Premium wood grain texture up close"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center max-w-2xl px-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 400, color: "#F0E6CC", lineHeight: 1.5 }}>
                  <em>"Every plank carries a story. We make sure yours is worth telling."</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-primary mb-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em" }}>
              CLIENT VOICES
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600 }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-background p-10 lg:p-14">
                <div className="flex gap-1 mb-8">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mb-8 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 400, fontStyle: "italic", color: "#D4C5A9" }}>
                  "{t.quote}"
                </blockquote>
                <div className="border-t border-border pt-6">
                  <p className="text-foreground/90 font-medium">{t.author}</p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", marginTop: "4px" }}>
                    {t.title.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="contact" className="relative py-32 overflow-hidden bg-background">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1760385737098-0b555a75b2ba?w=1800&h=900&fit=crop&auto=format"
            alt="Elegant double wooden doors with gold trim"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
          <div className="border border-border bg-background/80 backdrop-blur-sm p-12 lg:p-20">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <p className="text-primary mb-4" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em" }}>
                  START YOUR PROJECT
                </p>
                <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1 }}>
                  Let's Build<br />
                  <em style={{ fontStyle: "italic", color: "#C9A96E" }}>Something Lasting</em>
                </h2>
                <p className="text-foreground/60 mb-8 leading-relaxed" style={{ fontWeight: 300, fontSize: "15px" }}>
                  Share your vision with us. We respond to every inquiry within 24 hours with an initial consultation proposal.
                </p>
                <div className="flex flex-col gap-4">
                  <a href="tel:+1234567890" className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors group">
                    <Phone size={14} className="text-primary" />
                    <span style={{ fontSize: "14px", fontWeight: 300 }}>+1 (234) 567-8900</span>
                  </a>
                  <a href="mailto:studio@lakkis.com" className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors">
                    <Mail size={14} className="text-primary" />
                    <span style={{ fontSize: "14px", fontWeight: 300 }}>studio@lakkis.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-foreground/60">
                    <MapPin size={14} className="text-primary flex-shrink-0" />
                    <span style={{ fontSize: "14px", fontWeight: 300 }}>12 Craft District, Workshop Row, Berlin</span>
                  </div>
                </div>
              </div>

              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      style={{ fontSize: "14px", fontWeight: 300 }}
                      placeholder="James"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      style={{ fontSize: "14px", fontWeight: 300 }}
                      placeholder="Wright"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    style={{ fontSize: "14px", fontWeight: 300 }}
                    placeholder="james@example.com"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                    PROJECT TYPE
                  </label>
                  <select
                    className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                    style={{ fontSize: "14px", fontWeight: 300 }}
                  >
                    <option value="">Select a category</option>
                    <option>Doors</option>
                    <option>Drawers</option>
                    <option>Wall Panels</option>
                    <option>Decorative Pieces</option>
                    <option>Full Interior Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em" }}>
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-muted border border-border text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                    style={{ fontSize: "14px", fontWeight: 300 }}
                    placeholder="Describe your project, dimensions, materials, or any inspiration..."
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-background hover:bg-primary/90 transition-all duration-300 group mt-2"
                  style={{ fontSize: "11px", letterSpacing: "0.3em", fontWeight: 600 }}
                >
                  SEND INQUIRY
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 600, letterSpacing: "0.12em" }}>LAKKIS</span>
              </div>
              <p className="text-foreground/50 leading-relaxed max-w-sm" style={{ fontWeight: 300, fontSize: "14px" }}>
                Master woodworkers and CNC artisans creating bespoke pieces for private residences, hotels, and hospitality spaces worldwide since 2009.
              </p>
            </div>

            <div>
              <p className="text-primary mb-5" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.3em" }}>NAVIGATE</p>
              <ul className="flex flex-col gap-3">
                {["Catalog", "Process", "Materials", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-foreground/50 hover:text-primary transition-colors flex items-center gap-2 group" style={{ fontSize: "13px", fontWeight: 300 }}>
                      <ChevronRight size={10} className="text-primary/50 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-primary mb-5" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.3em" }}>COLLECTIONS</p>
              <ul className="flex flex-col gap-3">
                {categories.filter((c) => c !== "All").map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => { setActiveCategory(cat); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                      className="text-foreground/50 hover:text-primary transition-colors flex items-center gap-2 group"
                      style={{ fontSize: "13px", fontWeight: 300 }}
                    >
                      <ChevronRight size={10} className="text-primary/50 group-hover:translate-x-1 transition-transform" />
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-foreground/30" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em" }}>
              © 2024 LAKKIS. ALL RIGHTS RESERVED.
            </p>
            <p className="text-foreground/30" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em" }}>
              HANDCRAFTED WITH PRECISION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
