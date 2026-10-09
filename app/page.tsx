"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const affiliateUrl = "https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3";
const discordUrl = "https://discord.gg/QUeHC9eN";
const whatsappUrl = "https://wa.me/2349063389697";

const starterCategories = [
  { number: "01", title: "Call of Duty: Mobile", slug: "call-of-duty-mobile", description: "COD Points and Battle Pass offers listed on Carry1st.", tag: "CODM TOP-UP", type: "Top-ups", symbol: "⌁", accent: "lime" },
  { number: "02", title: "Free Fire Diamonds", slug: "free-fire-diamonds", description: "Browse available Free Fire diamond top-ups and offers.", tag: "FREE FIRE", type: "Top-ups", symbol: "◇", accent: "orange" },
  { number: "03", title: "PUBG Mobile UC", slug: "pubg-mobile-uc", description: "Find PUBG Mobile UC top-ups and related offers.", tag: "PUBG MOBILE", type: "Top-ups", symbol: "◎", accent: "gold" },
  { number: "04", title: "Mobile Legends Diamonds", slug: "mobile-legends-diamonds", description: "Explore Mobile Legends diamond top-ups on the partner shop.", tag: "MOBILE LEGENDS", type: "Top-ups", symbol: "✳", accent: "blue" },
  { number: "05", title: "Blood Strike Golds", slug: "blood-strike-golds", description: "Check available Blood Strike Gold top-ups and offers.", tag: "BLOOD STRIKE", type: "Top-ups", symbol: "↗", accent: "red" },
  { number: "06", title: "Gaming Gift Cards", slug: "gaming-gift-cards", description: "Browse available gaming vouchers, including Steam, Xbox, and other gift cards.", tag: "GIFT CARDS", type: "Gift cards", symbol: "▣", accent: "purple" },
];

type CatalogueItem = { slug: string; title: string; description: string; tag: string; type: string; symbol: string; accent: string; number: string };

const filters = ["All", "Top-ups", "Gift cards"];

