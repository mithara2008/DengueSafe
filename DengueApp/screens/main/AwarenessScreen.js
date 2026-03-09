import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          icon: 'water-outline',
          title: 'Remove Stagnant Water',
          summary: 'Eliminate mosquito breeding sites around your home',
          color: '#0284C7',
          bgColor: '#F0F9FF',
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
          icon: 'home-outline',
          title: 'Protect Your Home',
          summary: 'Keep mosquitoes out of your living spaces',
          color: '#16A34A',
          bgColor: '#F0FDF4',
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
          icon: 'thermometer-outline',
          title: 'Know the Symptoms',
          summary: 'Recognize dengue early for better treatment',
          color: '#DC2626',
          bgColor: '#FEF2F2',
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
          icon: 'medical-outline',
          title: 'When to Get Help',
          summary: 'Recognize warning signs that need urgent care',
          color: '#EA580C',
          bgColor: '#FFF7ED',
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
          icon: 'rainy-outline',
          title: 'Monsoon Season Tips',
          summary: 'Extra precautions during rainy season',
          color: '#7C3AED',
          bgColor: '#F5F3FF',
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
          icon: 'people-outline',
          title: 'Community Action',
          summary: 'Work together to control outbreaks',
          color: '#0D9488',
          bgColor: '#F0FDFA',
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
          icon: 'water-outline',
          title: 'එකතු වූ ජලය ඉවත් කරන්න',
          summary: 'ගෙදර වටේ මදුරු බෝවන තැන් නැති කරන්න',
          color: '#0284C7',
          bgColor: '#F0F9FF',
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
          icon: 'home-outline',
          title: 'ඔබේ නිවස ආරක්ෂා කරන්න',
          summary: 'මදුරුවන් ගෙට ඇතුළු නොවෙන සේ කරන්න',
          color: '#16A34A',
          bgColor: '#F0FDF4',
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
          icon: 'thermometer-outline',
          title: 'රෝග ලක්ෂණ දැනගන්න',
          summary: 'ඩෙංගු රෝගය ඉක්මනින් හඳුනාගන්න',
          color: '#DC2626',
          bgColor: '#FEF2F2',
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
          icon: 'medical-outline',
          title: 'හදිසි ප්‍රතිකාර',
          summary: 'හදිසි ප්‍රතිකාර අවශ්‍ය නිශාන හඳුනාගන්න',
          color: '#EA580C',
          bgColor: '#FFF7ED',
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
          icon: 'water-outline',
          title: 'தேங்கிய நீரை அகற்றுங்கள்',
          summary: 'வீட்டைச் சுற்றி கொசு வளரும் இடங்களை அகற்றுங்கள்',
          color: '#0284C7',
          bgColor: '#F0F9FF',
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
          icon: 'home-outline',
          title: 'உங்கள் வீட்டை பாதுகாங்கள்',
          summary: 'கொசுக்கள் வீட்டில் நுழையாமல் தடுங்கள்',
          color: '#16A34A',
          bgColor: '#F0FDF4',
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
          icon: 'thermometer-outline',
          title: 'அறிகுறிகளை அறிந்துகொள்ளுங்கள்',
          summary: 'டெங்குவை ஆரம்பத்திலேயே கண்டறியுங்கள்',
          color: '#DC2626',
          bgColor: '#FEF2F2',
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
          icon: 'medical-outline',
          title: 'உடனடி சிகிச்சை',
          summary: 'அவசர சிகிச்சை தேவைப்படும் அறிகுறிகள்',
          color: '#EA580C',
          bgColor: '#FFF7ED',
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{currentContent.title}</Text>
          <Text style={styles.headerSubtitle}>{currentContent.subtitle}</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.languageContainer}>
          {[
            { key: 'english', label: 'EN' },
            { key: 'sinhala', label: 'SI' },
            { key: 'tamil', label: 'TA' },
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning-outline" size={28} color="#EF4444" style={styles.emergencyIcon} />
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Emergency Hotlines</Text>
            <Text style={styles.emergencyText}>Suwaseriya: <Text style={{ fontWeight: '800' }}>1990</Text> | Health Line: <Text style={{ fontWeight: '800' }}>1999</Text></Text>
          </View>
        </View>

        {/* Content Cards */}
        {currentContent.categories.map(category => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: COLORS.white }]}
            onPress={() => setExpandedCard(expandedCard === category.id ? null : category.id)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: category.bgColor }]}>
                <Ionicons name={category.icon} size={24} color={category.color} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>
                  {category.title}
                </Text>
                <Text style={styles.cardSummary}>{category.summary}</Text>
              </View>
              <Ionicons
                name={expandedCard === category.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.textLight}
                style={styles.expandIcon}
              />
            </View>

            {expandedCard === category.id && (
              <View style={[styles.tipsContainer, { borderTopColor: category.bgColor }]}>
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
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.footerNoteText}>
            Information provided in partnership with Sri Lanka Ministry of Health
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  headerTitleContainer: { marginBottom: 20 },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 6, fontWeight: '500' },
  languageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 60,
    alignItems: 'center',
  },
  langBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  langBtnText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  langBtnTextActive: {
    color: COLORS.primary,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginTop: -40,
  },
  emergencyBanner: {
    backgroundColor: '#FEF2F2',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  emergencyIcon: { marginRight: 14 },
  emergencyTextContainer: { flex: 1 },
  emergencyTitle: {
    fontWeight: '800',
    color: '#B91C1C',
    fontSize: 16,
    marginBottom: 4,
  },
  emergencyText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  cardSummary: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  expandIcon: { marginLeft: 8 },
  tipsContainer: {
    marginTop: 16,
    borderTopWidth: 2,
    paddingTop: 16,
    gap: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipBulletText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  tipText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 22, fontWeight: '500' },
  footerNote: {
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNoteText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  bottomSpacing: { height: 90 },
});