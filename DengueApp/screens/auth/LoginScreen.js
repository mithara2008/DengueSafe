import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { loginUser } from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [portal, setPortal] = useState('public'); // 'public' | 'officer'

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(email, password);

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setLoading(false);

        if (portal === 'officer' && response.user.role !== 'officer') {
          Alert.alert('Access Denied', 'This email does not have Health Officer privileges.');
          return;
        }

        if (response.user.role === 'officer' && portal === 'officer') {
          navigation.replace('MainOfficer');
        } else {
          navigation.replace('MainPublic');
        }
      } else {
        setLoading(false);
        Alert.alert('Login Failed', 'No token received');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed',
        error.response?.data?.message ||
        error.message ||
        'Please check your credentials'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.header, portal === 'officer' && { backgroundColor: '#0F172A' }]}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../assets/mosquito_logo.png')}
              style={{ width: 65, height: 65, borderRadius: 32 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>DengueSafe</Text>
          <Text style={styles.subtitle}>Sri Lanka Mosquito Control System</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.loginSubText}>Log in to continue your journey</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, portal === 'public' && styles.toggleBtnActivePublic]}
              onPress={() => setPortal('public')}
            >
              <Text style={[styles.toggleText, portal === 'public' && styles.toggleTextActive]}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, portal === 'officer' && styles.toggleBtnActiveOfficer]}
              onPress={() => setPortal('officer')}
            >
              <Text style={[styles.toggleText, portal === 'officer' && styles.toggleTextActive]}>Health Officer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, portal === 'officer' && { backgroundColor: '#0F172A' }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
            {!loading && <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={styles.btnIcon} />}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.footerText}> Protecting Sri Lanka together</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1 },
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 70,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  iconCircle: {
    backgroundColor: COLORS.white,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: '500' },
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActivePublic: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnActiveOfficer: {
    backgroundColor: '#0F172A',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  welcomeText: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 6, letterSpacing: -0.5 },
  loginSubText: { fontSize: 14, color: COLORS.textLight, marginBottom: 30, fontWeight: '400' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginLeft: 4 },
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
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  eyeIcon: { padding: 8 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnIcon: { marginLeft: 8 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { color: COLORS.textLight, fontSize: 14, fontWeight: '500' },
  registerLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 30
  },
  footerText: { color: COLORS.textLight, fontSize: 13, fontWeight: '500' },
});