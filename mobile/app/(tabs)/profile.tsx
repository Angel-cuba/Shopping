import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../src/redux/actions/UserAction';
import { clearWishList } from '../../src/redux/actions/WishesActions';
import { clearCart } from '../../src/redux/actions/CartActions';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function ProfileScreen() {
  const dispatch      = useDispatch<AppDispatch>();
  const router        = useRouter();
  const userFromToken = useSelector((s: RootState) => s.userLogged.userFromToken);
  const addresses     = useSelector((s: RootState) => s.addresses.addresses);
  const payments      = useSelector((s: RootState) => s.payments.payments);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishList());
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('decodedUser');
    await SecureStore.deleteItemAsync('user');
    router.replace('/');
  };

  if (!userFromToken) {
    return (
      <View style={styles.empty}>
        <Ionicons name="person-outline" size={56} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Sign in to manage your account</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  const initials = userFromToken.username?.[0]?.toUpperCase() ?? '?';
  const isAdmin  = userFromToken.role === 'ADMIN';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing[16] }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.name}>{userFromToken.username}</Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>
      </View>

      {/* Nav items */}
      <View style={styles.section}>
        {[
          { icon: 'location-outline' as const, label: 'Addresses', sub: `${addresses.length} saved`, onPress: () => {} },
          { icon: 'card-outline' as const, label: 'Payment methods', sub: `${payments.length} saved`, onPress: () => {} },
          { icon: 'receipt-outline' as const, label: 'Order history', sub: 'View all orders', onPress: () => router.push('/history') },
        ].map(({ icon, label, sub, onPress }) => (
          <Pressable key={label} style={styles.row} onPress={onPress}>
            <View style={styles.rowIcon}>
              <Ionicons name={icon} size={20} color={colors.fgSecondary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowSub}>{sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.fgMuted} />
          </Pressable>
        ))}
      </View>

      {isAdmin && (
        <View style={styles.section}>
          <Pressable style={styles.row} onPress={() => router.push('/admin')}>
            <View style={styles.rowIcon}>
              <Ionicons name="settings-outline" size={20} color={colors.fgSecondary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Admin panel</Text>
              <Text style={styles.rowSub}>Manage products, orders and users</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.fgMuted} />
          </Pressable>
        </View>
      )}

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[4], padding: spacing[8] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  btn: { backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: 8 },
  btnText: { color: colors.secondary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing[4],
    padding: spacing[6], paddingTop: spacing[12],
    backgroundColor: colors.bgPrimary,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    marginBottom: spacing[3],
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: colors.secondary, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  adminBadge: {
    backgroundColor: colors.fgPrimary, borderRadius: 4,
    paddingHorizontal: spacing[2], paddingVertical: 2, alignSelf: 'flex-start', marginTop: spacing[1],
  },
  adminBadgeText: { color: colors.secondary, fontSize: fontSize.xs, fontWeight: fontWeight.bold, letterSpacing: 1 },
  section: {
    backgroundColor: colors.bgPrimary,
    marginBottom: spacing[3],
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing[3],
    paddingHorizontal: spacing[4], paddingVertical: spacing[4],
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: colors.bgSecondary, justifyContent: 'center', alignItems: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.fgPrimary },
  rowSub: { fontSize: fontSize.xs, color: colors.fgMuted, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing[3],
    margin: spacing[4], padding: spacing[4],
    backgroundColor: colors.bgPrimary, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  logoutText: { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.error },
});
