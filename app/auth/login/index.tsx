import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { API_URL } from '@/constants';
import { useAuth } from '@/context/auth-context';

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignIn = () => {
  const { user, handleTost, handleSetUser } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  useEffect(() => {
    if (user) router.replace("/root/home");
  }, [user]);

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      await AsyncStorage.setItem("authToken", data.token || "");
      handleSetUser({ ...data.user, token: data.token });
      
    } catch (err: any) {
      handleTost(err.message, "error", 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.subTitle}>Welcome to</Text>
              <Text style={styles.subTitle}>Smart Chat App Login now</Text>
            </View>

            <View style={styles.inputGap}>
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

              {/* Remember Me & Forgot Password */}
              <View style={styles.rowBetween}>
                <View style={styles.rowCenter}>
                  <Checkbox 
                    style={styles.checkbox} 
                    value={values.rememberMe} 
                    onValueChange={(val) => setFieldValue('rememberMe', val)} 
                    color={values.rememberMe ? '#3183ff' : undefined} 
                  />
                  <Text style={styles.mutedText}>Remember me</Text>
                </View>
                <TouchableOpacity><Text style={styles.mutedText}>Forgot password?</Text></TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => handleSubmit()} 
              disabled={isSubmitting}
              style={[styles.buttonPrimary, isSubmitting && { opacity: 0.7 }]}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <Link href="/auth/register" asChild>
              <TouchableOpacity style={styles.marginVertical12}>
                <Text style={styles.centerMutedText}>I don&apos;t have an account. Register?</Text>
              </TouchableOpacity>
            </Link>

            <Text style={[styles.centerMutedText, { marginBottom: 12 }]}>Or Sign In With</Text>

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
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9ecf4", padding: 16, justifyContent: "center" },
  card: { width: "100%", borderRadius: 16, backgroundColor: "#fff", padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  header: { alignItems: 'center', marginBottom: 24 },
  subTitle: { fontSize: 16, fontWeight: '600', color: "#8a8a8a" },
  inputGap: { gap: 16, marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#f8f7f7", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, height: 52, paddingHorizontal: 12 },
  inputError: { borderColor: "#ff6060", backgroundColor: "#fff5f5" },
  textInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  errorText: { color: "#ff6060", fontSize: 11, marginTop: 4, marginLeft: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  mutedText: { fontSize: 14, color: "#8a8a8a" },
  centerMutedText: { textAlign: "center", color: "#8a8a8a" },
  checkbox: { marginRight: 8, width: 18, height: 18 },
  buttonPrimary: { height: 52, backgroundColor: "#3183ff", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  socialBtn: { height: 48, width: 48, borderRadius: 24, backgroundColor: "#f0f6ff", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#d0e3ff" },
  marginVertical12: { marginVertical: 12 }
});