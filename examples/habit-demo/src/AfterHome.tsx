// The "after" screen: the same content after a nativize pass.
// Direction: calm and friendly like the best habit apps, system colors, one green accent for progress,
// and the week chart as the one memorable moment.
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { PlatformColor, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HABITS, WEEK } from './habits';

const accent = PlatformColor('systemGreen');
const label = PlatformColor('label');
const secondary = PlatformColor('secondaryLabel');
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function AfterHome() {
  const insets = useSafeAreaInsets();
  const done = HABITS.filter((h) => h.done).length;
  return (
    <ScrollView
      style={{ backgroundColor: PlatformColor('systemGroupedBackground') }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
    >
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.date} maxFontSizeMultiplier={1.6}>Thursday, November 12</Text>
          <Text style={styles.largeTitle} maxFontSizeMultiplier={1.4}>Today</Text>
        </View>
        <Pressable accessibilityLabel="Add habit" hitSlop={8} style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.5 }]}>
          <SymbolView name="plus.circle.fill" size={30} tintColor={accent} />
        </Pressable>
      </View>

      <View style={[styles.group, styles.summary]}>
        <Text style={styles.headline}>{done} of {HABITS.length} done</Text>
        <Text style={styles.subhead}>12 day streak on Morning walk</Text>
        <View style={styles.week}>
          {WEEK.map((v, i) => (
            <View key={i} style={styles.day}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${v * 100}%`, opacity: i === 3 ? 1 : 0.55 }]} />
              </View>
              <Text style={[styles.caption, i === 3 && { color: label, fontWeight: '600' }]}>{DAYS[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionHeader}>Habits</Text>
      <View style={styles.group}>
        {HABITS.map((h, i) => (
          <Pressable key={h.id} style={({ pressed }) => [styles.row, pressed && { backgroundColor: PlatformColor('systemFill') }]}>
            <View style={styles.rowIcon}>
              <SymbolView name={h.symbol as SymbolViewProps['name']} size={17} tintColor={PlatformColor('secondaryLabel')} />
            </View>
            <View style={[styles.rowText, i > 0 && styles.separator]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.body}>{h.name}</Text>
                <Text style={styles.subhead}>
                  {h.detail}
                  {h.streak > 0 ? ` · ${h.streak} days` : ''}
                </Text>
              </View>
              <SymbolView
                name={h.done ? 'checkmark.circle.fill' : 'circle'}
                size={26}
                tintColor={h.done ? accent : PlatformColor('tertiaryLabel')}
                accessibilityLabel={h.done ? 'Done' : 'Not done'}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={[styles.group, { marginTop: 28 }]}>
        <Pressable style={({ pressed }) => [styles.row, pressed && { backgroundColor: PlatformColor('systemFill') }]}>
          <View style={[styles.rowText, { paddingLeft: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.body}>Habit Pro</Text>
              <Text style={styles.subhead}>Unlimited habits, reminders and full history</Text>
            </View>
            <SymbolView name="chevron.right" size={14} tintColor={PlatformColor('tertiaryLabel')} />
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 16 },
  date: { fontSize: 13, fontWeight: '600', color: secondary },
  largeTitle: { fontSize: 34, fontWeight: '700', color: label },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  group: { marginHorizontal: 16, borderRadius: 12, backgroundColor: PlatformColor('secondarySystemGroupedBackground'), overflow: 'hidden' },
  summary: { padding: 16 },
  headline: { fontSize: 17, fontWeight: '600', color: label },
  body: { fontSize: 17, color: label },
  subhead: { fontSize: 15, color: secondary, marginTop: 2 },
  caption: { fontSize: 12, color: secondary, marginTop: 6 },
  week: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  day: { alignItems: 'center', flex: 1 },
  barTrack: { width: 18, height: 64, borderRadius: 9, backgroundColor: PlatformColor('systemFill'), justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 9, backgroundColor: accent },
  sectionHeader: { fontSize: 13, color: secondary, marginTop: 28, marginBottom: 7, marginHorizontal: 36 },
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: 16 },
  rowIcon: { width: 30, height: 30, borderRadius: 7, backgroundColor: PlatformColor('tertiarySystemFill'), alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingRight: 16, minHeight: 56 },
  separator: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: PlatformColor('separator') },
});
