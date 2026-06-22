import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { useLifeOS } from "../context/lifeos-context";
import { Sparkles, Plus, CheckCircle, Circle, Wallet, Flame, Trophy } from "lucide-react-native";

export default function Dashboard() {
  const { tasks, habits, expenses, level, xp, addTask, toggleTask, toggleHabit } = useLifeOS();

  // Modals Visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState<"Baixa" | "Média" | "Alta">("Média");

  // Sum today's spent
  const dailyLimit = 100.00;
  const todayStr = new Date().toISOString().split("T")[0];
  const spentToday = expenses
    .filter(e => e.date === todayStr && e.type === "Despesa")
    .reduce((acc, e) => acc + e.amount, 0);

  const xpNeeded = level * 200;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;
    addTask(taskTitle, priority);
    setTaskTitle("");
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Level Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Explorador</Text>
          <Text style={styles.subtext}>Seu progresso diário está ativo</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nív {level}</Text>
        </View>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpCard}>
        <View style={styles.xpInfo}>
          <Text style={styles.xpLabel}>Nível de Execução</Text>
          <Text style={styles.xpValue}>{xp}/{xpNeeded} XP</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${xpPercentage}%` }]} />
        </View>
      </View>

      {/* Quick Action Button */}
      <TouchableOpacity style={styles.actionBtn} onPress={() => setModalVisible(true)}>
        <Plus color="#002e6a" size={20} />
        <Text style={styles.actionBtnText}>Nova Missão</Text>
      </TouchableOpacity>

      {/* Daily Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Trophy color="#adc6ff" size={18} />
          <Text style={styles.sectionTitle}>Missões do Dia</Text>
        </View>
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={[styles.taskCard, task.status === "Concluído" && styles.taskCompleted]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskRow}>
              {task.status === "Concluído" ? (
                <CheckCircle color="#4edea3" size={20} />
              ) : (
                <Circle color="#8c909f" size={20} />
              )}
              <Text style={[styles.taskText, task.status === "Concluído" && styles.taskTextCompleted]}>
                {task.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Habits Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sparkles color="#4edea3" size={18} />
          <Text style={styles.sectionTitle}>Check-in de Hábitos</Text>
        </View>
        {habits.map((habit) => (
          <TouchableOpacity 
            key={habit.id} 
            style={styles.habitCard}
            onPress={() => toggleHabit(habit.id)}
          >
            <View style={styles.habitRow}>
              <View>
                <Text style={[styles.habitText, habit.completed && styles.habitTextCompleted]}>
                  {habit.name}
                </Text>
                {habit.streak > 0 && (
                  <Text style={styles.streakText}>🔥 {habit.streak} dias de streak</Text>
                )}
              </View>
              {habit.completed ? (
                <CheckCircle color="#4edea3" size={22} />
              ) : (
                <Circle color="#8c909f" size={22} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Expense Limit */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wallet color="#ffb95f" size={18} />
          <Text style={styles.sectionTitle}>Orçamento Diário</Text>
        </View>
        <View style={styles.expenseCard}>
          <View style={styles.expenseInfo}>
            <Text style={styles.spentText}>R$ {spentToday.toFixed(2)}</Text>
            <Text style={styles.limitText}>Limite: R$ {dailyLimit.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFillExpense, 
                { width: `${Math.min((spentToday / dailyLimit) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Task Creation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Missão</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da atividade..."
              placeholderTextColor="#8c909f"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleCreateTask}>
                <Text style={styles.confirmText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10131a",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e1e2ec",
  },
  subtext: {
    fontSize: 13,
    color: "#c2c6d6",
    opacity: 0.7,
    marginTop: 4,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#4edea3",
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#003824",
  },
  xpCard: {
    backgroundColor: "#191b23",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginBottom: 20,
  },
  xpInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  xpLabel: {
    color: "#c2c6d6",
    fontSize: 12,
    fontWeight: "bold",
  },
  xpValue: {
    color: "#4edea3",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#32353c",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4edea3",
  },
  progressBarFillExpense: {
    height: "100%",
    backgroundColor: "#ffb95f",
  },
  actionBtn: {
    backgroundColor: "#adc6ff",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  actionBtnText: {
    color: "#002e6a",
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c2c6d6",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  taskCard: {
    backgroundColor: "#191b23",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 8,
  },
  taskCompleted: {
    opacity: 0.5,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskText: {
    color: "#e1e2ec",
    fontSize: 14,
    fontWeight: "500",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  habitCard: {
    backgroundColor: "#191b23",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 8,
  },
  habitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitText: {
    color: "#e1e2ec",
    fontSize: 14,
    fontWeight: "500",
  },
  habitTextCompleted: {
    textDecorationLine: "line-through",
    color: "#4edea3",
  },
  streakText: {
    fontSize: 10,
    color: "#4edea3",
    marginTop: 4,
  },
  expenseCard: {
    backgroundColor: "#191b23",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  expenseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  spentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffb95f",
  },
  limitText: {
    fontSize: 11,
    color: "#c2c6d6",
    opacity: 0.6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1d2027",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e1e2ec",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#10131a",
    borderRadius: 12,
    padding: 14,
    color: "#e1e2ec",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#32353c",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#e1e2ec",
    fontWeight: "bold",
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#adc6ff",
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#002e6a",
    fontWeight: "bold",
  },
});
