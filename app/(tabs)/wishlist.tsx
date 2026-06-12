import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '../../store';
import { removingFromWishList } from '../../src/redux/actions/WishesActions';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function WishlistScreen() {
  const dispatch      = useDispatch<AppDispatch>();
  const router        = useRouter();
  const wishlist      = useSelector((s: RootState) => s.wishes.itemInWishlist ?? []);
  const products      = useSelector((s: RootState) => s.products.products);
  const userFromToken = useSelector((s: RootState) => s.userLogged.userFromToken);

  const wishedProducts = products.filter((p: { id: string }) => wishlist.includes(p.id));

  if (!userFromToken) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={56} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Sign in to see your wishlist</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if (wishedProducts.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={56} color={colors.fgMuted} />
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/')}>
          <Text style={styles.btnText}>Browse products</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.count}>{wishedProducts.length} items</Text>
      </View>
      <FlatList
        data={wishedProducts}
        keyExtractor={(item: { id: string }) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing[3] }}
        contentContainerStyle={{ padding: spacing[3] }}
        renderItem={({ item }: { item: { id: string; name: string; price: number } }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <View style={styles.cardImg} />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.cardPrice}>${item.price}</Text>
              <Pressable
                style={styles.removeBtn}
                onPress={() => {
                  if (userFromToken) {
                    dispatch(removingFromWishList(item.id, userFromToken.user_id));
                  }
                }}
              >
                <Ionicons name="heart" size={16} color={colors.error} />
                <Text style={styles.removeTxt}>Remove</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingHorizontal: spacing[4],
    paddingTop:      spacing[12],
    paddingBottom:   spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  count: { fontSize: fontSize.sm, color: colors.fgMuted },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[4], padding: spacing[8] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.fgSecondary, textAlign: 'center' },
  btn: { backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: 8 },
  btnText: { color: colors.secondary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  card: { flex: 1, backgroundColor: colors.bgCard, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: spacing[3] },
  cardImg: { height: 160, backgroundColor: colors.bgSecondary },
  cardBody: { padding: spacing[3] },
  cardName: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgPrimary, marginBottom: spacing[1] },
  cardPrice: { fontSize: fontSize.base, fontWeight: fontWeight.bold, color: colors.primary, marginBottom: spacing[2] },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  removeTxt: { fontSize: fontSize.xs, color: colors.error },
});
