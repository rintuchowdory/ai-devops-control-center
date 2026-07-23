import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, CloudFog, Flame, Zap } from "lucide-react";

const BUILDINGS = [
  { name: "api-gateway", base: 32 },
  { name: "auth-svc", base: 44 },
  { name: "worker-pool", base: 58 },
  { name: "db-primary", base: 40 },
  { name: "cache", base: 26 },
];

function weatherFor(load: number) {
  if (load < 30) return { label: "sunshine", icon: Sun, color: "var(--color-warn)" };
  if (load < 55) return { label: "partly cloudy", icon: CloudFog, color: "var(--color-k8s)" };
  if (load < 80) return { label: "heat wave", icon: Flame, color: "var(--color-docker)" };
  return { label: "storm", icon: Zap, color: "var(--color-alert)" };
}

export default function MonitoringCity() {
  const [load, setLoad] = useState(35);
  const weather = useMemo(() => weatherFor(load), [load]);
  const WeatherIcon = weather.icon;
  const stormy = load >= 80;

  return (
    <section id="city" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-xs text-ai uppercase tracking-widest mb-3">Monitoring City</p>
      <h2 className="font-display text-3xl md:text-4xl text-mist mb-4">Prometheus becomes a skyline</h2>
      <p className="text-fog max-w-xl mb-10">
        Drag the load slider. The weather is the cluster's health — sunshine when it's calm,
        a heat wave under CPU pressure, and a storm when things really tip over.
      </p>

      <div className="rounded-2xl border border-line bg-panel p-6 relative overflow-hidden">
        <AnimatePresence>
          {stormy && (
            <motion.div
              key="lightning"
              className="absolute inset-0 bg-mist pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.12, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.8 }}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 mb-4 font-mono text-xs" style={{ color: weather.color }}>
          <WeatherIcon size={14} />
          {weather.label}
        </div>

        <svg viewBox="0 0 800 260" className="w-full h-56">
          <rect width="800" height="260" fill="var(--color-void)" />
          <line x1="0" y1="220" x2="800" y2="220" stroke="var(--color-line)" strokeWidth="1.5" />
          {BUILDINGS.map((b, i) => {
            const height = b.base + load * 1.4;
            const heat = Math.min(1, (load + i * 3) / 110);
            const color = heat > 0.7 ? "var(--color-alert)" : heat > 0.4 ? "var(--color-docker)" : "var(--color-k8s)";
            const x = 60 + i * 150;
            return (
              <g key={b.name}>
                <motion.rect
                  x={x}
                  animate={{ y: 220 - height, height }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  width="70"
                  fill="var(--color-panel-2)"
                  stroke={color}
                  strokeWidth="1.5"
                />
                {Array.from({ length: 5 }).map((_, w) => (
                  <motion.rect
                    key={w}
                    x={x + 10 + (w % 3) * 18}
                    animate={{ y: 220 - height + 12 + Math.floor(w / 3) * 16 }}
                    width="8"
                    height="8"
                    fill={color}
                    opacity={heat > 0.15 ? 0.8 : 0.15}
                  />
                ))}
                <text x={x + 35} y="238" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-fog)">
                  {b.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-6 flex items-center gap-4">
          <span className="font-mono text-xs text-fog w-16">CPU {load}%</span>
          <input
            type="range"
            min={5}
            max={95}
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
            className="w-full accent-ai"
            aria-label="Simulated CPU load"
          />
        </div>
      </div>
    </section>
  );
}
