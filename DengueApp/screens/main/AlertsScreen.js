import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { getAlerts } from '../../services/api';
import AnimatedLoading from '../../components/AnimatedLoading';

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
      icon: 'trending-up-outline',
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
      icon: 'warning-outline',
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
      icon: 'analytics-outline',
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
      icon: 'bulb-outline',
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
      icon: 'shield-checkmark-outline',
      tips: ['Keep up good practices', 'Report any cases to health authorities'],
    },
  ];

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      const coloredData = data.map(alert => ({
        ...alert,
        icon: alert.risk === 'High' ? 'warning-outline' : alert.risk === 'Medium' ? 'analytics-outline' : 'shield-checkmark-outline',
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
    return <AnimatedLoading message="Loading alerts..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
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
        <Text style={styles.headerTitle}>Alerts & Predictions</Text>
        <Text style={styles.headerSubtitle}>
          Predictive alerts based on ML analysis — stay safe, not scared!
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Important Notice */}
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={24} color="#0284C7" style={styles.noticeIcon} />
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
                <View style={[styles.iconWrapper, { backgroundColor: alert.riskColor + '20' }]}>
                  <Ionicons name={alert.icon || 'notifications-outline'} size={22} color={alert.riskColor} />
                </View>
                <View style={styles.alertTitleContainer}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: alert.riskColor + '20' }]}>
                  <Text style={[styles.riskBadgeText, { color: alert.riskColor }]}>{alert.risk}</Text>
                </View>
              </View>

              <View style={styles.districtRow}>
                <Ionicons name="location" size={14} color={COLORS.textLight} style={styles.districtIcon} />
                <Text style={styles.districtText}>{alert.district}</Text>
              </View>

              <Text style={styles.alertMessage} numberOfLines={3}>{alert.message}</Text>

              {alert.tips && alert.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <View style={styles.tipsHeader}>
                    <Ionicons name="leaf-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.tipsTitle}>What you can do:</Text>
                  </View>
                  {alert.tips.map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <View style={styles.tipBullet} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </View>
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
  loadingText: { marginTop: 12, color: COLORS.textLight, fontSize: 16, fontWeight: '500' },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    paddingBottom: 40,
  },
  headerTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 6, lineHeight: 20 },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  noticeBanner: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  noticeIcon: { marginRight: 12 },
  noticeText: { flex: 1, fontSize: 13, color: '#0369A1', lineHeight: 20, fontWeight: '500' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  activeTabText: { color: COLORS.white, fontWeight: '700' },
  alertsList: { paddingBottom: 20 },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTitleContainer: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  alertTime: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  riskBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  riskBadgeText: { fontSize: 12, fontWeight: '800' },
  districtRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  districtIcon: { marginRight: 6 },
  districtText: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  alertMessage: { fontSize: 14, color: COLORS.text, lineHeight: 22, marginBottom: 16 },
  tipsContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginLeft: 6 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tipBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 8 },
  tipText: { fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 18 },
  bottomSpacing: { height: 90 },
});