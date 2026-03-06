import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { COLORS } from '../../constants/colors';

export default function AwarenessScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [expandedCard, setExpandedCard] = useState(null);

  const content = {
    english: {
      title: 'Dengue Prevention Guide',
      subtitle: 'Stay safe from mosquito-borne diseases',
      categories: [
        {
          id: 1,
          icon: '💧',
          title: 'Remove Stagnant Water',
          summary: 'Eliminate mosquito breeding sites around your home',
          color: '#1565C0',
          bgColor: '#E3F2FD',
          tips: [
            'Empty and clean flower pots every week',
            'Cover water storage tanks tightly',
            'Clear blocked gutters and drains',
            'Remove old tires from your compound',
            'Empty coconut shells after use',
            'Change water in vases every 3 days',
          ],
        },
        {
          id: 2,
          icon: '🏠',
          title: 'Protect Your Home',
          summary: 'Keep mosquitoes out of your living spaces',
          color: '#2E7D32',
          bgColor: '#E8F5E9',
          tips: [
            'Install wire mesh on windows and doors',
            'Use mosquito nets while sleeping',
            'Apply mosquito repellent on exposed skin',
            'Wear long-sleeved shirts and long pants',
            'Use mosquito coils or electric repellents',
            'Keep doors and windows closed at dawn and dusk',
          ],
        },
        {
          id: 3,
          icon: '🦟',
          title: 'Know the Symptoms',
          summary: 'Recognize dengue early for better treatment',
          color: '#C62828',
          bgColor: '#FFEBEE',
          tips: [
            'Sudden high fever above 38°C',
            'Severe headache and eye pain',
            'Muscle and joint pain',
            'Skin rash appearing after 3-4 days',
            'Nausea and vomiting',
            'See a doctor if fever lasts more than 2 days',
          ],
        },
        {
          id: 4,
          icon: '🏥',
          title: 'When to Get Help',
          summary: 'Recognize warning signs that need urgent care',
          color: '#E65100',
          bgColor: '#FFF3E0',
          tips: [
            'Severe stomach or abdominal pain',
            'Persistent vomiting more than 3 times',
            'Bleeding from gums, nose or skin',
            'Blood in urine, stool or vomit',
            'Extreme fatigue or restlessness',
            'Call 1990 (Suwaseriya) for emergencies',
          ],
        },
        {
          id: 5,
          icon: '🌧️',
          title: 'Monsoon Season Tips',
          summary: 'Extra precautions during rainy season',
          color: '#4527A0',
          bgColor: '#EDE7F6',
          tips: [
            'Check your garden after every rainfall',
            'Ensure drains around your house are clear',
            'Inspect roof gutters regularly',
            'Be extra vigilant during May-August and Nov-Jan',
            'Encourage neighbors to clean their surroundings',
            'Report stagnant water to local authorities',
          ],
        },
        {
          id: 6,
          icon: '👨‍👩‍👧',
          title: 'Community Action',
          summary: 'Work together to control outbreaks',
          color: '#00695C',
          bgColor: '#E0F2F1',
          tips: [
            'Organize community clean-up campaigns',
            'Educate neighbors about prevention',
            'Report dengue cases to health authorities',
            'Cooperate with health inspectors',
            'Share prevention tips with family and friends',
            'Use this app to monitor local risk levels',
          ],
        },
      ],
    },
    sinhala: {
      title: 'ඩෙංගු වැළැක්වීමේ මාර්ගෝපදේශය',
      subtitle: 'මදුරු රෝගවලින් ආරක්ෂා වන්න',
      categories: [
        {
          id: 1,
          icon: '💧',
          title: 'එකතු වූ ජලය ඉවත් කරන්න',
          summary: 'ගෙදර වටේ මදුරු බෝවන තැන් නැති කරන්න',
          color: '#1565C0',
          bgColor: '#E3F2FD',
          tips: [
            'සතියකට වරක් මල් බඳුන් හිස් කර සෝදන්න',
            'ජල ටැංකි හොඳින් ආවරණය කරන්න',
            'අවහිර ඇළ මාර්ග පිරිසිදු කරන්න',
            'පරණ රබර් රෝද ඉවත් කරන්න',
            'පොල් කෝල් ඉවත් කරන්න',
            'දින 3 කට වරක් මල් බඳුනේ ජලය මාරු කරන්න',
          ],
        },
        {
          id: 2,
          icon: '🏠',
          title: 'ඔබේ නිවස ආරක්ෂා කරන්න',
          summary: 'මදුරුවන් ගෙට ඇතුළු නොවෙන සේ කරන්න',
          color: '#2E7D32',
          bgColor: '#E8F5E9',
          tips: [
            'ජනෙල් සහ දොරවල් ජාලකය ගසන්න',
            'නිදා ගැනීමේදී මදුරු දැල් භාවිතා කරන්න',
            'ශරීරයේ නිරාවරණ ස්ථාන වලට රෙපෙලන්ට් ගල්වන්න',
            'දිගු අත් ජර්සි සහ දිගු කලිසම් ඇඳගන්න',
            'මදුරු දුම් දෑල් හෝ විදුලි රිපෙලන්ට් භාවිතා කරන්න',
            'උදෑසන සහ සවස දොර ජනෙල් වහන්න',
          ],
        },
        {
          id: 3,
          icon: '🦟',
          title: 'රෝග ලක්ෂණ දැනගන්න',
          summary: 'ඩෙංගු රෝගය ඉක්මනින් හඳුනාගන්න',
          color: '#C62828',
          bgColor: '#FFEBEE',
          tips: [
            '38°C ට වඩා හදිසි උෂ්ණත්වය',
            'දරුණු හිසරදය සහ ඇස් වේදනාව',
            'මාංශ පේශි සහ සන්ධි වේදනාව',
            'දින 3-4 කට පසු සමේ කුෂ්ඨ',
            'ඔක්කාරය සහ වමනය',
            'දින 2 කට වඩා උෂ්ණත්වය ඇත්නම් වෛද්‍යවරයෙකු හමුවන්න',
          ],
        },
        {
          id: 4,
          icon: '🏥',
          title: 'හදිසි ප්‍රතිකාර',
          summary: 'හදිසි ප්‍රතිකාර අවශ්‍ය නිශාන හඳුනාගන්න',
          color: '#E65100',
          bgColor: '#FFF3E0',
          tips: [
            'දරුණු උදර වේදනාව',
            'නතර නොවන වමනය',
            'විදුරුමස්, නාසය හෝ සමෙන් ලේ ගැලීම',
            'මුත්‍රා, මළ හෝ වමනයේ ලේ',
            'අධික දුර්වලතාව',
            'හදිසි ඇමතුම සඳහා 1990 අමතන්න',
          ],
        },
      ],
    },
    tamil: {
      title: 'டெங்கு தடுப்பு வழிகாட்டி',
      subtitle: 'கொசு நோய்களிலிருந்து பாதுகாப்பாக இருங்கள்',
      categories: [
        {
          id: 1,
          icon: '💧',
          title: 'தேங்கிய நீரை அகற்றுங்கள்',
          summary: 'வீட்டைச் சுற்றி கொசு வளரும் இடங்களை அகற்றுங்கள்',
          color: '#1565C0',
          bgColor: '#E3F2FD',
          tips: [
            'வாரம் ஒருமுறை தொட்டிகளை காலி செய்யுங்கள்',
            'தண்ணீர் தொட்டிகளை மூடி வையுங்கள்',
            'அடைத்த கால்வாய்களை சுத்தம் செய்யுங்கள்',
            'பழைய டயர்களை அகற்றுங்கள்',
            'தேங்காய் ஓடுகளை அகற்றுங்கள்',
            '3 நாட்களுக்கு ஒருமுறை பூந்தட்டி நீரை மாற்றுங்கள்',
          ],
        },
        {
          id: 2,
          icon: '🏠',
          title: 'உங்கள் வீட்டை பாதுகாங்கள்',
          summary: 'கொசுக்கள் வீட்டில் நுழையாமல் தடுங்கள்',
          color: '#2E7D32',
          bgColor: '#E8F5E9',
          tips: [
            'ஜன்னல்கள் மற்றும் கதவுகளில் கம்பி வலை பொருத்துங்கள்',
            'தூங்கும்போது கொசு வலை பயன்படுத்துங்கள்',
            'கொசு விரட்டி தடவுங்கள்',
            'நீண்ட கை சட்டை மற்றும் நீண்ட பேண்ட் அணியுங்கள்',
            'கொசு சுருள் அல்லது மின் விரட்டி பயன்படுத்துங்கள்',
            'விடியல் மற்றும் மாலையில் கதவுகளை மூடுங்கள்',
          ],
        },
        {
          id: 3,
          icon: '🦟',
          title: 'அறிகுறிகளை அறிந்துகொள்ளுங்கள்',
          summary: 'டெங்குவை ஆரம்பத்திலேயே கண்டறியுங்கள்',
          color: '#C62828',
          bgColor: '#FFEBEE',
          tips: [
            '38°C க்கு மேல் திடீர் காய்ச்சல்',
            'கடுமையான தலைவலி மற்றும் கண் வலி',
            'தசை மற்றும் மூட்டு வலி',
            '3-4 நாட்களுக்கு பிறகு தோல் தடிப்புகள்',
            'குமட்டல் மற்றும் வாந்தி',
            '2 நாட்களுக்கு மேல் காய்ச்சல் இருந்தால் மருத்துவரை சந்தியுங்கள்',
          ],
        },
        {
          id: 4,
          icon: '🏥',
          title: 'உடனடி சிகிச்சை',
          summary: 'அவசர சிகிச்சை தேவைப்படும் அறிகுறிகள்',
          color: '#E65100',
          bgColor: '#FFF3E0',
          tips: [
            'கடுமையான வயிற்று வலி',
            'தொடர்ச்சியான வாந்தி',
            'ஈறுகள், மூக்கு அல்லது தோலில் இரத்தப்போக்கு',
            'சிறுநீர், மலம் அல்லது வாந்தியில் இரத்தம்',
            'அதிகப்படியான சோர்வு',
            'அவசரநிலைக்கு 1990 என்ற எண்ணில் அழைக்கவும்',
          ],
        },
      ],
    },
  };

  const currentContent = content[selectedLanguage];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 {currentContent.title}</Text>
        <Text style={styles.headerSubtitle}>{currentContent.subtitle}</Text>

        {/* Language Selector */}
        <View style={styles.languageContainer}>
          {[
            { key: 'english', label: '🇬🇧 EN' },
            { key: 'sinhala', label: '🇱🇰 SI' },
            { key: 'tamil', label: '🇱🇰 TA' },
          ].map(lang => (
            <TouchableOpacity
              key={lang.key}
              style={[
                styles.langBtn,
                selectedLanguage === lang.key && styles.langBtnActive
              ]}
              onPress={() => setSelectedLanguage(lang.key)}
            >
              <Text style={[
                styles.langBtnText,
                selectedLanguage === lang.key && styles.langBtnTextActive
              ]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Emergency Hotlines</Text>
            <Text style={styles.emergencyText}>Suwaseriya: 1990 | Health Line: 1999</Text>
          </View>
        </View>

        {/* Content Cards */}
        {currentContent.categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.card, { backgroundColor: category.bgColor }]}
            onPress={() => setExpandedCard(expandedCard === category.id ? null : category.id)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <Text style={styles.cardIcon}>{category.icon}</Text>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={[styles.cardTitle, { color: category.color }]}>
                  {category.title}
                </Text>
                <Text style={styles.cardSummary}>{category.summary}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedCard === category.id ? '▲' : '▼'}
              </Text>
            </View>

            {expandedCard === category.id && (
              <View style={styles.tipsContainer}>
                {category.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <View style={[styles.tipBullet, { backgroundColor: category.color }]}>
                      <Text style={styles.tipBulletText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            🌿 Information provided in partnership with Sri Lanka Ministry of Health
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 55,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 12, marginTop: 3, marginBottom: 15 },
  languageContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  langBtnText: {
    color: '#C8E6C9',
    fontSize: 13,
    fontWeight: '600',
  },
  langBtnTextActive: {
    color: COLORS.primary,
  },
  emergencyBanner: {
    backgroundColor: '#FFEBEE',
    margin: 15,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    gap: 10,
  },
  emergencyIcon: { fontSize: 24 },
  emergencyTextContainer: { flex: 1 },
  emergencyTitle: {
    fontWeight: 'bold',
    color: '#D32F2F',
    fontSize: 14,
  },
  emergencyText: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 14,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 22 },
  cardTitleContainer: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold' },
  cardSummary: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  expandIcon: { fontSize: 12, color: COLORS.textLight },
  tipsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 12,
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipBulletText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  tipText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },
  footerNote: {
    margin: 15,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
  },
  bottomSpacing: { height: 20 },
});