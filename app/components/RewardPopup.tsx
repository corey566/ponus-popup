"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Check, Lock } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

import RewardClaimModal from "./RewardClaimModal";

import popupFrame from "@assets/Weekly_Reward_(2)_1776929627493.png";
import animeGirl from "@assets/Weekly_Reward_(1)_1776928976936.png";
import tabWeekly from "@assets/Weekly_Reward_(3)_1776929627492.png";
import tabMonthly from "@assets/Weekly_Reward_(4)_1776929627492.png";
import btnDeposit from "@assets/Weekly_Reward_(5)_1776936901985.png";
import btnCheckin from "@assets/Weekly_Reward_(7)_1776936901984.png";
import btnLucky from "@assets/Weekly_Reward_(10)_1776936901984.png";
import btnNewbie from "@assets/Weekly_Reward_(11)_1776936901983.png";

type Tab = "weekly" | "monthly";
type IconType = "coin" | "gem" | "glass" | "gift";

type CategoryId =
  | "deposit"
  | "rebate"
  | "lucky"
  | "newbie"
  | "loyalty"
  | "fever";

interface Milestone {
  day: number;
  qty: string;
  detail: string;
  iconType: IconType;
}

interface Category {
  id: CategoryId;
  tab: Tab;
  label: string;
  src: StaticImageData;
  title: string;
  description?: string;
  eligibility?: string;
  milestones: Milestone[];
}

interface DayItem {
  day: number;
  isMilestone: boolean;
  qty: string;
  detail: string;
  iconType: IconType;
}

const CATEGORIES: Category[] = [
  {
    id: "deposit",
    tab: "weekly",
    label: "Deposit Bonus",
    src: btnDeposit,
    title: "Play every day and get additional bonuses",
    milestones: [
      { day: 3, qty: "0.5%", detail: "0.5% of total weekly deposits", iconType: "gem" },
      { day: 5, qty: "0.8%", detail: "0.8% of total weekly deposits", iconType: "glass" },
      { day: 7, qty: "1.2%", detail: "1.2% of total weekly deposits", iconType: "gift" },
    ],
  },
  {
    id: "rebate",
    tab: "weekly",
    label: "Check-in Rebate",
    src: btnCheckin,
    title: "Play every day and get additional bonuses",
    milestones: [
      { day: 3, qty: "x1", detail: "Daily check-in reward", iconType: "glass" },
      { day: 5, qty: "x3", detail: "Daily check-in reward", iconType: "glass" },
      { day: 7, qty: "Gift", detail: "Final weekly reward", iconType: "gift" },
    ],
  },
  {
    id: "lucky",
    tab: "weekly",
    label: "Lucky Draw",
    src: btnLucky,
    title: "Play every day and get additional bonuses",
    eligibility: "Total weekly deposit ≥ 1,000 AND total weekly valid turnover ≥ 2,000.",
    milestones: [
      { day: 3, qty: "1 Draw", detail: "1 lucky draw chance", iconType: "glass" },
      { day: 5, qty: "2 Draws", detail: "2 lucky draw chances", iconType: "glass" },
      { day: 7, qty: "3 Draws", detail: "3 lucky draw chances", iconType: "gift" },
    ],
  },
  {
    id: "newbie",
    tab: "weekly",
    label: "Newbie Special\nFirst-Week Rewards",
    src: btnNewbie,
    title: "Play every day and get additional bonuses",
    milestones: [
      { day: 3, qty: "5%", detail: "5% of weekly net loss", iconType: "coin" },
      { day: 5, qty: "8%", detail: "8% of weekly net loss", iconType: "gem" },
      { day: 7, qty: "12%", detail: "12% of weekly net loss", iconType: "gift" },
    ],
  },
  {
    id: "loyalty",
    tab: "monthly",
    label: "Monthly Check-in",
    src: btnDeposit,
    title: "Monthly Check-in Reward",
    eligibility: "Total monthly deposit ≥ 6,000 AND total monthly valid turnover ≥ 10,000.",
    milestones: [
      { day: 10, qty: "188", detail: "188 bonus credit", iconType: "coin" },
      { day: 20, qty: "288", detail: "288 bonus credit", iconType: "coin" },
      { day: 28, qty: "388", detail: "388 bonus credit", iconType: "gift" },
    ],
  },
  {
    id: "fever",
    tab: "monthly",
    label: "Monthly Rewards",
    src: btnCheckin,
    title: "Monthly Rewards",
    milestones: [
      { day: 10, qty: "3%", detail: "3% of monthly net loss", iconType: "gem" },
      { day: 20, qty: "5%", detail: "5% of monthly net loss", iconType: "gem" },
      { day: 28, qty: "8%", detail: "8% of monthly net loss", iconType: "gift" },
    ],
  },
];

