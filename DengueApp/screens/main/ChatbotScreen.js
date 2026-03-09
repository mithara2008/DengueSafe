import React, { useState, useRef } from 'react';
import { sendChatMessage } from '../../services/api';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 I am DengueSafe Assistant. I can help you with information about dengue and chikungunya in Sri Lanka.\n\nYou can ask me:\n• Is there dengue in my area?\n• What are the symptoms?\n• How do I prevent dengue?\n• Which districts are high risk?',
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const quickQuestions = [
    { text: 'Dengue symptoms', icon: 'thermometer-outline' },
    { text: 'High risk areas', icon: 'map-outline' },
    { text: 'How to prevent', icon: 'shield-checkmark-outline' },
    { text: 'When to see doctor', icon: 'medical-outline' },
    { text: 'Breeding sites', icon: 'water-outline' },
    { text: 'Latest case count', icon: 'analytics-outline' },
  ];

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('symptom') || msg.includes('signs') || msg.includes('sick')) {
      return `🦟 **Dengue Symptoms:**\n\n• High fever (40°C/104°F)\n• Severe headache\n• Pain behind the eyes\n• Muscle and joint pains\n• Nausea and vomiting\n• Swollen glands\n• Skin rash\n\n⚠️ **Warning signs** (go to hospital immediately):\n• Severe abdominal pain\n• Persistent vomiting\n• Bleeding gums or nose\n• Fatigue and restlessness\n\nIf you have these symptoms, please visit your nearest hospital immediately! 🏥`;
    }

    if (msg.includes('high risk') || msg.includes('risk area') || msg.includes('dangerous')) {
      return `📍 **Current High Risk Districts:**\n\n🔴 Colombo — 342 cases\n🔴 Gampaha — 218 cases\n🔴 Kalutara — 178 cases\n\n🟡 **Medium Risk:**\nKandy, Kurunegala, Ratnapura\n\n🟢 **Low Risk:**\nGalle, Matara, Jaffna\n\n📊 ML prediction shows Colombo cases may rise to 380 next week. Please take extra precautions if you live in these areas!`;
    }

    if (msg.includes('prevent') || msg.includes('protection') || msg.includes('safe')) {
      return `🛡️ **Dengue Prevention Tips:**\n\n💧 **Remove Stagnant Water:**\n• Empty flower pots regularly\n• Clean coconut shells\n• Cover water tanks\n• Clear blocked gutters\n\n🏠 **Protect Your Home:**\n• Use mosquito nets at night\n• Install window screens\n• Use mosquito repellent\n• Wear long sleeves at dawn/dusk`;
    }

    if (msg.includes('colombo') || msg.includes('my area') || msg.includes('near me')) {
      return `📍 **Colombo District Status:**\n\n🔴 Risk Level: HIGH\n🦟 Current Cases: 342\n📈 ML Predicted (7 days): 380\n🌧 Recent Rainfall: 245mm\n🌡 Temperature: 31°C\n\n⚠️ Colombo is currently a HIGH RISK area. Please:\n• Use mosquito repellent daily\n• Remove stagnant water around your home\n• Visit a doctor if you have fever\n• Check our heatmap for detailed area info`;
    }

    if (msg.includes('doctor') || msg.includes('hospital') || msg.includes('when')) {
      return `🏥 **When to See a Doctor:**\n\nGo to hospital IMMEDIATELY if you have:\n\n🚨 • Fever above 38°C for more than 2 days\n🚨 • Severe stomach pain\n🚨 • Bleeding from gums or nose\n🚨 • Blood in urine or stool\n🚨 • Difficulty breathing\n🚨 • Extreme fatigue\n\n📞 **Emergency Numbers:**\n• Suwaseriya: 1990\n• Health Hotline: 1999\n\nDon't wait — early treatment saves lives! 💚`;
    }

    if (msg.includes('breed') || msg.includes('water') || msg.includes('mosquito breed')) {
      return `💧 **Removing Mosquito Breeding Sites:**\n\n🏠 **Inside Home:**\n• Empty vases and flower pots\n• Check indoor plants\n• Clean air cooler water weekly\n\n🌿 **Outside Home:**\n• Remove old tires\n• Clear coconut shells\n• Fix leaking taps\n• Clean roof gutters\n• Cover water storage tanks\n\n🗑️ Dispose of any containers that hold water after rain!\n\n**Remember:** Mosquitoes only need a bottle cap of water to breed! 🦟`;
    }

    if (msg.includes('case') || msg.includes('count') || msg.includes('latest') || msg.includes('update')) {
      return `📊 **Latest Sri Lanka Dengue Update:**\n\n🦟 Total Active Cases: 1,247\n📍 High Risk Districts: 3\n🔴 Active Clusters: 23\n💚 Recoveries: 1,089\n\n📈 **Trend:** Cases are rising in Western Province due to recent heavy rainfall.\n\n🔔 Our ML model predicts a 12% increase in cases over the next 7 days.\n\nCheck the Heatmap screen for detailed district-by-district information!`;
    }

    if (msg.includes('hello') || msg.includes('hi')) {
      return `Hello! 👋\n\nI am DengueSafe Assistant, here to help you stay safe from dengue and chikungunya in Sri Lanka.\n\nHow can I help you today? You can ask me about:\n• Symptoms\n• High risk areas\n• Prevention tips\n• When to see a doctor`;
    }

    return `🤖 I'm not sure about that specific question. Here are things I can help with:\n\n• Dengue/Chikungunya symptoms\n• High risk areas in Sri Lanka\n• Prevention and protection tips\n• When to see a doctor\n• Removing breeding sites\n• Latest case counts\n\nPlease try asking one of these questions! 😊`;
  };

  const sendMessage = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage(messageText);
      const botResponse = {
        id: messages.length + 2,
        text: response.reply,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(messageText),
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.botAvatar}>
          <Ionicons name="chatbubbles" size={30} color={COLORS.primary} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>DengueSafe Assistant</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerStatus}>Online — Ask me anything</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.isBot ? styles.botRow : styles.userRow
            ]}
          >
            {message.isBot && (
              <View style={styles.botAvatarSmall}>
                <Ionicons name="chatbubbles" size={16} color={COLORS.white} />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              message.isBot ? styles.botBubble : styles.userBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isBot ? styles.botText : styles.userText
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.isBot ? styles.botTime : styles.userTime
              ]}>
                {message.time}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageRow, styles.botRow]}>
            <View style={styles.botAvatarSmall}>
              <Ionicons name="chatbubbles" size={16} color={COLORS.white} />
            </View>
            <View style={[styles.messageBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <View style={styles.quickContainerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickContainer}
          contentContainerStyle={styles.quickContent}
        >
          {quickQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickBtn}
              onPress={() => sendMessage(q.text)}
            >
              <Ionicons name={q.icon} size={15} color={COLORS.primary} style={styles.quickBtnIcon} />
              <Text style={styles.quickBtnText}>{q.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about dengue, prevention..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={18} color={COLORS.white} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  botAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTextContainer: { marginLeft: 16 },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  headerStatus: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },
  messagesContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  messagesContent: { padding: 20, paddingBottom: 10 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  botAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  typingText: { color: COLORS.textLight, fontSize: 14, fontWeight: '500' },
  messageText: { fontSize: 15, lineHeight: 22 },
  botText: { color: COLORS.text, fontWeight: '400' },
  userText: { color: COLORS.white, fontWeight: '500' },
  messageTime: { fontSize: 11, marginTop: 8, fontWeight: '500' },
  botTime: { color: COLORS.textLight },
  userTime: { color: 'rgba(255,255,255,0.8)', textAlign: 'right' },
  quickContainerWrapper: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  quickContainer: { flexGrow: 0 },
  quickContent: { padding: 12, gap: 10 },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  quickBtnIcon: { marginRight: 6 },
  quickBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 15,
    maxHeight: 120,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 2,
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
  sendIcon: { marginLeft: 4 },
});