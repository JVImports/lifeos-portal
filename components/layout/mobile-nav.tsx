"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Compass, 
  CheckSquare, 
  Wallet 
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav on login screen
  if (pathname === "/login") return null;

  const navItems = [
    { name: "Hoje", href: "/", icon: LayoutDashboard },
    { name: "Atividades", href: "/atividades", icon: CheckSquare },
    { name: "Mentor", href: "/mentor", icon: BrainCircuit },
    { name: "Finanças", href: "/financas", icon: Wallet },
    { name: "Protocolos", href: "/protocolos", icon: Compass },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 md:hidden bg-[#10131a]/95 backdrop-blur-lg border-t border-[#424754]/15 flex items-center justify-around z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 gap-1.5 ${
              isActive
                ? "text-[#adc6ff]"
                : "text-[#c2c6d6]/60 hover:text-[#c2c6d6]"
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
