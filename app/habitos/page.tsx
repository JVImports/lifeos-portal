"use client";

import { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { Sparkles, Plus, CheckCircle2, Circle, Trash2, Flame } from "lucide-react";

export default function Habitos() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useLifeOS();
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addHabit(newName);
    setNewName("");
    setIsAdding(false);
  };

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Hábitos</h1>
          <p className="text-sm opacity-60 mt-1">Desenvolva consistência diária e acompanhe suas sequências de dias</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#4edea3] text-[#003824] rounded-xl text-sm font-semibold shadow-lg shadow-[#4edea3]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Hábito
        </button>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddHabit} className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-5 relative bg-[#1d2027]">
            <h3 className="text-lg font-bold">Novo Hábito</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Nome do Hábito</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                placeholder="Ex: Ler 10 páginas, Beber 3L de água..."
                required 
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 py-3 bg-[#4edea3] text-[#003824] rounded-xl text-sm font-semibold hover:opacity-90">Adicionar Hábito</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-[#32353c] text-on-surface rounded-xl text-sm font-semibold hover:opacity-90">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <div key={habit.id} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
                  Consistência
                </span>
                <h3 className="text-base font-bold text-on-surface mt-1">{habit.name}</h3>
              </div>
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="text-on-surface-variant hover:text-error transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center bg-[#0b0e15]/40 border border-[#424754]/15 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-secondary animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] opacity-50 font-bold uppercase">Streak</span>
                  <span className="text-sm font-extrabold text-secondary">{habit.streak} Dias</span>
                </div>
              </div>
              <button 
                onClick={() => toggleHabit(habit.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-xs font-semibold text-on-surface transition-all"
              >
                {habit.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary/15" />
                    Concluído
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-on-surface-variant" />
                    Marcar Hoje
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="col-span-3 py-16 text-center border border-dashed border-[#424754]/20 rounded-2xl text-xs opacity-40">
            Nenhum hábito cadastrado
          </div>
        )}
      </div>
    </main>
  );
}
