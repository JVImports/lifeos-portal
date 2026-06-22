import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Send, Sparkles, MessageSquare } from "lucide-react-native";

interface Message {
  id: number;
  sender: "user" | "aether";
  text: string;
  timestamp: string;
}

export default function Mentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "aether",
      text: "Olá! Eu sou o Aether, seu mentor estratégico de produtividade. Como posso otimizar o seu dia hoje?",
      timestamp: "10:00",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate AI response after 1 second
    setTimeout(() => {
      let aetherResponseText = "Entendido. Para maximizar sua energia nessa tarefa, recomendo utilizar a técnica Pomodoro com blocos focados de 25 minutos seguidos de 5 minutos de respiração consciente. Gostaria que eu criasse um lembrete para isso?";
      
      const textLower = userMsg.text.toLowerCase();
      if (textLower.includes("hábito") || textLower.includes("habito")) {
        aetherResponseText = "Manter novos hábitos exige rituais consistentes. Experimente o 'empilhamento de hábitos': conecte a nova rotina diretamente após algo que você já faz todos os dias sem falta.";
      } else if (textLower.includes("finança") || textLower.includes("dinheiro") || textLower.includes("orçamento")) {
        aetherResponseText = "Seu orçamento diário ajuda a reter capital estratégico. Evite compras impulsivas colocando um atraso deliberado de 24 horas antes de qualquer despesa supérflua.";
      } else if (textLower.includes("cansado") || textLower.includes("energia")) {
        aetherResponseText = "O cansaço mental geralmente é resolvido com descanso ativo (caminhar, beber água, alongar-se), não apenas deitando. Faça uma pausa de 10 minutos longe de qualquer tela.";
      }

      const aetherMsg: Message = {
        id: Date.now() + 1,
        sender: "aether",
        text: aetherResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aetherMsg]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const suggestions = [
    "Como manter o foco à tarde?",
    "Dicas de hábitos matinais",
    "Análise de metas da semana",
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Sparkles color="#d1b3ff" size={16} />
          <Text style={styles.aiBadgeText}>Aether v2.0</Text>
        </View>
        <Text style={styles.subtitle}>Mentor de Produtividade Consciente</Text>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === "user" ? styles.userBubble : styles.aetherBubble,
            ]}
          >
            {msg.sender === "aether" && (
              <Text style={styles.senderLabel}>AETHER</Text>
            )}
            <Text style={msg.sender === "user" ? styles.userText : styles.aetherText}>
              {msg.text}
            </Text>
            <Text style={styles.timeText}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input section & Quick prompts */}
      <View style={styles.bottomArea}>
        {messages.length === 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {suggestions.map((s, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionCard}
                onPress={() => setInputText(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pergunte ao Aether..."
            placeholderTextColor="#8c909f"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Send color="#10131a" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10131a",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(209, 179, 255, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    marginBottom: 6,
  },
  aiBadgeText: {
    color: "#d1b3ff",
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#c2c6d6",
    fontSize: 12,
    opacity: 0.6,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: "#adc6ff",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aetherBubble: {
    backgroundColor: "#191b23",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  senderLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#d1b3ff",
    letterSpacing: 1,
    marginBottom: 6,
  },
  userText: {
    color: "#002e6a",
    fontSize: 14,
    lineHeight: 20,
  },
  aetherText: {
    color: "#e1e2ec",
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 9,
    color: "#8c909f",
    opacity: 0.7,
    alignSelf: "flex-end",
    marginTop: 6,
  },
  bottomArea: {
    padding: 16,
    backgroundColor: "#151820",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.03)",
  },
  suggestionsScroll: {
    marginBottom: 12,
    flexDirection: "row",
  },
  suggestionCard: {
    backgroundColor: "#191b23",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  suggestionText: {
    color: "#c2c6d6",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#10131a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#e1e2ec",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    height: 48,
  },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#adc6ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
