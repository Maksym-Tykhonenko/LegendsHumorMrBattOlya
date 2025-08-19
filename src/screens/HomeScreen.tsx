import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Share,
  Switch,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type Page = 'main' | 'about' | 'settings';

const BASE_H = 844;
const BIG_ASPECT = 3.4;
const SMALL_ASPECT = 1.8;

const DEFAULT_OLD_LOGO_SIZE = 370;
const DEFAULT_NEW_LOGO_SIZE = 450;
const DEFAULT_BASE_TOP_OFFSET = 50;
const DEFAULT_GAP_BELOW_LOGO = 10;

const SMALL_SCREEN_OLD_LOGO_SIZE = 280;
const SMALL_SCREEN_NEW_LOGO_SIZE = 320;
const SMALL_SCREEN_BASE_TOP_OFFSET = 30;
const SMALL_SCREEN_GAP_BELOW_LOGO = 5;

const EXTRA_SHIFT = 20;

export default function HomeScreen({ navigation }: Props) {
  const [page, setPage] = useState<Page>('main');
  const [vibration, setVibration] = useState<boolean>(true);

  const { width, height } = Dimensions.get('window');

  const isSmallScreen = height < 700;

  const OLD_LOGO_SIZE = isSmallScreen ? SMALL_SCREEN_OLD_LOGO_SIZE : DEFAULT_OLD_LOGO_SIZE;
  const NEW_LOGO_SIZE = isSmallScreen ? SMALL_SCREEN_NEW_LOGO_SIZE : DEFAULT_NEW_LOGO_SIZE;
  const BASE_TOP_OFFSET = isSmallScreen ? SMALL_SCREEN_BASE_TOP_OFFSET : DEFAULT_BASE_TOP_OFFSET;
  const GAP_BELOW_LOGO = isSmallScreen ? SMALL_SCREEN_GAP_BELOW_LOGO : DEFAULT_GAP_BELOW_LOGO;

  const insets = useSafeAreaInsets();
  const headerTop = insets.top + 20;

  const platformOffset = Platform.OS === 'android' ? -30 : 0;
  
  const IMAGE_TOP = BASE_TOP_OFFSET + EXTRA_SHIFT + platformOffset;

  const s = useMemo(() => Math.min(1, height / BASE_H), [height]);

  const contentW = Math.min(width - 32, Math.round(360 * s));
  const bigBtnW = Math.round(contentW * 0.92);
  const bigBtnH = Math.round(bigBtnW / BIG_ASPECT);
  const smallBtnW = Math.round(contentW * 0.46);
  const smallRowH = Math.round(smallBtnW / SMALL_ASPECT);

  const vSp1 = Math.round((isSmallScreen ? 6 : 8) * s);
  const vSpRow = Math.round((isSmallScreen ? 5 : 6) * s);
  const vSp2 = Math.round((isSmallScreen ? 6 : 8) * s);

  const fadePage = useRef(new Animated.Value(1)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.94)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (page !== 'main') return;

    heroOpacity.setValue(0);
    heroScale.setValue(0.94);
    buttonsOpacity.setValue(0);
    buttonsTranslate.setValue(18);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(heroScale, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(buttonsOpacity, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(buttonsTranslate, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  }, [page, heroOpacity, heroScale, buttonsOpacity, buttonsTranslate]);

  const animateTo = (next: Page) => {
    Animated.sequence([
      Animated.timing(fadePage, { toValue: 0, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(fadePage, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    setPage(next);
  };

  const onShare = () => {
    Share.share({ message: '“Legends Humor Mr.Batt” — подборка шуток от легенд спорта. Чекни!' });
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.bg} imageStyle={styles.bgImage}>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {page !== 'main' && (
          <View
            style={[
              styles.headerRow,
              { paddingTop: headerTop, paddingHorizontal: Math.round(20 * s) },
            ]}
          >
            <TouchableOpacity onPress={() => animateTo('main')} activeOpacity={0.9}>
              <Image
                source={require('../assets/btn_back.png')}
                style={{ width: Math.round(77 * s), height: Math.round(77 * s), resizeMode: 'contain' }}
                accessibilityLabel="Back"
              />
            </TouchableOpacity>

            {page === 'about' ? (
              <Image
                source={require('../assets/btn_about.png')}
                style={{ width: Math.round(144 * s), height: Math.round(77 * s), resizeMode: 'contain' }}
                accessibilityLabel="ABOUT"
              />
            ) : (
              <Image
                source={require('../assets/btn_settings_header.png')}
                style={{ width: Math.round(177 * s), height: Math.round(77 * s), resizeMode: 'contain' }}
                accessibilityLabel="SETTINGS"
              />
            )}
            <View style={{ width: Math.round(77 * s) }} />
          </View>
        )}

        <Animated.View style={{ flex: 1, alignItems: 'center', opacity: fadePage }}>
          {page === 'main' && (
            <View style={{ alignItems: 'center', position: 'relative', width }}>
          
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: IMAGE_TOP,
                  left: (width - NEW_LOGO_SIZE) / 2,
                  width: NEW_LOGO_SIZE,
                  height: NEW_LOGO_SIZE,
                  zIndex: 0,
                  opacity: heroOpacity,
                  transform: [{ scale: heroScale }],
                }}
              >
                <Image source={require('../assets/image_loder.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
              </Animated.View>

              <View style={{ height: BASE_TOP_OFFSET + platformOffset }} />
              <View style={{ width: OLD_LOGO_SIZE, height: OLD_LOGO_SIZE }} />
              <View style={{ height: GAP_BELOW_LOGO }} />

              <Animated.View
                style={{
                  width: contentW,
                  alignItems: 'center',
                  zIndex: 1,
                  opacity: buttonsOpacity,
                  transform: [{ translateY: buttonsTranslate }],
                }}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ReadJokes')} style={{ width: '92%', alignSelf: 'center', marginBottom: vSp1 }}>
                  <Image source={require('../assets/btn_read_jokes.png')} style={{ width: '100%', height: bigBtnH, resizeMode: 'contain' }} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('WhoIs')} style={{ width: '92%', alignSelf: 'center', marginBottom: vSpRow }}>
                  <Image source={require('../assets/btn_whois.png')} style={{ width: '100%', height: bigBtnH, resizeMode: 'contain' }} />
                </TouchableOpacity>

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: vSp2 }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => animateTo('settings')} style={{ width: '46%' }}>
                    <Image source={require('../assets/btn_settings.png')} style={{ width: '100%', height: smallRowH, resizeMode: 'contain' }} />
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Saved')} style={{ width: '46%' }}>
                    <Image source={require('../assets/btn_favorites.png')} style={{ width: '100%', height: smallRowH, resizeMode: 'contain' }} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={() => animateTo('about')} style={{ width: '92%', alignSelf: 'center' }}>
                  <Image source={require('../assets/btn_about.png')} style={{ width: '100%', height: bigBtnH, resizeMode: 'contain' }} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}

          {page === 'about' && (
            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
              <Image
                source={require('../assets/image_loder.png')}
                style={{ width: Math.round((isSmallScreen ? 220 : 280) * s), height: Math.round((isSmallScreen ? 220 : 280) * s), resizeMode: 'contain', marginTop: Math.round((isSmallScreen ? 18 : 24) * s) }}
                accessibilityLabel="Mr. Batt"
              />
              <View style={{ paddingHorizontal: Math.round((isSmallScreen ? 20 : 24) * s), marginTop: Math.round((isSmallScreen ? 12 : 18) * s) }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: Math.max(12, Math.round((isSmallScreen ? 14 : 16) * s)), lineHeight: Math.round((isSmallScreen ? 18 : 22) * s) }}>
                  “Legends Humor MrBatt” is a collection of jokes from athletes of various sports: football, basketball, tennis and hockey.
                  Read stories every day, funny situations from the locker room and a special game “Guess the athlete” for real sports fans.
                </Text>
              </View>
              <TouchableOpacity onPress={onShare} activeOpacity={0.9} style={{ marginTop: Math.round((isSmallScreen ? 12 : 18) * s) }}>
                <Image source={require('../assets/btn_share.png')} style={{ width: Math.round((isSmallScreen ? 140 : 160) * s), height: Math.round((isSmallScreen ? 50 : 56) * s), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
          )}

          {page === 'settings' && (
            <View style={{ flex: 1, width: '100%' }}>
              <View style={{ paddingHorizontal: Math.round(20 * s), marginTop: Math.round((isSmallScreen ? 20 : 24) * s) }}>
                <View
                  style={{
                    backgroundColor: 'rgba(9,20,45,0.6)',
                    borderRadius: Math.round(22 * s),
                    paddingVertical: Math.round(14 * s),
                    paddingHorizontal: Math.round(18 * s),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: Math.round(344 * s),
                    height: Math.round(102 * s),
                    alignSelf: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: Math.max(14, Math.round(16 * s)), fontWeight: '700' }}>VIBRATION</Text>
                  <Switch
                    value={vibration}
                    onValueChange={setVibration}
                    thumbColor={vibration ? '#fff' : '#eee'}
                    trackColor={{ false: '#20304D', true: '#2C4B8F' }}
                  />
                </View>
              </View>

              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Image
                  source={require('../assets/image_onbording.png')}
                  style={{ width: Math.round((isSmallScreen ? 220 : 270) * s), height: Math.round((isSmallScreen ? 280 : 350) * s), resizeMode: 'contain', marginBottom: Math.round((isSmallScreen ? 10 : 20) * s) }}
                  accessibilityLabel="Mr. Batt character"
                />
              </View>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});