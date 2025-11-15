import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'react-native-linear-gradient';
import { authAPI } from "../../api/endpoints";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); // Default to Sign Up for new users

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isNewUser && password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (isNewUser) {
        // Sign Up Flow
        const username = email.split("@")[0]; // Generate username from email
        await authAPI.signup({
          email,
          username,
          password,
          password2: password,
          first_name: "",
          last_name: "",
        });

        Alert.alert(
          "Success!",
          "Account created successfully! Logging you in...",
          [{ text: "OK" }]
        );

        // Auto login after signup
        const response = await authAPI.login({ email, password });
        const { access, refresh, user } = response.data;

        await AsyncStorage.multiSet([
          ["access_token", access],
          ["refresh_token", refresh],
          ["user", JSON.stringify(user)],
        ]);

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "MainApp" }],
        // });
        navigation.replace("MainApp");
      } else {
        // Log In Flow
        const response = await authAPI.login({ email, password });
        const { access, refresh, user } = response.data;

        await AsyncStorage.multiSet([
          ["access_token", access],
          ["refresh_token", refresh],
          ["user", JSON.stringify(user)],
        ]);

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "MainApp" }],
        // });
        navigation.replace("MainApp");
      }
    } catch (error) {
      console.error("Auth error:", error.response?.data);
      const message = isNewUser
        ? error.response?.data?.email?.[0] ||
          error.response?.data?.username?.[0] ||
          "Sign up failed. Email might already be registered."
        : error.response?.data?.detail ||
          "Login failed. Please check your credentials.";
      Alert.alert(isNewUser ? "Sign Up Error" : "Login Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset functionality will be available soon. Please contact support if you need help.",
      [{ text: "OK" }]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Half - Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
              style={styles.gradient}
            />
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>FitTrack</Text>
              <Text style={styles.tagline}>
                Your Fitness Journey Starts Here
              </Text>
            </View>
          </View>

          {/* Bottom Half - Auth Form */}
          <View style={styles.formContainer}>
            {/* Toggle Buttons for Sign Up / Log In */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isNewUser && styles.toggleButtonActive,
                ]}
                onPress={() => setIsNewUser(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isNewUser && styles.toggleTextActive,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !isNewUser && styles.toggleButtonActive,
                ]}
                onPress={() => setIsNewUser(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isNewUser && styles.toggleTextActive,
                  ]}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.welcomeText}>
              {isNewUser ? "Create Account" : "Welcome Back!"}
            </Text>
            <Text style={styles.subtitleText}>
              {isNewUser
                ? "Sign up to start your fitness journey"
                : "Sign in to continue your fitness journey"}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isNewUser ? "Minimum 8 characters" : "Enter your password"
                }
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleAuth}
              />
            </View>

            {!isNewUser && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isNewUser ? "Create Account" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Bottom spacing for keyboard */}
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  logoContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 8,
    fontWeight: "300",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#4CAF50",
  },
  toggleText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: "#888",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  authButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpace: {
    height: 100,
  },
});

export default LoginScreen;
