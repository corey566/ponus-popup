'use client'

import Image from "next/image";
import RewardPopup from "./components/RewardPopup";
import WelcomePopup from "./components/WelcomePopup";
import lobbyBg from "@assets/Weekly_Reward_(3)_1776929665411.jpg";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

type Stage = "welcome" | "rewards" | "closed";

export default function Home() {

  const [stage, setStage] = useState<Stage>("welcome");

  return (
    <div className="min-h-dvh w-full relative overflow-hidden">
      <Image
        src={lobbyBg}
        alt="hh"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <WelcomePopup
        isOpen={stage === "welcome"}
        onCollect={() => setStage("rewards")}
      />

      <RewardPopup
        isOpen={stage === "rewards"}
        onClose={() => setStage("closed")}
      />

      {stage === "closed" && (
        <button
          type="button"
          onClick={() => setStage("welcome")}
          data-testid="btn-show-rewards"
          className="absolute top-4 right-4 z-50 bg-[#5B2C0F] text-[#F5D573] px-5 py-2.5 rounded-lg shadow-xl font-bold border-2 border-[#D4AF37] hover:bg-[#3D1D0A] transition-colors"
        >
          Show Rewards
        </button>
      )}
    </div>
  );
}
