"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Trash, DollarSign, X, CheckCircle } from "lucide-react";
import { useLifeOS } from "@/context/lifeos-context";

export default function Financas() {
  const { expenses, addExpense, deleteExpense, connectOpenFinance } = useLifeOS();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [type, setType] = useState<"Receita" | "Despesa">("Despesa");
  const [isAdding, setIsAdding] = useState(false);

  // Open Finance States
  const [isOpenFinanceModal, setIsOpenFinanceModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!description.trim() || isNaN(val)) return;

    addExpense(description, val, category, type);
    setDescription("");
    setAmount("");
    setIsAdding(false);
  };

  const handleConnectOpenFinance = () => {
    if (!selectedBank) return;
    setIsSyncing(true);
    setTimeout(() => {
      connectOpenFinance(selectedBank);
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 2000);
  };

  const handleCloseOpenFinance = () => {
    setIsOpenFinanceModal(false);
    setSelectedBank(null);
    setSyncSuccess(false);
  };

  // Calculations
  const income = expenses.filter(t => t.type === "Receita").reduce((acc, t) => acc + t.amount, 0);
  const expenseSum = expenses.filter(t => t.type === "Despesa").reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenseSum;

  return (
    <main className="p-6 md:p-10 min-h-screen">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Finanças</h1>
          <p className="text-sm opacity-60 mt-1">Monitore seu saldo, receitas e despesas mensais</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsOpenFinanceModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/35 rounded-xl text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Conectar Open Finance
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#ffb95f] text-[#472a00] rounded-xl text-sm font-semibold shadow-lg shadow-[#ffb95f]/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </button>
        </div>
      </header>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <DollarSign className="text-primary w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Saldo Líquido</span>
            <p className={`text-2xl font-extrabold mt-0.5 ${balance >= 0 ? "text-primary" : "text-error"}`}>
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <TrendingUp className="text-secondary w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total Receitas</span>
            <p className="text-2xl font-extrabold mt-0.5 text-secondary">
              R$ {income.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center border border-error/20">
            <TrendingDown className="text-error w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total Despesas</span>
            <p className="text-2xl font-extrabold mt-0.5 text-error">
              R$ {expenseSum.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTransaction} className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-5 relative bg-[#1d2027]">
            <h3 className="text-lg font-bold">Novo Lançamento</h3>
            
            <div className="flex gap-2 p-1 bg-[#191b23] rounded-xl border border-[#424754]/20">
              <button 
                type="button" 
                onClick={() => setType("Despesa")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${type === "Despesa" ? "bg-error/20 text-error border border-error/30" : "text-on-surface/60"}`}
              >
                Despesa
              </button>
              <button 
                type="button" 
                onClick={() => setType("Receita")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${type === "Receita" ? "bg-secondary/20 text-secondary border border-secondary/30" : "text-on-surface/60"}`}
              >
                Receita
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold opacity-70">Descrição</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                placeholder="Ex: Compra Carrefour..."
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none" 
                  placeholder="0.00"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold opacity-70">Categoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full bg-[#191b23] border border-[#424754]/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none"
                >
                  <option value="Salário">Salário</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Assinaturas">Assinaturas</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className={`flex-1 py-3 text-sm font-semibold rounded-xl text-white ${type === "Receita" ? "bg-secondary text-[#003824]" : "bg-error text-white"}`}>
                Adicionar Lançamento
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-[#32353c] text-on-surface rounded-xl text-sm font-semibold hover:opacity-90">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-bold mb-4">Histórico de Transações</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#424754]/20 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-60">
                <th className="pb-3">Descrição</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Data</th>
                <th className="pb-3 text-right">Valor</th>
                <th className="pb-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/10 text-sm">
              {expenses.map((t) => (
                <tr key={t.id} className="hover:bg-[#32353c]/5">
                  <td className="py-4 font-medium text-on-surface">{t.description}</td>
                  <td className="py-4 text-on-surface-variant">{t.category}</td>
                  <td className="py-4 text-on-surface-variant opacity-80">{t.date}</td>
                  <td className={`py-4 text-right font-bold ${t.type === "Receita" ? "text-secondary" : "text-error"}`}>
                    {t.type === "Receita" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => deleteExpense(t.id)} className="text-on-surface-variant hover:text-error transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs opacity-40">
                    Nenhuma transação lançada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* OPEN FINANCE INTEGRATION MODAL */}
      {isOpenFinanceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 flex flex-col gap-6 relative bg-[#1d2027]">
            <button 
              onClick={handleCloseOpenFinance}
              className="absolute top-4 right-4 text-on-surface/60 hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-[#424754]/20 pb-3">
              <span className="text-lg font-bold text-on-surface">Conexão Open Finance</span>
            </div>

            {syncSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle className="text-secondary w-12 h-12 mx-auto" />
                <h4 className="font-bold text-on-surface">Conexão Realizada com Sucesso!</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Importamos e categorizamos automaticamente as transações mais recentes da sua conta do <strong>{selectedBank}</strong>.
                </p>
                <div className="text-xs font-bold text-secondary">
                  🚀 +50 XP Adicionados!
                </div>
                <button 
                  onClick={handleCloseOpenFinance}
                  className="w-full py-3 bg-secondary text-[#003824] rounded-xl text-sm font-semibold"
                >
                  Concluir
                </button>
              </div>
            ) : isSyncing ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-on-surface-variant font-medium font-mono">
                  Conectando e sincronizando transações de forma segura com o {selectedBank}...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Conecte seu banco usando a infraestrutura do Open Finance para importar seus lançamentos e gastos automaticamente para o LifeOS.
                </p>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex flex-col gap-1">
                  <span className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                    ⚠️ Modo de Simulação
                  </span>
                  <span className="opacity-90 leading-relaxed text-[11px]">
                    Nenhum banco real será conectado neste MVP. Esta interface serve para demonstrar a categorização automatizada de despesas.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Nubank", "Banco Itaú", "Banco do Brasil", "Banco Inter"].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        selectedBank === bank
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-[#191b23] border-[#424754]/30 text-on-surface-variant hover:border-on-surface-variant/40"
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedBank}
                  onClick={handleConnectOpenFinance}
                  className="w-full py-3.5 bg-primary text-[#002e6a] rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Confirmar e Sincronizar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
