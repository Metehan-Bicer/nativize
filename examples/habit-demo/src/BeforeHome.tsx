// The "before" screen: the kind of home screen a model writes when asked for "a beautiful habit tracker".
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HABITS } from './habits';

const { height } = Dimensions.get('window');

export default function BeforeHome() {
  const done = HABITS.filter((h) => h.done).length;
  return (
    <View style={{ flex: 1, backgroundColor: '#0F0A1F' }}>
      <LinearGradient colors={['#7C3AED', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.hello} allowFontScaling={false}>Hey there, superstar! 👋</Text>
        <Text style={styles.headline} allowFontScaling={false}>Unlock your full potential 🚀</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{done}/{HABITS.length}</Text>
            <Text style={styles.statLabel}>TODAY</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>🔥 12</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>⚡ 86%</Text>
            <Text style={styles.statLabel}>SCORE</Text>
          </View>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        <Text style={styles.section}>✨ YOUR HABITS ✨</Text>
        {HABITS.map((h) => (
          <View key={h.id} style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.emoji}>{h.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{h.name}</Text>
                <Text style={styles.cardSub}>{h.detail} • 🔥 {h.streak} day streak!</Text>
              </View>
              <TouchableOpacity style={[styles.check, h.done && styles.checkDone]}>
                <Text style={{ color: '#fff', fontSize: 14 }}>{h.done ? '✓' : ''}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <LinearGradient colors={['#F59E0B', '#EC4899', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.pro}>
          <Text style={styles.proTitle}>Go PRO ✨</Text>
          <Text style={styles.proText}>Supercharge your habits with AI insights!</Text>
        </LinearGradient>
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.fabInner}>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '300' }}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: height * 0.36, paddingTop: 70, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, alignItems: 'center' },
  hello: { color: '#F5D0FE', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  headline: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  statNum: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#FBCFE8', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },
  section: { color: '#C4B5FD', fontSize: 13, fontWeight: '800', letterSpacing: 3, textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#1E1638', borderRadius: 24, padding: 6, marginBottom: 14, shadowColor: '#8B5CF6', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  cardInner: { backgroundColor: '#251C45', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  emoji: { fontSize: 30 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardSub: { color: '#A78BFA', fontSize: 13, marginTop: 3 },
  check: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: '#8B5CF6', shadowColor: '#EC4899', shadowOpacity: 0.9, shadowRadius: 10 },
  pro: { borderRadius: 24, padding: 22, marginTop: 8, alignItems: 'center' },
  proTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  proText: { color: '#fff', fontSize: 14, marginTop: 4, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 40, alignSelf: 'center', shadowColor: '#EC4899', shadowOpacity: 0.9, shadowRadius: 24 },
  fabInner: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
});
