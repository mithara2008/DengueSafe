import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator, Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { getHeatmapData, getDashboardStats } from '../../services/api';
import AnimatedLoading from '../../components/AnimatedLoading';

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    todayDeaths: 0,
    highRiskAreas: 0,
    activeClusters: 0,
  });
  const [riskAreas, setRiskAreas] = useState([]);

  const fetchStats = async () => {
    try {
      const [heatmapResponse, dashboardResponse] = await Promise.all([
        getHeatmapData(),
        getDashboardStats()
      ]);

      const heatmapData = heatmapResponse;
      const dashboardData = dashboardResponse.data;

      setStats({
        totalCases: dashboardData.todayCases || 0,
        todayDeaths: dashboardData.todayDeaths || 0,
        highRiskAreas: dashboardData.highRiskAreas || 0,
        activeClusters: dashboardData.activeOutbreaks || 0,
      });

      setRiskAreas(heatmapData.slice(0, 6).map(d => ({
        district: d.district,
        cases: d.cases,
        risk: d.risk,
        color: d.risk === 'High' ? COLORS.danger :
          d.risk === 'Medium' ? COLORS.warning : COLORS.safe,
      })));
    } catch (error) {
      console.log('Using mock stats');
      setStats({
        totalCases: 1247,
        highRiskAreas: 8,
        activeClusters: 23,
        recoveries: 1089,
      });
      setRiskAreas([
        { district: 'Colombo', cases: 342, risk: 'High', color: COLORS.danger },
        { district: 'Gampaha', cases: 218, risk: 'High', color: COLORS.danger },
        { district: 'Kandy', cases: 156, risk: 'Medium', color: COLORS.warning },
        { district: 'Kurunegala', cases: 134, risk: 'Medium', color: COLORS.warning },
        { district: 'Galle', cases: 89, risk: 'Low', color: COLORS.safe },
        { district: 'Matara', cases: 67, risk: 'Low', color: COLORS.safe },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (loading) {
    return <AnimatedLoading message="Fetching real-time stats..." />;
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
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>DengueSafe</Text>
          <Text style={styles.headerSubtitle}>Sri Lanka Disease Monitor</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertIconContainer}>
            <Ionicons name="warning" size={24} color={COLORS.accent} />
          </View>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Active Outbreak Alert</Text>
            <Text style={styles.alertText}>
              High risk detected in Colombo & Gampaha districts
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="virus" size={24} color={COLORS.danger} />
            </View>
            <Text style={styles.statNumber}>{stats.totalCases}</Text>
            <Text style={styles.statLabel}>Total Cases</Text>
          </View>
          <View style={[styles.statCard]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="skull-outline" size={24} color="#374151" />
            </View>
            <Text style={styles.statNumber}>{stats.todayDeaths}</Text>
            <Text style={styles.statLabel}>Total Deaths</Text>
          </View>
          <View style={[styles.statCard]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="location-outline" size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.statNumber}>{stats.highRiskAreas}</Text>
            <Text style={styles.statLabel}>High Risk Areas</Text>
          </View>
          <View style={[styles.statCard]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="analytics-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.statNumber}>{stats.activeClusters}</Text>
            <Text style={styles.statLabel}>Active Clusters</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Heatmap')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="map-outline" size={28} color="#0284C7" />
            </View>
            <Text style={styles.actionText}>Heatmap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Alerts')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#FFEDD5' }]}>
              <Ionicons name="notifications-outline" size={28} color="#EA580C" />
            </View>
            <Text style={styles.actionText}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="chatbubbles-outline" size={28} color="#9333EA" />
            </View>
            <Text style={styles.actionText}>Chatbot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Awareness')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="book-outline" size={28} color="#16A34A" />
            </View>
            <Text style={styles.actionText}>Awareness</Text>
          </TouchableOpacity>
        </View>

        {/* Risk Areas */}
        <Text style={styles.sectionTitle}>District Risk Levels (This Week)</Text>
        <View style={styles.riskContainer}>
          {riskAreas.map((area, index) => (
            <View key={index} style={[styles.riskRow, index === riskAreas.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.riskBadge, { backgroundColor: area.color + '20' }]}>
                <Text style={[styles.riskBadgeText, { color: area.color }]}>{area.risk}</Text>
              </View>
              <Text style={styles.districtName}>{area.district}</Text>
              <Text style={styles.caseCount}>{area.cases} cases</Text>
            </View>
          ))}
        </View>

        {/* Prevention Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
            <Text style={styles.tipTitle}>Prevention Tip of the Day</Text>
          </View>
          <Text style={styles.tipText}>
            Remove stagnant water from flower pots, coconut shells, and water
            tanks around your home. Mosquitoes breed in still water!
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 4, fontWeight: '500' },
  headerTitle: { color: COLORS.white, fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4, fontWeight: '400' },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 12,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -15, // Overlap effect
  },
  alertBanner: {
    backgroundColor: '#FFFBEB',
    marginTop: 35,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  alertIconContainer: { marginRight: 12, padding: 8, backgroundColor: '#FEF3C7', borderRadius: 12 },
  alertTextContainer: { flex: 1 },
  alertTitle: { fontWeight: '700', color: COLORS.accent, fontSize: 15, marginBottom: 4 },
  alertText: { color: COLORS.text, fontSize: 13, lineHeight: 18 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  statNumber: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '23%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  riskContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  riskBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 14,
    width: 75,
    alignItems: 'center',
  },
  riskBadgeText: { fontSize: 12, fontWeight: '700' },
  districtName: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '600' },
  caseCount: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  tipCard: {
    backgroundColor: '#F0FDF4',
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipTitle: { fontWeight: '700', color: COLORS.primary, fontSize: 16, marginLeft: 8 },
  tipText: { color: COLORS.text, fontSize: 14, lineHeight: 22, fontWeight: '400' },
  bottomSpacing: { height: 30 },
});