import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import FieldOperationsScreen from '../screens/officer/FieldOperationsScreen';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import HeatmapScreen from '../screens/main/HeatmapScreen';
import AlertsScreen from '../screens/main/AlertsScreen';
import ChatbotScreen from '../screens/main/ChatbotScreen';
import AwarenessScreen from '../screens/main/AwarenessScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Officer Screens
import OfficerHomeScreen from '../screens/officer/OfficerHomeScreen';
import UploadDataScreen from '../screens/officer/UploadDataScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Heatmap') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Chatbot') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-outline';
          else if (route.name === 'Awareness') iconName = focused ? 'book' : 'book-outline';

          return (
            <View style={focused ? styles.iconFocused : styles.iconContainer}>
              <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          paddingBottom: Platform.OS === 'ios' ? 0 : 6,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: Platform.OS === 'ios' ? 85 : 65,
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Heatmap" component={HeatmapScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Awareness" component={AwarenessScreen} />
    </Tab.Navigator>
  );
}

function OfficerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Heatmap') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';

          return (
            <View style={focused ? styles.iconFocused : styles.iconContainer}>
              <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#0F172A', // PHI blue active tint
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          paddingBottom: Platform.OS === 'ios' ? 0 : 6,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: Platform.OS === 'ios' ? 85 : 65,
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={OfficerHomeScreen} />
      <Tab.Screen name="Heatmap" component={HeatmapScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainPublic" component={MainTabs} />
        <Stack.Screen name="MainOfficer" component={OfficerTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="UploadData" component={UploadDataScreen} />
        <Stack.Screen name="FieldOperations" component={FieldOperationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconFocused: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  }
});