"use client";

import { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { Sparkles, Plus, CheckCircle2, Circle, Trash2, Calendar, Flame } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import Modal from "@/components/ui/modal";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export default function Habitos() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useLifeOS();
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addHabit(newName);
    setNewName("");
    setIsAdding(false);
    showToast("Hábito cadastrado com sucesso! ⚡", "success");
  };

  const handleToggleHabit = (id: number) => {
    toggleHabit(id);
    const habit = habits.find(h => h.id === id);
    if (habit) {
      if (habit.completed) {
        showToast("Hábito marcado como pendente.", "info");
      } else {
        showToast("Hábito concluído hoje! (+15 XP) 🚀", "success");
      }
    }
  };

  const handleDeleteHabit = (id: number) => {
    deleteHabit(id);
    showToast("Hábito removido.", "info");
  };

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <PageHeader
        title="Hábitos"
        description="Desenvolva consistência diária e acompanhe suas sequências de dias"
      >
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#4edea3] text-[#003824] rounded-xl text-sm font-semibold shadow-lg shadow-[#4edea3]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Hábito
        </button>
      </PageHeader>

      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="Novo Hábito"
      >
        <form onSubmit={handleAddHabit} className="flex flex-col gap-5">
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
      </Modal>

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
                onClick={() => handleDeleteHabit(habit.id)}
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
                onClick={() => handleToggleHabit(habit.id)}
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
          <div className="col-span-3">
            <EmptyState 
              message="Nenhum hábito cadastrado" 
              description="Adicione novos hábitos para monitorar suas rotinas diárias e construir sequências de consistência."
              icon={<Flame className="w-8 h-8 opacity-40 text-secondary" />}
            />
          </div>
        )}
      </div>
    </main>
  );
}