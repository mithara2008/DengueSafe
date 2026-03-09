import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, ActivityIndicator,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { getHeatmapData } from '../../services/api';
import AnimatedLoading from '../../components/AnimatedLoading';

const { width } = Dimensions.get('window');

export default function HeatmapScreen() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [outbreakData, setOutbreakData] = useState([]);

  const mockData = [
    { id: 1, district: 'Colombo', latitude: 6.9271, longitude: 79.8612, cases: 342, risk: 'High', color: COLORS.danger, radius: 8000, predictedNextWeek: 380, trend: '↑', rainfall: '245mm', temp: '31°C' },
    { id: 2, district: 'Gampaha', latitude: 7.0917, longitude: 79.9997, cases: 218, risk: 'High', color: COLORS.danger, radius: 7000, predictedNextWeek: 245, trend: '↑', rainfall: '198mm', temp: '30°C' },
    { id: 3, district: 'Kalutara', latitude: 6.5854, longitude: 79.9607, cases: 178, risk: 'High', color: COLORS.danger, radius: 6500, predictedNextWeek: 190, trend: '↑', rainfall: '210mm', temp: '30°C' },
    { id: 4, district: 'Kandy', latitude: 7.2906, longitude: 80.6337, cases: 156, risk: 'Medium', color: COLORS.warning, radius: 6000, predictedNextWeek: 160, trend: '→', rainfall: '156mm', temp: '27°C' },
    { id: 5, district: 'Kurunegala', latitude: 7.4863, longitude: 80.3647, cases: 134, risk: 'Medium', color: COLORS.warning, radius: 5500, predictedNextWeek: 140, trend: '→', rainfall: '145mm', temp: '29°C' },
    { id: 6, district: 'Ratnapura', latitude: 6.7056, longitude: 80.3847, cases: 98, risk: 'Medium', color: COLORS.warning, radius: 5000, predictedNextWeek: 95, trend: '↓', rainfall: '320mm', temp: '28°C' },
    { id: 7, district: 'Galle', latitude: 6.0535, longitude: 80.2210, cases: 89, risk: 'Low', color: COLORS.safe, radius: 4000, predictedNextWeek: 85, trend: '↓', rainfall: '178mm', temp: '29°C' },
    { id: 8, district: 'Matara', latitude: 5.9549, longitude: 80.5550, cases: 67, risk: 'Low', color: COLORS.safe, radius: 3500, predictedNextWeek: 60, trend: '↓', rainfall: '165mm', temp: '29°C' },
    { id: 9, district: 'Jaffna', latitude: 9.6615, longitude: 80.0255, cases: 45, risk: 'Low', color: COLORS.safe, radius: 3000, predictedNextWeek: 50, trend: '→', rainfall: '67mm', temp: '32°C' },
  ];

  const fetchHeatmap = async () => {
    try {
      const data = await getHeatmapData();
      const coloredData = data.map(d => ({
        ...d,
        color: d.risk === 'High' ? COLORS.danger :
          d.risk === 'Medium' ? COLORS.warning : COLORS.safe,
        radius: d.risk === 'High' ? 8000 :
          d.risk === 'Medium' ? 6000 : 4000,
      }));
      setOutbreakData(coloredData);
    } catch (error) {
      console.log('Using mock heatmap data');
      setOutbreakData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeatmap(); }, []);

  const filteredData = filterRisk === 'all'
    ? outbreakData
    : outbreakData.filter(d => d.risk.toLowerCase() === filterRisk);

  const totalCases = outbreakData.reduce((sum, d) => sum + d.cases, 0);
  const highRisk = outbreakData.filter(d => d.risk === 'High').length;
  const mediumRisk = outbreakData.filter(d => d.risk === 'Medium').length;
  const lowRisk = outbreakData.filter(d => d.risk === 'Low').length;

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {zoomControl: false}).setView([7.8731, 80.7718], 7.5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        var areas = ${JSON.stringify(filteredData.map(a => ({
    lat: a.latitude,
    lng: a.longitude,
    district: a.district,
    cases: a.cases,
    risk: a.risk,
    color: a.color,
    radius: a.radius,
    predicted: a.predictedNextWeek,
    rainfall: a.rainfall,
    temp: a.temp,
  })))};

        areas.forEach(function(area) {
          L.circle([area.lat, area.lng], {
            color: area.color,
            fillColor: area.color,
            fillOpacity: 0.35,
            radius: area.radius,
            weight: 2
          }).addTo(map);

          var markerHtml = '<div style="position:absolute; transform:translate(-50%, -50%); background:' + area.color + ';color:white;padding:4px 8px;border-radius:12px;font-weight:700;font-size:11px;border:1px solid white;white-space:nowrap;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);">' + area.cases + '</div>';
          var icon = L.divIcon({ html: markerHtml, className: '', iconSize: [0, 0], iconAnchor: [0, 0] });

          L.marker([area.lat, area.lng], { icon: icon })
            .addTo(map)
            .bindPopup(
              '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-width:160px;padding:5px;">' +
              '<b style="font-size:15px;color:#1e293b;">' + area.district + ' District</b><br><br>' +
              '<span style="color:' + area.color + ';font-weight:700;background:' + area.color + '15;padding:4px 8px;border-radius:12px;display:inline-block;margin-bottom:10px;">' + area.risk + ' Risk</span><br>' +
              '<div style="font-size:13px;color:#64748b;line-height:1.6;">' +
              'Real Cases (This Week): <b style="color:#0f172a;">' + area.cases + '</b><br>' +
              'Predicted (Next 7d): <b style="color:#f59e0b;">' + area.predicted + '</b><br>' +
              'Rainfall: <b style="color:#0f172a;">' + area.rainfall + '</b><br>' +
              'Temperature: <b style="color:#0f172a;">' + area.temp + '</b>' +
              '</div></div>'
            );
        });
      </script>
    </body>
    </html>
  `;

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'high', 'medium', 'low'].map(level => {
        const isActive = filterRisk === level;
        let btnColor = COLORS.primary;
        if (level === 'high') btnColor = COLORS.danger;
        else if (level === 'medium') btnColor = COLORS.warning;
        else if (level === 'low') btnColor = COLORS.safe;

        return (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterBtn,
              isActive && { backgroundColor: btnColor, borderColor: btnColor }
            ]}
            onPress={() => setFilterRisk(level)}
          >
            <Text style={[
              styles.filterText,
              isActive && styles.filterTextActive,
              isActive && { color: COLORS.white }
            ]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (loading) {
    return <AnimatedLoading message="Mapping outbreaks..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Outbreak Heatmap</Text>
          <Text style={styles.headerSubtitle}>Real-time District Risk (This Week)</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? COLORS.primary : COLORS.white} style={{ marginRight: 4 }} />
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={16} color={viewMode === 'map' ? COLORS.primary : COLORS.white} style={{ marginRight: 4 }} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          <View style={styles.mapFilterOverlay}><FilterButtons /></View>
          <WebView
            source={{ html: mapHTML }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.danger, shadowColor: COLORS.danger }]} />
              <Text style={styles.legendText}>High</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.warning, shadowColor: COLORS.warning }]} />
              <Text style={styles.legendText}>Medium</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.safe, shadowColor: COLORS.safe }]} />
              <Text style={styles.legendText}>Low</Text>
            </View>
          </View>
        </View>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainerWrapper}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard]}>
              <Text style={[styles.summaryNumber, { color: COLORS.danger }]}>{highRisk}</Text>
              <Text style={styles.summaryLabel}>High Risk</Text>
            </View>
            <View style={[styles.summaryCard]}>
              <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>{mediumRisk}</Text>
              <Text style={styles.summaryLabel}>Medium</Text>
            </View>
            <View style={[styles.summaryCard]}>
              <Text style={[styles.summaryNumber, { color: COLORS.safe }]}>{lowRisk}</Text>
              <Text style={styles.summaryLabel}>Low Risk</Text>
            </View>
            <View style={[styles.summaryCard]}>
              <Text style={[styles.summaryNumber, { color: COLORS.primary }]}>{totalCases}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>

          <FilterButtons />

          <View style={styles.riskBarContainer}>
            <Text style={styles.riskBarTitle}>Risk Distribution</Text>
            <View style={styles.riskBar}>
              <View style={[styles.riskBarSegment, { flex: highRisk, backgroundColor: COLORS.danger }]} />
              <View style={[styles.riskBarSegment, { flex: mediumRisk, backgroundColor: COLORS.warning }]} />
              <View style={[styles.riskBarSegment, { flex: lowRisk, backgroundColor: COLORS.safe }]} />
            </View>
            <View style={styles.riskBarLabels}>
              <Text style={[styles.riskBarLabel, { color: COLORS.danger }]}>High {highRisk}</Text>
              <Text style={[styles.riskBarLabel, { color: COLORS.warning }]}>Med {mediumRisk}</Text>
              <Text style={[styles.riskBarLabel, { color: COLORS.safe }]}>Low {lowRisk}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Districts ({filteredData.length})</Text>
          <View style={styles.districtsList}>
            {filteredData.map((area, index) => (
              <TouchableOpacity
                key={area.id || index}
                activeOpacity={0.8}
                style={styles.districtCard}
                onPress={() => setSelectedArea(selectedArea?.id === area.id ? null : area)}
              >
                <View style={styles.districtHeader}>
                  <View style={[styles.riskIndicator, { backgroundColor: area.color }]} />
                  <Text style={styles.districtName}>{area.district}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons
                      name={area.trend === '↑' ? 'trending-up' : area.trend === '↓' ? 'trending-down' : 'remove-outline'}
                      size={16}
                      color={area.trend === '↑' ? COLORS.danger : area.trend === '↓' ? COLORS.safe : COLORS.warning}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.casesText, { fontWeight: '700' }]}>{area.cases}</Text>
                  </View>

                  <View style={[styles.riskBadge, { backgroundColor: area.color + '15' }]}>
                    <Text style={[styles.riskBadgeText, { color: area.color }]}>{area.risk}</Text>
                  </View>
                </View>

                {selectedArea?.id === area.id && (
                  <View style={styles.expandedDetails}>
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="virus" size={16} color={area.color} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Real Cases (This Week)</Text>
                        <Text style={[styles.detailValue, { color: area.color }]}>{area.cases}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="analytics-outline" size={16} color={COLORS.warning} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Predicted (Next 7 Days)</Text>
                        <Text style={[styles.detailValue, { color: COLORS.warning }]}>{area.predictedNextWeek}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="rainy-outline" size={16} color={COLORS.textLight} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Rainfall</Text>
                        <Text style={styles.detailValue}>{area.rainfall}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="thermometer-outline" size={16} color={COLORS.textLight} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Temperature</Text>
                        <Text style={styles.detailValue}>{area.temp}</Text>
                      </View>
                    </View>
                    <View style={styles.predictionNote}>
                      <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                      <Text style={styles.predictionNoteText}>
                        ML prediction based on historical data & weather
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4, fontWeight: '500' },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },
  toggleBtnActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },
  toggleTextActive: { color: COLORS.primary, fontWeight: '800' },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1, width: width },
  mapFilterOverlay: {
    position: 'absolute',
    top: 15,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  legend: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 90,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: {
    width: 12, height: 12, borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  legendText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  listContainerWrapper: { paddingTop: 20 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  filterText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  filterTextActive: { color: COLORS.white, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryNumber: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  summaryLabel: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', fontWeight: '600' },
  riskBarContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  riskBarTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  riskBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' },
  riskBarSegment: { height: '100%' },
  riskBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  riskBarLabel: { fontSize: 12, fontWeight: '700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  districtsList: { paddingHorizontal: 16 },
  districtCard: {
    backgroundColor: COLORS.white,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  districtHeader: { flexDirection: 'row', alignItems: 'center' },
  riskIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  districtName: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.text },
  casesText: { fontSize: 14, color: COLORS.text },
  riskBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  riskBadgeText: { fontSize: 12, fontWeight: '800' },
  expandedDetails: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  detailItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: { fontSize: 12, color: COLORS.textLight, marginBottom: 4, fontWeight: '600' },
  detailValue: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  predictionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1'
  },
  predictionNoteText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  bottomSpacing: { height: 90 },
});