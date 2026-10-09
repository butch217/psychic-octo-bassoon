import Link from "next/link";

export default function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <main className="admin-login-shell">
    <section className="admin-login-card">
      <Link className="brand" href="/"><span className="brand-mark">S</span><span>SENTINEL<span className="brand-sub">GAMERS WORLD</span></span></Link>
      <p className="eyebrow">RESTRICTED AREA / ADMINISTRATION</p>
      <h1>Admin sign in</h1>
      <p className="admin-login-intro">Sign in to manage the Sentinel catalogue. Access is limited to the configured administrator.</p>
      <form action="/api/admin/login" method="post" className="admin-login-form">
        <label>Administrator password<input type="password" name="password" autoComplete="current-password" required minLength={12} /></label>
        <button className="button" type="submit">Sign in securely ↗</button>
      </form>
      <p className="admin-login-error">{(await searchParams).error ? "Sign-in failed. Check the password or server configuration." : ""}</p>
      <p className="admin-login-foot">Never share your admin password. <Link href="/">Return to storefront</Link></p>
    </section>
  </main>;
}
