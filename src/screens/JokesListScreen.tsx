
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, CategoryKey } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JOKES_BY_CAT } from '../data/jokes';

type Props = NativeStackScreenProps<RootStackParamList, 'JokesList'>;
type Joke = { id: string; text: string; category: CategoryKey };

const BASE_H = 844;

const CARD_W = 344;
const CARD_H = 433;
const R = 24;

const CATEGORY_IMAGES: Record<CategoryKey, any> = {
  FOOTBALL: require('../assets/football_player.png'),
  HOCKEY: require('../assets/hockey_player.png'),
  TENNIS: require('../assets/tennis_player.png'),
  BASKETBALL: require('../assets/basketball_player.png'),
  KGB: require('../assets/football_player.png'),
  RUGBY: require('../assets/rugby_player.png'), 
};

const JOKES_WITH_RUGBY = {
    ...JOKES_BY_CAT,
    RUGBY: [
        "Why don't rugby players play poker? Because a full house is just a ruck.",
        "What's the difference between a rugby player and a pizza? A pizza can feed a family of four.",
        "A guy asks a rugby player, 'Want a drink?' The rugby player says, 'Sure, is it an odd-shaped one?'",
        "What do you call a rugby player with a broken arm? A doctor.",
        "Why did the rugby player cross the road? To tackle the chicken.",
    ],
};

export default function JokesListScreen({ route, navigation }: Props) {
  const { category } = route.params;

  const { height } = Dimensions.get('window');
  const s = useMemo(() => Math.min(1, height / BASE_H), [height]);

  const headerIcon = Math.round(77 * s);
  const headerTitleW = Math.round(168 * s);
  const headerTitleH = Math.round(77 * s);

  const cardW = Math.round(CARD_W * s);
  const cardH = Math.round(CARD_H * s);
  const radius = Math.round(R * s);

  const favSize = Math.round(60 * s);
  const favPad = Math.round(10 * s);

  const smileW = Math.round(41 * s);
  const smileH = Math.round(41 * s);
  const ctaW = Math.round(190 * s);
  const ctaH = Math.round(84 * s);

  const jokesAll: string[] = useMemo(() => JOKES_WITH_RUGBY[category] ?? [], [category]);
  const [idx, setIdx] = useState<number>(() => (jokesAll.length ? Math.floor(Math.random() * jokesAll.length) : 0));
  const jokeText = jokesAll[idx] ?? '';
  const jokeId = `${category}_${idx}`;

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const loadSaved = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('SAVED_JOKES');
      setSavedIds(raw ? JSON.parse(raw).map((j: Joke) => j.id) : []);
    } catch {}
  }, []);
  useEffect(() => { loadSaved(); }, [loadSaved]);

  const isFav = savedIds.includes(jokeId);
  const toggleFavorite = async () => {
    try {
      const raw = await AsyncStorage.getItem('SAVED_JOKES');
      const list: Joke[] = raw ? JSON.parse(raw) : [];
      const next = isFav
        ? list.filter((j) => j.id !== jokeId)
        : [...list, { id: jokeId, text: jokeText, category }];
      await AsyncStorage.setItem('SAVED_JOKES', JSON.stringify(next));
      setSavedIds(next.map((j) => j.id));
    } catch {}
  };

  const imgH = useMemo(() => {
    const asset = Image.resolveAssetSource(CATEGORY_IMAGES[category]);
    const ar = asset?.width && asset?.height ? asset.width / asset.height : CARD_W / CARD_H;
    const hByWidth = Math.round(cardW / ar);
    return Math.max(hByWidth, cardH + Math.round(10 * s)); 
  }, [category, cardW, cardH, s]);

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeCard   = useRef(new Animated.Value(0)).current;
  const fadeJoke   = useRef(new Animated.Value(0)).current;
  const fadeCta    = useRef(new Animated.Value(0)).current;

  const slideHeader = useRef(new Animated.Value(-20)).current;
  const slideCard   = useRef(new Animated.Value(16)).current;
  const slideJoke   = useRef(new Animated.Value(10)).current;
  const slideCta    = useRef(new Animated.Value(10)).current;

  const scaleCard   = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeCard, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideCard, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scaleCard, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeJoke, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideJoke, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeCta, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideCta, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeHeader, slideHeader, fadeCard, slideCard, scaleCard, fadeJoke, slideJoke, fadeCta, slideCta]);

  const jokeSwap = useRef(new Animated.Value(1)).current;
  const onContinue = () => {
    Animated.timing(jokeSwap, { toValue: 0, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true })
      .start(() => {
        setIdx((i) => (i + 1) % jokesAll.length);
        Animated.timing(jokeSwap, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      });
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={{ flex: 1 }} imageStyle={{ resizeMode: 'cover' }}>
      <SafeAreaView style={{ flex: 1 }}>

        <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideHeader }], paddingHorizontal: Math.round(16 * s), marginTop: Math.round(20 * s) }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <Image source={require('../assets/btn_back.png')} style={{ width: headerIcon, height: headerIcon, resizeMode: 'contain' }} />
          </TouchableOpacity>

          <Image source={require('../assets/btn_read_jokes2.png')} style={{ width: headerTitleW, height: headerTitleH, resizeMode: 'contain' }} />

          <Image source={require('../assets/image_loder.png')} style={{ width: headerIcon, height: headerIcon, resizeMode: 'contain' }} />
        </Animated.View>

        <Animated.View style={[styles.cardWrap, { width: cardW, marginTop: Math.round(16 * s), opacity: fadeCard, transform: [{ translateY: slideCard }, { scale: scaleCard }] }]}>
          <View style={[styles.photoBox, { width: cardW, height: cardH, borderRadius: radius }]}>
            <View style={[styles.cropArea, { borderRadius: radius }]}>
              <Image
                source={CATEGORY_IMAGES[category]}
                style={{
                  width: cardW,
                  height: imgH,
                  resizeMode: 'cover',
                }}
              />
            </View>

            <TouchableOpacity onPress={toggleFavorite} activeOpacity={0.9} style={[styles.favBtn, { right: favPad, top: favPad }]}>
              <Image
                source={isFav ? require('../assets/button2.png') : require('../assets/button1.png')}
                style={{ width: favSize, height: favSize, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: fadeJoke, transform: [{ translateY: slideJoke }] }}>
            <View style={[styles.jokeRow, { paddingHorizontal: Math.round(10 * s), paddingTop: Math.round(12 * s) }]}>
              <Image
                source={require('../assets/solar_smile.png')}
                style={{ width: smileW, height: smileH, resizeMode: 'contain', marginRight: Math.round(8 * s) }}
              />
              <Animated.Text
                style={[
                  styles.jokeText,
                  { fontSize: Math.max(14, Math.round(14 * s)), lineHeight: Math.round(20 * s), opacity: jokeSwap },
                ]}
              >
                {jokeText}
              </Animated.Text>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeCta, transform: [{ translateY: slideCta }] }}>
            <TouchableOpacity onPress={onContinue} activeOpacity={0.9} style={[styles.ctaWrap, { marginTop: Math.round(8 * s), marginBottom: Math.round(8 * s) }]}>
              <Image source={require('../assets/continue.png')} style={{ width: ctaW, height: ctaH, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 77,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardWrap: {
    alignSelf: 'center',
  },

  photoBox: {
    backgroundColor: '#0E1A2B',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#203A62',
  },

  cropArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  favBtn: {
    position: 'absolute',
  },

  jokeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  jokeText: {
    color: '#FFFFFF',
    flex: 1,
  },

  ctaWrap: {
    alignSelf: 'center',
  },
});