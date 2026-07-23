import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 137) % 1600,
  y: (i * 71) % 380,
  r: 0.5 + ((i * 37) % 10) / 10,
  delay: (i % 20) / 5,
}));

function Ship({ x, delay, night }: { x: number; delay: number; night: boolean }) {
  return (
    <g>
      <motion.ellipse
        cx={x}
        cy="30"
        rx="34"
        ry="4"
        fill="none"
        stroke={night ? "#3a4d7a" : "#2f5468"}
        strokeWidth="1"
        animate={{ rx: [20, 46, 20], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay }}
      />
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <path
          d={`M ${x - 34} 0 L ${x + 34} 0 L ${x + 24} 20 L ${x - 24} 20 Z`}
          fill="var(--color-panel-2)"
          stroke="var(--color-docker)"
          strokeWidth="1.5"
        />
        <rect x={x - 10} y={-22} width="20" height="22" rx="2" fill="var(--color-docker-dim)" stroke="var(--color-docker)" strokeWidth="1.5" />
        <rect x={x - 4} y={-34} width="3" height="14" fill={night ? "var(--color-k8s)" : "var(--color-fog)"} />
      </motion.g>
    </g>
  );
}

function Pod({ cx, cy, delay, night }: { cx: number; cy: number; delay: number; night: boolean }) {
  return (
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}>
      <circle cx={cx} cy={cy} r="7" fill="var(--color-panel)" stroke="var(--color-k8s)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={night ? 2.6 : 2} fill="var(--color-k8s)">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" begin={`${delay}s`} />
      </circle>
    </motion.g>
  );
}

function Island({ x, y, scale = 1, night }: { x: number; y: number; scale?: number; night: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="34" rx="70" ry="14" fill="var(--color-k8s-dim)" opacity={night ? 0.7 : 0.5} />
      <path
        d="M -60 20 Q -70 -6 -30 -10 Q 0 -26 30 -10 Q 68 -6 60 20 Q 0 34 -60 20 Z"
        fill="var(--color-panel-2)"
        stroke="var(--color-k8s)"
        strokeWidth="1.5"
      />
      <Pod cx={-22} cy={-2} delay={0} night={night} />
      <Pod cx={6} cy={-10} delay={0.6} night={night} />
      <Pod cx={30} cy={0} delay={1.1} night={night} />
    </g>
  );
}

type LaunchPhase = "idle" | "counting" | "ignition" | "flying";

