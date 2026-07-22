import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

const MODES = ["Explain", "Fix", "Optimize", "Secure", "Architect"];

const SAMPLE_EXCHANGE = [
  { role: "user", text: "Why is my deployment failing?" },
  {
    role: "assistant",
    text: "checkout-service crashed 4 times in the last 2 minutes — CrashLoopBackOff. The container exits with code 137, which means it hit its memory limit. Raise the limit from 256Mi to 512Mi, or fix the leak in the image-resize step.",
  },
];

export default function AIAssistantPanel() {
  const [mode, setMode] = useState("Explain");
  const [input, setInput] = useState("");

  return (
    <section id="assistant" className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-xs text-ai uppercase tracking-widest mb-3">AI DevOps Assistant</p>
      <h2 className="font-display text-3xl md:text-4xl text-mist mb-4">Ask it, don't grep for it</h2>
      <p className="text-fog max-w-xl mb-10">
        Point the assistant at a mode and it inspects logs, explains the failure, and highlights
        the exact resource — instead of another wall of kubectl output.
      </p>

      <div className="rounded-2xl border border-line bg-panel overflow-hidden">
        <div className="flex flex-wrap gap-2 p-4 border-b border-line">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-sm font-mono px-3 py-1.5 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ai ${
                mode === m
                  ? "border-ai text-ai bg-ai/10"
                  : "border-line text-fog hover:text-mist hover:border-mist/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4 min-h-[220px]">
          {SAMPLE_EXCHANGE.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`max-w-lg rounded-xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "self-end bg-panel-2 text-mist"
                  : "self-start bg-ai/10 text-mist border border-ai/30"
              }`}
            >
              {m.role === "assistant" && (
                <span className="flex items-center gap-1.5 text-xs text-ai font-mono mb-1.5">
                  <Sparkles size={12} /> {mode.toLowerCase()} mode
                </span>
              )}
              {m.text}
            </motion.div>
          ))}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-3 p-4 border-t border-line"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask the assistant to ${mode.toLowerCase()} something…`}
            className="flex-1 bg-panel-2 rounded-lg px-4 py-2.5 text-sm text-mist placeholder:text-fog/70 border border-line focus:outline-none focus:border-ai/60"
          />
          <button
            type="submit"
            className="rounded-lg bg-ai text-void p-2.5 hover:bg-ai/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ai"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
