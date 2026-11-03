import { useEffect } from 'react';
import { BackHandler, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from './src/store/catalog';
import { RequestState } from './src/components/RequestState';
import { ProductScreen } from './src/screens/ProductScreen';
import { useShop } from './src/store/shop';
import { AccountScreen } from './src/screens/AccountScreen';

export default function App() {
  const shop = useShop();
  const { products, status, error, load } = useCatalog();
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (shop.page === 'account') {
        shop.navigate('shop');
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [shop.page, shop.navigate]);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" />
        {shop.page === 'account' ? (
          <AccountScreen onBack={() => shop.navigate('shop')} />
        ) : status !== 'ready' ? (
          <RequestState loading={status !== 'error'} error={error} onRetry={() => void load()} />
        ) : (
          <ProductScreen
            products={products}
            productId={shop.productId}
            onSelect={shop.selectProduct}
            cart={shop.cart}
            onAdd={shop.addToCart}
            onRemove={shop.removeFromCart}
            onAccount={() => shop.navigate('account')}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
