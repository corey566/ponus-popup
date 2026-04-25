import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  day: number | null;
  dayLabel?: string;
  qty?: string;
  detail?: string;
  title?: string;
  iconType?: "coin" | "gem" | "glass" | "gift";
};

const ICON_FOR_TYPE: Record<NonNullable<Props["iconType"]>, string> = {
  coin: "/images/chest.gif",
  gem: "/images/chest.gif",
  glass: "/images/chest.gif",
  gift: "/images/chest.gif",
};

const CONFETTI_COLORS = [
  "#FFD166",
  "#EF476F",
  "#06D6A0",
  "#118AB2",
  "#FFC93C",
  "#FF6B6B",
  "#A78BFA",
];

export default function RewardClaimModal({
  isOpen,
  onClose,
  day,
  dayLabel,
  qty,
  detail,
  title,
  iconType = "gift",
}: Props) {
  const icon = ICON_FOR_TYPE[iconType];

  return (
    <AnimatePresence>
      {isOpen && day != null && (
        <motion.div
          key="claim-overlay"
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-testid="claim-modal-overlay"
        >
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.4, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 16, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              data-testid="btn-claim-close"
              className="absolute -top-2 -right-2 md:top-0 md:-right-10 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-7 h-7" strokeWidth={2.5} />
            </button>

            {/* Purple ribbon banner */}
            <div className="relative z-20 flex justify-center">
              <RibbonBanner>
                {dayLabel ? `${dayLabel} Reward` : `Day ${day} Reward`}
              </RibbonBanner>
            </div>

            {/* Treasure / chest area with starburst */}
            <div className="relative w-75 md:w-95 h-65 md:h-80 flex items-center justify-center -mt-2">
              {/* Rotating starburst */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 360, scale: 1, opacity: 1 }}
                transition={{
                  rotate: { repeat: Infinity, duration: 18, ease: "linear" },
                  scale: { duration: 0.6, ease: "easeOut" },
                  opacity: { duration: 0.4 },
                }}
              >
                <Starburst />
              </motion.div>

              {/* Glow */}
              <div
                className="absolute w-[60%] h-[60%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,210,80,0.55) 0%, rgba(255,180,0,0.15) 45%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />

              {/* Reward icon */}
              <motion.img
                src={icon}
                alt={`${dayLabel ?? `Day ${day}`} reward`}
                className="relative z-10 w-[70%] h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.15,
                }}
              />

              {qty && (
                <motion.div
                  className="absolute bottom-2 z-20 bg-linear-to-b from-[#FF9A4D] to-[#D9491A] text-white font-bold text-base md:text-lg px-4 py-1 rounded-full border-2 border-[#FFD58A] shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {qty}
                </motion.div>
              )}

              {/* Confetti particles */}
              {Array.from({ length: 18 }).map((_, i) => {
                const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
                const angle = (i / 18) * Math.PI * 2;
                const radius = 110 + Math.random() * 60;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.span
                    key={i}
                    className="absolute z-20 rounded-sm"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: 8 + Math.random() * 6,
                      height: 8 + Math.random() * 6,
                      backgroundColor: color,
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
                    animate={{
                      x,
                      y,
                      opacity: [0, 1, 1, 0],
                      rotate: 360 * (i % 2 === 0 ? 1 : -1),
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.6,
                      delay: 0.2 + (i % 6) * 0.04,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>

            {/* Reward title + detail */}
            {(title || detail) && (
              <motion.div
                className="relative z-20 max-w-85 md:max-w-105 text-center px-3 -mt-1 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {title && (
                  <div className="text-white font-bold text-base md:text-lg drop-shadow">
                    {title}
                  </div>
                )}
                {detail && (
                  <div className="text-[#FFE6A8] text-xs md:text-sm mt-0.5 leading-snug">
                    {detail}
                  </div>
                )}
              </motion.div>
            )}

            {/* Claim button */}
            <div className="relative z-20 flex justify-center">
              <motion.button
                type="button"
                onClick={onClose}
                data-testid="btn-claim-confirm"
                className="relative px-10 md:px-14 py-3 md:py-3.5 rounded-full bg-linear-to-b from-[#FFB347] via-[#FF9A1F] to-[#E07112] text-white font-bold text-base md:text-lg shadow-[0_6px_0_0_rgba(160,60,0,0.8),0_10px_24px_rgba(0,0,0,0.45)] border-2 border-[#FFD58A] hover:brightness-110 active:translate-y-0.75 active:shadow-[0_3px_0_0_rgba(160,60,0,0.8),0_6px_14px_rgba(0,0,0,0.45)] transition-all"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", damping: 14 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Claim Reward
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RibbonBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center">
      <svg
        viewBox="0 0 30 40"
        className="w-5 h-10 -mr-1 drop-shadow-md"
        preserveAspectRatio="none"
      >
        <polygon points="0,20 30,0 30,40" fill="#5B21B6" />
      </svg>
      <div
        className="relative px-8 md:px-12 py-2.5 bg-linear-to-b from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9] text-white font-bold text-base md:text-xl tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_10px_rgba(0,0,0,0.35)]"
        style={{
          clipPath:
            "polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%)",
        }}
      >
        {children}
      </div>
      <svg
        viewBox="0 0 30 40"
        className="w-5 h-10 -ml-1 drop-shadow-md"
        preserveAspectRatio="none"
      >
        <polygon points="30,20 0,0 0,40" fill="#5B21B6" />
      </svg>
    </div>
  );
}

function Starburst() {
  const rays = Array.from({ length: 16 });
  return (
    <svg viewBox="-100 -100 200 200" className="w-[110%] h-[110%]">
      <defs>
        <radialGradient id="ray-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE27A" stopOpacity="1" />
          <stop offset="60%" stopColor="#FFB347" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF7A1F" stopOpacity="0.0" />
        </radialGradient>
      </defs>
      {rays.map((_, i) => {
        const angle = (i / rays.length) * 360;
        const long = i % 2 === 0;
        const length = long ? 95 : 70;
        const halfWidth = long ? 9 : 6;
        return (
          <polygon
            key={i}
            transform={`rotate(${angle})`}
            points={`0,-${length} ${halfWidth},0 0,${length * 0.15} -${halfWidth},0`}
            fill="url(#ray-gradient)"
          />
        );
      })}
    </svg>
  );
}
