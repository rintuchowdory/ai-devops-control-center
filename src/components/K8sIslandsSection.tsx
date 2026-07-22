import K8sIslands3D from "./K8sIslands3D";

const NAMESPACES = [
  { name: "frontend", color: "bg-k8s" },
  { name: "backend", color: "bg-ai" },
  { name: "redis", color: "bg-signal" },
];

export default function K8sIslandsSection() {
  return (
    <section id="islands" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-xs text-k8s uppercase tracking-widest mb-3">Kubernetes Islands</p>
      <h2 className="font-display text-3xl md:text-4xl text-mist mb-4">Namespaces you can orbit</h2>
      <p className="text-fog max-w-xl mb-10">
        Each namespace floats as its own island. Drag to look around — clicking a pod (coming in
        Phase 2) will surface CPU, memory, logs, and an AI explanation of what it's doing.
      </p>

      <K8sIslands3D />

      <div className="flex gap-6 mt-4 font-mono text-xs text-fog">
        {NAMESPACES.map((n) => (
          <span key={n.name} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${n.color}`} />
            {n.name}
          </span>
        ))}
      </div>
    </section>
  );
}
