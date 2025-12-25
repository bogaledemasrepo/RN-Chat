import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';

// Validation Schema for Registration
const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name too short!')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

const SignUp = () => {
  const { handleSetUser, handleTost } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await AsyncStorage.setItem("authToken", data.token || "");
      handleSetUser({ ...data.user, token: data.token });
      router.replace("/root/home");
      
    } catch (err: any) {
      handleTost(err.message, "error", 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (<SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name='arrow-left' size={28} color="#3183ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Chat App</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <Formik
        initialValues={{ name: '', email: '', password: '', acceptTerms: false }}
        validationSchema={SignUpSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create New Account</Text>

            <View style={styles.inputGap}>
              {/* Name Field */}
              <View>
                <View style={[styles.inputWrapper, touched.name && errors.name && styles.inputError]}>
                  <MaterialCommunityIcons name='account' size={22} color="#c7c7c7" />
                  <TextInput 
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    style={styles.textInput} 
                    placeholder='Full Name'
                  />
                </View>
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Email Field */}
              <View>
                <View style={[styles.inputWrapper, touched.email && errors.email && styles.inputError]}>
                  <MaterialCommunityIcons name='email' size={22} color="#c7c7c7" />
                  <TextInput 
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    style={styles.textInput} 
                    placeholder='Email'
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password Field */}
              <View>
                <View style={[styles.inputWrapper, touched.password && errors.password && styles.inputError]}>
                  <MaterialCommunityIcons name='lock' size={22} color="#c7c7c7" />
                  <TextInput 
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!isPasswordVisible} 
                    placeholder='Password' 
                    style={styles.textInput}
                  />
                  <MaterialCommunityIcons 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                    name={isPasswordVisible ? 'eye-off' : 'eye'} 
                    size={22} 
                    color="#c7c7c7" 
                  />
                </View>
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Terms Checkbox */}
              <View>
                <View style={styles.rowCenter}>
                  <Checkbox 
                    style={styles.checkbox} 
                    value={values.acceptTerms} 
                    onValueChange={(val) => setFieldValue('acceptTerms', val)} 
                    color={values.acceptTerms ? '#3183ff' : undefined} 
                  />
                  <Text style={styles.mutedText}>Accept Terms and Policies.</Text>
                </View>
                {touched.acceptTerms && errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => handleSubmit()} 
              disabled={isSubmitting}
              style={[styles.buttonPrimary, isSubmitting && { opacity: 0.7 }]}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

            <Text style={styles.orText}>Or Sign In With</Text>

            <View style={styles.socialRow}>
              {['facebook', 'google', 'apple'].map((icon) => (
                <TouchableOpacity key={icon} style={styles.socialBtn}>
                  <MaterialCommunityIcons name={icon as any} size={20} color="#3183ff" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Formik>
      <View style={{height:40}}></View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9ecf4", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#3183ff" },
  card: { width: "100%", borderRadius: 16, backgroundColor: "#fff", padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: "#8a8a8a", textAlign: "center", marginBottom: 20 },
  inputGap: { gap: 14, marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#f8f7f7", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, height: 50, paddingHorizontal: 12 },
  inputError: { borderColor: "#ff6060", backgroundColor: "#fff5f5" },
  textInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  errorText: { color: "#ff6060", fontSize: 11, marginTop: 4, marginLeft: 4 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  mutedText: { fontSize: 14, color: "#8a8a8a" },
  checkbox: { marginRight: 8, width: 18, height: 18 },
  buttonPrimary: { height: 50, backgroundColor: "#3183ff", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10, marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  orText: { textAlign: "center", color: "#8a8a8a", marginBottom: 16 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  socialBtn: { height: 44, width: 44, borderRadius: 22, backgroundColor: "#f0f6ff", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#d0e3ff" },
});