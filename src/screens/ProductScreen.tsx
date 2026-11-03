import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ProductImage } from '../components/ProductImage';
import { CartItem, Category, Product } from '../types/catalog';

const categories: Category[] = ['MEN', 'WOMEN', 'KIDS', 'FTW', 'ACCESSORIES'];
type Props = {
  products: Product[];
  productId: string;
  onSelect: (id: string) => void;
  cart: CartItem[];
  onAdd: (product: Product, size: string, color: string) => void;
  onRemove: (index: number) => void;
  onAccount: () => void;
};
export function ProductScreen({ products, productId, onSelect, cart, onAdd, onRemove, onAccount }: Props) {
  const [category, setCategory] = useState<Category>('MEN');
  const [query, setQuery] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [message, setMessage] = useState('');
  const [zoom, setZoom] = useState(false);
  const [bag, setBag] = useState(false);
  const product = products.find(p => p.id === productId) ?? products[0];
  const filtered = products.filter(p => p.category === category && p.title.toLowerCase().includes(query.trim().toLowerCase()));
  const searching = !!query.trim() || category !== product?.category;
  const chooseProduct = (p: Product) => { onSelect(p.id); setSize(''); setColor(''); setMessage(''); setQuery(''); setCategory(p.category); };
  if (!product) return <Text>No products available.</Text>;
  return <>
    <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
      <View style={s.utility}><Pressable accessibilityRole="button" onPress={onAccount}><Text style={s.utilityText}>My account</Text></Pressable><Pressable accessibilityRole="button" onPress={() => setBag(true)}><Text style={s.utilityText}>Bag ({cart.reduce((n, item) => n + item.quantity, 0)})</Text></Pressable></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Return to featured product" onPress={() => chooseProduct(products[0])}><Text style={s.logo}>LOGO</Text></Pressable>
      <View style={s.categories}>{categories.map(item => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)}><Text style={[s.category, category === item && s.activeCategory]}>{item}</Text></Pressable>)}</View>
      <View style={s.search}><TextInput accessibilityLabel="Search products" placeholder="SEARCH" placeholderTextColor="#a0a0a0" value={query} onChangeText={setQuery} style={s.searchInput} returnKeyType="search" /><Text style={s.searchIcon}>⌕</Text></View>
      {searching ? <View style={s.results}><Text style={s.section}>{filtered.length} RESULTS</Text>{filtered.length === 0 && <Text style={s.copy}>No products found. Try MEN or a different search.</Text>}{filtered.map(p => <Pressable accessibilityRole="button" key={p.id} onPress={() => chooseProduct(p)} style={s.result}><View style={{ width: 64 }}><ProductImage product={p} /></View><Text style={s.title}>{p.title}</Text></Pressable>)}</View> : <>
        <View style={s.hero}><ProductImage product={product} /><Pressable accessibilityRole="button" accessibilityLabel="Enlarge product image" onPress={() => setZoom(true)} style={s.expand}><Text style={{ fontSize: 23 }}>⛶</Text></Pressable></View>
        <Text style={s.title}>{product.title}</Text><Text style={s.price}>{product.currency} {product.price}</Text>
        <View style={s.sizes}><Text style={s.light}>Available Sizes:</Text>{product.sizes.map(item => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Size ${item}`} accessibilityState={{ selected: size === item }} onPress={() => { setSize(item); setMessage(''); }} style={[s.size, size === item && s.selectedSize]}><Text style={[s.light, size === item && s.chosen]}>{item}</Text></Pressable>)}</View>
        <Text style={s.light}>Colors:</Text><View style={s.swatches}>{product.colors.map(item => <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`Color ${item.name}`} accessibilityState={{ selected: color === item.name }} onPress={() => { setColor(item.name); setMessage(''); }} style={[s.swatch, { backgroundColor: item.hex }, color === item.name && s.selectedSwatch]} />)}{color ? <Text style={s.copy}>{color}</Text> : null}</View>
        <Pressable accessibilityRole="button" onPress={() => { if (!size || !color) { setMessage('Please choose a size and color.'); return; } onAdd(product, size, color); setMessage('Added to your bag.'); }} style={[s.add, size && color ? s.ready : null]}><Text style={[s.addText, size && color ? { color: 'white' } : null]}>ADD TO BAG</Text></Pressable>
        {!!message && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.message}>{message}</Text>}
        <Text style={s.section}>DESCRIPTION</Text><Text style={s.copy}>{product.description}</Text><Text style={[s.copy, { marginTop: 18 }]}>{product.details.join('\n')}</Text>
        <View style={s.related}><Text style={s.section}>SEE MORE PRODUCTS</Text><View style={s.relatedRow}>{products.filter(p => p.id !== product.id).map(p => <Pressable accessibilityRole="button" accessibilityLabel={`View ${p.title}`} key={p.id} onPress={() => chooseProduct(p)} style={s.thumbnail}><ProductImage product={p} /></Pressable>)}</View></View>
      </>}
    </ScrollView>
    <Modal visible={zoom} transparent animationType="fade" onRequestClose={() => setZoom(false)}><View style={s.overlay}><View style={s.dialog}><Pressable accessibilityRole="button" onPress={() => setZoom(false)}><Text style={s.close}>Close image ×</Text></Pressable><ProductImage product={product} /></View></View></Modal>
    <Modal visible={bag} transparent animationType="slide" onRequestClose={() => setBag(false)}><View style={s.overlay}><View style={s.dialog}><Pressable accessibilityRole="button" onPress={() => setBag(false)}><Text style={s.close}>Close bag ×</Text></Pressable><Text style={s.title}>Your bag</Text><ScrollView style={{ maxHeight: 360 }}>{cart.length === 0 && <Text style={s.copy}>Your bag is empty.</Text>}{cart.map((item, i) => <View key={`${item.product.id}-${item.size}-${item.color}`} style={s.bagItem}><Text style={s.copy}>{item.product.title} · {item.size} · {item.color}{'\n'}Qty {item.quantity} · {item.product.currency} {item.product.price * item.quantity}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Remove ${item.product.title} ${item.size} ${item.color}`} onPress={() => onRemove(i)}><Text style={s.utilityText}>Remove</Text></Pressable></View>)}</ScrollView><Text style={s.total}>Total: {product.currency} {cart.reduce((n, i) => n + i.product.price * i.quantity, 0)}</Text><Text style={s.copy}>Demo shopping bag. Payment is outside this assignment.</Text></View></View></Modal>
  </>;
}
const s = StyleSheet.create({
  page: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: 24, paddingBottom: 32 },
  utility: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 }, utilityText: { fontSize: 12, color: '#5e5e5e', textDecorationLine: 'underline', paddingVertical: 8 },
  logo: { fontSize: 64, fontWeight: '900', textAlign: 'center', color: '#000', marginTop: 0, marginBottom: 30, letterSpacing: -3 },
  categories: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, category: { fontSize: 13, color: '#606060', paddingVertical: 7 }, activeCategory: { color: '#111' },
  search: { borderWidth: 1, borderColor: '#e2e2e2', borderRadius: 3, flexDirection: 'row', alignItems: 'center', height: 28, marginBottom: 30 }, searchInput: { flex: 1, fontSize: 10, paddingHorizontal: 9, paddingVertical: 4, color: '#444' }, searchIcon: { color: '#666', paddingRight: 8, fontSize: 20 },
  hero: { position: 'relative', marginBottom: 20 }, expand: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#fff', paddingHorizontal: 3 },
  title: { fontSize: 18, fontWeight: '600', color: '#5c5c5c', marginBottom: 4 }, price: { fontSize: 17, fontWeight: '300', color: '#666', marginBottom: 16 },
  sizes: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }, light: { color: '#888', fontSize: 17, fontWeight: '300' }, size: { minWidth: 33, minHeight: 36, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: 'transparent' }, selectedSize: { borderColor: '#111' }, chosen: { color: '#111', fontWeight: '500' },
  swatches: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 6, marginBottom: 19 }, swatch: { width: 29, height: 29, borderRadius: 3, borderWidth: 1, borderColor: '#d4d4d4' }, selectedSwatch: { borderWidth: 3, borderColor: '#888' },
  add: { borderRadius: 4, backgroundColor: '#e5e5e5', alignItems: 'center', padding: 14, marginBottom: 19 }, ready: { backgroundColor: '#004c49' }, addText: { fontSize: 11, letterSpacing: 1, color: '#666', fontWeight: '600' }, message: { fontSize: 13, marginBottom: 16, color: '#004c49' },
  section: { fontSize: 12, fontWeight: '600', color: '#606060', marginBottom: 8 }, copy: { fontSize: 12, fontWeight: '300', color: '#777', lineHeight: 18 },
  related: { borderTopWidth: 1, borderColor: '#eee', marginTop: 20, paddingTop: 20 }, relatedRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 }, thumbnail: { flex: 1 },
  overlay: { flex: 1, backgroundColor: '#0009', alignItems: 'center', justifyContent: 'center', padding: 20 }, dialog: { backgroundColor: '#fff', width: '100%', maxWidth: 440, padding: 20, borderRadius: 6 }, close: { textAlign: 'right', paddingVertical: 12, color: '#004c49' }, bagItem: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 14 }, total: { fontSize: 18, marginVertical: 16, fontWeight: '600' }, results: { minHeight: 300 }, result: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 12 },
});
