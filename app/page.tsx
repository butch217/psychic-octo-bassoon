const affiliateUrl = "https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3";
const discordUrl = "https://discord.gg/QUeHC9eN";
const whatsappUrl = "https://wa.me/2349063389697";
const categories = [
  { number: "01", title: "COD Mobile", description: "Guides, loadout discussions, and official-store offers.", tag: "MOBILE FPS" },
  { number: "02", title: "Gaming offers", description: "Browse eligible digital gaming products through our partner shop.", tag: "AFFILIATE PICKS" },
  { number: "03", title: "Community events", description: "Meet other players, share tips, and follow community announcements.", tag: "PLAY TOGETHER" },
];
export default function Home() {
  return <main>
    <div className="announcement"><span className="status-dot" /> GAMERS WORLD PRESENTS <strong>SENTINEL</strong><span className="announcement-note">Built for the community.</span></div>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Sentinel Gaming home"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMING / GAMERS WORLD</span></span></a>
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
      <div className="section-heading"><div><p className="eyebrow">THE SENTINEL NETWORK / 01</p><h2>Find your next move.</h2></div><p className="section-intro">A growing hub for players who want better information, good company, and easy access to relevant offers.</p></div>
      <div className="category-grid">{categories.map((category) => <article className="category-card" key={category.number}>
        <div className="card-top"><span>{category.tag}</span><span>{category.number}</span></div><div className="card-symbol">{category.number === "01" ? "⌁" : category.number === "02" ? "↗" : "◎"}</div><h3>{category.title}</h3><p>{category.description}</p>
        <a href={category.number === "03" ? discordUrl : affiliateUrl} target="_blank" rel="noreferrer">{category.number === "03" ? "Enter community" : "Explore with Carry1st"} <span>↗</span></a>
      </article>)}</div>
    </section>
    <section className="partner-banner"><div><p className="eyebrow">OFFICIAL PARTNER DESTINATION</p><h2>Ready to gear up?</h2><p>Explore products and offers on Carry1st. Purchases are completed on the partner&apos;s website.</p></div><a className="button button-light" href={affiliateUrl} target="_blank" rel="noreferrer">Shop Carry1st ↗</a></section>
    <section className="section community-section" id="community"><div className="community-mark">S<span>+</span></div><div className="community-copy">
      <p className="eyebrow">THE PEOPLE MAKE THE GAME / 02</p><h2>More than a lobby.<br /><span>A community.</span></h2><p>Join the conversation, trade strategies, share clips, and hear about community updates. Keep it respectful and help make the space useful for every player.</p>
      <div className="hero-actions"><a className="button" href={discordUrl} target="_blank" rel="noreferrer">Join Discord ↗</a><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Contact on WhatsApp ↗</a></div>
    </div></section>
    <section className="disclosure" id="about"><strong>Affiliate transparency</strong><p>Some links on Sentinel may be affiliate links. If you make an eligible purchase through them, Sentinel may earn a commission at no additional cost to you. Product availability, prices, fulfilment, and purchase terms are controlled by Carry1st. Sentinel does not process payments for these partner purchases.</p></section>
    <footer className="footer"><a className="brand footer-brand" href="/"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMERS WORLD</span></span></a><span>COMMUNITY FIRST. ALWAYS.</span><span>© {new Date().getFullYear()} Gamers World</span></footer>
  </main>;
}