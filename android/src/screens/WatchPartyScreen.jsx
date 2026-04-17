import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Clipboard, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { SOCKET_URL } from '../config';

const { width: W } = Dimensions.get('window');

export default function WatchPartyScreen({ route, navigation }) {
  const { roomId, dramaTitle, dramaId } = route.params;
  const { user, api } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const flatRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const v = await api.get('/dramas/' + dramaId + '/videos');
        const vids = (v.data.results || []).filter(x => x.site === 'YouTube');
        const main = vids.find(x => x.type === 'Trailer') || vids[0];
        if (main) setVideoId(main.key);
      } catch (e) { console.error(e); }
    })();

    const sock = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(sock);

    sock.on('connect', () => {
      setConnected(true);
      sock.emit('join-room', { roomId, user: { userId: user._id, name: user.name, role: user.role } });
    });
    sock.on('new-message', msg => setMessages(p => [...p, msg]));
    sock.on('room-update', room => {
      setUsers(room.users || []);
      setMessages(room.messages || []);
    });
    sock.on('disconnect', () => setConnected(false));
    return () => sock.disconnect();
  }, [roomId]);

  const send = () => {
    if (!input.trim() || !socket) return;
    socket.emit('chat-message', { roomId, message: input.trim(), user: { name: user.name, userId: user._id, role: user.role } });
    setInput('');
  };

  const copyRoomId = () => {
    Clipboard.setString(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleColor = (role) => '#e50914';

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={s.header}>
        <View style={[s.statusDot, { backgroundColor: connected ? '#4ade80' : '#ef4444' }]} />
        <Text style={s.headerTitle} numberOfLines={1}>{dramaTitle}</Text>
        <TouchableOpacity onPress={copyRoomId} style={s.roomBadge}>
          <Text style={s.roomId}>{copied ? '✅ Copied' : roomId}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.leaveBtn}>
          <Text style={s.leaveTxt}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Video */}
      {videoId && (
        <View style={{ height: W * 9/16, backgroundColor: '#000' }}>
          <WebView source={{ uri: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1' }}
            allowsFullscreenVideo javaScriptEnabled style={{ flex: 1 }} />
        </View>
      )}

      {/* Viewers Bar */}
      <View style={s.viewersBar}>
        <Text style={s.viewersLabel}>👥 {users.length} watching</Text>
        <View style={s.viewerAvatars}>
          {users.slice(0, 5).map((u, i) => (
            <View key={i} style={[s.viewerAvatar, { backgroundColor: roleColor(u.role) + '30', marginLeft: i > 0 ? -6 : 0 }]}>
              <Text style={[s.viewerInitial, { color: roleColor(u.role) }]}>{u.name?.[0]?.toUpperCase()}</Text>
            </View>
          ))}
          {users.length > 5 && <Text style={s.moreUsers}>+{users.length - 5}</Text>}
        </View>
      </View>

      {/* Messages */}
      <FlatList ref={flatRef} data={messages} keyExtractor={(_, i) => String(i)}
        style={s.messages}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMe = item.user?.userId === user._id;
          return (
            <View style={[s.msg, isMe && s.msgMe]}>
              {!isMe && <View style={[s.avatar, { backgroundColor: roleColor(item.user?.role) + '25' }]}>
                <Text style={[s.avatarTxt, { color: roleColor(item.user?.role) }]}>{item.user?.name?.[0]?.toUpperCase()}</Text>
              </View>}
              <View style={{ maxWidth: '75%' }}>
                {!isMe && <Text style={[s.msgUser, { color: roleColor(item.user?.role) }]}>{item.user?.name}</Text>}
                <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
                  <Text style={s.bubbleTxt}>{item.message}</Text>
                </View>
                <Text style={s.msgTime}>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={s.emptyChat}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>💬</Text>
            <Text style={{ color: '#8a8a9a', fontSize: 13 }}>Be the first to chat!</Text>
          </View>
        }
      />

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput}
          placeholder="Say something..." placeholderTextColor="#8a8a9a"
          returnKeyType="send" onSubmitEditing={send} maxLength={300} />
        <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]} onPress={send} disabled={!input.trim()}>
          <Text style={s.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingTop: 48, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1e1e2e', backgroundColor: 'rgba(20,20,32,0.9)' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  headerTitle: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 13 },
  roomBadge: { backgroundColor: 'rgba(229,9,20,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roomId: { color: '#e50914', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '800', fontSize: 12 },
  leaveBtn: { paddingLeft: 6 },
  leaveTxt: { color: '#8a8a9a', fontSize: 13 },
  viewersBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#141420', borderBottomWidth: 1, borderBottomColor: '#1e1e2e' },
  viewersLabel: { color: '#4ade80', fontSize: 12, fontWeight: '600' },
  viewerAvatars: { flexDirection: 'row', alignItems: 'center' },
  viewerAvatar: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#0a0a0f' },
  viewerInitial: { fontSize: 10, fontWeight: '700' },
  moreUsers: { color: '#8a8a9a', fontSize: 11, marginLeft: 4 },
  messages: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  emptyChat: { alignItems: 'center', paddingTop: 40 },
  msg: { flexDirection: 'row', marginBottom: 12, gap: 8, alignItems: 'flex-end' },
  msgMe: { flexDirection: 'row-reverse' },
  avatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 12, fontWeight: '700' },
  msgUser: { fontSize: 10, fontWeight: '700', marginBottom: 3 },
  bubble: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9 },
  bubbleMe: { backgroundColor: '#7f1d1d', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#1e1e2e', borderBottomLeftRadius: 4 },
  bubbleTxt: { color: '#e8e8f0', fontSize: 14, lineHeight: 20 },
  msgTime: { color: '#8a8a9a', fontSize: 10, marginTop: 3 },
  inputRow: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#1e1e2e', backgroundColor: '#0a0a0f' },
  input: { flex: 1, backgroundColor: '#141420', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 11, color: '#e8e8f0', fontSize: 14 },
  sendBtn: { backgroundColor: '#e50914', borderRadius: 22, width: 44, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
