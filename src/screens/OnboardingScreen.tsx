
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BASE_SCREEN_H = 844;
const BASE_PANEL_H = 279;
const BASE_OVERLAP = 60; 

const BASE_HERO1_W = 377;
const BASE_HERO1_H = 430;
const BASE_HERO1_MTOP = 38;
const BASE_HERO1_MBOT = 16;

const BASE_PANEL_PAD_H = 20;
const BASE_PANEL_PAD_TOP = 16;
const BASE_PANEL_PAD_BOTTOM = 18;
const BASE_TITLE_FS = 20;
const BASE_SUB_FS = 18;
const BASE_BTN_W = 222;
const BASE_BTN_H = 77;

export default function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const { height: screenH } = Dimensions.get('window');
 
  const s = Math.min(1, screenH / BASE_SCREEN_H);


  const panelH = Math.round(BASE_PANEL_H * s);
  const overlap = Math.round(BASE_OVERLAP * s);
  const panelTopY = screenH - panelH; 

  const imgHeight23 = Math.max(200, panelTopY + overlap);

  const hero1W = Math.round(BASE_HERO1_W * s);
  const hero1H = Math.round(BASE_HERO1_H * s);
  const hero1MT = Math.round(BASE_HERO1_MTOP * s);
  const hero1MB = Math.round(BASE_HERO1_MBOT * s);

  const padH = Math.round(BASE_PANEL_PAD_H * s);
  const padTop = Math.round(BASE_PANEL_PAD_TOP * s);
  const padBottom = Math.round(BASE_PANEL_PAD_BOTTOM * s);
  const titleFS = Math.max(16, Math.round(BASE_TITLE_FS * s));
  const subFS = Math.max(14, Math.round(BASE_SUB_FS * s));
  const btnW = Math.round(BASE_BTN_W * s);
  const btnH = Math.round(BASE_BTN_H * s);

  const imgOpacity = useRef(new Animated.Value(0)).current;
  const imgTranslate = useRef(new Animated.Value(12)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslate = useRef(new Animated.Value(24)).current;

  const runStepAnim = () => {
    imgOpacity.setValue(0);
    imgTranslate.setValue(12);
    panelOpacity.setValue(0);
    panelTranslate.setValue(24);

    Animated.parallel([
      Animated.timing(imgOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(imgTranslate, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(panelOpacity, {
        toValue: 1,
        delay: 80,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelTranslate, {
        toValue: 0,
        delay: 80,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    runStepAnim();
  }, [step, s]);

  const goNext = async () => {
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else {
      await AsyncStorage.setItem('hasOnboarded', '1');
      navigation.replace('Home');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.container}>
  
        {step === 0 ? (
          <Animated.Image
            source={require('../assets/image_onbording.png')}
            style={[
              styles.hero1,
              {
                width: hero1W,
                height: hero1H,
                marginTop: hero1MT,
                marginBottom: hero1MB,
                opacity: imgOpacity,
                transform: [{ translateY: imgTranslate }],
              },
            ]}
            accessibilityLabel="Onboarding image page 1"
          />
        ) : step === 1 ? (
          <Animated.Image
            source={require('../assets/image_onbording2.png')}
            style={[
              styles.topImage,
              {
                height: imgHeight23,
                opacity: imgOpacity,
                transform: [{ translateY: imgTranslate }],
              },
            ]}
            resizeMode="cover"
            accessibilityLabel="Onboarding image page 2"
          />
        ) : (
          <Animated.Image
            source={require('../assets/image_onbording3.png')}
            style={[
              styles.topImage,
              {
                height: imgHeight23,
                opacity: imgOpacity,
                transform: [{ translateY: imgTranslate }],
              },
            ]}
            resizeMode="cover"
            accessibilityLabel="Onboarding image page 3"
          />
        )}

        <Animated.View
          style={[
            styles.panel,
            {
              height: panelH,
              paddingHorizontal: padH,
              paddingTop: padTop,
              paddingBottom: padBottom,
              opacity: panelOpacity,
              transform: [{ translateY: panelTranslate }],
            },
          ]}
        >
          {step === 0 && (
            <>
              <Text style={[styles.title, { fontSize: titleFS }]}>
                Hello, friend! I'm Mr. Batt!
              </Text>
              <Text style={[styles.subtitle, { fontSize: subFS }]}>
                Here you and I will joke together with sports legends. Get ready to laugh, because we
                have five categories and not a single dull moment!
              </Text>

              <TouchableOpacity onPress={goNext} activeOpacity={0.9} style={styles.btnWrap}>
                <Image
                  source={require('../assets/contin.png')}
                  style={{ width: btnW, height: btnH, resizeMode: 'contain' }}
                  accessibilityLabel="Continue"
                />
              </TouchableOpacity>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={[styles.title, { fontSize: titleFS }]}>Choose a category</Text>
              <Text style={[styles.subtitle, { fontSize: subFS }]}>
                football, basketball, tennis, hockey or anything else — and get fresh jokes straight
                from the locker rooms of great athletes. Every day a new portion of fun!
              </Text>

              <TouchableOpacity onPress={goNext} activeOpacity={0.9} style={styles.btnWrap}>
                <Image
                  source={require('../assets/next.png')}
                  style={{ width: btnW, height: btnH, resizeMode: 'contain' }}
                  accessibilityLabel="Next"
                />
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.title, { fontSize: titleFS }]}>Guess the athlete</Text>
              <Text style={[styles.subtitle, { fontSize: subFS }]}>
                There's a special feature here — I'll show you a silhouette and a few jokes, and you
                try to guess who this athlete is! Test your sports sense!
              </Text>

              <TouchableOpacity onPress={goNext} activeOpacity={0.9} style={styles.btnWrap}>
                <Image
                  source={require('../assets/start.png')}
                  style={{ width: btnW, height: btnH, resizeMode: 'contain' }}
                  accessibilityLabel="Start"
                />
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  bgImage: { resizeMode: 'cover' },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  hero1: {
    zIndex: 1,
  },

  topImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1, 
  },

  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#14243E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2, 
  },

  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 14,
  },

  btnWrap: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
