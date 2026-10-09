"use client";

import { useMemo, useState } from "react";

type DraftProduct = { name: string; category: string; description: string; partnerUrl: string; status: "Draft" | "Active" };
const starterProducts: DraftProduct[] = [
  { name: "Call of Duty: Mobile", category: "Top-ups", description: "COD Points and Battle Pass offers", partnerUrl: "Carry1st affiliate destination", status: "Active" },
  { name: "Free Fire Diamonds", category: "Top-ups", description: "Free Fire diamond top-ups", partnerUrl: "Carry1st affiliate destination", status: "Active" },
  { name: "PUBG Mobile UC", category: "Top-ups", description: "PUBG Mobile UC top-ups", partnerUrl: "Carry1st affiliate destination", status: "Active" },
  { name: "Mobile Legends Diamonds", category: "Top-ups", description: "Mobile Legends diamond top-ups", partnerUrl: "Carry1st affiliate destination", status: "Active" },
  { name: "Blood Strike Golds", category: "Top-ups", description: "Blood Strike Gold top-ups", partnerUrl: "Carry1st affiliate destination", status: "Active" },
  { name: "Gaming Gift Cards", category: "Gift cards", description: "Steam, Xbox and other vouchers", partnerUrl: "Carry1st affiliate destination", status: "Active" },
];

export default function AdminPage() {
  const [products, setProducts] = useState(starterProducts);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("Preview mode: changes are kept only in this browser session.");
  const [draft, setDraft] = useState<DraftProduct>({ name: "", category: "Top-ups", description: "", partnerUrl: "Carry1st affiliate destination", status: "Draft" });
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  function addDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.description.trim()) {
      setNotice("Enter a product name and description before adding the draft.");
      return;
    }
    setProducts((current) => [...current, { ...draft, name: draft.name.trim(), description: draft.description.trim() }]);
    setDraft({ name: "", category: "Top-ups", description: "", partnerUrl: "Carry1st affiliate destination", status: "Draft" });
    setShowForm(false);
    setNotice("Draft added to this preview. It is not saved to a database or published to the storefront.");
  }

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a className="brand" href="/"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMERS WORLD</span></span></a>
      <p className="admin-side-label">WORKSPACE</p>
      <a className="admin-nav active" href="#overview">▦ &nbsp; Overview</a>
      <a className="admin-nav" href="#products">▤ &nbsp; Products</a>
      <a className="admin-nav" href="#affiliate">↗ &nbsp; Affiliate reports</a>
      <div className="admin-side-bottom"><span className="admin-online-dot" /> Admin UI preview<br /><small>Authentication not enabled</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="eyebrow">GAMERS WORLD / CONTROL ROOM</p><h1>Admin dashboard</h1></div><div className="admin-top-actions"><a className="button button-small" href="/">View storefront ↗</a><form action="/api/admin/logout" method="post"><button className="button button-small button-ghost" type="submit">Sign out</button></form></div></header>
      <div className="admin-warning"><strong>Preview only</strong><span>This dashboard is not secured or database-connected yet. Do not enter passwords, customer data, or confidential information.</span></div>
      <section id="overview" className="admin-stats">
        <article><span>CATALOGUE ENTRIES</span><strong>{products.length}</strong><small>Local preview items</small></article>
        <article><span>ACTIVE CATEGORIES</span><strong>{new Set(products.filter(p => p.status === "Active").map(p => p.category)).size}</strong><small>Based on preview state</small></article>
        <article><span>VERIFIED COMMISSION</span><strong>—</strong><small>Connect official affiliate reports first</small></article>
      </section>
      <section className="admin-panel" id="products">
        <div className="admin-panel-heading"><div><p className="eyebrow">CATALOGUE MANAGEMENT / 01</p><h2>Products</h2></div><button className="button" onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "+ Add draft"}</button></div>
        {showForm && <form className="admin-product-form" onSubmit={addDraft}>
          <label>Product name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Game currency" required /></label>
          <label>Category<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}><option>Top-ups</option><option>Gift cards</option><option>Other</option></select></label>
          <label className="admin-form-wide">Description<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Short product description" required /></label>
          <button className="button" type="submit">Add draft to preview</button>
        </form>}
        <div className="admin-table-tools"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search catalogue..." aria-label="Search admin catalogue" /><span>{filtered.length} items</span></div>
        <div className="admin-table-wrap"><table><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>STATUS</th><th>PARTNER</th></tr></thead><tbody>{filtered.map((p, i) => <tr key={p.name + i}><td><strong>{p.name}</strong><small>{p.description}</small></td><td>{p.category}</td><td><span className={p.status === "Active" ? "admin-status active" : "admin-status"}>{p.status}</span></td><td>Carry1st affiliate</td></tr>)}</tbody></table></div>
        {filtered.length === 0 && <p className="admin-empty">No products match this search.</p>}
        <p className="admin-notice" role="status">{notice}</p>
      </section>
      <section className="admin-panel" id="affiliate"><div className="admin-panel-heading"><div><p className="eyebrow">PERFORMANCE / 02</p><h2>Affiliate reporting</h2></div></div><div className="admin-report-note"><strong>Reporting is not connected yet.</strong><p>Outbound clicks and confirmed orders are different events. Commission totals should only appear after verified data is imported from the affiliate partner.</p></div></section>
    </section>
  </main>;
}
