"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Sparkles, 
  Trophy, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  BrainCircuit,
  Compass,
  FileQuestion
} from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";

export default function Sidebar() {
  const pathname = usePathname();
  const { xp, level } = useLifeOS();

  const xpNeeded = level * 200;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mentor Aether", href: "/mentor", icon: BrainCircuit },
    { name: "Protocolos", href: "/protocolos", icon: Compass },
    { name: "Atividades", href: "/atividades", icon: CheckSquare },
    { name: "Finanças", href: "/financas", icon: Wallet },
    { name: "Hábitos", href: "/habitos", icon: Sparkles },
    { name: "Metas", href: "/metas", icon: Trophy },
    { name: "Onboarding", href: "/onboarding", icon: FileQuestion },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] hidden md:flex flex-col p-6 gap-2 bg-[#10131a]/80 backdrop-blur-2xl border-r border-[#424754]/10 shadow-xl z-50 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/20 flex items-center justify-center border border-[#4d8eff]/30">
            <BrainCircuit className="text-[#adc6ff] w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#adc6ff] tracking-tight">LifeOS</span>
            <span className="text-xs opacity-60 font-semibold tracking-widest text-[#c2c6d6]">COMMAND CENTER</span>
          </div>
        </div>

        {/* Gamification Level & XP display */}
        <div className="p-3 bg-[#1d2027]/40 rounded-xl border border-[#424754]/10">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-[#4edea3]">Explorador Nível {level}</span>
            <span className="text-[10px] opacity-60 font-mono">{xp}/{xpNeeded} XP</span>
          </div>
          <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4edea3] to-primary transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#adc6ff]/10 text-[#adc6ff] border-l-4 border-[#adc6ff] font-medium"
                  : "text-[#c2c6d6] hover:bg-[#32353c]/20 hover:text-[#e1e2ec] hover:translate-x-1"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 space-y-4">
        <div className="flex flex-col gap-1">
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-2 text-sm text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ajuda</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-2 text-sm text-[#ffb4ab] hover:text-[#ffb4ab] hover:opacity-80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
