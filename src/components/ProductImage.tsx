import { Image, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Product } from '../types/catalog';

/** Crop the supplied reference at render time; no generated substitute artwork. */
export function ProductImage({ product }: { product: Product }) {
  const [width, setWidth] = useState(0);
  const crop = product.crop;
  const scale = crop ? width / crop.width : 1;
  return (
    <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[styles.frame, { aspectRatio: crop ? crop.width / crop.height : 1 }]}>
      <Image accessibilityLabel={product.title} source={product.imageUrl === 'reference' ? require('../../layout/task.png') : { uri: product.imageUrl }}
        resizeMode={crop ? 'stretch' : 'contain'}
        style={crop ? { position: 'absolute', width: 375 * scale, height: 1131 * scale, left: -crop.x * scale, top: -crop.y * scale } : StyleSheet.absoluteFill} />
    </View>
  );
}
const styles = StyleSheet.create({ frame: { overflow: 'hidden', backgroundColor: '#f5f5f7', width: '100%' } });
