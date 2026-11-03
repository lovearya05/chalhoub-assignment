import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Product } from '../types/catalog';

/** Crop the supplied reference at render time; no generated substitute artwork. */
export function ProductImage({ product }: { product: Product }) {
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.imageUrl]);
  const crop = product.crop;
  const scale = crop ? width / crop.width : 1;
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.frame, { aspectRatio: crop ? crop.width / crop.height : 1 }]}
    >
      {failed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Retry image for ${product.title}`}
          onPress={() => setFailed(false)}
          style={styles.unavailable}
        >
          <Text style={styles.caption}>Image unavailable. Tap to retry.</Text>
        </Pressable>
      ) : (
        <Image
          accessibilityLabel={product.title}
          source={{ uri: product.imageUrl }}
          onError={() => setFailed(true)}
          resizeMode={crop ? 'stretch' : 'contain'}
          style={
            crop
              ? {
                  position: 'absolute',
                  width: 375 * scale,
                  height: 1131 * scale,
                  left: -crop.x * scale,
                  top: -crop.y * scale,
                }
              : StyleSheet.absoluteFill
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: '#f5f5f7', width: '100%' },
  unavailable: { flex: 1, justifyContent: 'center', padding: 8 },
  caption: { fontSize: 11, textAlign: 'center', color: '#666' },
});
