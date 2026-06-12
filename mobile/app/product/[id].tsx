import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  ActivityIndicator, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppDispatch, RootState } from '../../store';
import { addToCart } from '../../src/redux/actions/CartActions';
import { addingToWishList, removingFromWishList } from '../../src/redux/actions/WishesActions';
import { api } from '../../services/api';
import { Product } from '../../src/interfaces/products/ProductType';
import { CartProduct } from '../../src/interfaces/cart/CartType';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontSize, fontWeight } from '../../theme/typography';

export default function ProductDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const dispatch  = useDispatch<AppDispatch>();
  const router    = useRouter();

  const wishlist      = useSelector((s: RootState) => s.wishes.itemInWishlist ?? []);
  const userFromToken = useSelector((s: RootState) => s.userLogged.userFromToken);

  const [product,         setProduct]         = useState<Product | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedSize,    setSelectedSize]    = useState<string | null>(null);

  const wished = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    if (!id) return;
    api.get<Product>(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        if (data.variants?.length)  setSelectedVariant(data.variants[0] ?? null);
        if (data.sizes?.length)     setSelectedSize(data.sizes[0] ?? null);
      })
      .catch(() => Toast.show({ type: 'error', text1: 'Could not load product' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWish = () => {
    if (!userFromToken) {
      router.push('/auth/login');
      return;
    }
    if (!product) return;
    if (wished) {
      dispatch(removingFromWishList(product.id, userFromToken.user_id));
    } else {
      dispatch(addingToWishList(product.id, userFromToken.user_id));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length && !selectedSize) {
      Toast.show({ type: 'error', text1: 'Please select a size' });
      return;
    }
    const item: CartProduct = {
      id:          product.id,
      name:        product.name,
      price:       product.price,
      description: product.description,
      image:       product.image,
      categories:  product.categories ?? '',
      variant:     selectedVariant ?? undefined,
      sizes:       selectedSize ?? undefined,
      quantity:    1,
      stock:       product.inStock,
    };
    dispatch(addToCart(item));
    Toast.show({ type: 'success', text1: 'Added to bag' });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.fgMuted }}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Pressable onPress={handleWish} style={styles.headerBtn}>
          <Ionicons
            name={wished ? 'heart' : 'heart-outline'}
            size={24}
            color={wished ? colors.error : colors.fgPrimary}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image */}
        <View style={styles.imgContainer}>
          {product.image
            ? <Image source={{ uri: product.image }} style={styles.img} resizeMode="cover" />
            : <View style={styles.imgPlaceholder} />
          }
        </View>

        <View style={styles.content}>
          {/* Name & Price */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.name}</Text>
              {product.categories && (
                <Text style={styles.category}>{product.categories}</Text>
              )}
            </View>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Color</Text>
              <View style={styles.chips}>
                {product.variants.map((v) => (
                  <Pressable
                    key={v}
                    style={[styles.chip, selectedVariant === v && styles.chipActive]}
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text style={[styles.chipText, selectedVariant === v && styles.chipTextActive]}>
                      {v}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Size (EU)</Text>
              <View style={styles.chips}>
                {product.sizes.map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.chip, selectedSize === s && styles.chipActive]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={[styles.chipText, selectedSize === s && styles.chipTextActive]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Stock */}
          <Text style={styles.stock}>
            {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <Pressable
          style={[styles.addBtn, product.inStock === 0 && styles.btnDisabled]}
          onPress={handleAddToCart}
          disabled={product.inStock === 0}
        >
          <Ionicons name="bag-add-outline" size={20} color={colors.secondary} />
          <Text style={styles.addBtnText}>Add to bag</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.bgPrimary },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:        {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[2],
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: `${colors.bgPrimary}CC`,
    justifyContent: 'center', alignItems: 'center',
  },
  imgContainer: { height: 360, backgroundColor: colors.bgSecondary },
  img:          { width: '100%', height: '100%' },
  imgPlaceholder: { flex: 1, backgroundColor: colors.bgSecondary },
  content:      { padding: spacing[4] },
  nameRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[4] },
  name:         { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.fgPrimary },
  category:     { fontSize: fontSize.sm, color: colors.fgMuted, marginTop: 2 },
  price:        { fontSize: fontSize.xl, fontWeight: fontWeight.black, color: colors.primary },
  sectionBlock: { marginBottom: spacing[5] },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.fgSecondary, marginBottom: spacing[2], textTransform: 'uppercase', letterSpacing: 1 },
  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  chip:         { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary },
  chipActive:   { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText:     { fontSize: fontSize.sm, color: colors.fgSecondary },
  chipTextActive: { color: colors.secondary, fontWeight: fontWeight.semibold },
  description:  { fontSize: fontSize.sm, color: colors.fgSecondary, lineHeight: 22 },
  stock:        { fontSize: fontSize.xs, color: colors.fgMuted, marginTop: spacing[2] },
  cta:          {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing[4], backgroundColor: colors.bgPrimary,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  addBtn: {
    backgroundColor: colors.primary, borderRadius: 8,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: spacing[2], paddingVertical: spacing[4],
  },
  btnDisabled: { opacity: 0.4 },
  addBtnText: { color: colors.secondary, fontWeight: fontWeight.bold, fontSize: fontSize.base, letterSpacing: 1 },
});
