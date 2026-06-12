import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { colors } from '../../theme/colors';

export default function TabLayout() {
  const cartCount  = useSelector((s: RootState) => s.cart.itemInCart?.length ?? 0);
  const wishCount  = useSelector((s: RootState) => s.wishes.itemInWishlist?.length ?? 0);
  const authed     = useSelector((s: RootState) => !!s.userLogged.userFromToken);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.fgMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.bgPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          href: authed ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          tabBarBadge: wishCount > 0 ? wishCount : undefined,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: authed ? 'Profile' : 'Sign in',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
