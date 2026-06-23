"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export interface Task {
  id: any;
  title: string;
  status: "A Fazer" | "Em Andamento" | "Concluído";
  priority: "Baixa" | "Média" | "Alta";
}

export interface Habit {
  id: any;
  name: string;
  completed: boolean;
  streak: number;
}

export interface Expense {
  id: any;
  description: string;
  amount: number;
  category: string;
  type: "Receita" | "Despesa";
  date: string;
}

export interface Protocol {
  id: string;
  name: string;
  duration: number;
  active: boolean;
  tasks: string[];
  habits: string[];
}

interface OnboardingAnswers {
  name: string;
  focus: string;
  goal: string;
  wakeTime: string;
  sleepTime: string;
  discipline: string;
  tone: string;
  diagnostic?: string;
}

interface LifeOSContextType {
  tasks: Task[];
  habits: Habit[];
  expenses: Expense[];
  xp: number;
  level: number;
  activeProtocol: string | null;
  onboardingAnswers: OnboardingAnswers | null;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  addTask: (title: string, priority: "Baixa" | "Média" | "Alta", status?: Task["status"]) => void;
  toggleTask: (id: any) => void;
  deleteTask: (id: any) => void;
  moveTask: (id: any, status: Task["status"]) => void;
  addHabit: (name: string) => void;
  toggleHabit: (id: any) => void;
  deleteHabit: (id: any) => void;
  addExpense: (description: string, amount: number, category: string, type: "Receita" | "Despesa") => void;
  deleteExpense: (id: any) => void;
  activateProtocol: (id: string) => void;
  deactivateProtocol: () => void;
  gainXp: (amount: number) => void;
  connectOpenFinance: (bank: string) => void;
  completeDailyReview: (tomorrowTasks: string[]) => void;
  user: any;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

const XP_REWARDS = {
  onboarding: 100,
  addTask: 20,
  completeTask: 50,
  addHabit: 15,
  completeHabit: 30,
  addExpense: 10,
  activateProtocol: 50,
  connectOpenFinance: 50,
  dailyReview: 80,
};

export function LifeOSProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Auth initialization & listener
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setHasHydrated(true);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setHasHydrated(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Client-side route protection
  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      if (pathname !== "/login") {
        router.push("/login");
      }
    } else {
      if (pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, hasHydrated, pathname, router]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
    setHabits([]);
    setExpenses([]);
    setXp(120);
    setLevel(1);
    setActiveProtocol(null);
    setOnboardingAnswers(null);
    router.push("/login");
  };

