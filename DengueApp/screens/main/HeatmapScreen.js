//import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../constants/colors';
import { getHeatmapData } from '../../services/api';

const { width } = Dimensions.get('window');

export default function HeatmapScreen() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [outbreakData, setOutbreakData] = useState([]);

  const mockData = [
    { id: 1, district: 'Colombo', latitude: 6.9271, longitude: 79.8612, cases: 342, risk: 'High', color: '#D32F2F', radius: 8000, predictedNextWeek: 380, trend: '↑', rainfall: '245mm', temp: '31°C' },
    { id: 2, district: 'Gampaha', latitude: 7.0917, longitude: 79.9997, cases: 218, risk: 'High', color: '#D32F2F', radius: 7000, predictedNextWeek: 245, trend: '↑', rainfall: '198mm', temp: '30°C' },
    { id: 3, district: 'Kalutara', latitude: 6.5854, longitude: 79.9607, cases: 178, risk: 'High', color: '#D32F2F', radius: 6500, predictedNextWeek: 190, trend: '↑', rainfall: '210mm', temp: '30°C' },
    { id: 4, district: 'Kandy', latitude: 7.2906, longitude: 80.6337, cases: 156, risk: 'Medium', color: '#F9A825', radius: 6000, predictedNextWeek: 160, trend: '→', rainfall: '156mm', temp: '27°C' },
    { id: 5, district: 'Kurunegala', latitude: 7.4863, longitude: 80.3647, cases: 134, risk: 'Medium', color: '#F9A825', radius: 5500, predictedNextWeek: 140, trend: '→', rainfall: '145mm', temp: '29°C' },
    { id: 6, district: 'Ratnapura', latitude: 6.7056, longitude: 80.3847, cases: 98, risk: 'Medium', color: '#F9A825', radius: 5000, predictedNextWeek: 95, trend: '↓', rainfall: '320mm', temp: '28°C' },
    { id: 7, district: 'Galle', latitude: 6.0535, longitude: 80.2210, cases: 89, risk: 'Low', color: '#388E3C', radius: 4000, predictedNextWeek: 85, trend: '↓', rainfall: '178mm', temp: '29°C' },
    { id: 8, district: 'Matara', latitude: 5.9549, longitude: 80.5550, cases: 67, risk: 'Low', color: '#388E3C', radius: 3500, predictedNextWeek: 60, trend: '↓', rainfall: '165mm', temp: '29°C' },
    { id: 9, district: 'Jaffna', latitude: 9.6615, longitude: 80.0255, cases: 45, risk: 'Low', color: '#388E3C', radius: 3000, predictedNextWeek: 50, trend: '→', rainfall: '67mm', temp: '32°C' },
  ];

  const fetchHeatmap = async () => {
    try {
      const data = await getHeatmapData();
      const coloredData = data.map(d => ({
        ...d,
        color: d.risk === 'High' ? '#D32F2F' :
               d.risk === 'Medium' ? '#F9A825' : '#388E3C',
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
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([7.8731, 80.7718], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap'
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
            fillOpacity: 0.25,
            radius: area.radius,
            weight: 2
          }).addTo(map);

          var markerHtml = '<div style="background:' + area.color + ';color:white;padding:5px 8px;border-radius:12px;font-weight:bold;font-size:12px;border:2px solid white;white-space:nowrap;text-align:center;min-width:36px;box-shadow:0 2px 4px rgba(0,0,0,0.3);">' + area.cases + '</div>';
          var icon = L.divIcon({ html: markerHtml, className: '', iconAnchor: [18, 15] });

          L.marker([area.lat, area.lng], { icon: icon })
            .addTo(map)
            .bindPopup(
              '<div style="font-family:sans-serif;min-width:150px;">' +
              '<b style="font-size:14px;">' + area.district + ' District</b><br><br>' +
              '<span style="color:' + area.color + ';font-weight:bold;">● ' + area.risk + ' Risk</span><br><br>' +
              '🦟 Current Cases: <b>' + area.cases + '</b><br>' +
              '📊 ML Predicted (7 days): <b>' + area.predicted + '</b><br>' +
              '🌧 Rainfall: <b>' + area.rainfall + '</b><br>' +
              '🌡 Temperature: <b>' + area.temp + '</b>' +
              '</div>'
            );
        });
      </script>
    </body>
    </html>
  `;

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'high', 'medium', 'low'].map(level => (
        <TouchableOpacity
          key={level}
          style={[
            styles.filterBtn,
            filterRisk === level && {
              backgroundColor:
                level === 'high' ? '#D32F2F' :
                level === 'medium' ? '#F9A825' :
                level === 'low' ? '#388E3C' : COLORS.primary
            }
          ]}
          onPress={() => setFilterRisk(level)}
        >
          <Text style={[
            styles.filterText,
            filterRisk === level && styles.filterTextActive
          ]}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading heatmap data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🗺️ Outbreak Heatmap</Text>
          <Text style={styles.headerSubtitle}>Sri Lanka dengue risk by district</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>📋 List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>🗺️ Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          <FilterButtons />
          <WebView
            source={{ html: mapHTML }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D32F2F' }]} />
              <Text style={styles.legendText}>High Risk</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F9A825' }]} />
              <Text style={styles.legendText}>Medium Risk</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#388E3C' }]} />
              <Text style={styles.legendText}>Low Risk</Text>
            </View>
          </View>
        </View>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderTopColor: '#D32F2F' }]}>
              <Text style={styles.summaryNumber}>{highRisk}</Text>
              <Text style={styles.summaryLabel}>High Risk</Text>
            </View>
            <View style={[styles.summaryCard, { borderTopColor: '#F9A825' }]}>
              <Text style={styles.summaryNumber}>{mediumRisk}</Text>
              <Text style={styles.summaryLabel}>Medium</Text>
            </View>
            <View style={[styles.summaryCard, { borderTopColor: '#388E3C' }]}>
              <Text style={styles.summaryNumber}>{lowRisk}</Text>
              <Text style={styles.summaryLabel}>Low Risk</Text>
            </View>
            <View style={[styles.summaryCard, { borderTopColor: COLORS.primary }]}>
              <Text style={styles.summaryNumber}>{totalCases}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>

          <FilterButtons />

          <View style={styles.riskBarContainer}>
            <Text style={styles.riskBarTitle}>Risk Distribution</Text>
            <View style={styles.riskBar}>
              <View style={[styles.riskBarSegment, { flex: highRisk, backgroundColor: '#D32F2F' }]} />
              <View style={[styles.riskBarSegment, { flex: mediumRisk, backgroundColor: '#F9A825' }]} />
              <View style={[styles.riskBarSegment, { flex: lowRisk, backgroundColor: '#388E3C' }]} />
            </View>
            <View style={styles.riskBarLabels}>
              <Text style={[styles.riskBarLabel, { color: '#D32F2F' }]}>High {highRisk}</Text>
              <Text style={[styles.riskBarLabel, { color: '#F9A825' }]}>Medium {mediumRisk}</Text>
              <Text style={[styles.riskBarLabel, { color: '#388E3C' }]}>Low {lowRisk}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Districts ({filteredData.length})</Text>
          {filteredData.map((area, index) => (
            <TouchableOpacity
              key={area.id || index}
              style={styles.districtCard}
              onPress={() => setSelectedArea(selectedArea?.id === area.id ? null : area)}
            >
              <View style={styles.districtHeader}>
                <View style={[styles.riskIndicator, { backgroundColor: area.color }]} />
                <Text style={styles.districtName}>{area.district}</Text>
                <Text style={[styles.trendText, {
                  color: area.trend === '↑' ? '#D32F2F' :
                         area.trend === '↓' ? '#388E3C' : '#F9A825'
                }]}>{area.trend}</Text>
                <Text style={styles.casesText}>{area.cases} cases</Text>
                <View style={[styles.riskBadge, { backgroundColor: area.color }]}>
                  <Text style={styles.riskBadgeText}>{area.risk}</Text>
                </View>
              </View>

              {selectedArea?.id === area.id && (
                <View style={styles.expandedDetails}>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Current Cases</Text>
                      <Text style={[styles.detailValue, { color: area.color }]}>{area.cases}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>ML Predicted</Text>
                      <Text style={[styles.detailValue, { color: '#F9A825' }]}>{area.predictedNextWeek}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Rainfall</Text>
                      <Text style={styles.detailValue}>{area.rainfall}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Temperature</Text>
                      <Text style={styles.detailValue}>{area.temp}</Text>
                    </View>
                  </View>
                  <View style={styles.predictionNote}>
                    <Text style={styles.predictionNoteText}>
                      📊 ML prediction based on historical data & weather
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  loadingText: { marginTop: 10, color: COLORS.textLight, fontSize: 14 },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 55,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 11, marginTop: 3 },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 3,
  },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  toggleBtnActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontSize: 11, color: '#C8E6C9', fontWeight: '600' },
  toggleTextActive: { color: COLORS.primary },
  mapContainer: { flex: 1 },
  map: { flex: 1, width: width },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: COLORS.textLight },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 6,
    justifyContent: 'center',
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterText: { fontSize: 12, color: COLORS.textLight, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  summaryRow: { flexDirection: 'row', padding: 10, gap: 8 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 3,
    elevation: 2,
  },
  summaryNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  summaryLabel: { fontSize: 9, color: COLORS.textLight, textAlign: 'center', marginTop: 2 },
  riskBarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  riskBarTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  riskBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' },
  riskBarSegment: { height: '100%' },
  riskBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  riskBarLabel: { fontSize: 11, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 10,
    marginBottom: 8,
  },
  districtCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  districtHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  riskIndicator: { width: 12, height: 12, borderRadius: 6 },
  districtName: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  trendText: { fontSize: 18, fontWeight: 'bold' },
  casesText: { fontSize: 13, color: COLORS.textLight, marginRight: 8 },
  riskBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  riskBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  expandedDetails: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  detailItem: {
    width: '45%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
  },
  detailLabel: { fontSize: 11, color: COLORS.textLight, marginBottom: 4 },
  detailValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  predictionNote: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  predictionNoteText: { fontSize: 11, color: COLORS.primary, textAlign: 'center' },
  bottomSpacing: { height: 20 },
});