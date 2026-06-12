import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { apiWithoutAuth } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      await apiWithoutAuth.post('/auth/register', { username, email, password });
      Toast.show({ type: 'success', text1: 'Account created!', text2: 'You can now sign in.' });
      router.replace('/auth/login');
    } catch {
      Toast.show({ type: 'error', text1: 'Registration failed', text2: 'Email may already be in use.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.brand}>STRIDE</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join STRIDE today</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="johndoe"
              placeholderTextColor={colors.fgMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={colors.fgMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.fgMuted}
              secureTextEntry
            />
          </View>

          <Pressable style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color={colors.secondary} />
              : <Text style={styles.btnText}>Create account</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/auth/login')}>
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flexGrow: 1, padding: spacing[6], paddingTop: spacing[12] },
  back: { marginBottom: spacing[8] },
  backText: { fontSize: fontSize.base, color: colors.fgSecondary },
  brand: { fontSize: fontSize['2xl'], fontWeight: fontWeight.black, letterSpacing: 4, color: colors.primary, marginBottom: spacing[6] },
  title: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, color: colors.fgPrimary, marginBottom: spacing[1] },
  subtitle: { fontSize: fontSize.base, color: colors.fgMuted, marginBottom: spacing[8] },
  form: { gap: spacing[4] },
  field: { gap: spacing[2] },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgSecondary },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: spacing[4], paddingVertical: spacing[3],
    fontSize: fontSize.base, color: colors.fgPrimary,
    backgroundColor: colors.bgSecondary,
  },
  btn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingVertical: spacing[4], alignItems: 'center',
    marginTop: spacing[2],
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.secondary, fontWeight: fontWeight.bold, fontSize: fontSize.base, letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing[8] },
  footerText: { fontSize: fontSize.sm, color: colors.fgMuted },
  link: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primary },
});
