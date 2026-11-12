import { SafeAreaProvider } from 'react-native-safe-area-context';

import AfterHome from './src/AfterHome';
import BeforeHome from './src/BeforeHome';

// Build with EXPO_PUBLIC_SCREEN=after to see the nativized screen; the default is the "before" screen.
export default function App() {
  return <SafeAreaProvider>{process.env.EXPO_PUBLIC_SCREEN === 'after' ? <AfterHome /> : <BeforeHome />}</SafeAreaProvider>;
}
