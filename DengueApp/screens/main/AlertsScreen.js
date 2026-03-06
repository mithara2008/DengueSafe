import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { getAlerts } from '../../services/api';

export default function AlertsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockAlerts = [
    {
      id: 1,
      type: 'prediction',
      title: 'Dengue Risk May Increase',
      message: 'Based on recent rainfall and temperature data, dengue cases in Colombo district may increase over the next 7 days. Please take preventive measures.',
      district: 'Colombo',
      risk: 'High',
      riskColor: COLORS.danger,
      time: '2 hours ago',
      icon: '📈',
      tips: ['Remove stagnant water', 'Use mosquito repellent', 'Wear long sleeves'],
    },
    {
      id: 2,
      type: 'prediction',
      title: 'Elevated Risk Forecast',
      message: 'Environmental conditions in Gampaha suggest a possible rise in mosquito activity. Stay alert and follow prevention guidelines.',
      district: 'Gampaha',
      risk: 'High',
      riskColor: COLORS.danger,
      time: '5 hours ago',
      icon: '⚠️',
      tips: ['Check water containers', 'Use bed nets at night', 'Keep surroundings clean'],
    },
    {
      id: 3,
      type: 'prediction',
      title: 'Moderate Risk Advisory',
      message: 'Kandy district shows moderate dengue risk patterns for the coming week based on historical data and current weather conditions.',
      district: 'Kandy',
      risk: 'Medium',
      riskColor: COLORS.warning,
      time: '1 day ago',
      icon: '📊',
      tips: ['Monitor symptoms', 'Clean gutters', 'Avoid outdoor activities at dawn/dusk'],
    },
    {
      id: 4,
      type: 'awareness',
      title: 'Weekly Prevention Reminder',
      message: 'This week focus on checking and emptying any containers that may hold water around your home and neighborhood.',
      district: 'All Districts',
      risk: 'Info',
      riskColor: COLORS.primary,
      time: '2 days ago',
      icon: '💡',
      tips: ['Inspect flower pots', 'Check roof gutters', 'Empty unused containers'],
    },
    {
      id: 5,
      type: 'prediction',
      title: 'Low Risk — Stay Cautious',
      message: 'Galle district currently shows low dengue risk. Continue preventive practices to maintain this status.',
      district: 'Galle',
      risk: 'Low',
      riskColor: COLORS.safe,
      time: '3 days ago',
      icon: '✅',
      tips: ['Keep up good practices', 'Report any cases to health authorities'],
    },
  ];

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      // Add riskColor based on risk level
      const coloredData = data.map(alert => ({
        ...alert,
        riskColor:
          alert.risk === 'High' ? COLORS.danger :
          alert.risk === 'Medium' ? COLORS.warning :
          alert.risk === 'Low' ? COLORS.safe : COLORS.primary,
      }));
      setAlerts(coloredData);
    } catch (error) {
      console.log('Using mock alerts');
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const filteredAlerts = activeTab === 'all'
    ? alerts
    : alerts.filter(a => a.type === activeTab);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Alerts & Predictions</Text>
        <Text style={styles.headerSubtitle}>
          Predictive alerts based on ML analysis — stay safe, not scared!
        </Text>
      </View>

      {/* Important Notice */}
      <View style={styles.noticeBanner}>
        <Text style={styles.noticeIcon}>ℹ️</Text>
        <Text style={styles.noticeText}>
          These alerts are predictive forecasts to help you stay prepared. They are not confirmed outbreak announcements.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['all', 'prediction', 'awareness'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? 'All' : tab === 'prediction' ? 'Predictions' : 'Awareness'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <View style={styles.alertsList}>
        {filteredAlerts.map((alert, index) => (
          <View key={alert.id || index} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>{alert.icon}</Text>
              <View style={styles.alertTitleContainer}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: alert.riskColor }]}>
                <Text style={styles.riskBadgeText}>{alert.risk}</Text>
              </View>
            </View>

            <View style={styles.districtRow}>
              <Text style={styles.districtIcon}>📍</Text>
              <Text style={styles.districtText}>{alert.district}</Text>
            </View>

            <Text style={styles.alertMessage}>{alert.message}</Text>

            {alert.tips && alert.tips.length > 0 && (
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>🌿 What you can do:</Text>
                {alert.tips.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 10, color: COLORS.textLight, fontSize: 14 },
  header: {
    backgroundColor: COLORS.primary,
    padding: 25,
    paddingTop: 55,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 12, marginTop: 5, lineHeight: 18 },
  noticeBanner: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  noticeIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  noticeText: { flex: 1, fontSize: 12, color: '#1565C0', lineHeight: 18 },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  activeTabText: { color: COLORS.white },
  alertsList: { paddingHorizontal: 15 },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  alertIcon: { fontSize: 24, marginRight: 10 },
  alertTitleContainer: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  alertTime: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  riskBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  riskBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  districtRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  districtIcon: { fontSize: 12, marginRight: 4 },
  districtText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  alertMessage: { fontSize: 13, color: COLORS.text, lineHeight: 20, marginBottom: 12 },
  tipsContainer: { backgroundColor: '#F1F8E9', borderRadius: 8, padding: 10 },
  tipsTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginBottom: 6 },
  tipRow: { flexDirection: 'row', marginBottom: 4 },
  tipBullet: { color: COLORS.primary, marginRight: 6, fontSize: 13 },
  tipText: { fontSize: 12, color: COLORS.text, flex: 1 },
  bottomSpacing: { height: 20 },
});