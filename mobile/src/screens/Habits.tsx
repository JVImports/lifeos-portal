import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { useLifeOS } from "../context/lifeos-context";
import { Plus, Flame, Award, Trash2, CheckCircle2, Circle } from "lucide-react-native";

export default function Habits() {
  const { habits, addHabit, toggleHabit, level } = useLifeOS();
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit(newHabitName);
    setNewHabitName("");
    setModalVisible(false);
  };

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Hábitos</Text>
          <Text style={styles.subtext}>Consistência gera evolução</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus color="#002e6a" size={18} />
          <Text style={styles.addBtnText}>Criar</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Taxa Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {habits.reduce((max, h) => Math.max(max, h.streak), 0)}
          </Text>
          <Text style={styles.statLabel}>Maior Streak</Text>
        </View>
      </View>

      {/* List section */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Rotinas Ativas</Text>
        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum hábito cadastrado.</Text>
            <Text style={styles.emptySubtext}>Comece criando um novo hábito para começar a pontuar XP!</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <View key={habit.id} style={[styles.habitCard, habit.completed && styles.habitCardCompleted]}>
              <View style={styles.habitDetails}>
                <Text style={[styles.habitName, habit.completed && styles.habitNameCompleted]}>
                  {habit.name}
                </Text>
                <View style={styles.streakRow}>
                  <Flame color={habit.streak > 0 ? "#ff7a00" : "#8c909f"} size={16} />
                  <Text style={[styles.streakText, habit.streak > 0 && styles.streakActive]}>
                    {habit.streak} {habit.streak === 1 ? "dia" : "dias"} seguidos
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.checkTouch} onPress={() => toggleHabit(habit.id)}>
                {habit.completed ? (
                  <CheckCircle2 color="#4edea3" size={26} />
                ) : (
                  <Circle color="#32353c" size={26} />
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Habit Creation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Hábito</Text>
            <Text style={styles.modalDescription}>Defina uma ação diária curta e direta para treinar seu cérebro.</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ler 10 páginas, Beber 2L água..."
              placeholderTextColor="#8c909f"
              value={newHabitName}
              onChangeText={setNewHabitName}
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleCreateHabit}>
                <Text style={styles.confirmText}>Adicionar</Text>
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
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
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
  addBtn: {
    backgroundColor: "#adc6ff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addBtnText: {
    color: "#002e6a",
    fontSize: 13,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#191b23",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4edea3",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#c2c6d6",
    opacity: 0.7,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c2c6d6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  emptyContainer: {
    backgroundColor: "#191b23",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
    marginTop: 10,
  },
  emptyText: {
    color: "#e1e2ec",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtext: {
    color: "#c2c6d6",
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 18,
  },
  habitCard: {
    backgroundColor: "#191b23",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  habitCardCompleted: {
    borderColor: "rgba(78, 222, 163, 0.15)",
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    color: "#e1e2ec",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  habitNameCompleted: {
    color: "#8c909f",
    textDecorationLine: "line-through",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakText: {
    fontSize: 11,
    color: "#c2c6d6",
    opacity: 0.6,
  },
  streakActive: {
    color: "#ff9f43",
    opacity: 1,
    fontWeight: "600",
  },
  checkTouch: {
    padding: 4,
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
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 12,
    color: "#c2c6d6",
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 18,
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
