import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/colors';
import { getFacilities, submitCaseReport } from '../../services/api';

const DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
    'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
    'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
];

export default function UploadDataScreen({ navigation }) {
    const [district, setDistrict] = useState('Colombo');
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [caseCount, setCaseCount] = useState('');
    const [deathCount, setDeathCount] = useState('0');
    const [loading, setLoading] = useState(false);
    const [fetchingFacilities, setFetchingFacilities] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Load facilities when district changes
    useEffect(() => {
        fetchFacilitiesForDistrict();
    }, [district]);

    const fetchFacilitiesForDistrict = async () => {
        setFetchingFacilities(true);
        try {
            const response = await getFacilities(district);
            const facilityList = response.data || [];
            setFacilities(facilityList);
            if (facilityList.length > 0) {
                setSelectedFacility(facilityList[0]);
            } else {
                setSelectedFacility(null);
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
            setFacilities([]);
        } finally {
            setFetchingFacilities(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFacility) {
            Alert.alert('Error', 'Please select a health facility');
            return;
        }
        if (!caseCount || isNaN(caseCount)) {
            Alert.alert('Error', 'Please enter a valid number of cases');
            return;
        }

        setLoading(true);
        try {
            const reportData = {
                hospitalId: selectedFacility.hospitalId,
                hospitalName: selectedFacility.name,
                district: selectedFacility.district,
                province: selectedFacility.province || '',
                diseaseType: 'dengue',
                caseCount: parseInt(caseCount),
                deathCount: parseInt(deathCount) || 0,
                reportedAt: date,
                verified: false, // For PHI verification process
                source: 'MobileApp_PHI'
            };

            await submitCaseReport(reportData);

            Alert.alert(
                'Submission Successful',
                'Report has been submitted to the National Database and is pending verification.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={styles.iconCircle}>
                        <Ionicons name="document-text-outline" size={40} color="#0F172A" />
                    </View>
                    <Text style={styles.title}>Health Report</Text>
                    <Text style={styles.subtitle}>Official Case Submission Portal</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>New Entry</Text>
                    <Text style={styles.subText}>Submit verified field data for national records.</Text>

                    {/* District Selection */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>District</Text>
                        <View style={[styles.inputContainer, { paddingHorizontal: 0 }]}>
                            <Ionicons name="location-outline" size={20} color={COLORS.textLight} style={[styles.inputIcon, { marginLeft: 16 }]} />
                            <Picker
                                selectedValue={district}
                                onValueChange={(itemValue) => setDistrict(itemValue)}
                                style={{ flex: 1, color: COLORS.text, marginLeft: -8 }}
                            >
                                {DISTRICTS.map((d) => (
                                    <Picker.Item key={d} label={d} value={d} color={COLORS.text} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Facility Selection (Dynamic) */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Health Facility / MOH Unit</Text>
                        <View style={[styles.inputContainer, { paddingHorizontal: 0 }]}>
                            <Ionicons name="business-outline" size={20} color={COLORS.textLight} style={[styles.inputIcon, { marginLeft: 16 }]} />
                            {fetchingFacilities ? (
                                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 10 }} />
                            ) : (
                                <Picker
                                    selectedValue={selectedFacility ? selectedFacility.hospitalId : ''}
                                    onValueChange={(id) => {
                                        const facility = facilities.find(f => f.hospitalId === id);
                                        setSelectedFacility(facility);
                                    }}
                                    style={{ flex: 1, color: COLORS.text, marginLeft: -8 }}
                                >
                                    {facilities.length > 0 ? (
                                        facilities.map((f) => (
                                            <Picker.Item key={f.hospitalId} label={f.name} value={f.hospitalId} color={COLORS.text} />
                                        ))
                                    ) : (
                                        <Picker.Item label="No facilities found" value="" color={COLORS.textLight} />
                                    )}
                                </Picker>
                            )}
                        </View>
                    </View>

                    {/* Case Counts */}
                    <View style={styles.row}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Total Cases</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="people-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Count"
                                    value={caseCount}
                                    onChangeText={setCaseCount}
                                    keyboardType="numeric"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>
                        <View style={[styles.inputWrapper, { flex: 1 }]}>
                            <Text style={styles.label}>Deaths</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="sad-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Count"
                                    value={deathCount}
                                    onChangeText={setDeathCount}
                                    keyboardType="numeric"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Submission Date</Text>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: COLORS.textLight }]}
                                value={date}
                                editable={false}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUpload}
                        disabled={loading || fetchingFacilities}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.uploadButtonText}>Submit for Verification</Text>
                        )}
                        {!loading && <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.white} style={styles.btnIcon} />}
                    </TouchableOpacity>
                </View>

                {/* Info Card */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={24} color="#1E40AF" />
                    <Text style={styles.infoBoxText}>
                        Data submitted via this portal will enter the 'Verification Queue' for regional supervisors before appearing on the public map.
                    </Text>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContainer: { flexGrow: 1 },
    header: {
        backgroundColor: '#0F172A',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 70 : 60,
        paddingBottom: 60,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 50,
        left: 20,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    iconCircle: {
        backgroundColor: COLORS.white,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
    subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 6, fontWeight: '500' },
    formContainer: {
        backgroundColor: COLORS.card,
        marginHorizontal: 20,
        marginTop: -30,
        borderRadius: 24,
        padding: 24,
        paddingTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 8,
    },
    row: { flexDirection: 'row' },
    welcomeText: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    subText: { fontSize: 14, color: COLORS.textLight, marginBottom: 25 },
    inputWrapper: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputDisabled: {
        backgroundColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
    uploadButton: {
        backgroundColor: '#0F172A',
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    uploadButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    btnIcon: { marginLeft: 8 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        alignItems: 'center',
    },
    infoBoxText: {
        flex: 1,
        marginLeft: 12,
        color: '#1E40AF',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500',
    },
    bottomSpacing: { height: 40 },
});
