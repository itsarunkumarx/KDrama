import { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48) / 3;

export default function SearchScreen({ navigation }) {
  const { api } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const r = await api.get('/dramas/search?q=' + encodeURIComponent(query));
      setResults(r.data.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>🔍 Search</Text>
      <View style={s.searchRow}>
        <TextInput style={s.input} value={query} onChangeText={setQuery}
          placeholder="Search K-dramas..." placeholderTextColor="#8a8a9a"
          returnKeyType="search" onSubmitEditing={search} />
        <TouchableOpacity style={s.btn} onPress={search}>
          <Text style={s.btnTxt}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#e50914" size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={i => String(i.id)}
          numColumns={3}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Watch', { dramaId: item.id, dramaTitle: item.name })}>
              <Image source={{ uri: 'https://image.tmdb.org/t/p/w185' + item.poster_path }}
                style={{ width: CARD_W, height: CARD_W * 1.5, borderRadius: 10, backgroundColor: '#141420' }} />
              <Text style={s.cardTitle} numberOfLines={2}>{item.name}</Text>
              <Text style={{ color: '#f5c518', fontSize: 10 }}>★ {item.vote_average?.toFixed(1)}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={searched ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>😅</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>No results found</Text>
              <Text style={{ color: '#8a8a9a', marginTop: 6 }}>Try a different search term</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🎬</Text>
              <Text style={{ color: '#8a8a9a' }}>Search for any K-drama</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', paddingTop: 52 },
  heading: { color: '#fff', fontSize: 24, fontWeight: '900', paddingHorizontal: 16, marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#141420', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#e8e8f0', fontSize: 15 },
  btn: { backgroundColor: '#e50914', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  cardTitle: { color: '#e8e8f0', fontSize: 10, marginTop: 5, fontWeight: '600', lineHeight: 14 },
});
