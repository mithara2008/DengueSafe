import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { registerUser } from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !district) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser(name, email, password, district);
      setLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.mosquitoIcon}>🦟</Text>
        <Text style={styles.title}>DengueSafe</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <View style={styles.form}>
        {[
          { label: 'Full Name', value: name, setter: setName, placeholder: 'Enter your full name' },
          { label: 'Email', value: email, setter: setEmail, placeholder: 'Enter your email', keyboard: 'email-address' },
          { label: 'District', value: district, setter: setDistrict, placeholder: 'e.g. Colombo, Kandy, Galle' },
          { label: 'Password', value: password, setter: setPassword, placeholder: 'Create a password', secure: true },
          { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm your password', secure: true },
        ].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.setter}
              keyboardType={field.keyboard || 'default'}
              secureTextEntry={field.secure || false}
              autoCapitalize="none"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: COLORS.white, fontSize: 16 },
  mosquitoIcon: { fontSize: 45, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: 13, color: '#C8E6C9', marginTop: 5 },
  form: { padding: 25, marginTop: 10 },
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
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  registerButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: COLORS.textLight, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
});