"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const PARTNER_URL = "https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3";
type Product = { id: string; name: string; slug: string; category: string; description: string; partnerUrl: string; status: "DRAFT" | "ACTIVE" | "ARCHIVED"; sortOrder: number };
type Draft = { name: string; category: string; description: string };
const emptyDraft: Draft = { name: "", category: "Top-ups", description: "" };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("Loading saved catalogue…");
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load catalogue.");
      setProducts(data.products);
      setNotice("Catalogue loaded from the database.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load catalogue.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const filtered = useMemo(() => products.filter(p =>
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())
  ), [products, query]);

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    const description = draft.description.trim();
    if (!name || !description) { setNotice("Enter a product name and description."); return; }
    const slug = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, category: draft.category, description, partnerUrl: PARTNER_URL, status: "DRAFT" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save product.");
      setProducts(current => [data.product, ...current]);
      setDraft(emptyDraft); setShowForm(false); setNotice("Product saved as a draft.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save product."); }
    finally { setSaving(false); }
  }

  async function changeStatus(product: Product) {
    const status = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update product.");
      setProducts(current => current.map(item => item.id === product.id ? data.product : item));
      setNotice(`${product.name} set to ${status.toLowerCase()}.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not update product."); }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete “${product.name}” from the catalogue?`)) return;
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete product.");
      setProducts(current => current.filter(item => item.id !== product.id));
      setNotice("Product deleted.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete product."); }
  }

  const activeCategories = new Set(products.filter(p => p.status === "ACTIVE").map(p => p.category)).size;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="brand" href="/"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMERS WORLD</span></span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav active" href="#overview">▦ &nbsp; Overview</a>
      <a className="admin-nav" href="#products">▤ &nbsp; Products</a>
      <a className="admin-nav" href="#affiliate">↗ &nbsp; Affiliate reports</a>
      <div className="admin-side-bottom"><span className="admin-online-dot" /> Admin workspace<br /><small>Session-protected</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="eyebrow">GAMERS WORLD / CONTROL ROOM</p><h1>Admin dashboard</h1></div><div className="admin-top-actions"><a className="button button-small" href="/">View storefront ↗</a><form action="/api/admin/logout" method="post"><button className="button button-small button-ghost" type="submit">Sign out</button></form></div></header>
      <div className="admin-warning"><strong>Database-backed catalogue</strong><span>Product edits are saved to the configured database. Affiliate commissions remain blank until verified partner reporting is available.</span></div>
      <section id="overview" className="admin-stats">
        <article><span>CATALOGUE ENTRIES</span><strong>{products.length}</strong><small>Saved products</small></article>
        <article><span>ACTIVE CATEGORIES</span><strong>{activeCategories}</strong><small>Categories with published items</small></article>
        <article><span>VERIFIED COMMISSION</span><strong>—</strong><small>Awaiting verified partner data</small></article>
      </section>
      <section className="admin-panel" id="products">
        <div className="admin-panel-heading"><div><p className="eyebrow">CATALOGUE MANAGEMENT / 01</p><h2>Products</h2></div><button className="button" onClick={() => setShowForm(v => !v)}>{showForm ? "Cancel" : "+ Add product"}</button></div>
        {showForm && <form className="admin-product-form" onSubmit={addProduct}>
          <label>Product name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Game currency" maxLength={120} required /></label>
          <label>Category<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}><option>Top-ups</option><option>Gift cards</option><option>COD Mobile</option><option>Free Fire</option><option>PUBG Mobile</option><option>Other</option></select></label>
          <label className="admin-form-wide">Description<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Short product description" maxLength={3000} required /></label>
          <button className="button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save as draft"}</button>
        </form>}
        <div className="admin-table-tools"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search catalogue..." aria-label="Search admin catalogue" /><span>{filtered.length} items <button className="button button-small button-ghost" onClick={() => void loadProducts()} disabled={loading}>Refresh</button></span></div>
        <div className="admin-table-wrap"><table><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><strong>{p.name}</strong><small>{p.description}</small></td><td>{p.category}</td><td><span className={p.status === "ACTIVE" ? "admin-status active" : "admin-status"}>{p.status}</span></td><td><div className="admin-row-actions"><button className="button button-small button-ghost" onClick={() => void changeStatus(p)}>{p.status === "ACTIVE" ? "Unpublish" : "Publish"}</button><button className="button button-small button-ghost" onClick={() => void deleteProduct(p)}>Delete</button></div></td></tr>)}</tbody></table></div>
        {!loading && filtered.length === 0 && <p className="admin-empty">No saved products match this search.</p>}
        <p className="admin-notice" role="status">{loading ? "Loading…" : notice}</p>
      </section>
      <section className="admin-panel" id="affiliate"><div className="admin-panel-heading"><div><p className="eyebrow">PERFORMANCE / 02</p><h2>Affiliate reporting</h2></div></div><div className="admin-report-note"><strong>Verified reporting is not connected yet.</strong><p>Outbound clicks are not confirmed sales. Import official partner reports before recording verified orders or commission amounts. No commission is estimated or invented.</p></div></section>
    </section>
  </main>;
}
