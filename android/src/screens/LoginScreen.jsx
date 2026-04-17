import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Enter your email');
    setLoading(true);
    try {
      if (tab === 'login') {
        if (!password) return Alert.alert('Error', 'Enter password');
        await login(email.trim(), password);
      } else if (tab === 'register') {
        if (!name || !password) return Alert.alert('Error', 'Fill all fields');
        await register(name.trim(), email.trim(), password);
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <LinearGradient colors={['#0a0a0f', '#141420', '#0a0a0f']} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoWrap}>
            <Text style={s.logoRed}>KDRAMA</Text>
            <Text style={s.logoGold}>X</Text>
          </View>
          <Text style={s.tagline}>Stream Korean Dramas Together</Text>

          {/* Card */}
          <View style={s.card}>
            {/* Tab Switcher */}
            <View style={s.tabs}>
              {[['login','🔐 Login'],['register','✨ Register']].map(([id, label]) => (
                <TouchableOpacity key={id} style={[s.tab, tab===id && s.tabActive]} onPress={() => setTab(id)}>
                  <Text style={[s.tabTxt, tab===id && s.tabTxtActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {tab === 'register' && (
              <TextInput style={s.input} placeholder="Full Name" placeholderTextColor="#8a8a9a"
                value={name} onChangeText={setName} />
            )}

            <TextInput style={s.input} placeholder="Email Address" placeholderTextColor="#8a8a9a"
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <TextInput style={s.input} placeholder="Password" placeholderTextColor="#8a8a9a"
              value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={[s.btn, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
              <Text style={s.btnTxt}>
                {loading ? '⏳ Please wait...' : tab==='login' ? '▶  Sign In' : '✨  Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
  logoRed: { fontSize: 52, fontWeight: '900', color: '#e50914', letterSpacing: 3 },
  logoGold: { fontSize: 52, fontWeight: '900', color: '#f5c518' },
  tagline: { textAlign: 'center', color: '#8a8a9a', fontSize: 14, marginBottom: 36 },
  card: { backgroundColor: 'rgba(20,20,32,0.95)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#e50914', shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 },
  tabs: { flexDirection: 'row', backgroundColor: '#0a0a0f', borderRadius: 12, marginBottom: 20, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#e50914' },
  tabTxt: { color: '#8a8a9a', fontWeight: '600', fontSize: 12 },
  tabTxtActive: { color: '#fff' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#e8e8f0', marginBottom: 14, fontSize: 15 },
  codeInput: { textAlign: 'center', letterSpacing: 6, fontSize: 22, fontWeight: '800', color: '#f5c518' },
  hint: { color: '#8a8a9a', fontSize: 12, textAlign: 'center', marginBottom: 14, marginTop: -8 },
  btn: { backgroundColor: '#e50914', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 4, shadowColor: '#e50914', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
