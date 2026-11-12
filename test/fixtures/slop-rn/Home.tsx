import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const H = Dimensions.get('window').height * 0.8;

export default function Home() {
  return (
    <LinearGradient colors={['#8B5CF6', '#EC4899']} style={{ height: H }}>
      <Text style={styles.title} allowFontScaling={false}>Unlock your full potential</Text>
      <Text style={styles.label}>🔥 Streak</Text>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.button}><Text style={styles.cta}>Let's go! 🚀</Text></View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: '900', textTransform: 'uppercase' },
  label: { fontSize: 14 },
  cta: { fontSize: 18 },
  a: { fontSize: 12 },
  b: { fontSize: 13 },
  c: { fontSize: 15 },
  button: { shadowColor: '#7C3AED', shadowOpacity: 0.6, shadowRadius: 20, height: 700 },
});
