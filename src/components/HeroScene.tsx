import { motion } from "framer-motion";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 137) % 1600,
  y: (i * 71) % 380,
  r: 0.5 + ((i * 37) % 10) / 10,
  delay: (i % 20) / 5,
}));

function Ship({ x, delay }: { x: number; delay: number }) {
  return (
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
      <rect x={x - 4} y={-34} width="3" height="14" fill="var(--color-fog)" />
    </motion.g>
  );
}

function Pod({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <circle cx={cx} cy={cy} r="7" fill="var(--color-panel)" stroke="var(--color-k8s)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="2" fill="var(--color-k8s)">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" begin={`${delay}s`} />
      </circle>
    </motion.g>
  );
}

function Island({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="34" rx="70" ry="14" fill="var(--color-k8s-dim)" opacity="0.5" />
      <path
        d="M -60 20 Q -70 -6 -30 -10 Q 0 -26 30 -10 Q 68 -6 60 20 Q 0 34 -60 20 Z"
        fill="var(--color-panel-2)"
        stroke="var(--color-k8s)"
        strokeWidth="1.5"
      />
      <Pod cx={-22} cy={-2} delay={0} />
      <Pod cx={6} cy={-10} delay={0.6} />
      <Pod cx={30} cy={0} delay={1.1} />
    </g>
  );
}

export default function HeroScene() {
  return (
    <div className="relative w-full aspect-[16/10] max-h-[640px] overflow-hidden rounded-2xl border border-line bg-panel">
      <svg viewBox="0 0 1600 900" className="w-full h-full" role="img" aria-label="Animated illustration of Kubernetes islands, a Docker harbor, and a deployment rocket launching from GitHub">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070b14" />
            <stop offset="100%" stopColor="#0c1730" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2a3a" />
            <stop offset="100%" stopColor="#070b14" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#sky)" />

        {STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="var(--color-mist)"
            animate={{ opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
          />
        ))}

        {/* Deployment pipeline: GitHub -> build -> rocket -> island */}
        <g transform="translate(90 130)">
          <rect x="-30" y="-24" width="60" height="48" rx="10" fill="var(--color-panel-2)" stroke="var(--color-fog)" strokeWidth="1.5" />
          <path d="M0 -10a10 10 0 100 20 10 10 0 000-20z" fill="none" stroke="var(--color-mist)" strokeWidth="2" />
          <text x="0" y="42" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--color-fog)">GitHub</text>
        </g>

        <motion.path
          d="M 120 130 C 260 130, 260 260, 400 260"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <motion.circle r="4" fill="var(--color-signal)">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M 120 130 C 260 130, 260 260, 400 260" />
        </motion.circle>

        <g transform="translate(430 260)">
          <rect x="-30" y="-22" width="60" height="44" rx="8" fill="var(--color-docker-dim)" stroke="var(--color-docker)" strokeWidth="1.5" />
          <text x="0" y="40" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--color-docker)">build</text>
        </g>

        <g>
          <path d="M0 0 L-8 20 L0 14 L8 20 Z" fill="var(--color-alert)" />
          <path d="M-3 8 L3 8 L0 -10 Z" fill="var(--color-mist)" />
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            rotate="auto"
            path="M 460 260 C 560 260, 560 90, 700 60"
          />
        </g>

        {/* Islands */}
        <Island x={780} y={80} scale={0.9} />
        <Island x={1180} y={140} scale={1.05} />

        <line x1="850" y1="90" x2="1120" y2="130" stroke="var(--color-k8s)" strokeWidth="1" strokeDasharray="2 6" opacity="0.6" />

        {/* Water + harbor */}
        <rect x="0" y="640" width="1600" height="260" fill="url(#water)" />
        <line x1="0" y1="640" x2="1600" y2="640" stroke="var(--color-line)" strokeWidth="1.5" />

        <g transform="translate(0 700)">
          <Ship x={260} delay={0} />
          <Ship x={360} delay={0.5} />
          <Ship x={460} delay={1} />
          <Ship x={1150} delay={0.3} />
          <Ship x={1260} delay={0.9} />
        </g>

        {/* Traffic particles along the base */}
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} r="3" fill="var(--color-ai)">
            <animateMotion
              dur={`${5 + i}s`}
              repeatCount="indefinite"
              path="M 0 760 C 400 760, 900 760, 1600 760"
              begin={`${i * 1.6}s`}
            />
          </motion.circle>
        ))}
      </svg>
    </div>
  );
}
