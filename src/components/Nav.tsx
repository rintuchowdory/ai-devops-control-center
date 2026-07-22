const LINKS = [
  { href: "#harbor", label: "Harbor" },
  { href: "#islands", label: "Islands" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#city", label: "City" },
  { href: "#assistant", label: "Assistant" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-void/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-semibold text-mist tracking-tight">
          <span className="inline-block w-2 h-2 rounded-full bg-k8s shadow-[0_0_10px_var(--color-k8s)]" />
          DevOps Control Center
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-fog">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-mist transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#assistant"
          className="text-sm font-medium rounded-full border border-k8s/40 text-k8s px-4 py-1.5 hover:bg-k8s/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-k8s"
        >
          Ask the assistant
        </a>
      </div>
    </header>
  );
}
