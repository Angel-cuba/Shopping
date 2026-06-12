import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';
import { AppDispatch } from '../../store';
import { logged } from '../../src/redux/actions/UserAction';
import { getWishList } from '../../src/redux/actions/WishesActions';
import { fetchingAddresses } from '../../src/redux/actions/AddressAction';
import { fetchingPayments } from '../../src/redux/actions/PaymentAction';
import { api } from '../../services/api';
import { DecodedUser } from '../../src/interfaces/user/constants';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function LoginScreen() {
  const dispatch  = useDispatch<AppDispatch>();
  const router    = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token: string = data.token ?? data;
      const decoded = jwtDecode<DecodedUser>(token);

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('decodedUser', JSON.stringify(decoded));

      dispatch(logged(decoded));
      dispatch(getWishList(decoded.user_id));
      dispatch(fetchingAddresses(decoded.user_id));
      dispatch(fetchingPayments(decoded.user_id));

      Toast.show({ type: 'success', text1: `Welcome, ${decoded.username}!` });
      router.replace('/');
    } catch {
      Toast.show({ type: 'error', text1: 'Invalid email or password' });
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
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

        <View style={styles.form}>
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

          <Pressable style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color={colors.secondary} />
              : <Text style={styles.btnText}>Sign in</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/register')}>
            <Text style={styles.link}>Sign up</Text>
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
