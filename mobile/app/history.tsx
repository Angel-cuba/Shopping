import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable,
  ActivityIndicator, Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';
import { api } from '../services/api';
import { History, OrderStatus, orderDetailsItem } from '../src/interfaces/profile/order/orderType';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

// ── Status badgeStyles ──────────────────────────────────────────────
const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING:    '#F59E0B',
  CONFIRMED:  '#3B82F6',
  PROCESSING: '#8B5CF6',
  SHIPPED:    '#06B6D4',
  DELIVERED:  '#10B981',
  CANCELLED:  '#EF4444',
};

function StatusBadge({ status }: { status?: OrderStatus }) {
  const color = status ? STATUS_COLOR[status] : colors.fgMuted;
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
      <View style={[badgeStyles.dot, { backgroundColor: color }]} />
      <Text style={[badgeStyles.text, { color }]}>{status ?? 'UNKNOWN'}</Text>
    </View>
  );
}
const badgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  dot:  { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
});

// ── Date formatter ────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Order items row (lazy-loaded per order) ───────────────────
function OrderItems({ detailIds }: { detailIds: string[] }) {
  const [items,   setItems]   = useState<orderDetailsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!detailIds.length) { setLoading(false); return; }
    let cancelled = false;
    api.get<orderDetailsItem[]>('/order-details/all-order-details', {
      params: { orderDetailsIds: detailIds.join(',') },
    })
      .then(({ data }) => { if (!cancelled) setItems(data); })
      .catch(() => { /* silent — order header still shows */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [detailIds]);

  if (loading) {
    return (
      <View style={itemStyles.row}>
        {[0, 1, 2].map((i) => <View key={i} style={itemStyles.skeleton} />)}
      </View>
    );
  }

  if (!items.length) return null;

  return (
    <View style={itemStyles.row}>
      {items.map((item) => (
        <View key={item.id} style={itemStyles.thumb}>
          {item.image
            ? <Image source={{ uri: item.image }} style={itemStyles.img} resizeMode="cover" />
            : <View style={itemStyles.imgPlaceholder} />
          }
          <Text style={itemStyles.size}>EU {item.size}</Text>
          <Text style={itemStyles.price}>${item.price}</Text>
          {item.quantity > 1 && <Text style={itemStyles.qty}>×{item.quantity}</Text>}
        </View>
      ))}
    </View>
  );
}
const itemStyles = StyleSheet.create({
  row:         { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3] },
  skeleton:    { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.bgSecondary },
  thumb:       { alignItems: 'center', gap: 2 },
  img:         { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.bgSecondary },
  imgPlaceholder: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.bgSecondary },
  size:        { fontSize: fontSize.xs, color: colors.fgMuted },
  price:       { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.fgPrimary },
  qty:         { fontSize: fontSize.xs, color: colors.fgMuted },
});

// ── Main screen ───────────────────────────────────────────────
export default function HistoryScreen() {
  const router        = useRouter();
  const userFromToken = useSelector((s: RootState) => s.userLogged.userFromToken);

  const [orders,  setOrders]  = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchOrders = useCallback(() => {
    if (!userFromToken?.user_id) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    api.get<History[]>(`/orders/${userFromToken.user_id}`)
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userFromToken?.user_id]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (!userFromToken) {
    return (
      <View style={styles.center}>
        <Ionicons name="receipt-outline" size={48} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Sign in to see your orders</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Order history</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.fgMuted} />
          <Text style={styles.emptyTitle}>Couldn't load orders</Text>
          <Pressable style={styles.btn} onPress={fetchOrders}>
            <Text style={styles.btnText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && orders.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="bag-outline" size={48} color={colors.fgMuted} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>When you complete a purchase it'll appear here.</Text>
          <Pressable style={styles.btn} onPress={() => router.replace('/')}>
            <Text style={styles.btnText}>Browse products</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && orders.length > 0 && (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: order }) => (
            <View style={styles.card}>
              {/* Order header */}
              <View style={styles.cardTop}>
                <View style={{ flex: 1, gap: spacing[2] }}>
                  <StatusBadge status={order.status} />
                  <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="card-outline" size={13} color={colors.fgMuted} />
                    <Text style={styles.meta}>{order.paymentType}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name={order.shippingMethod === 'DOOR' ? 'home-outline' : 'business-outline'}
                      size={13}
                      color={colors.fgMuted}
                    />
                    <Text style={styles.meta}>
                      {order.shippingMethod === 'DOOR' ? 'Home delivery' : 'Store pickup'}
                    </Text>
                  </View>
                  {order.shippingAddress ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="location-outline" size={13} color={colors.fgMuted} />
                      <Text style={styles.meta} numberOfLines={1}>{order.shippingAddress}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.totalBlock}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Items */}
              <OrderItems detailIds={order.orderDetails} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bgSecondary },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[4], padding: spacing[8] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  emptySub:   { fontSize: fontSize.sm, color: colors.fgMuted, textAlign: 'center' },
  btn:        { backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: 8 },
  btnText:    { color: colors.secondary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[4],
    backgroundColor: colors.bgPrimary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  list:        { padding: spacing[3] },
  card: {
    backgroundColor: colors.bgPrimary, borderRadius: 12,
    padding: spacing[4], borderWidth: 1, borderColor: colors.border,
  },
  cardTop:    { flexDirection: 'row', gap: spacing[3] },
  date:       { fontSize: fontSize.xs, color: colors.fgMuted },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  meta:       { fontSize: fontSize.xs, color: colors.fgSecondary, flex: 1 },
  totalBlock: { alignItems: 'flex-end' },
  totalLabel: { fontSize: fontSize.xs, color: colors.fgMuted },
  totalValue: { fontSize: fontSize.xl, fontWeight: fontWeight.black, color: colors.primary },
  divider:    { height: 1, backgroundColor: colors.border, marginVertical: spacing[3] },
});
