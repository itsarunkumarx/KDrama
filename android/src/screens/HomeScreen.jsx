import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48) / 3;
const TMDB = 'https://image.tmdb.org/t/p';

export default function HomeScreen({ navigation }) {
  const { api, user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [romance, setRomance] = useState([]);
  const [action, setAction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [t, n, r, a] = await Promise.all([
        api.get('/dramas/trending'), api.get('/dramas/new-releases'),
        api.get('/dramas/romance'), api.get('/dramas/action')
      ]);
      setTrending(t.data.results || []);
      setNewReleases(n.data.results || []);
      setRomance(r.data.results || []);
      setAction(a.data.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (!trending.length) return;
    const t = setInterval(() => setHeroIdx(i => (i+1) % Math.min(5, trending.length)), 6000);
    return () => clearInterval(t);
  }, [trending]);

  const DramaCard = ({ item, width = CARD_W }) => {
    const isNew = item.first_air_date && new Date(item.first_air_date) > new Date(Date.now() - 30*86400000);
    return (
      <TouchableOpacity style={[cs.card, { width }]} onPress={() => navigation.navigate('Watch', { dramaId: item.id, dramaTitle: item.name })}>
        <Image source={{ uri: TMDB + '/w342' + item.poster_path }} style={[cs.poster, { width, height: width * 1.5 }]} />
        {isNew && <View style={cs.newBadge}><Text style={cs.newBadgeTxt}>NEW</Text></View>}
        <View style={cs.ratingBadge}><Text style={cs.ratingTxt}>★ {item.vote_average?.toFixed(1)}</Text></View>
        <Text style={cs.cardTitle} numberOfLines={2}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const DramaRow = ({ title, data, badge }) => (
    <View style={rs.row}>
      <View style={rs.rowHeader}>
        <Text style={rs.rowTitle}>{title}</Text>
        {badge && <View style={rs.badge}><Text style={rs.badgeTxt}>{badge}</Text></View>}
      </View>
      <FlatList horizontal data={data} keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => <DramaCard item={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }} />
    </View>
  );

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0f' }}>
      <Text style={{ color: '#e50914', fontSize: 32, fontWeight: '900', letterSpacing: 4 }}>KDRAMAX</Text>
      <ActivityIndicator color="#e50914" style={{ marginTop: 20 }} size="large" />
    </View>
  );

  const hero = trending[heroIdx];

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#e50914" />}>

        {/* HERO */}
        {hero && (
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Watch', { dramaId: hero.id, dramaTitle: hero.name })}>
            <View style={hs.hero}>
              <Image source={{ uri: TMDB + '/w780' + hero.backdrop_path }} style={hs.heroImg} />
              <LinearGradient colors={['transparent', 'rgba(10,10,15,0.7)', '#0a0a0f']} style={hs.heroGrad}>
                <Text style={hs.heroTitle} numberOfLines={2}>{hero.name}</Text>
                <Text style={hs.heroMeta}>★ {hero.vote_average?.toFixed(1)}  •  {hero.first_air_date?.substring(0,4)}</Text>
                <View style={hs.heroButtons}>
                  <TouchableOpacity style={hs.playBtn} onPress={() => navigation.navigate('Watch', { dramaId: hero.id, dramaTitle: hero.name })}>
                    <Text style={hs.playBtnTxt}>▶  Watch Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={hs.partyBtn} onPress={() => navigation.navigate('Watch', { dramaId: hero.id, dramaTitle: hero.name, startParty: true })}>
                    <Text style={hs.partyBtnTxt}>👥  Party</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        )}

        {/* Hero Dots */}
        <View style={hs.dots}>
          {trending.slice(0,5).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setHeroIdx(i)}
              style={[hs.dot, i === heroIdx ? hs.dotActive : hs.dotInactive]} />
          ))}
        </View>

        {/* Rows */}
        <DramaRow title="🔥 Trending This Week" data={trending} badge="LIVE" />
        <DramaRow title="🆕 New Releases" data={newReleases} badge="NEW" />
        <DramaRow title="💕 Romance" data={romance} />
        <DramaRow title="⚡ Action & Thriller" data={action} />
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const cs = StyleSheet.create({
  card: { marginBottom: 4 },
  poster: { borderRadius: 10, backgroundColor: '#141420' },
  newBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#e50914', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  newBadgeTxt: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  ratingBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  ratingTxt: { color: '#f5c518', fontSize: 9, fontWeight: '700' },
  cardTitle: { color: '#e8e8f0', fontSize: 10, marginTop: 5, fontWeight: '600', lineHeight: 14 },
});

const rs = StyleSheet.create({
  row: { marginTop: 28 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 16, marginBottom: 12 },
  rowTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  badge: { backgroundColor: '#e50914', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
});

const hs = StyleSheet.create({
  hero: { width: '100%', height: 420 },
  heroImg: { width: '100%', height: '100%', position: 'absolute' },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 80 },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '900', lineHeight: 34, marginBottom: 6 },
  heroMeta: { color: '#f5c518', fontSize: 13, fontWeight: '600', marginBottom: 14 },
  heroButtons: { flexDirection: 'row', gap: 10 },
  playBtn: { backgroundColor: '#e50914', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 22 },
  playBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  partyBtn: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  partyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10, marginBottom: 4 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 20, backgroundColor: '#e50914' },
  dotInactive: { width: 6, backgroundColor: 'rgba(255,255,255,0.3)' },
});
