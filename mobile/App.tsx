import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { LifeOSProvider } from "./src/context/lifeos-context";
import Dashboard from "./src/screens/Dashboard";
import Habits from "./src/screens/Habits";
import Finances from "./src/screens/Finances";
import Mentor from "./src/screens/Mentor";
import { LayoutDashboard, CheckSquare, Wallet, Bot } from "lucide-react-native";

type ScreenName = "Dashboard" | "Habits" | "Finances" | "Mentor";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("Dashboard");

  const renderScreen = () => {
    switch (currentScreen) {
      case "Dashboard":
        return <Dashboard />;
      case "Habits":
        return <Habits />;
      case "Finances":
        return <Finances />;
      case "Mentor":
        return <Mentor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LifeOSProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#10131a" />
        
        {/* Main Content View */}
        <View style={styles.mainContent}>
          {renderScreen()}
        </View>

        {/* Tab Navigation Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, currentScreen === "Dashboard" && styles.tabItemActive]}
            onPress={() => setCurrentScreen("Dashboard")}
          >
            <LayoutDashboard color={currentScreen === "Dashboard" ? "#adc6ff" : "#8c909f"} size={22} />
            <Text style={[styles.tabLabel, currentScreen === "Dashboard" && styles.tabLabelActive]}>
              Hoje
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, currentScreen === "Habits" && styles.tabItemActive]}
            onPress={() => setCurrentScreen("Habits")}
          >
            <CheckSquare color={currentScreen === "Habits" ? "#4edea3" : "#8c909f"} size={22} />
            <Text style={[styles.tabLabel, currentScreen === "Habits" && styles.tabLabelActive]}>
              Hábitos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, currentScreen === "Finances" && styles.tabItemActive]}
            onPress={() => setCurrentScreen("Finances")}
          >
            <Wallet color={currentScreen === "Finances" ? "#ffb95f" : "#8c909f"} size={22} />
            <Text style={[styles.tabLabel, currentScreen === "Finances" && styles.tabLabelActive]}>
              Finanças
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, currentScreen === "Mentor" && styles.tabItemActive]}
            onPress={() => setCurrentScreen("Mentor")}
          >
            <Bot color={currentScreen === "Mentor" ? "#d1b3ff" : "#8c909f"} size={22} />
            <Text style={[styles.tabLabel, currentScreen === "Mentor" && styles.tabLabelActive]}>
              Mentor
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LifeOSProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10131a",
  },
  mainContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#151820",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.03)",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  tabItemActive: {
    // Subtle background highlight if desired
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8c909f",
  },
  tabLabelActive: {
    color: "#e1e2ec",
  },
});
