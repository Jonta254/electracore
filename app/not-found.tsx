import Link from "next/link";

export default function NotFound() {
  return (
    <main className="route-state">
      <p className="section-label">404 · Open circuit</p>
      <h1>That page is not connected.</h1>
      <p>Check the address or return to ElectraCore's learning and calculation tools.</p>
      <Link className="btn-primary" href="/">Return home</Link>
    </main>
  );
}
