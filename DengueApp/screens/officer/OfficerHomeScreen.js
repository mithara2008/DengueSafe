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
        todayCases: 0,
        weeklyCases: 0,
        activeClusters: 0,
        totalDeaths: 0,
    });

    const fetchStats = async () => {
        try {
            const response = await getDashboardStats();
            const dashboardData = response.data;
            setStats({
                todayCases: dashboardData.todayCases || 0,
                weeklyCases: dashboardData.weeklyCases || 0,
                activeClusters: dashboardData.activeOutbreaks || 0,
                totalDeaths: dashboardData.totalDeaths || 0,
            });
        } catch (error) {
            console.log('Using mock officer stats');
            setStats({
                todayCases: 0,
                weeklyCases: 770,
                activeClusters: 2,
                totalDeaths: 57,
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

                {/* Field Operations */}
                <Text style={styles.sectionTitle}>Field Operations</Text>

                {/* Upload Data Card */}
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

                {/* Field Operations Unified Card */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('FieldOperations')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIconWrapper, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="clipboard-outline" size={28} color="#16A34A" />
                        </View>
                        <Text style={styles.actionTitle}>Incident Report</Text>
                        <Text style={styles.actionSubtitle}>Issue Fines & Record Spots</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <Text style={styles.sectionTitle}>National Overview</Text>
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard]}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="virus" size={24} color="#16A34A" />
                        </View>
                        <Text style={styles.statNumber}>{stats.todayCases}</Text>
                        <Text style={styles.statLabel}>Today Cases</Text>
                    </View>
                    <View style={[styles.statCard]}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="calendar-outline" size={24} color="#0EA5E9" />
                        </View>
                        <Text style={styles.statNumber}>{stats.weeklyCases}</Text>
                        <Text style={styles.statLabel}>Weekly Total</Text>
                    </View>
                    <View style={[styles.statCard]}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="skull-outline" size={24} color="#EF4444" />
                        </View>
                        <Text style={styles.statNumber}>{stats.totalDeaths}</Text>
                        <Text style={styles.statLabel}>Total Deaths</Text>
                    </View>
                    <View style={[styles.statCard]}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#F5F3FF' }]}>
                            <Ionicons name="analytics-outline" size={24} color="#8B5CF6" />
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
        backgroundColor: '#0F172A',
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
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 24,
        marginBottom: 16,
        letterSpacing: -0.2,
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
    uploadTextContainer: { flex: 1 },
    uploadTitle: { color: COLORS.white, fontSize: 18, fontWeight: '700', marginBottom: 4 },
    uploadSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },

    // New action row styles
    actionRow: {
        flexDirection: 'row',
        gap: 14,
        marginTop: 14,
    },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
    },
    actionIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '500',
        lineHeight: 16,
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
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statNumber: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    statLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
    bottomSpacing: { height: 100 },
});