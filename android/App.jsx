import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import WatchScreen from './src/screens/WatchScreen';
import WatchPartyScreen from './src/screens/WatchPartyScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = { Home: focused ? '🏠' : '🏠', Search: focused ? '🔍' : '🔍', Profile: focused ? '👤' : '👤' };
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      tabBarStyle: { backgroundColor: '#141420', borderTopColor: '#1e1e2e', borderTopWidth: 1, height: 58, paddingBottom: 8 },
      tabBarActiveTintColor: '#e50914',
      tabBarInactiveTintColor: '#8a8a9a',
      tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#e50914', fontSize: 42, fontWeight: '900', letterSpacing: 4 }}>KDRAMA</Text>
      <Text style={{ color: '#f5c518', fontSize: 42, fontWeight: '900' }}>X</Text>
    </View>
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0f' }, animation: 'slide_from_right' }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Watch" component={WatchScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="WatchParty" component={WatchPartyScreen} options={{ animation: 'slide_from_bottom' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
