import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Switch,
  Platform, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [notifications, setNotifications] = useState(true);
  const [predictionAlerts, setPredictionAlerts] = useState(true);
  const [awarenessAlerts, setAwarenessAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setName(userData.name || 'User');
        setEmail(userData.email || '');
        setDistrict(userData.district || 'Colombo');
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'user']);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const stats = [
    { label: 'Alerts', value: '24', icon: 'notifications-outline', color: '#F59E0B' },
    { label: 'Monitored', value: '3', icon: 'location-outline', color: '#10B981' },
    { label: 'Days Active', value: '12', icon: 'calendar-outline', color: '#3B82F6' },
    { label: 'Tips Read', value: '18', icon: 'book-outline', color: '#8B5CF6' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={45} color={COLORS.primary} />
        </View>
        <Text style={styles.headerName}>{name}</Text>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={14} color={COLORS.white} />
          <Text style={styles.headerDistrict}>{district} District</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={16} color={COLORS.white} style={{ marginRight: 6 }} />
          <Text style={styles.editBtnText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconWrapper, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
              <TextInput
                style={[styles.input, !isEditing && { color: COLORS.textLight }]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
              <TextInput
                style={[styles.input, !isEditing && { color: COLORS.textLight }]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
              <TextInput
                style={[styles.input, !isEditing && { color: COLORS.textLight }]}
                value={phone}
                onChangeText={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>District</Text>
            <View style={[styles.inputContainer, !isEditing && styles.inputDisabled]}>
              <TextInput
                style={[styles.input, !isEditing && { color: COLORS.textLight }]}
                value={district}
                onChangeText={setDistrict}
                editable={isEditing}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.sectionTitle}>Preferred Language</Text>
          </View>
          <View style={styles.languageRow}>
            {['English', 'සිංහල', 'தமிழ்'].map(lang => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtn,
                  selectedLanguage === lang && styles.langBtnActive
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text style={[
                  styles.langBtnText,
                  selectedLanguage === lang && styles.langBtnTextActive
                ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.sectionTitle}>Notification Settings</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Push Notifications</Text>
              <Text style={styles.switchSubtitle}>Receive all app notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E2E8F0', true: COLORS.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFF' : notifications ? COLORS.primary : '#F8FAFC'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Prediction Alerts</Text>
              <Text style={styles.switchSubtitle}>ML-based outbreak forecasts</Text>
            </View>
            <Switch
              value={predictionAlerts}
              onValueChange={setPredictionAlerts}
              trackColor={{ false: '#E2E8F0', true: COLORS.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFF' : predictionAlerts ? COLORS.primary : '#F8FAFC'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Awareness Tips</Text>
              <Text style={styles.switchSubtitle}>Weekly prevention reminders</Text>
            </View>
            <Switch
              value={awarenessAlerts}
              onValueChange={setAwarenessAlerts}
              trackColor={{ false: '#E2E8F0', true: COLORS.secondary }}
              thumbColor={Platform.OS === 'ios' ? '#FFF' : awarenessAlerts ? COLORS.primary : '#F8FAFC'}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data Source</Text>
            <Text style={styles.infoValue}>Sri Lanka MOH</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>Today</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ML Model</Text>
            <Text style={styles.infoValue}>v2.1 (LSTM)</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DengueSafe — Protecting Sri Lanka</Text>
          <Text style={styles.footerSubText}>Smart Mosquito Control System</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  headerDistrict: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '23%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 4, fontWeight: '600' },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  langBtnText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  langBtnTextActive: { color: COLORS.white, fontWeight: '700' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchTextContainer: { flex: 1, paddingRight: 10 },
  switchTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  switchSubtitle: { fontSize: 13, color: COLORS.textLight },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', padding: 15, opacity: 0.7 },
  footerText: { color: COLORS.textLight, fontSize: 13, fontWeight: '600' },
  footerSubText: { color: COLORS.textLight, fontSize: 11, marginTop: 4 },
  bottomSpacing: { height: 30 },
});