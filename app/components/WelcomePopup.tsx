import { motion, AnimatePresence } from "framer-motion";
import welcomeFrame from "@assets/COLLECT_REWARD_1777008799001.png";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onCollect: () => void;
};

export default function WelcomePopup({ isOpen, onCollect }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="welcome-overlay"
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="welcome-popup"
        >
          <motion.div
            className="relative w-full max-w-[640px] flex items-center justify-center"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 16, stiffness: 200 }}
          >
            {/* Frame image — establishes size and visual */}
            <Image
              src={welcomeFrame}
              alt="Welcome"
              className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
              draggable={false}
            />

            {/* Body text inside the cream panel */}
            <div className="absolute inset-x-0 top-[50%] bottom-[18%] flex flex-col items-center justify-center px-[14%] text-center">
              <motion.h2
                className="text-[#5B2C0F] font-serif font-bold text-base md:text-2xl tracking-wide"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Your Daily Reward Awaits!
              </motion.h2>
              <motion.p
                className="text-[#7A4218] text-[11px] md:text-sm mt-2 leading-snug max-w-[90%]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Check in every day to unlock weekly &amp; monthly bonuses,
                lucky draws and special rescue rewards.
              </motion.p>
            </div>

            {/* Clickable hotspot over the green "COLLECT REWARD" banner */}
            <button
              type="button"
              onClick={onCollect}
              data-testid="btn-collect-reward"
              aria-label="Collect Reward"
              className="absolute left-1/2 -translate-x-1/2 bottom-[5%] w-[42%] h-[7%] rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE27A] hover:brightness-110 active:scale-95 transition-transform"
            >
              <span className="sr-only">Collect Reward</span>
              {/* subtle pulsing glow to draw attention */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:
                    "0 0 0 0 rgba(255, 226, 122, 0.55), inset 0 0 18px rgba(255,255,255,0.0)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 226, 122, 0.55)",
                    "0 0 0 14px rgba(255, 226, 122, 0)",
                  ],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
