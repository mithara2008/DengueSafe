import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl, Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { getDashboardStats } from '../../services/api';
import AnimatedLoading from '../../components/AnimatedLoading';

export default function OfficerHomeScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCases: 0,
        todayDeaths: 0,
        highRiskAreas: 0,
        activeClusters: 0,
    });

    const fetchStats = async () => {
        try {
            const response = await getDashboardStats();
            const dashboardData = response.data; // Web backend wraps it in { success: true, data: ... }
            setStats({
                totalCases: dashboardData.todayCases || 0,
                todayDeaths: dashboardData.todayDeaths || 0,
                highRiskAreas: dashboardData.highRiskAreas || 0,
                activeClusters: dashboardData.activeOutbreaks || 0,
            });
        } catch (error) {
            console.log('Using mock officer stats');
            setStats({
                totalCases: 1247,
                todayDeaths: 2,
                highRiskAreas: 8,
                activeClusters: 23,
            });
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
        return <AnimatedLoading message="Fetching officer dashboard..." />;
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
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>PHI Portal 👋</Text>
                        <Text style={styles.headerTitle}>Officer Dashboard</Text>
                        <Text style={styles.headerSubtitle}>Manage & Upload Health Data</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="person-circle" size={32} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Field Operations</Text>
                <TouchableOpacity
                    style={styles.uploadCard}
                    onPress={() => navigation.navigate('UploadData')}
                    activeOpacity={0.8}
                >
                    <View style={styles.uploadIconContainer}>
                        <Ionicons name="cloud-upload-outline" size={36} color={COLORS.white} />
                    </View>
                    <View style={styles.uploadTextContainer}>
                        <Text style={styles.uploadTitle}>Upload Data Manually</Text>
                        <Text style={styles.uploadSubtitle}>Submit new confirmed dengue cases into the system.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
                </TouchableOpacity>

                {/* Stats Cards */}
                <Text style={styles.sectionTitle}>National Overview (Today)</Text>
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

                <View style={styles.bottomSpacing} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        backgroundColor: '#0F172A', // Dark professional blue for officer portal
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 4, fontWeight: '700' },
    headerTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
    headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontWeight: '400' },
    profileButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 4,
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: -10,
    },
    uploadCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
    },
    uploadIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    uploadTextContainer: {
        flex: 1,
    },
    uploadTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    uploadSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        lineHeight: 18,
    },
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
        width: '48%',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    iconWrapper: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    statNumber: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    statLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
    bottomSpacing: { height: 100 },
});
