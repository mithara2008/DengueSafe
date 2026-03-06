import React, { useState, useRef } from 'react';
import { sendChatMessage } from '../../services/api';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'හෙලෝ! 👋 I am DengueSafe Assistant. I can help you with information about dengue and chikungunya in Sri Lanka.\n\nYou can ask me:\n• Is there dengue in my area?\n• What are the symptoms?\n• How do I prevent dengue?\n• Which districts are high risk?',
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const quickQuestions = [
    '🦟 Dengue symptoms?',
    '📍 High risk areas?',
    '🛡️ How to prevent?',
    '🌡️ When to see doctor?',
    '💧 Remove breeding sites?',
    '📊 Latest case count?',
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
      return `🛡️ **Dengue Prevention Tips:**\n\n💧 **Remove Stagnant Water:**\n• Empty flower pots regularly\n• Clean coconut shells\n• Cover water tanks\n• Clear blocked gutters\n\n🏠 **Protect Your Home:**\n• Use mosquito nets at night\n• Install window screens\n• Use mosquito repellent\n• Wear long sleeves at dawn/dusk\n\n🌿 **Sinhala Tip:**\nගෙදර වටේ ජලය එකතු නොවෙන්න බලාගන්න!\n\n🌿 **Tamil Tip:**\nமழைக்காலத்தில் தண்ணீர் தேங்காமல் பார்த்துக்கொள்ளுங்கள்!`;
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

    if (msg.includes('chikungunya')) {
      return `🦟 **Chikungunya Information:**\n\nChikungunya is also spread by Aedes mosquitoes (same as dengue).\n\n**Symptoms:**\n• Sudden fever\n• Severe joint pain (may last weeks)\n• Muscle pain\n• Headache\n• Rash\n\n**Key Difference from Dengue:**\nJoint pain in chikungunya is more severe and longer lasting.\n\n**Prevention:** Same as dengue — remove stagnant water and use mosquito repellent!\n\nVisit a doctor if symptoms appear. 🏥`;
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('ayubowan') || msg.includes('vanakkam')) {
      return `ආයුබෝවන්! வணக்கம்! Hello! 👋\n\nI am DengueSafe Assistant, here to help you stay safe from dengue and chikungunya in Sri Lanka.\n\nHow can I help you today? You can ask me about:\n• Symptoms\n• High risk areas\n• Prevention tips\n• When to see a doctor`;
    }

    return `🤖 I'm not sure about that specific question. Here are things I can help with:\n\n• 🦟 Dengue/Chikungunya symptoms\n• 📍 High risk areas in Sri Lanka\n• 🛡️ Prevention and protection tips\n• 🏥 When to see a doctor\n• 💧 Removing breeding sites\n• 📊 Latest case counts\n\nPlease try asking one of these questions or tap the quick questions below! 😊`;
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
    // Fallback to local responses if API fails
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
          <Text style={styles.botAvatarText}>🤖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>DengueSafe Assistant</Text>
          <Text style={styles.headerStatus}>🟢 Online — Ask me anything!</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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
                <Text style={styles.botAvatarSmallText}>🤖</Text>
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
          <View style={styles.botRow}>
            <View style={styles.botAvatarSmall}>
              <Text style={styles.botAvatarSmallText}>🤖</Text>
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
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
            onPress={() => sendMessage(q)}
          >
            <Text style={styles.quickBtnText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about dengue, symptoms, prevention..."
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
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  botAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatarText: { fontSize: 24 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  headerStatus: { color: '#C8E6C9', fontSize: 12, marginTop: 2 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 15, paddingBottom: 5 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 4,
  },
  botAvatarSmallText: { fontSize: 14 },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  botText: { color: COLORS.text },
  userText: { color: '#FFFFFF' },
  messageTime: { fontSize: 10, marginTop: 4 },
  botTime: { color: COLORS.textLight },
  userTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomLeftRadius: 4,
  },
  typingText: { color: COLORS.textLight, fontSize: 13 },
  quickContainer: {
    maxHeight: 45,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quickContent: { padding: 8, gap: 8 },
  quickBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  quickBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  sendBtnDisabled: { backgroundColor: '#BDBDBD' },
  sendBtnText: { color: '#FFFFFF', fontSize: 16 },
});