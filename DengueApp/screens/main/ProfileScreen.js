import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Switch
} from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Nisadi Mithara');
  const [email, setEmail] = useState('nisadi@email.com');
  const [district, setDistrict] = useState('Colombo');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [notifications, setNotifications] = useState(true);
  const [predictionAlerts, setPredictionAlerts] = useState(true);
  const [awarenessAlerts, setAwarenessAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully! ✅');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  const stats = [
    { label: 'Alerts Received', value: '24', icon: '🔔' },
    { label: 'Areas Monitored', value: '3', icon: '📍' },
    { label: 'Days Active', value: '12', icon: '📅' },
    { label: 'Tips Read', value: '18', icon: '📚' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.headerName}>{name}</Text>
        <Text style={styles.headerDistrict}>📍 {district} District</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editBtnText}>
            {isEditing ? '✅ Save Changes' : '✏️ Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>District</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={district}
            onChangeText={setDistrict}
            editable={isEditing}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Preferred Language</Text>
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
        <Text style={styles.sectionTitle}>🔔 Notification Settings</Text>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>Push Notifications</Text>
            <Text style={styles.switchSubtitle}>Receive all app notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E0E0E0', true: COLORS.secondary }}
            thumbColor={notifications ? COLORS.primary : '#BDBDBD'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>📊 Prediction Alerts</Text>
            <Text style={styles.switchSubtitle}>ML-based outbreak forecasts for your area</Text>
          </View>
          <Switch
            value={predictionAlerts}
            onValueChange={setPredictionAlerts}
            trackColor={{ false: '#E0E0E0', true: COLORS.secondary }}
            thumbColor={predictionAlerts ? COLORS.primary : '#BDBDBD'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>💡 Awareness Tips</Text>
            <Text style={styles.switchSubtitle}>Weekly prevention reminders</Text>
          </View>
          <Switch
            value={awarenessAlerts}
            onValueChange={setAwarenessAlerts}
            trackColor={{ false: '#E0E0E0', true: COLORS.secondary }}
            thumbColor={awarenessAlerts ? COLORS.primary : '#BDBDBD'}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ App Information</Text>
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
          <Text style={styles.infoLabel}>ML Model Version</Text>
          <Text style={styles.infoValue}>v2.1 (LSTM)</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🦟 DengueSafe — Protecting Sri Lanka</Text>
        <Text style={styles.footerSubText}>Smart Mosquito Control System</Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 25,
    paddingTop: 55,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 40 },
  headerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerDistrict: {
    color: '#C8E6C9',
    fontSize: 14,
    marginTop: 4,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    padding: 15,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 9, color: COLORS.textLight, textAlign: 'center', marginTop: 2 },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 14,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  inputGroup: { marginBottom: 12 },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: COLORS.textLight,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  langBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langBtnText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  langBtnTextActive: { color: '#FFFFFF' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchTextContainer: { flex: 1 },
  switchTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  switchSubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: { fontSize: 14, color: COLORS.textLight },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', padding: 15 },
  footerText: { color: COLORS.textLight, fontSize: 13, fontWeight: '600' },
  footerSubText: { color: COLORS.textLight, fontSize: 11, marginTop: 3 },
  bottomSpacing: { height: 20 },
});