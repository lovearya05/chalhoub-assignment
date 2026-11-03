import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Account, getAccount } from '../api/account';
import { RequestState } from '../components/RequestState';

export function AccountScreen({ onBack }: { onBack: () => void }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setAccount(null);
    setError(null);
    getAccount()
      .then((value) => {
        if (active) setAccount(value);
      })
      .catch((error) => {
        if (active)
          setError(error instanceof Error ? error.message : 'Unable to load your account.');
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return (
    <View style={s.root}>
      <Pressable accessibilityRole="button" onPress={onBack} style={s.back}>
        <Text style={s.link}>‹ Back to shop</Text>
      </Pressable>
      <Text style={s.heading}>My account</Text>
      {!account ? (
        <RequestState loading={!error} error={error} onRetry={() => setAttempt((n) => n + 1)} />
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          <Image
            accessibilityLabel={`${account.name}'s avatar`}
            source={{ uri: account.image }}
            style={s.avatar}
          />
          <Text style={s.name}>{account.name}</Text>
          <Text style={s.caption}>Welcome back to Tiger Store</Text>
          {[
            ['Status', account.status],
            ['Species', account.species],
            ['Gender', account.gender],
            ['Origin', account.origin.name],
            ['Location', account.location.name],
          ].map(([label, value]) => (
            <View style={s.row} key={label}>
              <Text style={s.label}>{label}</Text>
              <Text style={s.value}>{value}</Text>
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            style={s.refresh}
            onPress={() => setAttempt((n) => n + 1)}
          >
            <Text style={s.link}>Refresh profile</Text>
          </Pressable>
          <Text style={s.caption}>Demo profile provided by the Rick and Morty API.</Text>
        </ScrollView>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: 24 },
  back: { paddingVertical: 18 },
  link: { color: '#004c49', fontSize: 14 },
  heading: { fontSize: 28, fontWeight: '600', color: '#333', marginBottom: 24 },
  content: { alignItems: 'center', paddingBottom: 32 },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee' },
  name: { fontSize: 24, fontWeight: '600', marginTop: 18, color: '#333' },
  caption: { fontSize: 12, color: '#777', marginVertical: 12, textAlign: 'center' },
  row: { width: '100%', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 16 },
  label: { color: '#888', fontSize: 12, marginBottom: 5 },
  value: { color: '#444', fontSize: 15 },
  refresh: { padding: 18 },
});
