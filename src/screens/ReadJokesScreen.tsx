
import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, CategoryKey } from '../../App';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadJokes'>;

const CATEGORIES = [
  { key: 'FOOTBALL', ui: 'for Footballer', img: require('../assets/football_player.png') },
  { key: 'HOCKEY', ui: 'for Hockey player', img: require('../assets/hockey_player.png') },
  { key: 'TENNIS', ui: 'for Tennis player', img: require('../assets/tennis_player.png') },
  { key: 'BASKETBALL', ui: 'for Basketball player', img: require('../assets/basketball_player.png') },
] as const;

const BASE_H = 844;          
const CAT_W  = 344;
const CAT_H  = 433;
const CAT_RADIUS = 24;

const BAR_W = 240;
const BAR_H = 72;
const BTN_ARR = 62;

export default function ReadJokesScreen({ navigation }: Props) {
  const [catIndex, setCatIndex] = useState(0);
  const currentCat = useMemo(() => CATEGORIES[catIndex], [catIndex]);

  const { width, height } = Dimensions.get('window');
  const s = useMemo(() => Math.min(1, height / BASE_H), [height]);

  const headerIcon = Math.round(77 * s);
  const headerTitleW = Math.round(168 * s);
  const headerTitleH = Math.round(77 * s);

  const mascotW = Math.round(110 * s);
  const mascotH = Math.round(125 * s);

  const boxW = Math.round(CAT_W * s);
  const boxH = Math.round(CAT_H * s);
  const boxR = Math.round(CAT_RADIUS * s);
  const innerPad = Math.max(2, Math.round(4 * s));

  const barW = Math.round(BAR_W * s);
  const barH = Math.round(BAR_H * s);
  const btnArr = Math.round(BTN_ARR * s);

  const nextCat = () => setCatIndex((i) => (i + 1) % CATEGORIES.length);
  const prevCat = () => setCatIndex((i) => (i - 1 + CATEGORIES.length) % CATEGORIES.length);

  const fadeHeader   = useRef(new Animated.Value(0)).current;
  const fadeChoose   = useRef(new Animated.Value(0)).current;
  const fadeCard     = useRef(new Animated.Value(0)).current;
  const fadeBottom   = useRef(new Animated.Value(0)).current;

  const slideHeader  = useRef(new Animated.Value(-20)).current;
  const slideChoose  = useRef(new Animated.Value(12)).current;
  const slideCard    = useRef(new Animated.Value(18)).current;
  const slideBottom  = useRef(new Animated.Value(18)).current;

  const scaleCard    = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeHeader, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeChoose, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideChoose, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeCard, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideCard, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scaleCard, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBottom, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(slideBottom, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeHeader, slideHeader, fadeChoose, slideChoose, fadeCard, slideCard, fadeBottom, slideBottom, scaleCard]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.header,
            {
              paddingHorizontal: Math.round(16 * s),
              marginTop: Math.round(20 * s),
              opacity: fadeHeader,
              transform: [{ translateY: slideHeader }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <Image source={require('../assets/btn_back.png')} style={{ width: headerIcon, height: headerIcon, resizeMode: 'contain' }} />
          </TouchableOpacity>

          <Image source={require('../assets/btn_read_jokes2.png')} style={{ width: headerTitleW, height: headerTitleH, resizeMode: 'contain' }} />

          <Image source={require('../assets/image_loder.png')} style={{ width: headerIcon, height: headerIcon, resizeMode: 'contain' }} />
        </Animated.View>

        <Animated.View
          style={[
            styles.chooseWrap,
            {
              opacity: fadeChoose,
              transform: [{ translateY: slideChoose }],
            },
          ]}
        >
          <Image
            source={require('../assets/red_jokers.png')}
            style={{ width: mascotW, height: mascotH, resizeMode: 'contain', marginRight: Math.round(12 * s) }}
          />
          <Text style={[styles.chooseText, { fontSize: Math.max(16, Math.round(18 * s)) }]}>CHOOSE CATEGORY:</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.centerRow,
            {
              opacity: fadeCard,
              transform: [{ translateY: slideCard }, { scale: scaleCard }],
            },
          ]}
        >
          <View style={[styles.photoContainer, { width: boxW, height: boxH, borderRadius: boxR }]}>
        
            <Svg width={boxW} height={boxH} style={styles.absFill}>
              <Defs>
                <SvgLinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#14243E" />
                  <Stop offset="1" stopColor="#091221" />
                </SvgLinearGradient>
              </Defs>
              <Rect x={1} y={1} width={boxW - 2} height={boxH - 2} rx={boxR} ry={boxR} fill="url(#fillGrad)" />
            </Svg>

            <View
              style={{
                position: 'absolute',
                left: innerPad,
                right: innerPad,
                top: innerPad,
                bottom: innerPad,
                borderRadius: Math.max(1, boxR - innerPad),
                overflow: 'hidden',
                backgroundColor: '#0B1526',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
        
              <Image
                source={currentCat.img}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
              
                }}
                accessibilityLabel={currentCat.ui}
              />
            </View>

            <Svg width={boxW} height={boxH} style={styles.absFill}>
              <Defs>
                <SvgLinearGradient id="strokeGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#FFFFFF" />
                  <Stop offset="1" stopColor="#14243E" />
                </SvgLinearGradient>
              </Defs>
              <Rect x={1} y={1} width={boxW - 2} height={boxH - 2} rx={boxR} ry={boxR} fill="none" stroke="url(#strokeGrad)" strokeWidth={2} />
            </Svg>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomBarWrap,
            {
              marginTop: Math.round(-24 * s),
              opacity: fadeBottom,
              transform: [{ translateY: slideBottom }],
            },
          ]}
        >
      
          <TouchableOpacity onPress={prevCat} activeOpacity={0.9} style={{ width: btnArr, height: btnArr, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/btn_back.png')} style={{ width: btnArr, height: btnArr, resizeMode: 'contain' }} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('JokesList', { category: currentCat.key as CategoryKey })}
            style={{ width: barW, height: barH }}
          >
            <Svg width={barW} height={barH} style={styles.absFill}>
              <Defs>
                <SvgLinearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#14243E" />
                  <Stop offset="1" stopColor="#091221" />
                </SvgLinearGradient>
              </Defs>
              <Rect x={0} y={0} width={barW} height={barH} rx={barH / 2} ry={barH / 2} fill="url(#barFill)" />
            </Svg>
            <View style={styles.barCenter}>
              <Text style={[styles.barText, { fontSize: Math.max(14, Math.round(16 * s)) }]}>{currentCat.ui}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextCat} activeOpacity={0.9} style={{ width: btnArr, height: btnArr, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('../assets/btn_back.png')}
              style={{ width: btnArr, height: btnArr, resizeMode: 'contain', transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: Math.round(10 * s) }} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },

  header: {
    height: 77, 
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  chooseWrap: {
    marginTop: 4,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  centerRow: {
    alignItems: 'center',
    marginTop: 0,
  },

  photoContainer: {
    position: 'relative',
    overflow: 'hidden',
  },

  absFill: {
    ...StyleSheet.absoluteFillObject,
  },

  bottomBarWrap: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
  },

  barCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barText: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
});