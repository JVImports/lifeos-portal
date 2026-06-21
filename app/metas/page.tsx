"use client";

import { useState } from "react";
import { Plus, Trophy, Calendar, Sliders, Trash } from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";

export default function Metas() {
  const { gainXp } = useLifeOS();

  // Keep goals states local since they require slider logic, but link XP gains on updates
  const [goals, setGoals] = useState([
    { id: 1, name: "Aprender Next.js & Server Actions", progress: 80, dueDate: "2026-07-15", category: "Profissional" },
    { id: 2, name: "Consistência de Finanças Pessoais", progress: 65, dueDate: "2026-08-30", category: "Financeiro" },
    { id: 3, name: "Correr Meia Maratona (21km)", progress: 40, dueDate: "2026-10-12", category: "Saúde" },
  ]);

  const [newName, setNewName] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("Pessoal");
  const [isAdding, setIsAdding] = useState(false);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setGoals([
      ...goals,
      { id: Date.now(), name: newName, progress: 0, dueDate: newDueDate || "Sem prazo", category: newCategory }
    ]);
    gainXp(30);
    setNewName("");
    setNewDueDate("");
    setIsAdding(false);
  };

  const updateProgress = (id: number, val: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const nextProg = Math.min(Math.max(val, 0), 100);
        if (nextProg > g.progress) {
          gainXp((nextProg - g.progress) * 2); // Gain 2 XP per 1% progress increase
        }
        return { ...g, progress: nextProg };
      }
      return g;
    }));
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Metas e OKRs</h1>
          <p className="text-sm opacity-60 mt-1">Acompanhe seus objetivos pessoais e marcos de evolução</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#8b5cf6] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#8b5cf6]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar Meta
        </button>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={addGoal} className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-5 relative bg-[#1d2027]">
            <h3 className="text-lg font-bold">Nova Meta Pessoal</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Objetivo / Nome da Meta</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                placeholder="Ex: Ler 12 livros no ano..."
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Prazo Limite</label>
                <input 
                  type="date" 
                  value={newDueDate} 
                  onChange={(e) => setNewDueDate(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Categoria</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Pessoal">Pessoal</option>
                  <option value="Profissional">Profissional</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Espiritual">Espiritual</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="flex-1 py-3 bg-[#8b5cf6] text-white rounded-xl text-sm font-semibold hover:opacity-90">Adicionar Meta</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-[#32353c] text-on-surface rounded-xl text-sm font-semibold hover:opacity-90">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#8b5cf6]/10 text-[#8b5cf6]">
                  {goal.category}
                </span>
                <h2 className="text-lg font-bold text-on-surface mt-1">{goal.name}</h2>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                <Trash className="w-4 h-4" />
              </button>
            </div>

            {/* Slider / Controls */}
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prazo: {goal.dueDate}</span>
                </div>
                <span>Progresso: {goal.progress}%</span>
              </div>
              
              <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#adc6ff] rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              {/* Incremental Controls */}
              <div className="flex gap-2 items-center justify-between pt-2 border-t border-[#424754]/10">
                <span className="text-xs opacity-50 flex items-center gap-1"><Sliders className="w-3 h-3" /> Progresso</span>
                <div className="flex gap-1.5">
                  <button 
                    type="button"
                    onClick={() => updateProgress(goal.id, goal.progress - 5)}
                    className="w-8 h-8 rounded-lg bg-[#32353c]/50 text-xs font-bold hover:bg-[#32353c] border border-[#424754]/20 transition-colors"
                  >
                    -5%
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateProgress(goal.id, goal.progress + 5)}
                    className="w-8 h-8 rounded-lg bg-[#32353c]/50 text-xs font-bold hover:bg-[#32353c] border border-[#424754]/20 transition-colors"
                  >
                    +5%
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateProgress(goal.id, 100)}
                    className="px-3 h-8 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/20 transition-colors"
                  >
                    Completar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-2 py-16 text-center border border-dashed border-[#424754]/20 rounded-2xl text-xs opacity-40">
            Nenhuma meta cadastrada
          </div>
        )}
      </div>
    </main>
  );
}
