import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, Pressable } from 'react-native';
import { products } from './src/data/catalog';
import { ProductScreen } from './src/screens/ProductScreen';
import { CartItem } from './src/types/catalog';

export default function App() {
  const [productId, setProductId] = useState(products[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [account, setAccount] = useState(false);
  return <SafeAreaView style={styles.root}><StatusBar barStyle="dark-content" />{account ? <Pressable onPress={() => setAccount(false)}><Text>My account · Back to shop</Text></Pressable> : <ProductScreen products={products} productId={productId} onSelect={setProductId} cart={cart} onAdd={(product, size, color) => setCart(items => [...items, { product, size, color, quantity: 1 }])} onRemove={index => setCart(items => items.filter((_, i) => i !== index))} onAccount={() => setAccount(true)} />}</SafeAreaView>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
