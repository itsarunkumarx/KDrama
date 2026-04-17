import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');

export default function WatchScreen({ route, navigation }) {
  const { dramaId, dramaTitle, startParty } = route.params;
  const { api } = useAuth();
  const [drama, setDrama] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [d, v] = await Promise.all([api.get('/dramas/' + dramaId), api.get('/dramas/' + dramaId + '/videos')]);
        setDrama(d.data);
        const vids = (v.data.results || []).filter(x => x.site === 'YouTube');
        setVideos(vids);
        const main = vids.find(x => x.type === 'Trailer') || vids[0];
        setActiveVideo(main);
        if (startParty && d.data) createParty(d.data);
      } catch (e) { Alert.alert('Error', 'Could not load drama'); navigation.goBack(); }
    })();
  }, [dramaId]);

  const createParty = async (d = drama) => {
    if (!d) return;
    setCreating(true);
    try {
      const r = await api.post('/rooms', { dramaId: d.id, dramaTitle: d.name, posterPath: d.poster_path });
      navigation.navigate('WatchParty', { roomId: r.data.roomId, dramaTitle: d.name, dramaId: d.id });
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Cannot create room'); }
    finally { setCreating(false); }
  };

  if (!drama) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0f' }}>
      <Text style={{ color: '#e50914', fontSize: 16, fontWeight: '700' }}>Loading...</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0a0f' }} showsVerticalScrollIndicator={false}>
      {/* Back button */}
      <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backTxt}>← Back</Text>
      </TouchableOpacity>

      {/* Video Player */}
      <View style={[s.videoWrap, { height: W * 9/16 }]}>
        {activeVideo ? (
          <WebView
            source={{ uri: 'https://www.youtube.com/embed/' + activeVideo.key + '?autoplay=1&rel=0&modestbranding=1' }}
            style={{ flex: 1 }} allowsFullscreenVideo javaScriptEnabled
          />
        ) : (
          <View style={s.noVideo}>
            <Text style={s.noVideoTxt}>🎬 No trailer available</Text>
          </View>
        )}
      </View>

      {/* Video selector */}
      {videos.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {videos.map(v => (
            <TouchableOpacity key={v.id} style={[s.vidChip, activeVideo?.id === v.id && s.vidChipActive]}
              onPress={() => setActiveVideo(v)}>
              <Text style={[s.vidChipTxt, activeVideo?.id === v.id && s.vidChipTxtActive]}>
                {v.type === 'Trailer' ? '🎬' : '▶'} {v.name?.substring(0, 20)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Drama Info */}
      <View style={s.info}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Image source={{ uri: 'https://image.tmdb.org/t/p/w185' + drama.poster_path }}
            style={s.poster} />
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{drama.name}</Text>
            {drama.original_name !== drama.name && <Text style={s.origTitle}>{drama.original_name}</Text>}
            <View style={s.meta}>
              {drama.vote_average > 0 && <Text style={s.rating}>★ {drama.vote_average?.toFixed(1)}</Text>}
              {drama.first_air_date && <Text style={s.metaTxt}>{drama.first_air_date?.substring(0,4)}</Text>}
              {drama.number_of_seasons > 0 && <Text style={s.metaTxt}>{drama.number_of_seasons} Season{drama.number_of_seasons > 1 ? 's' : ''}</Text>}
            </View>
            {/* Genres */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {drama.genres?.slice(0,4).map(g => (
                  <View key={g.id} style={s.genre}><Text style={s.genreTxt}>{g.name}</Text></View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <Text style={s.overview}>{drama.overview}</Text>

        {/* Action Buttons */}
        <TouchableOpacity style={[s.partyBtn, creating && { opacity: 0.6 }]}
          onPress={() => createParty()} disabled={creating}>
          <Text style={s.partyBtnTxt}>{creating ? '⏳ Creating Room...' : '👥 Start Watch Party'}</Text>
        </TouchableOpacity>

        {/* Info Table */}
        <View style={s.table}>
          {[['Network', drama.networks?.[0]?.name], ['Language', drama.original_language?.toUpperCase()],
            ['Status', drama.status], ['Country', drama.origin_country?.join(', ')]
          ].filter(([,v]) => v).map(([k,v]) => (
            <View key={k} style={s.tableRow}>
              <Text style={s.tableKey}>{k}</Text>
              <Text style={s.tableVal}>{v}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  back: { paddingHorizontal: 16, paddingTop: 48, paddingBottom: 8 },
  backTxt: { color: '#e50914', fontWeight: '700', fontSize: 15 },
  videoWrap: { width: '100%', backgroundColor: '#000' },
  noVideo: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141420' },
  noVideoTxt: { color: '#8a8a9a', fontSize: 16 },
  vidChip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#1e1e2e', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  vidChipActive: { backgroundColor: '#e50914', borderColor: '#e50914' },
  vidChipTxt: { color: '#8a8a9a', fontSize: 12, fontWeight: '600' },
  vidChipTxtActive: { color: '#fff' },
  info: { padding: 16 },
  poster: { width: 90, height: 135, borderRadius: 10, backgroundColor: '#141420' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', flexWrap: 'wrap' },
  origTitle: { color: '#8a8a9a', fontSize: 13, marginTop: 2 },
  meta: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' },
  rating: { color: '#f5c518', fontWeight: '700' },
  metaTxt: { color: '#8a8a9a', fontSize: 13 },
  genre: { backgroundColor: 'rgba(229,9,20,0.12)', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(229,9,20,0.25)' },
  genreTxt: { color: '#e50914', fontSize: 11, fontWeight: '600' },
  overview: { color: '#aaa', lineHeight: 22, marginVertical: 16, fontSize: 14 },
  partyBtn: { backgroundColor: '#e50914', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 20 },
  partyBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  table: { backgroundColor: '#141420', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1e1e2e' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#1e1e2e' },
  tableKey: { color: '#8a8a9a', fontSize: 13 },
  tableVal: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
