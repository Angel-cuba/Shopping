import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '../../store';
import { addToCart, removeFromCart, removeLineFromCart } from '../../src/redux/actions/CartActions';
import { CartProduct } from '../../src/interfaces/cart/CartType';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router   = useRouter();
  const items    = useSelector((s: RootState) => s.cart.itemInCart ?? []);

  const total = items.reduce((sum: number, i: CartProduct) => sum + i.price * (i.quantity ?? 1), 0);

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="bag-outline" size={56} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/')}>
          <Text style={styles.btnText}>Shop now</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bag</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item: CartProduct) => item.id}
        contentContainerStyle={{ padding: spacing[4] }}
        renderItem={({ item }: { item: CartProduct }) => (
          <View style={styles.row}>
            <View style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.meta}>EU {item.sizes}{item.variant ? ` · ${item.variant}` : ''}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable onPress={() => dispatch(removeFromCart(item))} style={styles.stepBtn}>
                <Ionicons name="remove" size={18} color={colors.fgPrimary} />
              </Pressable>
              <Text style={styles.qty}>{item.quantity ?? 1}</Text>
              <Pressable onPress={() => dispatch(addToCart(item))} style={styles.stepBtn}>
                <Ionicons name="add" size={18} color={colors.fgPrimary} />
              </Pressable>
              <Pressable onPress={() => dispatch(removeLineFromCart(item.id))} style={[styles.stepBtn, { marginLeft: spacing[2] }]}>
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutTxt}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[4], padding: spacing[8] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  btn: { backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: 8 },
  btnText: { color: colors.secondary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[4],
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  count: { fontSize: fontSize.sm, color: colors.fgMuted },
  row: { flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start' },
  img: { width: 80, height: 80, borderRadius: 8, backgroundColor: colors.bgSecondary },
  info: { flex: 1, gap: spacing[1] },
  name: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgPrimary },
  meta: { fontSize: fontSize.xs, color: colors.fgMuted },
  price: { fontSize: fontSize.base, fontWeight: fontWeight.bold, color: colors.primary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  stepBtn: { padding: spacing[2], borderRadius: 6, backgroundColor: colors.bgSecondary },
  qty: { fontSize: fontSize.base, fontWeight: fontWeight.bold, minWidth: 20, textAlign: 'center' },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: spacing[3] },
  footer: {
    padding: spacing[4], borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.bgPrimary,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[4] },
  totalLabel: { fontSize: fontSize.base, color: colors.fgSecondary },
  totalValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.primary },
  checkoutBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    paddingVertical: spacing[4], alignItems: 'center',
  },
  checkoutTxt: { color: colors.secondary, fontWeight: fontWeight.bold, fontSize: fontSize.base, letterSpacing: 1 },
});
