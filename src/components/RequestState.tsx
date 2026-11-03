import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export function RequestState({ loading, error, onRetry }: { loading: boolean; error: string | null; onRetry: () => void }) {
  return <View style={s.root}>{loading ? <><ActivityIndicator size="large" color="#004c49" /><Text style={s.text}>Loading…</Text></> : <><Text accessibilityRole="alert" style={s.text}>{error}</Text><Pressable accessibilityRole="button" style={s.button} onPress={onRetry}><Text style={{ color: 'white' }}>Try again</Text></Pressable></>}</View>;
}
const s = StyleSheet.create({ root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }, text: { color: '#666', textAlign: 'center', marginVertical: 16, lineHeight: 22 }, button: { backgroundColor: '#004c49', padding: 14, borderRadius: 4 } });