  // Load state from Supabase once user is authenticated
  useEffect(() => {
    if (!user) return;

    const loadState = async () => {
      try {
        // Load User profile (XP, Level, Onboarding, Protocol)
        const { data: profile } = await supabase
          .from("users")
          .select("xp, level, onboarding_answers, active_protocol")
          .eq("id", user.id)
          .single();

        if (profile) {
          if (profile.xp !== null) setXp(profile.xp);
          if (profile.level !== null) setLevel(profile.level);
          if (profile.onboarding_answers !== null) setOnboardingAnswers(profile.onboarding_answers);
          if (profile.active_protocol !== null) setActiveProtocol(profile.active_protocol);
        }

        // Load Tasks
        const { data: dbTasks } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (dbTasks) setTasks(dbTasks);

        // Load Habits
        const { data: dbHabits } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (dbHabits) {
          setHabits(
            dbHabits.map((h) => ({
              id: h.id,
              name: h.name,
              streak: h.streak,
              completed: h.completed_today,
            }))
          );
        }

        // Load Expenses
        const { data: dbExpenses } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { descending: true });
        if (dbExpenses) setExpenses(dbExpenses);

      } catch (err) {
        console.error("Failed to load user state from Supabase:", err);
      } finally {
        setHasHydrated(true);
      }
    };

    loadState();
  }, [user]);

  const gainXp = (amount: number) => {
    if (!user) return;

    setLevel((currentLevel) => {
      let nextLevel = currentLevel;
      setXp((currentXp) => {
        let newXp = currentXp + amount;
        let req = nextLevel * 200;
        while (newXp >= req) {
          newXp -= req;
          nextLevel += 1;
          req = nextLevel * 200;
        }

        // Async update user profile in database
        supabase
          .from("users")
          .update({ xp: newXp, level: nextLevel })
          .eq("id", user.id)
          .then();

        return newXp;
      });
      return nextLevel;
    });
  };

  const completeOnboarding = async (answers: OnboardingAnswers) => {
    if (!user) return;

    const diagnostic = `Você possui um perfil de execução ${
      answers.discipline === "Alta" ? "Altamente Focado" : "Inconsistente"
    }, com foco principal em ${answers.focus}. A IA definiu que sua melhor estratégia inicial é o ciclo matinal e controle rígido das tarefas de prioridade ${
      answers.discipline === "Baixa" ? "Alta" : "Média"
    }.`;

    const onboarding_answers = { ...answers, diagnostic };

    const { error } = await supabase
      .from("users")
      .update({ onboarding_answers })
      .eq("id", user.id);

    if (!error) {
      setOnboardingAnswers(onboarding_answers);
      gainXp(XP_REWARDS.onboarding);
    }
  };

  const addTask = async (title: string, priority: "Baixa" | "Média" | "Alta", status: Task["status"] = "A Fazer") => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: user.id, title, status, priority }])
      .select()
      .single();

    if (data) {
      setTasks((prev) => [...prev, data]);
      gainXp(XP_REWARDS.addTask);
    }
  };

  const toggleTask = async (id: any) => {
    if (!user) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "Concluído" ? "A Fazer" : "Concluído";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      if (newStatus === "Concluído") {
        gainXp(XP_REWARDS.completeTask);
      }
    }
  };

  const deleteTask = async (id: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const moveTask = async (id: any, status: Task["status"]) => {
    if (!user) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      if (status === "Concluído" && task.status !== "Concluído") {
        gainXp(XP_REWARDS.completeTask);
      }
    }
  };

  const addHabit = async (name: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("habits")
      .insert([{ user_id: user.id, name, streak: 0, completed_today: false }])
      .select()
      .single();

    if (data) {
      setHabits((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          streak: data.streak,
          completed: data.completed_today,
        },
      ]);
      gainXp(XP_REWARDS.addHabit);
    }
  };

  const toggleHabit = async (id: any) => {
    if (!user) return;

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const completed = !habit.completed;
    const streak = completed ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    const { error } = await supabase
      .from("habits")
      .update({ completed_today: completed, streak })
      .eq("id", id);

    if (!error) {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, completed, streak } : h))
      );

      if (completed) {
        await supabase
          .from("habit_logs")
          .insert([{ habit_id: id, user_id: user.id, xp_gained: XP_REWARDS.completeHabit }]);
        gainXp(XP_REWARDS.completeHabit);
      } else {
        await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", id)
          .eq("marked_date", new Date().toISOString().split("T")[0]);
      }
    }
  };

  const deleteHabit = async (id: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id);

    if (!error) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const addExpense = async (description: string, amount: number, category: string, type: "Receita" | "Despesa") => {
    if (!user) return;

    const { data, error } = await supabase
      .from("expenses")
      .insert([{ user_id: user.id, description, amount, category, type }])
      .select()
      .single();

    if (data) {
      setExpenses((prev) => [data, ...prev]);
      gainXp(XP_REWARDS.addExpense);
    }
  };

  const deleteExpense = async (id: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const activateProtocol = async (protocolId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({ active_protocol: protocolId })
      .eq("id", user.id);

    if (!error) {
      setActiveProtocol(protocolId);
      gainXp(XP_REWARDS.activateProtocol);

      if (protocolId === "foco") {
        await addTask("Definir objetivos da Sprint", "Alta", "A Fazer");
        await addTask("Reunião de alinhamento individual", "Média", "A Fazer");
        await addHabit("Bloquear distrações (1h)");
      } else if (protocolId === "manha") {
        await addHabit("Beber 500ml de água");
        await addHabit("Alongamento matinal");
      } else if (protocolId === "financeiro") {
        await addTask("Anotar gastos da semana no LifeOS", "Alta", "A Fazer");
        await addHabit("Zero gastos supérfluos");
      }
    }
  };

  const deactivateProtocol = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({ active_protocol: null })
      .eq("id", user.id);

    if (!error) {
      setActiveProtocol(null);
    }
  };

  const connectOpenFinance = async (bank: string) => {
    if (!user) return;

    const newExpenses = [
      { user_id: user.id, description: `${bank}: Transferência Recebida`, amount: 1200.00, category: "Outros", type: "Receita" },
      { user_id: user.id, description: `${bank}: Uber Trip`, amount: 32.50, category: "Transporte", type: "Despesa" },
      { user_id: user.id, description: `${bank}: Spotify Premium`, amount: 21.90, category: "Assinaturas", type: "Despesa" },
    ];

    const { data, error } = await supabase
      .from("expenses")
      .insert(newExpenses)
      .select();

    if (data) {
      setExpenses((prev) => [...data, ...prev]);
      gainXp(XP_REWARDS.connectOpenFinance);
    }
  };

  const completeDailyReview = async (tomorrowTasks: string[]) => {
    if (!user) return;

    const pendingTasksAudit = tasks
      .filter((t) => t.status !== "Concluído")
      .map((t) => ({ id: t.id, title: t.title }));

    await supabase
      .from("daily_reviews")
      .insert([
        {
          user_id: user.id,
          pending_tasks_audit,
          tomorrow_missions: tomorrowTasks.filter((t) => t.trim() !== ""),
          mentor_feedback: "Revisão sincronizada na nuvem com o Mentor Aether!",
        },
      ]);

    for (const title of tomorrowTasks) {
      if (title.trim()) {
        await addTask(title, "Média", "A Fazer");
      }
    }

    const { error } = await supabase
      .from("habits")
      .update({ completed_today: false })
      .eq("user_id", user.id);

    if (!error) {
      setHabits((prev) => prev.map((h) => ({ ...h, completed: false })));
      gainXp(XP_REWARDS.dailyReview);
    }
  };

  return (
    <LifeOSContext.Provider
      value={{
        tasks,
        habits,
        expenses,
        xp,
        level,
        activeProtocol,
        onboardingAnswers,
        completeOnboarding,
        addTask,
        toggleTask,
        deleteTask,
        moveTask,
        addHabit,
        toggleHabit,
        deleteHabit,
        addExpense,
        deleteExpense,
        activateProtocol,
        deactivateProtocol,
        gainXp,
        connectOpenFinance,
        completeDailyReview,
        user,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
}

export function useLifeOS() {
  const context = useContext(LifeOSContext);
  if (!context) throw new Error("useLifeOS must be used within a LifeOSProvider");
  return context;
}
