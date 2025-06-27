import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useVideoStore } from '@/stores/videoStore';

const RootLayout = () => {
  useFrameworkReady();
  const { loadStoredData } = useVideoStore();

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="comment"
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: '#18181b' },
            headerTintColor: '#fff',
            headerShadowVisible: false,
            headerBackTitle: 'Browse',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#000" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default RootLayout;
