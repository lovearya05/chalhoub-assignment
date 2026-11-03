import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from './src/store/catalog';
import { RequestState } from './src/components/RequestState';
import { ProductScreen } from './src/screens/ProductScreen';
import { useShop } from './src/store/shop';

export default function App() {
  const shop = useShop();
  const { products, status, error, load } = useCatalog();
  useEffect(() => { void load(); }, [load]);
  return <SafeAreaProvider><SafeAreaView style={styles.root}><StatusBar barStyle="dark-content" />{shop.page === 'account' ? <Pressable onPress={() => shop.navigate('shop')}><Text>My account · Back to shop</Text></Pressable> : status !== 'ready' ? <RequestState loading={status !== 'error'} error={error ? `${error}\nCheck the API server or EXPO_PUBLIC_CATALOG_URL.` : null} onRetry={() => void load()} /> : <ProductScreen products={products} productId={shop.productId} onSelect={shop.selectProduct} cart={shop.cart} onAdd={shop.addToCart} onRemove={shop.removeFromCart} onAccount={() => shop.navigate('account')} />}</SafeAreaView></SafeAreaProvider>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
