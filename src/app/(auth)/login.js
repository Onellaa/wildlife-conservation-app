import { useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, TextInput } from "../../components/NunitoText";
import { useRouter } from "expo-router";
import { loginStyles as styles, COLORS } from "../../styles/loginStyles";
import { authService } from "../../services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign in with Supabase auth
      const { user } = await authService.signIn(email.trim(), password);

      // 2. Fetch the user's profile
      const profile = await authService.getProfile(user.id);

      // 3. Route based on role
      switch (profile.role) {
        case "ranger":
          // Rangers land on Home after signing in.
          router.replace("/(tabs)");
          break;

        case "park_manager":
          // Keep your existing park manager route
          router.replace("/(tabs)");
          break;

        case "liaison_officer":
          // Liaison officer goes directly to officer dashboard
          router.replace("/(tabs)/features/officer/dashboard");
          break;

        case "admin":
          // Keep your existing admin route
          router.replace("/(tabs)/admin");
          break;

        case "community_member":
          // Community member / villager goes to Home
          router.replace("/(tabs)");
          break;

        default:
          // Unknown role → Home
          router.replace("/(tabs)");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🐘</Text>

          <Text style={styles.title}>Wildlife Conservation</Text>

          <Text style={styles.subtitle}>Sign In</Text>
        </View>

        <View style={styles.form}>
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="ranger@wildlife.lk"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Department of Wildlife Conservation{"\n"}
            Sri Lanka
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