export default function HeroScene() {
  const [night, setNight] = useState(false);
  const [phase, setPhase] = useState<LaunchPhase>("idle");
  const [count, setCount] = useState(3);
  const [shootingStar, setShootingStar] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const id = setInterval(() => setShootingStar((n) => n + 1), 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const launch = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("counting");
    setCount(3);
    timers.current.push(setTimeout(() => setCount(2), 700));
    timers.current.push(setTimeout(() => setCount(1), 1400));
    timers.current.push(setTimeout(() => setPhase("ignition"), 2100));
    timers.current.push(setTimeout(() => setPhase("flying"), 2600));
    timers.current.push(setTimeout(() => setPhase("idle"), 5800));
  }, [phase]);

  return (
    <div
      className={`relative w-full aspect-[16/10] max-h-[640px] overflow-hidden rounded-2xl border border-line transition-colors duration-700 ${
        phase === "ignition" ? "camera-shake" : ""
      }`}
      style={{ background: night ? "#050816" : "#0a1024" }}
    >
      <button
        onClick={() => setNight((n) => !n)}
        aria-label={night ? "Switch to day" : "Switch to night"}
        className="absolute top-4 right-4 z-10 rounded-full border border-line bg-panel/80 backdrop-blur p-2 text-mist hover:text-k8s transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-k8s"
      >
        {night ? <Moon size={16} className="glow-purple" /> : <Sun size={16} />}
      </button>

      <button
        onClick={launch}
        disabled={phase !== "idle"}
        className="absolute bottom-4 right-4 z-10 rounded-full border border-alert/50 bg-panel/80 backdrop-blur px-4 py-1.5 text-xs font-mono text-alert disabled:opacity-50 hover:bg-alert/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-alert"
      >
        launch deployment →
      </button>

      <svg viewBox="0 0 1600 900" className="w-full h-full">
        <defs>
          <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1024" />
            <stop offset="100%" stopColor="#132242" />
          </linearGradient>
          <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050816" />
            <stop offset="100%" stopColor="#150c2e" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={night ? "#0d1a3a" : "#0f2a3a"} />
            <stop offset="100%" stopColor="#050816" />
          </linearGradient>
        </defs>

        <motion.rect
          width="1600"
          height="900"
          animate={{ fill: night ? "url(#sky-night)" : "url(#sky-day)" }}
          transition={{ duration: 0.8 }}
        />

        <motion.circle
          cx="1450"
          cy="90"
          animate={{ r: night ? 26 : 34 }}
          fill={night ? "var(--color-mist)" : "var(--color-warn)"}
          className={night ? "glow-purple" : "glow-warn"}
        />

        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="var(--color-mist)"
            animate={{ opacity: night ? [0.2, 1, 0.2] : 0 }}
            transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
          />
        ))}

        <AnimatePresence>
          {night && (
            <motion.line
              key={shootingStar}
              stroke="var(--color-mist)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0, x1: 100, y1: 20, x2: 240, y2: 100 }}
              animate={{ opacity: [0, 1, 0], x1: 300, y1: 200, x2: 440, y2: 280 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <g transform="translate(90 130)">
          <rect x="-30" y="-24" width="60" height="48" rx="10" fill="var(--color-panel-2)" stroke="var(--color-fog)" strokeWidth="1.5" />
          <path d="M0 -10a10 10 0 100 20 10 10 0 000-20z" fill="none" stroke="var(--color-mist)" strokeWidth="2" />
          <text x="0" y="42" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--color-fog)">GitHub</text>
        </g>

        <path d="M 120 130 C 260 130, 260 260, 400 260" fill="none" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="6 8" />
        <circle r="4" fill="var(--color-signal)">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M 120 130 C 260 130, 260 260, 400 260" />
        </circle>

        <g transform="translate(430 260)">
          <rect x="-30" y="-22" width="60" height="44" rx="8" fill="var(--color-docker-dim)" stroke="var(--color-docker)" strokeWidth="1.5" />
          <text x="0" y="40" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--color-docker)">build</text>
        </g>

        <g transform="translate(430 260)">
          <AnimatePresence>
            {phase === "counting" && (
              <motion.text
                key={count}
                x="0"
                y="-40"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize="28"
                fontWeight="700"
                fill="var(--color-warn)"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: -46 }}
                exit={{ opacity: 0 }}
              >
                {count}
              </motion.text>
            )}
          </AnimatePresence>

          {(phase === "ignition" || phase === "flying") &&
            [0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={i * 8 - 8}
                cy="20"
                fill="var(--color-fog)"
                initial={{ opacity: 0.8, r: 4 }}
                animate={{ opacity: 0, r: 16 }}
                transition={{ duration: 1.2, delay: i * 0.15 }}
              />
            ))}
        </g>

        {phase === "flying" ? (
          <g>
            <path d="M0 0 L-8 20 L0 14 L8 20 Z" fill="var(--color-alert)" className="glow-alert" />
            <path d="M-3 8 L3 8 L0 -10 Z" fill="var(--color-mist)" />
            <animateMotion dur="3.2s" repeatCount="1" rotate="auto" path="M 460 260 C 560 260, 560 90, 700 60" fill="freeze" />
          </g>
        ) : (
          <g>
            <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" path="M 460 260 C 560 260, 560 90, 700 60" />
            <path d="M0 0 L-8 20 L0 14 L8 20 Z" fill="var(--color-alert)" opacity="0.85" />
            <path d="M-3 8 L3 8 L0 -10 Z" fill="var(--color-mist)" />
          </g>
        )}

        <Island x={780} y={80} scale={0.9} night={night} />
        <Island x={1180} y={140} scale={1.05} night={night} />
        <line x1="850" y1="90" x2="1120" y2="130" stroke="var(--color-k8s)" strokeWidth="1" strokeDasharray="2 6" opacity="0.6" />

        <rect x="0" y="640" width="1600" height="260" fill="url(#water)" />
        <line x1="0" y1="640" x2="1600" y2="640" stroke="var(--color-line)" strokeWidth="1.5" />

        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M0 ${660 + i * 40} Q 200 ${650 + i * 40}, 400 ${660 + i * 40} T 800 ${660 + i * 40} T 1200 ${660 + i * 40} T 1600 ${660 + i * 40}`}
            fill="none"
            stroke={night ? "#1c2b52" : "#1c3e52"}
            strokeWidth="1.5"
            animate={{ x: [0, -60, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <motion.g
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: [-100, 900], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatDelay: 20, ease: "linear" }}
        >
          <path d="M0 780 Q 30 760 60 780 Q 40 792 20 788 Q 8 796 0 780 Z" fill={night ? "#22314f" : "#1c3e52"} />
        </motion.g>

        <g transform="translate(0 700)">
          <Ship x={260} delay={0} night={night} />
          <Ship x={360} delay={0.5} night={night} />
          <Ship x={460} delay={1} night={night} />
          <Ship x={1150} delay={0.3} night={night} />
          <Ship x={1260} delay={0.9} night={night} />
        </g>

        {[0, 1, 2].map((i) => (
          <circle key={i} r="3" fill="var(--color-ai)">
            <animateMotion dur={`${5 + i}s`} repeatCount="indefinite" path="M 0 760 C 400 760, 900 760, 1600 760" begin={`${i * 1.6}s`} />
          </circle>
        ))}
      </svg>
    </div>
  );
}
