import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { useLifeOS } from "../context/lifeos-context";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, Landmark, Calendar } from "lucide-react-native";

export default function Finances() {
  const { expenses, addExpense, connectOpenFinance } = useLifeOS();

  // Modals Visibility
  const [addVisible, setAddVisible] = useState(false);
  const [bankVisible, setBankVisible] = useState(false);

  // Form Fields
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Receita" | "Despesa">("Despesa");

  const totalIncome = expenses
    .filter((e) => e.type === "Receita")
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === "Despesa")
    .reduce((acc, e) => acc + e.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    const parsedAmount = parseFloat(amount);
    if (!desc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    addExpense(desc, parsedAmount, type);
    setDesc("");
    setAmount("");
    setAddVisible(false);
  };

  const handleConnectBank = (bank: string) => {
    connectOpenFinance(bank);
    setBankVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Finanças</Text>
          <Text style={styles.subtext}>Seu fluxo financeiro automatizado</Text>
        </View>
        <TouchableOpacity style={styles.bankBtn} onPress={() => setBankVisible(true)}>
          <Landmark color="#adc6ff" size={16} />
          <Text style={styles.bankBtnText}>Integrar Banco</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Consolidado</Text>
        <Text style={[styles.balanceValue, balance < 0 && styles.balanceNegative]}>
          R$ {balance.toFixed(2)}
        </Text>

        <View style={styles.miniStats}>
          <View style={styles.statCol}>
            <View style={styles.labelRow}>
              <ArrowUpRight color="#4edea3" size={14} />
              <Text style={styles.miniLabel}>Receitas</Text>
            </View>
            <Text style={styles.miniValue}>R$ {totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <View style={styles.labelRow}>
              <ArrowDownRight color="#ffb95f" size={14} />
              <Text style={styles.miniLabel}>Despesas</Text>
            </View>
            <Text style={styles.miniValue}>R$ {totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.actionBtn} onPress={() => setAddVisible(true)}>
        <Plus color="#002e6a" size={18} />
        <Text style={styles.actionBtnText}>Novo Lançamento</Text>
      </TouchableOpacity>

      {/* Transactions List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Transações Recentes</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sem movimentações</Text>
            <Text style={styles.emptySubtext}>Crie lançamentos ou conecte suas contas via Open Finance.</Text>
          </View>
        ) : (
          expenses.map((exp) => (
            <View key={exp.id} style={styles.transactionCard}>
              <View style={styles.leftInfo}>
                <View style={[styles.typeIconBg, exp.type === "Receita" ? styles.bgIncome : styles.bgExpense]}>
                  {exp.type === "Receita" ? (
                    <ArrowUpRight color={exp.type === "Receita" ? "#4edea3" : "#ffb95f"} size={16} />
                  ) : (
                    <ArrowDownRight color={exp.type === "Receita" ? "#4edea3" : "#ffb95f"} size={16} />
                  )}
                </View>
                <View>
                  <Text style={styles.txDesc}>{exp.description}</Text>
                  <View style={styles.dateRow}>
                    <Calendar color="#8c909f" size={10} />
                    <Text style={styles.txDate}>{exp.date}</Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.txAmount, exp.type === "Receita" ? styles.txtIncome : styles.txtExpense]}>
                {exp.type === "Receita" ? "+" : "-"} R$ {exp.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Add Lançamento Modal */}
      <Modal visible={addVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Registro</Text>

            {/* Type selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeOption, type === "Despesa" && styles.typeSelectedExpense]}
                onPress={() => setType("Despesa")}
              >
                <Text style={[styles.typeText, type === "Despesa" && styles.typeTextActive]}>Despesa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeOption, type === "Receita" && styles.typeSelectedIncome]}
                onPress={() => setType("Receita")}
              >
                <Text style={[styles.typeText, type === "Receita" && styles.typeTextActive]}>Receita</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descrição..."
              placeholderTextColor="#8c909f"
              value={desc}
              onChangeText={setDesc}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor (Ex: 45.90)..."
              placeholderTextColor="#8c909f"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setAddVisible(false)}>
                <Text style={styles.cancelText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleAddTransaction}>
                <Text style={styles.confirmText}>Lançar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Open Finance Bank Selector Modal */}
      <Modal visible={bankVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conectar Open Finance</Text>
            <Text style={styles.modalDescription}>
              Conecte de forma 100% segura. Suas movimentações serão sincronizadas de forma automatizada para somar ao seu painel.
            </Text>

            <TouchableOpacity style={styles.bankSelectCard} onPress={() => handleConnectBank("Nubank")}>
              <Landmark color="#8a05be" size={20} />
              <Text style={styles.bankSelectText}>Nubank</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bankSelectCard} onPress={() => handleConnectBank("Itaú")}>
              <Landmark color="#ec7000" size={20} />
              <Text style={styles.bankSelectText}>Itaú</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bankSelectCard} onPress={() => handleConnectBank("Banco do Brasil")}>
              <Landmark color="#fcf000" size={20} />
              <Text style={styles.bankSelectText}>Banco do Brasil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalCancel, { marginTop: 12 }]} onPress={() => setBankVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
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
  bankBtn: {
    backgroundColor: "rgba(173,198,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(173,198,255,0.15)",
  },
  bankBtnText: {
    color: "#adc6ff",
    fontSize: 11,
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: "#191b23",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#c2c6d6",
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4edea3",
    marginBottom: 20,
  },
  balanceNegative: {
    color: "#ffb95f",
  },
  miniStats: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.03)",
    paddingTop: 16,
  },
  statCol: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  miniLabel: {
    fontSize: 10,
    color: "#c2c6d6",
    opacity: 0.6,
  },
  miniValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e1e2ec",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 16,
  },
  actionBtn: {
    backgroundColor: "#adc6ff",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  actionBtnText: {
    color: "#002e6a",
    fontSize: 14,
    fontWeight: "bold",
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
  transactionCard: {
    backgroundColor: "#191b23",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  typeIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bgIncome: {
    backgroundColor: "rgba(78, 222, 163, 0.08)",
  },
  bgExpense: {
    backgroundColor: "rgba(255, 185, 95, 0.08)",
  },
  txDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e1e2ec",
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  txDate: {
    fontSize: 10,
    color: "#c2c6d6",
    opacity: 0.5,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },
  txtIncome: {
    color: "#4edea3",
  },
  txtExpense: {
    color: "#ffb95f",
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
  modalDescription: {
    fontSize: 12,
    color: "#c2c6d6",
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 18,
  },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#10131a",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  typeSelectedExpense: {
    backgroundColor: "rgba(255, 185, 95, 0.15)",
  },
  typeSelectedIncome: {
    backgroundColor: "rgba(78, 222, 163, 0.15)",
  },
  typeText: {
    fontSize: 13,
    color: "#c2c6d6",
    opacity: 0.7,
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#e1e2ec",
    opacity: 1,
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
  bankSelectCard: {
    backgroundColor: "#10131a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  bankSelectText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e1e2ec",
  },
});
