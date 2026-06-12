import { useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '../../store';
import { fetchProducts } from '../../src/redux/actions/ProductActions';
import { Product } from '../../src/interfaces/products/ProductType';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router   = useRouter();
  const { products, loading } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>STRIDE</Text>
      </View>
      <FlatList
        data={products as Product[]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <View style={styles.cardImg} />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.cardPrice}>${item.price}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: colors.fgMuted }}>No products found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:    {
    paddingHorizontal: spacing[4],
    paddingTop:        spacing[12],
    paddingBottom:     spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor:   colors.bgPrimary,
  },
  brand: {
    fontSize:   fontSize['2xl'],
    fontWeight: fontWeight.black,
    letterSpacing: 4,
    color: colors.primary,
  },
  list: { padding: spacing[3] },
  row:  { gap: spacing[3] },
  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    marginBottom: spacing[3],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImg: {
    height: 180,
    backgroundColor: colors.bgSecondary,
  },
  cardBody: { padding: spacing[3] },
  cardName: {
    fontSize:   fontSize.sm,
    fontWeight: fontWeight.semibold,
    color:      colors.fgPrimary,
    marginBottom: spacing[1],
  },
  cardPrice: {
    fontSize:   fontSize.base,
    fontWeight: fontWeight.bold,
    color:      colors.primary,
  },
});
