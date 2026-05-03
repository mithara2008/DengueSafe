import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Platform, ScrollView, ActivityIndicator,
    TextInput, Image, Alert, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';
import { getViolations, getBreedingSpots, issueFine, recordBreedingSpot } from '../../services/api';

const DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

const SPOT_TYPES = [
    'Stagnant Water Container', 'Blocked Drain', 'Abandoned Tyre',
    'Flower Pot / Tray', 'Coconut Shell', 'Construction Site Water',
    'Roof Gutter', 'Other',
];

const VIOLATION_TYPES = [
    'Stagnant Water — Flower Pot', 'Stagnant Water — Water Tank',
    'Stagnant Water — Coconut Shell', 'Stagnant Water — Blocked Drain',
    'Uncleared Garbage', 'Abandoned Container', 'Other Breeding Site',
];

const FINE_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function FieldOperationsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('new'); // 'new', 'history'

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Field Operations</Text>
                    <Text style={styles.headerSubtitle}>Unified Incident Report</Text>
                </View>
            </View>

            {/* Custom Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'new' && styles.activeTabBtn]}
                    onPress={() => setActiveTab('new')}
                >
                    <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>New Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'history' && styles.activeTabBtn]}
                    onPress={() => setActiveTab('history')}
                >
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentArea}>
                {activeTab === 'new' && <UnifiedForm onSuccess={() => setActiveTab('history')} />}
                {activeTab === 'history' && <HistoryTab />}
            </View>
        </View>
    );
}

function UnifiedForm({ onSuccess }) {
    const [form, setForm] = useState({
        district: '', address: '',
        officerName: '', officerBadge: '',
        notes: '',
        isBreedingSpot: false,
        isFine: false,
        spotType: '', severity: 'medium',
        ownerName: '', ownerEmail: '', violationType: '', fineAmount: ''
    });
    
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission needed', 'Camera roll permission required'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, quality: 0.5, base64: true,
        });
        if (!result.canceled) setImage(result.assets[0]);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission needed', 'Camera permission required'); return; }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true, quality: 0.5, base64: true,
        });
        if (!result.canceled) setImage(result.assets[0]);
    };

    const getLocation = async () => {
        setGpsLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permission needed', 'Location permission required'); return; }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc.coords);
            Alert.alert('✅ Location captured', `${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
        } catch (e) {
            Alert.alert('Error', 'Could not get location');
        }
        setGpsLoading(false);
    };

    const handleSubmit = async () => {
        if (!form.isBreedingSpot && !form.isFine) { Alert.alert('Missing Info', 'Please select at least one action (Breeding Spot or Fine).'); return; }
        if (!form.district) { Alert.alert('Missing Info', 'District is required'); return; }
        if (!location) { Alert.alert('Missing Info', 'GPS location is required'); return; }
        if (!form.officerName) { Alert.alert('Missing Info', 'Officer name is required'); return; }

        if (form.isBreedingSpot) {
            if (!form.spotType) { Alert.alert('Missing Info', 'Spot type is required for Breeding Spot'); return; }
        }

        if (form.isFine) {
            if (!form.ownerName || !form.ownerEmail || !form.violationType || !form.fineAmount) {
                Alert.alert('Missing Info', 'Please fill all required fine details (Owner Name, Email, Violation Type, Fine Amount).'); return;
            }
        }

        setLoading(true);
        try {
            const promises = [];
            const base64Img = image?.base64 || null;

            if (form.isBreedingSpot) {
                promises.push(recordBreedingSpot({
                    district: form.district,
                    address: form.address,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    spotType: form.spotType,
                    description: form.notes,
                    severity: form.severity,
                    officerName: form.officerName,
                    imageBase64: base64Img
                }));
            }

            if (form.isFine) {
                promises.push(issueFine({
                    ownerName: form.ownerName,
                    ownerEmail: form.ownerEmail,
                    address: form.address,
                    district: form.district,
                    violationType: form.violationType,
                    fineAmount: Number(form.fineAmount),
                    notes: form.notes,
                    officerName: form.officerName,
                    officerBadge: form.officerBadge,
                    imageBase64: base64Img
                }));
            }

            await Promise.all(promises);

            Alert.alert('✅ Success', 'Report submitted successfully!',
                [{ text: 'OK', onPress: () => {
                    setForm({
                        district: '', address: '', officerName: '', officerBadge: '', notes: '',
                        isBreedingSpot: false, isFine: false, spotType: '', severity: 'medium',
                        ownerName: '', ownerEmail: '', violationType: '', fineAmount: ''
                    });
                    setImage(null);
                    setLocation(null);
                    if (onSuccess) onSuccess();
                }}]
            );
        } catch (e) {
            Alert.alert('Error', e.message || 'Failed to submit report');
        }
        setLoading(false);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            {/* Action Toggles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Report Type *</Text>
                <View style={styles.card}>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Record Breeding Spot</Text>
                        <Switch
                            trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                            thumbColor={form.isBreedingSpot ? '#16A34A' : '#F8FAFC'}
                            onValueChange={(v) => set('isBreedingSpot', v)}
                            value={form.isBreedingSpot}
                        />
                    </View>
                    <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.toggleLabel}>Issue Fine</Text>
                        <Switch
                            trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                            thumbColor={form.isFine ? '#EF4444' : '#F8FAFC'}
                            onValueChange={(v) => set('isFine', v)}
                            value={form.isFine}
                        />
                    </View>
                </View>
            </View>

            {/* Photo & Location (Common) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Evidence & Location</Text>
                <View style={styles.card}>
                    {/* Photo */}
                    <Text style={styles.label}>Photo Evidence</Text>
                    {image ? (
                        <View style={{ marginBottom: 16 }}>
                            <Image source={{ uri: image.uri }} style={styles.previewImage} />
                            <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto}>
                                <Text style={styles.retakeBtnText}>Retake Photo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                                <Text style={styles.photoBtnText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                                <Ionicons name="images-outline" size={24} color={COLORS.primary} />
                                <Text style={styles.photoBtnText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* GPS */}
                    <Text style={styles.label}>GPS Coordinates *</Text>
                    <TouchableOpacity style={styles.gpsBtn} onPress={getLocation} disabled={gpsLoading}>
                        {gpsLoading
                            ? <ActivityIndicator color={COLORS.white} />
                            : <>
                                <Ionicons name="locate-outline" size={20} color={COLORS.white} />
                                <Text style={styles.gpsBtnText}>
                                    {location ? '✅ Location Captured' : 'Capture Location'}
                                </Text>
                            </>
                        }
                    </TouchableOpacity>
                    {location && (
                        <Text style={styles.coordText}>
                            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                        </Text>
                    )}

                    {/* District */}
                    <Text style={styles.label}>District *</Text>
                    <TouchableOpacity
                        style={styles.dropdownTrigger}
                        onPress={() => setShowDistrictDropdown(!showDistrictDropdown)}
                    >
                        <Text style={[styles.dropdownTriggerText, !form.district && { color: '#A0AEC0' }]}>
                            {form.district || 'Select district...'}
                        </Text>
                        <Ionicons
                            name={showDistrictDropdown ? 'chevron-up' : 'chevron-down'}
                            size={18}
                            color={COLORS.textLight}
                        />
                    </TouchableOpacity>
                    {showDistrictDropdown && (
                        <View style={styles.dropdownList}>
                            <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                                {DISTRICTS.map((d, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.dropdownItem, form.district === d && styles.dropdownItemSelected]}
                                        onPress={() => { set('district', d); setShowDistrictDropdown(false); }}
                                    >
                                        <Text style={[styles.dropdownItemText, form.district === d && { color: COLORS.primary, fontWeight: '700' }]}>
                                            {d}
                                        </Text>
                                        {form.district === d && <Ionicons name="checkmark" size={16} color={COLORS.primary} />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Address */}
                    <Text style={styles.label}>Property / Street Address *</Text>
                    <TextInput
                        style={[styles.input, { height: 70 }]}
                        placeholder="No. 12, Main Street"
                        multiline
                        value={form.address}
                        onChangeText={v => set('address', v)}
                    />
                </View>
            </View>

            {/* Breeding Spot Details */}
            {form.isBreedingSpot && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Breeding Spot Details</Text>
                    <View style={styles.card}>
                        <Text style={styles.label}>Spot Type *</Text>
                        {SPOT_TYPES.map((type, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.optionRow, form.spotType === type && styles.optionSelected]}
                                onPress={() => set('spotType', type)}
                            >
                                <View style={[styles.radio, form.spotType === type && styles.radioSelected]}>
                                    {form.spotType === type && <View style={styles.radioDot} />}
                                </View>
                                <Text style={[styles.optionText, form.spotType === type && { color: COLORS.primary, fontWeight: '700' }]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <Text style={styles.label}>Severity Level</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {['low', 'medium', 'high'].map(s => (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.severityBtn,
                                    form.severity === s && {
                                        backgroundColor: s === 'high' ? '#EF4444' : s === 'medium' ? '#F59E0B' : '#10B981',
                                        borderColor: 'transparent',
                                    }
                                    ]}
                                    onPress={() => set('severity', s)}
                                >
                                    <Text style={[styles.severityText, form.severity === s && { color: COLORS.white }]}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Fine Details */}
            {form.isFine && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fine & Owner Details</Text>
                    <View style={styles.card}>
                        <Text style={styles.label}>Owner Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Kamal Perera"
                            value={form.ownerName}
                            onChangeText={v => set('ownerName', v)}
                        />

                        <Text style={styles.label}>Owner Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="owner@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.ownerEmail}
                            onChangeText={v => set('ownerEmail', v)}
                        />

                        <Text style={styles.label}>Violation Type *</Text>
                        {VIOLATION_TYPES.map((type, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.optionRow, form.violationType === type && styles.optionSelected]}
                                onPress={() => set('violationType', type)}
                            >
                                <View style={[styles.radio, form.violationType === type && styles.radioSelected]}>
                                    {form.violationType === type && <View style={styles.radioDot} />}
                                </View>
                                <Text style={[styles.optionText, form.violationType === type && { color: COLORS.primary, fontWeight: '700' }]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <Text style={styles.label}>Fine Amount (Rs.) *</Text>
                        <View style={styles.amountGrid}>
                            {FINE_AMOUNTS.map(amt => (
                                <TouchableOpacity
                                    key={amt}
                                    style={[styles.amountBtn, form.fineAmount === String(amt) && styles.amountSelected]}
                                    onPress={() => set('fineAmount', String(amt))}
                                >
                                    <Text style={[styles.amountText, form.fineAmount === String(amt) && { color: COLORS.white }]}>
                                        Rs. {amt.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={[styles.input, { marginTop: 12 }]}
                            placeholder="Or enter custom amount"
                            keyboardType="numeric"
                            value={form.fineAmount}
                            onChangeText={v => set('fineAmount', v)}
                        />
                    </View>
                </View>
            )}

            {/* Officer Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Officer Details & Notes</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>Officer Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        value={form.officerName}
                        onChangeText={v => set('officerName', v)}
                    />
                    <Text style={styles.label}>Badge Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="PHI-0001"
                        value={form.officerBadge}
                        onChangeText={v => set('officerBadge', v)}
                    />
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Additional observations..."
                        multiline
                        value={form.notes}
                        onChangeText={v => set('notes', v)}
                    />
                </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading
                    ? <ActivityIndicator color={COLORS.white} />
                    : <>
                        <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} />
                        <Text style={styles.submitText}>Submit Report</Text>
                    </>
                }
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

function HistoryTab() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const [violationsRes, spotsRes] = await Promise.all([
                getViolations(),
                getBreedingSpots()
            ]);

            const vList = (violationsRes.data || []).map(v => ({
                ...v,
                type: 'violation',
                sortDate: new Date(v.issuedAt).getTime(),
            }));

            const sList = (spotsRes.data || []).map(s => ({
                ...s,
                type: 'spot',
                sortDate: new Date(s.recordedAt).getTime(),
            }));

            const combined = [...vList, ...sList].sort((a, b) => b.sortDate - a.sortDate);
            setItems(combined);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (items.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={48} color={COLORS.textLight} />
                <Text style={{ marginTop: 16, color: COLORS.textLight }}>No history found</Text>
            </View>
        );
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            {items.map((item, index) => (
                <View key={item._id || index} style={styles.historyCard}>
                    <View style={[styles.iconWrapper, { backgroundColor: item.type === 'violation' ? '#FEE2E2' : '#DCFCE7' }]}>
                        <Ionicons 
                            name={item.type === 'violation' ? 'document-text' : 'camera'} 
                            size={20} 
                            color={item.type === 'violation' ? '#EF4444' : '#16A34A'} 
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.historyTitle}>
                            {item.type === 'violation' ? `Fine: Rs. ${item.fineAmount}` : 'Breeding Spot Recorded'}
                        </Text>
                        <Text style={styles.historySubtitle}>
                            {item.type === 'violation' ? item.violationType : item.spotType}
                        </Text>
                        <Text style={styles.historyDate}>
                            {new Date(item.sortDate).toLocaleString()}
                        </Text>
                    </View>
                </View>
            ))}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        backgroundColor: '#0F172A',
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 8 },
    headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
    headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 8,
        margin: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTabBtn: { backgroundColor: '#F1F5F9' },
    tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
    activeTabText: { color: '#0F172A', fontWeight: '800' },
    contentArea: { flex: 1 },
    
    // Form Styles
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    toggleRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    toggleLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textLight, marginBottom: 6, marginTop: 12 },
    input: {
        backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.text,
    },
    dropdownTrigger: {
        backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 10, padding: 12, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
    },
    dropdownTriggerText: { fontSize: 14, color: COLORS.text },
    dropdownList: {
        borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
        marginTop: 4, backgroundColor: COLORS.white, overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    dropdownItemSelected: { backgroundColor: '#F0FDF4' },
    dropdownItemText: { fontSize: 14, color: COLORS.text },
    photoButtons: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    photoBtn: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        padding: 16, borderRadius: 12, borderWidth: 2,
        borderColor: COLORS.primary, borderStyle: 'dashed', gap: 6,
    },
    photoBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
    previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 },
    retakeBtn: { backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, alignItems: 'center' },
    retakeBtnText: { color: COLORS.textLight, fontWeight: '600' },
    gpsBtn: {
        backgroundColor: COLORS.primary, borderRadius: 12, padding: 14,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    gpsBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
    coordText: { textAlign: 'center', marginTop: 8, color: COLORS.textLight, fontSize: 12 },
    optionRow: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12,
    },
    optionSelected: { backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 8 },
    optionText: { fontSize: 14, color: COLORS.text, flex: 1 },
    radio: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 2,
        borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: COLORS.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
    severityBtn: {
        flex: 1, padding: 12, borderRadius: 10, alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#F8FAFC',
    },
    severityText: { fontWeight: '700', fontSize: 13, color: COLORS.text },
    amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    amountBtn: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
        borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#F8FAFC',
    },
    amountSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    amountText: { fontSize: 13, fontWeight: '700', color: COLORS.text },
    submitBtn: {
        backgroundColor: '#0F172A', borderRadius: 16, padding: 18,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, marginTop: 10,
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
    
    // History Styles
    historyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    historySubtitle: { fontSize: 13, color: COLORS.textLight, marginBottom: 6 },
    historyDate: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
});
