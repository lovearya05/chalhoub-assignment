import { StatusBar, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { products } from './src/data/catalog';
import { ProductScreen } from './src/screens/ProductScreen';
import { useShop } from './src/store/shop';

export default function App() {
  const shop = useShop();
  return <SafeAreaProvider><SafeAreaView style={styles.root}><StatusBar barStyle="dark-content" />{shop.page === 'account' ? <Pressable onPress={() => shop.navigate('shop')}><Text>My account · Back to shop</Text></Pressable> : <ProductScreen products={products} productId={shop.productId} onSelect={shop.selectProduct} cart={shop.cart} onAdd={shop.addToCart} onRemove={shop.removeFromCart} onAccount={() => shop.navigate('account')} />}</SafeAreaView></SafeAreaProvider>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
