import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "running" | "restarting" | "crashed";

const INITIAL = [
  { name: "nginx", status: "running" as Status },
  { name: "redis", status: "running" as Status },
  { name: "postgres", status: "running" as Status },
  { name: "backend", status: "running" as Status },
  { name: "frontend", status: "running" as Status },
];

function ShipCard({
  name,
  status,
  onKill,
}: {
  name: string;
  status: Status;
  onKill: () => void;
}) {
  const ring =
    status === "running"
      ? "border-docker/50"
      : status === "restarting"
      ? "border-signal/60"
      : "border-alert/60";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, rotate: status === "crashed" ? [0, -6, 0] : 0 }}
      exit={{ opacity: 0 }}
      className={`rounded-xl border ${ring} bg-panel-2 p-4 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-mist">{name}</span>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            status === "running"
              ? "text-signal bg-signal/10"
              : status === "restarting"
              ? "text-docker bg-docker/10"
              : "text-alert bg-alert/10"
          }`}
        >
          {status}
        </span>
      </div>

      <svg viewBox="0 0 120 60" className="w-full h-14">
        <defs>
          <linearGradient id={`water-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2a3a" />
            <stop offset="100%" stopColor="#050816" />
          </linearGradient>
        </defs>
        <rect x="0" y="46" width="120" height="14" fill={`url(#water-${name})`} />
        <motion.path
          d="M0 46 Q 20 44 40 46 T 80 46 T 120 46"
          fill="none"
          stroke="#1c3e52"
          strokeWidth="1"
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.ellipse
          cx="60"
          cy="47"
          rx="30"
          ry="3"
          fill="none"
          stroke="#1c3e52"
          strokeWidth="1"
          animate={
            status === "running"
              ? { rx: [18, 36, 18], opacity: [0.5, 0, 0.5] }
              : { opacity: 0 }
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.g
          animate={
            status === "crashed"
              ? { rotate: 70, y: 20, opacity: 0.3 }
              : { y: [0, -3, 0], rotate: 0, opacity: 1 }
          }
          transition={
            status === "crashed"
              ? { duration: 0.6 }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: "60px 40px" }}
        >
          <path d="M20 40 L100 40 L88 54 L32 54 Z" fill="var(--color-panel)" stroke="var(--color-docker)" strokeWidth="1.5" />
          <rect x="46" y="18" width="28" height="22" rx="2" fill="var(--color-docker-dim)" stroke="var(--color-docker)" strokeWidth="1.5" />
        </motion.g>

        {status === "crashed" && (
          <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0.9, 0], scale: 1.4 }} transition={{ duration: 0.8 }}>
            <circle cx="60" cy="46" r="14" fill="none" stroke="var(--color-alert)" strokeWidth="1.5" />
          </motion.g>
        )}
      </svg>

      <button
        onClick={onKill}
        disabled={status !== "running"}
        className="text-xs font-mono text-fog hover:text-alert disabled:opacity-40 disabled:hover:text-fog text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-alert rounded"
      >
        kill container →
      </button>
    </motion.div>
  );
}

export default function DockerHarbor() {
  const [ships, setShips] = useState(INITIAL);

  function kill(name: string) {
    setShips((prev) => prev.map((s) => (s.name === name ? { ...s, status: "crashed" } : s)));
    setTimeout(() => {
      setShips((prev) => prev.map((s) => (s.name === name ? { ...s, status: "restarting" } : s)));
    }, 900);
    setTimeout(() => {
      setShips((prev) => prev.map((s) => (s.name === name ? { ...s, status: "running" } : s)));
    }, 2400);
  }

  return (
    <section id="harbor" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-xs text-docker uppercase tracking-widest mb-3">Docker Harbor</p>
      <h2 className="font-display text-3xl md:text-4xl text-mist mb-4">Every container is a ship at dock</h2>
      <p className="text-fog max-w-xl mb-10">
        Sink one to see self-healing in action. It crashes, Kubernetes notices, and a fresh ship
        launches to take its place — no manifest reading required.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {ships.map((s) => (
            <ShipCard key={s.name} name={s.name} status={s.status} onKill={() => kill(s.name)} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
