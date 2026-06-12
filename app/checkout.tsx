import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppDispatch, RootState } from '../store';
import { clearCart } from '../src/redux/actions/CartActions';
import { api } from '../services/api';
import { CartProduct } from '../src/interfaces/cart/CartType';
import { AddressType } from '../src/interfaces/profile/address/AddressType';
import { PaymentType } from '../src/interfaces/profile/payment/paymentType';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

// Cart item id = productUUID(36 chars) + timestamp — strip suffix
const getProductId = (id: string): string => id.slice(0, 36);

const STEPS = ['Address', 'Payment', 'Shipping', 'Confirm'];

export default function CheckoutScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router   = useRouter();

  const userFromToken = useSelector((s: RootState) => s.userLogged.userFromToken);
  const itemInCart    = useSelector((s: RootState) => s.cart.itemInCart ?? []);
  const addresses     = useSelector((s: RootState) => s.addresses.addresses);
  const payments      = useSelector((s: RootState) => s.payments.payments);

  const [address,        setAddress]        = useState<AddressType | null>(null);
  const [payment,        setPayment]        = useState<PaymentType | null>(null);
  const [doorDelivery,   setDoorDelivery]   = useState(true);
  const [allowToPay,     setAllowToPay]     = useState(false);
  const [outOfStock,     setOutOfStock]     = useState<string[]>([]);
  const [checking,       setChecking]       = useState(false);
  const [placing,        setPlacing]        = useState(false);
  const [addrModal,      setAddrModal]      = useState(false);
  const [payModal,       setPayModal]       = useState(false);

  const subtotal    = itemInCart.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  const shippingFee = doorDelivery ? 2.99 : 0;
  const grandTotal  = subtotal + shippingFee;
  const currentStep = !address ? 0 : !payment ? 1 : !allowToPay ? 2 : 3;

  // Reset stock approval whenever cart changes
  useEffect(() => {
    setAllowToPay(false);
    setOutOfStock([]);
  }, [itemInCart]);

  const handleCheckStock = async () => {
    if (!address || !payment) {
      Toast.show({ type: 'error', text1: 'Select address and payment first' });
      return;
    }
    setChecking(true);
    setOutOfStock([]);
    const bad: string[] = [];
    try {
      for (const item of itemInCart) {
        const { data } = await api.get(`/products/${getProductId(item.id)}`);
        if (data.inStock === 0) {
          bad.push(data.id);
          Toast.show({ type: 'error', text1: `${data.name} is out of stock` });
        } else if (data.inStock < (item.quantity ?? 1)) {
          bad.push(data.id);
          Toast.show({ type: 'error', text1: `${data.name}: only ${data.inStock} left` });
        }
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Stock check failed — try again' });
    }
    setOutOfStock(bad);
    if (bad.length === 0) {
      setAllowToPay(true);
      Toast.show({ type: 'success', text1: 'All items in stock' });
    }
    setChecking(false);
  };

  const handlePlaceOrder = async () => {
    if (!userFromToken || !address || !payment || !allowToPay) return;
    setPlacing(true);
    try {
      await api.post('/orders/place', {
        userId:          userFromToken.user_id,
        items:           itemInCart.map((item: CartProduct) => ({
          productId: getProductId(item.id),
          variant:   item.variant,
          image:     item.image,
          size:      item.sizes,
          price:     Math.round(item.price),
          quantity:  item.quantity ?? 1,
        })),
        paymentType:     payment.provider,
        shippingAddress: `${address.address}, ${address.city}`,
        shippingMethod:  doorDelivery ? 'DOOR' : 'PICKUP',
        shippingFee:     Math.round(shippingFee),
        total:           Math.round(grandTotal),
      });
      dispatch(clearCart());
      Toast.show({ type: 'success', text1: "Order placed! We'll confirm shortly." });
      router.replace('/history');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setAllowToPay(false);
        Toast.show({ type: 'error', text1: 'Some items went out of stock — recheck' });
      } else {
        Toast.show({ type: 'error', text1: 'Something went wrong placing your order' });
      }
    } finally {
      setPlacing(false);
    }
  };

  if (!userFromToken) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={48} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Sign in to checkout</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if (itemInCart.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="bag-outline" size={48} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Pressable style={styles.btn} onPress={() => router.replace('/')}>
          <Text style={styles.btnText}>Browse products</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step bar */}
      <View style={styles.stepBar}>
        {STEPS.map((label, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          return (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepDot, (done || active) && styles.stepDotActive]}>
                {done
                  ? <Ionicons name="checkmark" size={12} color={colors.secondary} />
                  : <Text style={[styles.stepNum, active && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, done && styles.stepLineActive]} />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Address ── */}
        <SectionRow
          icon="location-outline"
          label="Delivery address"
          value={address ? `${address.address}, ${address.city}` : undefined}
          done={!!address}
          onPress={() => {
            if (addresses.length === 0) {
              Toast.show({ type: 'error', text1: 'Add an address in your profile first' });
            } else {
              setAddrModal(true);
            }
          }}
        />

        {/* ── Payment ── */}
        <SectionRow
          icon="card-outline"
          label="Payment method"
          value={payment ? `${payment.provider} •••• ${payment.cardNumber?.slice(-4)}` : undefined}
          done={!!payment}
          onPress={() => {
            if (payments.length === 0) {
              Toast.show({ type: 'error', text1: 'Add a payment method in your profile first' });
            } else {
              setPayModal(true);
            }
          }}
        />

        {/* ── Shipping ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bicycle-outline" size={18} color={colors.fgSecondary} />
            <Text style={styles.cardLabel}>Shipping method</Text>
          </View>
          <View style={styles.shippingRow}>
            {[
              { door: true,  icon: 'home-outline' as const,     label: 'Home delivery', sub: '+$2.99' },
              { door: false, icon: 'business-outline' as const, label: 'Store pickup',  sub: 'Free'   },
            ].map((opt) => (
              <Pressable
                key={String(opt.door)}
                style={[styles.shippingOpt, doorDelivery === opt.door && styles.shippingOptActive]}
                onPress={() => { setDoorDelivery(opt.door); setAllowToPay(false); }}
              >
                <Ionicons
                  name={opt.icon}
                  size={20}
                  color={doorDelivery === opt.door ? colors.primary : colors.fgMuted}
                />
                <Text style={[styles.shippingLabel, doorDelivery === opt.door && styles.shippingLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={[styles.shippingSub, doorDelivery === opt.door && styles.shippingSubActive]}>
                  {opt.sub}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Order summary ── */}
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Order summary</Text>
          {itemInCart.map((item) => (
            <View key={item.id} style={styles.lineItem}>
              <View style={[styles.lineItemDot, outOfStock.includes(getProductId(item.id)) && styles.lineItemDotRed]} />
              <Text style={styles.lineItemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.lineItemMeta}>×{item.quantity ?? 1}</Text>
              <Text style={styles.lineItemPrice}>${(item.price * (item.quantity ?? 1)).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>{doorDelivery ? '$2.99' : 'Free'}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: spacing[2] }]}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Footer CTAs ── */}
      <View style={styles.footer}>
        {!allowToPay && (
          <Pressable
            style={[styles.ghostBtn, (checking || !address || !payment) && styles.btnDisabled]}
            onPress={handleCheckStock}
            disabled={checking || !address || !payment}
          >
            {checking
              ? <ActivityIndicator size="small" color={colors.primary} />
              : <><Ionicons name="search-outline" size={16} color={colors.primary} />
                  <Text style={styles.ghostBtnText}>Check stock availability</Text></>
            }
          </Pressable>
        )}

        {allowToPay && (
          <View style={styles.stockOk}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.stockOkText}>All items in stock</Text>
          </View>
        )}

        <Pressable
          style={[styles.placeBtn, (!address || !payment || !allowToPay || placing) && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={!address || !payment || !allowToPay || placing}
        >
          {placing
            ? <ActivityIndicator color={colors.secondary} />
            : <Text style={styles.placeBtnText}>Place order — ${grandTotal.toFixed(2)}</Text>
          }
        </Pressable>
      </View>

      {/* ── Address picker modal ── */}
      <PickerModal<AddressType>
        visible={addrModal}
        title="Select address"
        items={addresses}
        keyExtractor={(a) => a.id ?? a.address}
        renderLabel={(a) => `${a.address}, ${a.city}`}
        onSelect={(a) => { setAddress(a); setAddrModal(false); setAllowToPay(false); }}
        onClose={() => setAddrModal(false)}
      />

      {/* ── Payment picker modal ── */}
      <PickerModal<PaymentType>
        visible={payModal}
        title="Select payment"
        items={payments}
        keyExtractor={(p) => p.id ?? p.cardNumber}
        renderLabel={(p) => `${p.provider} •••• ${p.cardNumber?.slice(-4)}`}
        onSelect={(p) => { setPayment(p); setPayModal(false); }}
        onClose={() => setPayModal(false)}
      />
    </View>
  );
}

// ── Reusable section row ──────────────────────────────────────
function SectionRow({
  icon, label, value, done, onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.card, styles.sectionRow]} onPress={onPress}>
      <View style={[styles.sectionIcon, done && styles.sectionIconDone]}>
        <Ionicons name={done ? 'checkmark' : icon} size={18} color={done ? colors.secondary : colors.fgSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardLabel}>{label}</Text>
        {value
          ? <Text style={styles.sectionValue} numberOfLines={1}>{value}</Text>
          : <Text style={styles.sectionPlaceholder}>Tap to select</Text>
        }
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.fgMuted} />
    </Pressable>
  );
}

