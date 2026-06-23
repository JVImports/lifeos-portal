"use client";

import React, { useState } from "react";
import { useLifeOS } from "@/context/lifeos-context";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, Sparkles, BrainCircuit } from "lucide-react";

export default function LoginPage() {
  const { login, signUp } = useLifeOS();
  const { showToast } = useToast();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Por favor, preencha todos os campos.", "error");
      return;
    }

    if (!isLoginTab && password !== confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (isLoginTab) {
        const { error } = await login(email, password);
        if (error) {
          showToast(error.message || "Erro ao fazer login.", "error");
        } else {
          showToast("Acesso concedido! Bem-vindo de volta.", "success");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          showToast(error.message || "Erro ao criar conta.", "error");
        } else {
          showToast("Conta criada com sucesso! Você está logado.", "success");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Ocorreu um erro inesperado.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#07090e] p-4">
      {/* Decorative Neon Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />

      {/* Main Glassmorphic Form Card */}
      <div className="w-full max-w-[440px] glass-card bg-[#121620]/45 border border-white/5 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(77,142,255,0.2)]">
            <BrainCircuit className="text-[#adc6ff] w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#e1e2ec] flex items-center gap-1.5">
              LifeOS <span className="text-xs px-2 py-0.5 bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] rounded-full font-bold">Portal</span>
            </h1>
            <p className="text-xs text-on-surface-variant/60 font-semibold tracking-widest mt-0.5 uppercase">
              Command Center
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1 bg-[#191e2b] rounded-xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(true);
              setPassword("");
              setConfirmPassword("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
              isLoginTab 
                ? "bg-[#252c3e] text-[#adc6ff] shadow-md" 
                : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(false);
              setPassword("");
              setConfirmPassword("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
              !isLoginTab 
                ? "bg-[#252c3e] text-[#adc6ff] shadow-md" 
                : "text-on-surface-variant/60 hover:text-on-surface"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#171c26]/60 border border-[#424754]/20 rounded-xl text-sm focus:outline-none focus:border-[#4d8eff]/50 focus:ring-1 focus:ring-[#4d8eff]/30 text-[#e1e2ec] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#171c26]/60 border border-[#424754]/20 rounded-xl text-sm focus:outline-none focus:border-[#4d8eff]/50 focus:ring-1 focus:ring-[#4d8eff]/30 text-[#e1e2ec] transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password (Only for Sign Up) */}
          {!isLoginTab && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#171c26]/60 border border-[#424754]/20 rounded-xl text-sm focus:outline-none focus:border-[#4d8eff]/50 focus:ring-1 focus:ring-[#4d8eff]/30 text-[#e1e2ec] transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-[#6c9cff] hover:opacity-95 text-[#002e6a] font-bold rounded-xl text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_4px_20px_rgba(77,142,255,0.15)] hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-[#002e6a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isLoginTab ? "Entrar no Painel" : "Criar Minha Conta"}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-[#424754]/10 text-center">
          <p className="text-[10px] opacity-40 leading-relaxed font-semibold uppercase tracking-wider">
            LifeOS Security Center — Protegido por Supabase RLS
          </p>
        </div>
      </div>
    </div>
  );
}