function fillerQty(day: number): { qty: string; detail: string; iconType: IconType } {
  const weeklyMap: Record<number, { qty: string; iconType: IconType }> = {
    1: { qty: "x200", iconType: "coin" },
    2: { qty: "x5", iconType: "gem" },
    4: { qty: "x10", iconType: "gem" },
    6: { qty: "x500", iconType: "coin" },
  };

  const fallback = weeklyMap[day] ?? { qty: `x${day}`, iconType: "coin" as IconType };

  return {
    qty: fallback.qty,
    detail: `${fallback.qty} login reward`,
    iconType: fallback.iconType,
  };
}

function buildDays(category: Category): DayItem[] {
  const totalDays = category.tab === "weekly" ? 7 : 28;
  const milestonesByDay = new Map(category.milestones.map((m) => [m.day, m]));

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const milestone = milestonesByDay.get(day);

    if (milestone) {
      return {
        day,
        isMilestone: true,
        qty: milestone.qty,
        detail: milestone.detail,
        iconType: milestone.iconType,
      };
    }

    const filler = fillerQty(day);

    return {
      day,
      isMilestone: false,
      qty: filler.qty,
      detail: filler.detail,
      iconType: filler.iconType,
    };
  });
}

export default function RewardPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("weekly");
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("deposit");

  const [claimed, setClaimed] = useState<Record<CategoryId, Set<number>>>({
    deposit: new Set([1, 2, 3]),
    rebate: new Set(),
    lucky: new Set(),
    newbie: new Set(),
    loyalty: new Set(),
    fever: new Set(),
  });

  const [pulse, setPulse] = useState<number | null>(null);
  const [selected, setSelected] = useState<DayItem | null>(null);

  useEffect(() => {
    const first = CATEGORIES.find((category) => category.tab === activeTab);
    const current = CATEGORIES.find((category) => category.id === activeCategoryId);

    if (first && current?.tab !== activeTab) {
      setActiveCategoryId(first.id);
    }
  }, [activeTab, activeCategoryId]);

  const tabCategories = CATEGORIES.filter((category) => category.tab === activeTab);

  const activeCategory =
    CATEGORIES.find((category) => category.id === activeCategoryId) ?? tabCategories[0];

  const days = useMemo(() => buildDays(activeCategory), [activeCategory]);

  if (!isOpen) return null;

  const claimedSet = claimed[activeCategory.id] ?? new Set<number>();

  const statusOf = (day: number): "claimed" | "claimable" | "locked" => {
    if (claimedSet.has(day)) return "claimed";

    for (let d = 1; d < day; d++) {
      if (!claimedSet.has(d)) return "locked";
    }

    return "claimable";
  };

  const handleClick = (item: DayItem) => {
    const status = statusOf(item.day);
    if (status !== "claimable") return;

    setPulse(item.day);
    setTimeout(() => setPulse((p) => (p === item.day ? null : p)), 350);
    setSelected(item);
  };

  const closeClaim = () => {
    if (selected != null) {
      setClaimed((prev) => {
        const next = { ...prev };
        const selectedSet = new Set(next[activeCategory.id]);
        selectedSet.add(selected.day);
        next[activeCategory.id] = selectedSet;
        return next;
      });
    }

    setSelected(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/55 p-0">
      <div
        className="relative flex w-full max-w-385 items-center justify-center"
        data-testid="reward-popup"
      >
        <div className="relative w-[86%] max-w-290">
          <div className="absolute left-1/2 top-[22%] z-40 flex -translate-x-1/2 -translate-y-1/2 gap-30">
            <button
              type="button"
              onClick={() => setActiveTab("weekly")}
              data-testid="tab-weekly"
              aria-pressed={activeTab === "weekly"}
              className={`relative -mt-2 transition-all duration-300  ${
                activeTab === "weekly"
  ? " scale-150 brightness-110"
                  : "scale-150 brightness-90 hover:brightness-105"
              }`}
            >
              <Image
                src={tabWeekly}
                alt="Weekly Reward"
                className="h-auto w-75 select-none pointer-events-none md:w-90 xl:w-105"
                draggable={false}
                priority
              />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              data-testid="tab-monthly"
              aria-pressed={activeTab === "monthly"}
              className={`relative -mt-2 transition-all duration-300  ${
                activeTab === "weekly"
  ? "scale-150 brightness-110"
                  : "scale-150 brightness-90 hover:brightness-105"
              }`}
            >
              <Image
                src={tabMonthly}
                alt="Monthly Reward"
                className="h-auto w-75 select-none pointer-events-none md:w-90 xl:w-105"
                draggable={false}
                priority
              />
            </button>
          </div>

          <Image
            src={popupFrame}
            alt=""
            className="relative z-20 block h-auto w-full select-none pointer-events-none drop-shadow-2xl"
            draggable={false}
            priority
          />

          <div className="absolute left-[3.5%] top-[57%] z-10 flex translate-x-[-78%] -translate-y-1/2 flex-col gap-2.5 xl:gap-3">
            {tabCategories.map((cat) => (
              <CategoryButton
                key={cat.id}
                label={cat.label}
                src={cat.src}
                active={cat.id === activeCategory.id}
                onClick={() => setActiveCategoryId(cat.id)}
              />
            ))}
          </div>

          <Image
            src={animeGirl}
            alt=""
            className="absolute bottom-[-3%] right-[-25%] z-30 h-auto w-[35%] select-none pointer-events-none drop-shadow-2xl xl:w-full"
            draggable={false}
            priority
          />

          <button
            type="button"
            onClick={onClose}
            data-testid="btn-close"
            className="absolute right-[8.8%] top-[24%] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5E0CF]/70 text-[#8A4D42] shadow-md transition-transform hover:scale-105"
          >
            <X className="h-7 w-7" strokeWidth={4} />
          </button>

          <div className="absolute inset-x-0 bottom-[12%] top-[28%] z-30 flex flex-col items-center pl-[15%] pr-[15%]">
            <h2 className="mb-8 whitespace-nowrap text-center text-[24px] font-extrabold tracking-wide text-[#7A514C] xl:text-[28px]">
              {activeCategory.title}
            </h2>

            {activeCategory.eligibility && (
              <p className="mb-4 max-w-[92%] text-center text-[13px] font-semibold leading-tight text-[#7A4218] xl:text-[15px]">
                {activeCategory.eligibility}
              </p>
            )}

            {activeTab === "weekly" ? (
              <WeeklyGrid
                days={days}
                statusOf={statusOf}
                pulse={pulse}
                onClick={handleClick}
              />
            ) : (
              <MonthlyGrid
                days={days}
                statusOf={statusOf}
                pulse={pulse}
                onClick={handleClick}
              />
            )}
          </div>
        </div>
      </div>

      <RewardClaimModal
        isOpen={selected != null}
        onClose={closeClaim}
        day={selected?.day ?? null}
        dayLabel={selected ? `Day ${selected.day}` : undefined}
        qty={selected?.qty}
        detail={selected?.detail}
        title={activeCategory.title}
        iconType={selected?.iconType}
      />
    </div>
  );
}

