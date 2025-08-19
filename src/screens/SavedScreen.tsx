
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  Share,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Saved'>;
type SavedJoke = { id: string; text: string; category?: string };

const BASE_W = 390;
const BASE_H = 844;

export default function SavedScreen({ navigation }: Props) {
  const [items, setItems] = useState<SavedJoke[]>([]);
  const { width, height } = Dimensions.get('window');
  const s = useMemo(() => Math.min(width / BASE_W, height / BASE_H), [width, height]);

  const CARD_W = Math.round(344 * s);
  const CARD_H = Math.round(160 * s);
  const CARD_RADIUS = Math.round(24 * s);
  const BTN_SIZE = Math.round(77 * s);
  const HEADER_H = Math.round(77 * s);

  const listTranslateY = useRef(new Animated.Value(300)).current; 
  const emptyTranslateX = useRef(new Animated.Value(-300)).current; 
  const contentOpacity = useRef(new Animated.Value(0)).current; 

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('SAVED_JOKES');
      if (!raw) { setItems([]); return; }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
        setItems(parsed as SavedJoke[]);
      } else {
        setItems([]);
      }
    } catch { setItems([]); }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (items.length > 0) {
      
      Animated.parallel([
        Animated.timing(listTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
     
      Animated.parallel([
        Animated.timing(emptyTranslateX, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [items.length, listTranslateY, emptyTranslateX, contentOpacity]);

  const remove = useCallback(async (id: string) => {
    try {
      const raw = await AsyncStorage.getItem('SAVED_JOKES');
      const list: SavedJoke[] = raw ? JSON.parse(raw) : [];
      const next = list.filter(j => j.id !== id);
      await AsyncStorage.setItem('SAVED_JOKES', JSON.stringify(next));
      setItems(next);
    } catch {}
  }, []);

  const onShare = useCallback(async (text: string) => {
    try { await Share.share({ message: text }); } catch {}
  }, []);

  const renderItem = ({ item }: { item: SavedJoke }) => (
    <View style={styles.itemWrap}>
      <View style={[styles.card, { width: CARD_W, height: CARD_H, borderRadius: CARD_RADIUS, paddingBottom: Math.round(60 * s) }]}>
        <View style={styles.cardTopRow}>
          <Image
            source={
              item.category === 'FOOTBALL' ? require('../assets/football_player.png') :
              item.category === 'BASKETBALL' ? require('../assets/basketball_player.png') :
              item.category === 'TENNIS' ? require('../assets/tennis_player.png') :
              item.category === 'HOCKEY' ? require('../assets/hockey_player.png') :
              require('../assets/image_loder.png')
            }
            style={[styles.avatar, { width: Math.round(48 * s), height: Math.round(48 * s), borderRadius: Math.round(24 * s) }]}
          />
          <Image source={require('../assets/solar_smile.png')} style={[styles.smile, { width: Math.round(22 * s), height: Math.round(22 * s), marginTop: Math.round(4 * s) }]} />
          <Text style={[styles.jokeText, { fontSize: Math.round(14 * s), lineHeight: Math.round(20 * s) }]} numberOfLines={4}>{item.text}</Text>
        </View>

        <View style={[styles.cardActions, { bottom: Math.round(10 * s), gap: Math.round(18 * s) }]}>
          <TouchableOpacity onPress={() => onShare(item.text)} activeOpacity={0.9} style={[styles.roundBtn, { width: Math.round(49 * s), height: Math.round(49 * s), borderRadius: Math.round(24.5 * s) }]}>
            <Image source={require('../assets/btn_share.png')} style={[styles.roundImg, { width: Math.round(49 * s), height: Math.round(49 * s) }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => remove(item.id)} activeOpacity={0.9} style={[styles.roundBtn, styles.deleteBg, { width: Math.round(49 * s), height: Math.round(49 * s), borderRadius: Math.round(24.5 * s) }]}>
            <Image source={require('../assets/delete.png')} style={[styles.roundImg, { width: Math.round(49 * s), height: Math.round(49 * s) }]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmptyState = useMemo(() => (
    <Animated.View style={[styles.emptyWrap, { opacity: contentOpacity, transform: [{ translateX: emptyTranslateX }] }]}>
      <Text style={[styles.emptyText, { fontSize: Math.round(18 * s) }]}>Oops. It’s empty here for now!</Text>
      <Image
        source={require('../assets/image_onbording.png')}
        style={{ width: Math.round(225 * s), height: Math.round(258 * s), resizeMode: 'contain', marginTop: Math.round(12 * s) }}
      />
    </Animated.View>
  ), [s, contentOpacity, emptyTranslateX]);

  return (
    <ImageBackground source={require('../assets/background.png')} style={{ flex: 1 }} imageStyle={{ resizeMode: 'cover' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, { height: HEADER_H, paddingHorizontal: Math.round(16 * s), marginTop: Math.round(20 * s) }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <Image source={require('../assets/btn_back.png')} style={{ width: BTN_SIZE, height: BTN_SIZE, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <Image
            source={require('../assets/saved_im.png')}
            style={{ width: Math.round(168 * s), height: BTN_SIZE, resizeMode: 'contain' }}
            accessibilityLabel="SAVED"
          />
          <Image source={require('../assets/image_loder.png')} style={{ width: BTN_SIZE, height: BTN_SIZE, resizeMode: 'contain' }} />
        </View>

        {items.length === 0 ? (
          EmptyState
        ) : (
          <Animated.View style={{ flex: 1, opacity: contentOpacity, transform: [{ translateY: listTranslateY }] }}>
            <FlatList
              data={items}
              keyExtractor={(i) => i.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: Math.round(16 * s), paddingBottom: Math.round(24 * s) }}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' },
  itemWrap: { marginBottom: 20 },
  card: {
    alignSelf: 'center',
    backgroundColor: 'rgba(11, 21, 38, 0.7)',
    borderWidth: 1,
    borderColor: '#233B63',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: { marginRight: 10, resizeMode: 'cover' },
  smile: { marginRight: 8 },
  jokeText: { color: '#EAF0FF', flex: 1 },
  cardActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roundBtn: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  deleteBg: { backgroundColor: '#EF4444' },
  roundImg: { resizeMode: 'contain' },
});