//import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { getHeatmapData } from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    highRiskAreas: 0,
    activeClusters: 0,
    recoveries: 0,
  });
  const [riskAreas, setRiskAreas] = useState([]);

  const fetchStats = async () => {
    try {
      const data = await getHeatmapData();
      const total = data.reduce((sum, d) => sum + d.cases, 0);
      const high = data.filter(d => d.risk === 'High').length;
      setStats({
        totalCases: total,
        highRiskAreas: high,
        activeClusters: 23,
        recoveries: Math.floor(total * 0.87),
      });
      setRiskAreas(data.slice(0, 6).map(d => ({
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>DengueSafe</Text>
          <Text style={styles.headerSubtitle}>Sri Lanka Disease Monitor</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Alert Banner */}
      <View style={styles.alertBanner}>
        <Text style={styles.alertIcon}>⚠️</Text>
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
        <View style={[styles.statCard, { borderTopColor: COLORS.danger }]}>
          <Text style={styles.statNumber}>{stats.totalCases}</Text>
          <Text style={styles.statLabel}>Total Cases</Text>
          <Text style={styles.statIcon}>🦟</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.warning }]}>
          <Text style={styles.statNumber}>{stats.highRiskAreas}</Text>
          <Text style={styles.statLabel}>High Risk Areas</Text>
          <Text style={styles.statIcon}>📍</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.accent }]}>
          <Text style={styles.statNumber}>{stats.activeClusters}</Text>
          <Text style={styles.statLabel}>Active Clusters</Text>
          <Text style={styles.statIcon}>🔴</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.safe }]}>
          <Text style={styles.statNumber}>{stats.recoveries}</Text>
          <Text style={styles.statLabel}>Recoveries</Text>
          <Text style={styles.statIcon}>💚</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Heatmap')}
        >
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>View Heatmap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Alerts')}
        >
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>View Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Text style={styles.actionIcon}>🤖</Text>
          <Text style={styles.actionText}>Ask Chatbot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Awareness')}
        >
          <Text style={styles.actionIcon}>📚</Text>
          <Text style={styles.actionText}>Awareness</Text>
        </TouchableOpacity>
      </View>

      {/* Risk Areas */}
      <Text style={styles.sectionTitle}>District Risk Levels</Text>
      <View style={styles.riskContainer}>
        {riskAreas.map((area, index) => (
          <View key={index} style={styles.riskRow}>
            <View style={[styles.riskBadge, { backgroundColor: area.color }]}>
              <Text style={styles.riskBadgeText}>{area.risk}</Text>
            </View>
            <Text style={styles.districtName}>{area.district}</Text>
            <Text style={styles.caseCount}>{area.cases} cases</Text>
          </View>
        ))}
      </View>

      {/* Prevention Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Prevention Tip of the Day</Text>
        <Text style={styles.tipText}>
          Remove stagnant water from flower pots, coconut shells, and water
          tanks around your home. Mosquitoes breed in still water!
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  greeting: { color: '#C8E6C9', fontSize: 14 },
  headerTitle: { color: COLORS.white, fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 12 },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 10,
  },
  profileIcon: { fontSize: 22 },
  alertBanner: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  alertIcon: { fontSize: 24, marginRight: 10 },
  alertTextContainer: { flex: 1 },
  alertTitle: { fontWeight: 'bold', color: COLORS.accent, fontSize: 14 },
  alertText: { color: COLORS.text, fontSize: 12, marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    borderTopWidth: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  statIcon: { fontSize: 20, position: 'absolute', top: 15, right: 15 },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: { fontSize: 30, marginBottom: 8 },
  actionText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  riskContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  riskBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
    width: 70,
    alignItems: 'center',
  },
  riskBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  districtName: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '500' },
  caseCount: { fontSize: 13, color: COLORS.textLight },
  tipCard: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipTitle: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14, marginBottom: 8 },
  tipText: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  bottomSpacing: { height: 20 },
});