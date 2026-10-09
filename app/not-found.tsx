import Link from "next/link";
export default function NotFound() {
  return <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
    <div><p style={{ color: "#d7ff43", letterSpacing: ".15em" }}>SENTINEL / 404</p><h1 style={{ fontSize: "clamp(3rem, 9vw, 6rem)" }}>Wrong turn.</h1><p style={{ color: "#9da4a5" }}>That page is not in this part of the map.</p><Link href="/" style={{ display: "inline-block", marginTop: "1rem", padding: "1rem 1.25rem", background: "#d7ff43", color: "#11150b", fontWeight: 800 }}>Back to Sentinel</Link></div>
  </main>;
}