// ── Generic picker modal ──────────────────────────────────────
function PickerModal<T>({
  visible, title, items, keyExtractor, renderLabel, onSelect, onClose,
}: {
  visible: boolean;
  title: string;
  items: T[];
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <Pressable style={styles.modalRow} onPress={() => onSelect(item)}>
              <Text style={styles.modalRowText}>{renderLabel(item)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.fgMuted} />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bgSecondary },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[4], padding: spacing[8] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  btn:        { backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: 8 },
  btnText:    { color: colors.secondary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[4],
    backgroundColor: colors.bgPrimary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.fgPrimary },

  stepBar: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center',
    paddingVertical: spacing[4], paddingHorizontal: spacing[4],
    backgroundColor: colors.bgPrimary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  stepItem:       { alignItems: 'center', position: 'relative', flex: 1 },
  stepDot:        { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: spacing[1] },
  stepDotActive:  { backgroundColor: colors.primary },
  stepNum:        { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.fgMuted },
  stepNumActive:  { color: colors.secondary },
  stepLabel:      { fontSize: fontSize.xs, color: colors.fgMuted, textAlign: 'center' },
  stepLabelActive:{ color: colors.fgPrimary, fontWeight: fontWeight.semibold },
  stepLine:       { position: 'absolute', top: 14, left: '60%', right: '-40%', height: 2, backgroundColor: colors.border, zIndex: -1 },
  stepLineActive: { backgroundColor: colors.primary },

  content: { padding: spacing[3], gap: spacing[3] },

  card:       { backgroundColor: colors.bgPrimary, borderRadius: 12, padding: spacing[4], borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] },
  cardLabel:  { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgSecondary },

  sectionRow:         { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  sectionIcon:        { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.bgSecondary, justifyContent: 'center', alignItems: 'center' },
  sectionIconDone:    { backgroundColor: colors.primary },
  sectionValue:       { fontSize: fontSize.sm, color: colors.fgPrimary, marginTop: 2 },
  sectionPlaceholder: { fontSize: fontSize.sm, color: colors.fgMuted, marginTop: 2 },

  shippingRow:        { flexDirection: 'row', gap: spacing[3] },
  shippingOpt:        { flex: 1, padding: spacing[3], borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: 'center', gap: spacing[1] },
  shippingOptActive:  { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  shippingLabel:      { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  shippingLabelActive:{ color: colors.primary },
  shippingSub:        { fontSize: fontSize.xs, color: colors.fgMuted },
  shippingSubActive:  { color: colors.primary },

  summaryTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.fgPrimary, marginBottom: spacing[3] },
  lineItem:     { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] },
  lineItemDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.fgMuted },
  lineItemDotRed: { backgroundColor: colors.error },
  lineItemName: { flex: 1, fontSize: fontSize.sm, color: colors.fgPrimary },
  lineItemMeta: { fontSize: fontSize.xs, color: colors.fgMuted },
  lineItemPrice:{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgPrimary },
  divider:      { height: 1, backgroundColor: colors.border, marginVertical: spacing[3] },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[1] },
  totalLabel:   { fontSize: fontSize.sm, color: colors.fgMuted },
  totalValue:   { fontSize: fontSize.sm, color: colors.fgSecondary },
  grandLabel:   { fontSize: fontSize.base, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  grandValue:   { fontSize: fontSize.base, fontWeight: fontWeight.black, color: colors.primary },

  footer:       { padding: spacing[4], gap: spacing[3], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgPrimary },
  ghostBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], paddingVertical: spacing[3], borderRadius: 8, borderWidth: 1, borderColor: colors.primary },
  ghostBtnText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.primary },
  stockOk:      { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  stockOkText:  { fontSize: fontSize.sm, color: colors.success },
  placeBtn:     { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: spacing[4], alignItems: 'center' },
  placeBtnText: { color: colors.secondary, fontWeight: fontWeight.bold, fontSize: fontSize.base, letterSpacing: 0.5 },
  btnDisabled:  { opacity: 0.4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet:   { backgroundColor: colors.bgPrimary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing[4], maxHeight: '60%' },
  modalHandle:  { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing[4] },
  modalTitle:   { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.fgPrimary, marginBottom: spacing[3] },
  modalRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[4] },
  modalRowText: { fontSize: fontSize.base, color: colors.fgPrimary },
});