function WeeklyGrid({
  days,
  statusOf,
  pulse,
  onClick,
}: {
  days: DayItem[];
  statusOf: (day: number) => "claimed" | "claimable" | "locked";
  pulse: number | null;
  onClick: (item: DayItem) => void;
}) {
  const day7 = days.find((day) => day.day === 7)!;
  const others = days.filter((day) => day.day !== 7);

  return (
    <div className="grid w-full flex-1 grid-cols-4 grid-rows-2 gap-x-7 gap-y-7">
      {others.slice(0, 3).map((item) => (
        <DayCard
          key={item.day}
          item={item}
          status={statusOf(item.day)}
          pulse={pulse === item.day}
          onClick={() => onClick(item)}
        />
      ))}

      <BigDayCard
        item={day7}
        status={statusOf(day7.day)}
        pulse={pulse === day7.day}
        onClick={() => onClick(day7)}
      />

      {others.slice(3).map((item) => (
        <DayCard
          key={item.day}
          item={item}
          status={statusOf(item.day)}
          pulse={pulse === item.day}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}

function MonthlyGrid({
  days,
  statusOf,
  pulse,
  onClick,
}: {
  days: DayItem[];
  statusOf: (day: number) => "claimed" | "claimable" | "locked";
  pulse: number | null;
  onClick: (item: DayItem) => void;
}) {
  return (
    <div className="grid w-full flex-1 grid-cols-7 grid-rows-4 gap-2">
      {days.map((item) => (
        <MonthlyCard
          key={item.day}
          item={item}
          status={statusOf(item.day)}
          pulse={pulse === item.day}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}

function CategoryButton({
  label,
  src,
  active,
  onClick,
}: {
  label: string;
  src: StaticImageData;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      data-testid={`left-btn-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={`block w-77.5 drop-shadow-xl transition-all duration-200 active:scale-95 xl:w-92.5 ${
        active
          ? "scale-[1.06] brightness-115 drop-shadow-[0_0_16px_rgba(255,230,90,0.75)]"
          : "scale-100 brightness-95 hover:scale-[1.03] hover:brightness-110"
      }`}
    >
      <Image
        src={src}
        alt={label}
        className="h-auto w-full select-none pointer-events-none"
        draggable={false}
      />
    </button>
  );
}

function DayPill({
  label,
  tone = "orange",
}: {
  label: string;
  tone?: "orange" | "green" | "red";
}) {
  const bg =
    tone === "green"
      ? "from-[#6FB37E] to-[#237A4E] border-[#92D4A2]"
      : tone === "red"
        ? "from-[#FF681F] to-[#C93407] border-[#FFAE63]"
        : "from-[#FF681F] to-[#C93407] border-[#FFAE63]";

  return (
    <div
      className={`absolute -top-5 left-1/2 z-20 -translate-x-1/2 rounded-b-[22px] rounded-t-xl border bg-linear-to-b ${bg} px-9 py-2 text-[20px] font-extrabold text-white shadow-md whitespace-nowrap`}
    >
      {label}
    </div>
  );
}

function DayCard({
  item,
  status,
  onClick,
  pulse,
}: {
  item: DayItem;
  status: "claimed" | "claimable" | "locked";
  onClick?: () => void;
  pulse?: boolean;
}) {
  const isClaimed = status === "claimed";
  const isLocked = status === "locked";

  const isGreen = item.day === 4 || item.day === 5 || item.day === 7;
  const pillTone = item.day === 3 || item.day === 4 || item.day === 5 ? "green" : "red";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={`relative flex flex-col items-center justify-center overflow-visible rounded-[26px] border-2 p-4 shadow-[inset_0_5px_12px_rgba(255,255,255,0.75),0_5px_10px_rgba(95,50,20,0.24)] transition-transform duration-150 active:scale-95 ${
        isGreen
          ? "border-[#74B982] bg-linear-to-b from-[#B8E7C5] to-[#77C995]"
          : "border-[#E9C58B] bg-linear-to-b from-[#FFF1D8] to-[#FFE0B0]"
      } ${isLocked ? "cursor-not-allowed opacity-95" : "cursor-pointer hover:scale-[1.04] hover:brightness-105"} ${
        pulse ? "scale-95" : ""
      }`}
      data-testid={`day-card-${item.day}`}
    >
      <DayPill label={`Day ${item.day}`} tone={pillTone} />

      <div className="relative z-10 mt-8 flex w-full flex-1 items-center justify-center">
        <Image
          src={`/images/${item.iconType}.png`}
          alt=""
          width={140}
          height={140}
          className="h-auto w-[74%] max-w-33 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.28)]"
        />
      </div>

      <div className="relative z-10 -mt-2 text-[24px] font-black text-white drop-shadow-[0_3px_2px_rgba(0,0,0,0.55)]">
        {item.qty}
      </div>

      {isClaimed ? (
        <div className="absolute -bottom-3 right-3 z-20 text-[#2EA65A] drop-shadow-[0_3px_2px_rgba(0,0,0,0.2)]">
          <Check className="h-12 w-12 fill-[#2EA65A]" strokeWidth={5} />
        </div>
      ) : isLocked ? (
        <div className="absolute -bottom-4 right-2 z-20 rounded-full text-[#C23520] drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)]">
          <Lock className="h-12 w-12 fill-[#F57A2A]" strokeWidth={3} />
        </div>
      ) : null}
    </button>
  );
}

function BigDayCard({
  item,
  status,
  onClick,
  pulse,
}: {
  item: DayItem;
  status: "claimed" | "claimable" | "locked";
  onClick?: () => void;
  pulse?: boolean;
}) {
  const isClaimed = status === "claimed";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "locked"}
      data-testid={`day-card-${item.day}`}
      className={`relative row-span-2 flex flex-col items-center justify-center overflow-visible rounded-[52px] border-2 border-[#74B982] bg-linear-to-b from-[#A7E6BD] to-[#58B67B] p-6 shadow-[inset_0_6px_16px_rgba(255,255,255,0.45),0_8px_14px_rgba(70,40,20,0.25)] transition-transform duration-150 active:scale-95 ${
        status === "locked" ? "cursor-not-allowed opacity-95" : "cursor-pointer hover:scale-[1.03]"
      } ${pulse ? "scale-95" : ""}`}
    >
      <DayPill label={`Day ${item.day}`} tone="green" />

      <div
        className="pointer-events-none absolute inset-5 rounded-[42px] opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 22px, rgba(0,0,0,0.20) 22px 24px)",
        }}
      />

      <Image
        src={`/images/${item.iconType}.png`}
        alt=""
        width={260}
        height={260}
        className="relative z-10 h-auto w-[86%] max-w-62.5 object-contain pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
      />

      <div className="relative z-10 mt-4 text-[30px] font-black text-white drop-shadow-[0_3px_2px_rgba(0,0,0,0.55)]">
        {item.qty}
      </div>

      <div className="absolute -bottom-4 right-3 z-20 text-[#C23520] drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)]">
        {isClaimed ? (
          <Check className="h-12 w-12 fill-[#2EA65A]" strokeWidth={5} />
        ) : (
          <Lock className="h-12 w-12 fill-[#F57A2A]" strokeWidth={3} />
        )}
      </div>
    </button>
  );
}

function MonthlyCard({
  item,
  status,
  onClick,
  pulse,
}: {
  item: DayItem;
  status: "claimed" | "claimable" | "locked";
  onClick?: () => void;
  pulse?: boolean;
}) {
  const isClaimed = status === "claimed";
  const isLocked = status === "locked";
  const isMilestone = item.isMilestone;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      data-testid={`day-card-${item.day}`}
      className={`relative flex flex-col items-center justify-between overflow-hidden rounded-md border p-1 shadow transition-transform duration-150 active:scale-95 ${
        isMilestone
          ? "border-[#74B982] bg-linear-to-b from-[#A7E6BD] to-[#58B67B]"
          : "border-[#E9C58B] bg-linear-to-b from-[#FFF1D8] to-[#FFE0B0]"
      } ${isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:scale-[1.05]"} ${
        pulse ? "scale-95" : ""
      }`}
    >
      <div className="mt-1 text-[10px] font-black text-[#7A514C]">
        Day {item.day}
      </div>

      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <Image
          src={`/images/${item.iconType}.png`}
          alt=""
          width={70}
          height={70}
          className="h-auto max-h-full max-w-full object-contain"
        />
      </div>

      <div className="mb-1 max-w-full truncate px-1 text-[10px] font-black text-[#5B2C0F]">
        {item.qty}
      </div>

      {isClaimed && (
        <div className="absolute right-0 top-0 rounded-bl-md bg-[#22C55E] p-px">
          <Check className="h-3 w-3 text-white" strokeWidth={4} />
        </div>
      )}

      {isLocked && (
        <div className="absolute right-0 top-0 rounded-bl-md bg-white/90 p-px">
          <Lock className="h-3 w-3 text-[#5B2C0F]" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}