export default function Home() {
  const [categories, setCategories] = useState<CatalogueItem[]>(starterCategories);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetch("/api/products", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Catalogue API unavailable");
        const data = await response.json();
        if (!Array.isArray(data.products) || data.products.length === 0) return;
        const fallbackBySlug = new Map(starterCategories.map(item => [item.slug, item] as const));
        const items: CatalogueItem[] = data.products.map((product: { slug: string; name: string; category: string; description: string }, index: number) => {
          const fallback = fallbackBySlug.get(product.slug);
          return {
            slug: product.slug,
            title: product.name,
            description: product.description,
            tag: fallback?.tag ?? product.category.toUpperCase(),
            type: product.category,
            symbol: fallback?.symbol ?? "✳",
            accent: fallback?.accent ?? "lime",
            number: String(index + 1).padStart(2, "0"),
          };
        });
        if (!cancelled) setCategories(items);
      })
      .catch(() => { /* Keep the static starter catalogue available if the database is not configured. */ });
    return () => { cancelled = true; };
  }, []);

  const visibleCategories = useMemo(() => categories.filter((category) => {
    const matchesFilter = activeFilter === "All" || category.type === activeFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${category.title} ${category.description} ${category.tag}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  }), [activeFilter, categories, search]);

  return <main>
    <div className="announcement"><span className="status-dot" /> GAMERS WORLD PRESENTS <strong>SENTINEL</strong><span className="announcement-note">Built for the community.</span></div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Sentinel Gaming home"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMING / GAMERS WORLD</span></span></Link>
      <nav aria-label="Main navigation"><a href="#explore">Explore</a><a href="#community">Community</a><a href="#about">About</a></nav>
      <a className="button button-small" href={affiliateUrl} target="_blank" rel="noreferrer">Visit Carry1st ↗</a>
    </header>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span /> YOUR GAME. YOUR COMMUNITY.</div>
        <h1>STAY READY.<br /><span>PLAY YOUR WAY.</span></h1>
        <p className="hero-text">A home for mobile gamers to discover useful guides, connect with the community, and explore gaming offers through our Carry1st affiliate shop.</p>
        <div className="hero-actions"><a className="button" href={discordUrl} target="_blank" rel="noreferrer">Join the community ↗</a><a className="button button-ghost" href="#explore">Explore Sentinel ↓</a></div>
        <p className="micro-copy">COMMUNITY FIRST · CLEAR AFFILIATE DISCLOSURE · MOBILE READY</p>
      </div>
      <div className="hero-art" aria-label="Sentinel Gaming abstract shield graphic"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="shield"><span>S</span></div><div className="art-label label-top">SNTL / 001</div><div className="art-label label-bottom">GAMERS WORLD<br />EST. COMMUNITY</div><div className="crosshair">+</div></div>
    </section>
    <section className="ticker" aria-label="Sentinel principles"><span>COMMUNITY</span><b>✳</b><span>STRATEGY</span><b>✳</b><span>DISCOVERY</span><b>✳</b><span>PLAY TOGETHER</span><b>✳</b><span>COMMUNITY</span></section>
    <section className="section explore-section" id="explore">
      <div className="section-heading"><div><p className="eyebrow">THE SENTINEL NETWORK / 01</p><h2>Find your next move.</h2></div><p className="section-intro">Browse product categories listed on Carry1st, then continue to the partner shop to check current options and complete your purchase.</p></div>
      <div className="catalogue-tools">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games or gift cards..." aria-label="Search product categories" /></label>
        <div className="filter-list" aria-label="Filter categories">{filters.map((filter) => <button key={filter} type="button" className={activeFilter === filter ? "filter-button active" : "filter-button"} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div>
      </div>
      <p className="catalogue-count">{visibleCategories.length} CATEGORIES <span>·</span> CHECK LIVE PRICES AND STOCK ON CARRY1ST</p>
      <div className="category-grid">{visibleCategories.map((category) => <article className="category-card" key={category.number}>
        <div className="card-top"><span>{category.tag}</span><span>{category.number}</span></div>
        <div className={`card-art card-art-${category.accent}`} aria-hidden="true"><span>{category.symbol}</span><i>{category.number}</i></div>
        <h3>{category.title}</h3><p>{category.description}</p>
        <a href={`/api/outbound/${category.slug}`} target="_blank" rel="noreferrer">Browse on Carry1st <span>↗</span></a>
      </article>)}</div>
      {visibleCategories.length === 0 && <div className="empty-results"><strong>No matching categories</strong><p>Try another game name or switch the category filter.</p><button type="button" className="filter-button active" onClick={() => { setSearch(""); setActiveFilter("All"); }}>Clear filters</button></div>}
      <p className="catalogue-note">Sentinel is an affiliate discovery page, not the seller. Prices, package options, stock and checkout are provided by Carry1st and may change.</p>
    </section>
    <section className="partner-banner"><div><p className="eyebrow">OFFICIAL PARTNER DESTINATION</p><h2>Ready to gear up?</h2><p>Explore products and offers on Carry1st. Purchases are completed on the partner&apos;s website.</p></div><a className="button button-light" href={affiliateUrl} target="_blank" rel="noreferrer">Shop Carry1st ↗</a></section>
    <section className="section community-section" id="community"><div className="community-mark">S<span>+</span></div><div className="community-copy">
      <p className="eyebrow">THE PEOPLE MAKE THE GAME / 02</p><h2>More than a lobby.<br /><span>A community.</span></h2><p>Join the conversation, trade strategies, share clips, and hear about community updates. Keep it respectful and help make the space useful for every player.</p>
      <div className="hero-actions"><a className="button" href={discordUrl} target="_blank" rel="noreferrer">Join Discord ↗</a><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Contact on WhatsApp ↗</a></div>
    </div></section>
    <section className="disclosure" id="about"><strong>Affiliate transparency</strong><p>Some links on Sentinel may be affiliate links. If you make an eligible purchase through them, Sentinel may earn a commission at no additional cost to you. Product availability, prices, fulfilment, and purchase terms are controlled by Carry1st. Sentinel does not process payments for these partner purchases.</p></section>
    <footer className="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMERS WORLD</span></span></Link><span>COMMUNITY FIRST. ALWAYS.</span><span>© {new Date().getFullYear()} Gamers World</span></footer>
  </main>;
}
