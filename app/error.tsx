"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="route-state" role="alert">
      <p className="section-label">Connection interrupted</p>
      <h1>ElectraCore could not display this page.</h1>
      <p>Your saved browser data has not been changed. Try loading the page again.</p>
      <button className="btn-primary" type="button" onClick={reset}>Try again</button>
    </main>
  );
}

