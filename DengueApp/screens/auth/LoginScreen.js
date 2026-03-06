import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/colors';
import { loginUser } from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  console.log('Attempting login to:', 'http://192.168.132.146:5000/auth/login'); // debug
  if (!email || !password) {
    Alert.alert('Error', 'Please enter email and password');
    return;
  }

  setLoading(true);
  try {
    const response = await loginUser(email, password);
    console.log('Login response:', response); // debug
    
    if (response.token) {
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setLoading(false);
      navigation.replace('Main');
    } else {
      setLoading(false);
      Alert.alert('Login Failed', 'No token received');
    }
  } catch (error) {
    setLoading(false);
    console.log('Login error:', error.response?.data);
    console.log('Login error message:', error.message);
    Alert.alert('Login Failed', 
      error.response?.data?.message || 
      error.message || 
      'Please check your credentials'
    );
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mosquitoIcon}>🦟</Text>
        <Text style={styles.title}>DengueSafe</Text>
        <Text style={styles.subtitle}>Sri Lanka Mosquito Control System</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.loginSubText}>Sign in to your account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🌿 Protecting Sri Lanka from mosquito-borne diseases</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mosquitoIcon: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#C8E6C9', marginTop: 5 },
  form: { padding: 25, marginTop: 10 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
  loginSubText: { fontSize: 14, color: COLORS.textLight, marginBottom: 25 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: COLORS.text,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  loginButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: COLORS.textLight, fontSize: 14 },
  registerLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  footer: { alignItems: 'center', padding: 20, marginTop: 10 },
  footerText: { color: COLORS.textLight, fontSize: 12, textAlign: 'center' },
});