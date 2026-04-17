import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleColors = { user: '#e50914' };
  const rc = roleColors[user?.role] || '#e50914';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0a0f' }} contentContainerStyle={{ paddingTop: 52, padding: 20 }}>
      {/* Avatar */}
      <View style={s.center}>
        <LinearGradient colors={['#e50914', '#7f1d1d']} style={s.avatar}>
          <Text style={s.initials}>{initials}</Text>
        </LinearGradient>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={[s.badge, { backgroundColor: rc + '20', borderColor: rc + '40' }]}>
          <Text style={[s.badgeTxt, { color: rc }]}>
            {user?.role === 'user' ? '👤 USER' : '👤 USER'}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={s.card}>
        <Text style={s.cardHeader}>Account Info</Text>
        {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role?.toUpperCase()],
          ['Member Since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'],
          ['Status', 'Active ✅']].map(([k, v]) => (
          <View key={k} style={s.row}>
            <Text style={s.key}>{k}</Text>
            <Text style={s.val} numberOfLines={1}>{v}</Text>
          </View>
        ))}
      </View>



      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutTxt}>🚪  Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 88, height: 88, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 14, shadowColor: '#e50914', shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
  initials: { color: '#fff', fontSize: 32, fontWeight: '900' },
  name: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  email: { color: '#8a8a9a', fontSize: 14, marginBottom: 10 },
  badge: { paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  badgeTxt: { fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  card: { backgroundColor: '#141420', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1e1e2e', marginBottom: 16 },
  cardHeader: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e1e2e' },
  key: { color: '#8a8a9a', fontSize: 14 },
  val: { color: '#fff', fontWeight: '600', fontSize: 14, maxWidth: '60%', textAlign: 'right' },

  logoutBtn: { backgroundColor: 'rgba(229,9,20,0.1)', borderWidth: 1, borderColor: 'rgba(229,9,20,0.3)', borderRadius: 14, padding: 16, alignItems: 'center' },
  logoutTxt: { color: '#e50914', fontWeight: '700', fontSize: 16 },
});
