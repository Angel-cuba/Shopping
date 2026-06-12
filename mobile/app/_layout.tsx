import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useBootstrap } from '../hooks/useBootstrap';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function RootLayoutContent() {
  useBootstrap();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootLayoutContent />
      </SafeAreaProvider>
    </Provider>
  );
}
