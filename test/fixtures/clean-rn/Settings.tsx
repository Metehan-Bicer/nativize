import { PlatformColor, Pressable, ScrollView, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';

export default function Settings() {
  const scheme = useColorScheme();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: PlatformColor('systemGroupedBackground') }}>
      <View style={styles.section}>
        <Text style={styles.row}>Reminders</Text>
        <Switch value={scheme === 'dark'} />
      </View>
      <Pressable style={({ pressed }) => [styles.section, { opacity: pressed ? 0.7 : 1 }]}>
        <Text style={styles.row}>Restore purchases</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { borderRadius: 12, padding: 16 },
  row: { fontSize: 17 },
});
