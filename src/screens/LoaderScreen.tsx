
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Home: undefined;
  ReadJokes: undefined;
  Saved: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const SPINNER_SIZE = 52;
const R = 20;
const CX = 26;
const CY = 26;
const STROKE_W = 3;
const CIRC = 2 * Math.PI * R;

const BASE_LOGO_SIZE = 500;
const BASE_LOGO_MARGIN_TOP = 88; 
const BASE_SPINNER_BOTTOM = 160; 

export default function LoaderScreen({ navigation }: Props) {
  const rotate = useRef(new Animated.Value(0)).current;
  const phase = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoTranslateY = useRef(new Animated.Value(-12)).current;

  const { height } = useWindowDimensions();

  const designHeight = BASE_LOGO_SIZE + BASE_LOGO_MARGIN_TOP + BASE_SPINNER_BOTTOM + 40; 
  const fitScale = Math.min(1, height / designHeight);

  const logoSize = BASE_LOGO_SIZE * fitScale;
  const logoMarginTop = BASE_LOGO_MARGIN_TOP * fitScale;
  const spinnerBottom = BASE_SPINNER_BOTTOM * fitScale;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(phase, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [rotate, phase]);

  useEffect(() => {
    const id = phase.addListener(({ value }) => {
      const firstHalf = value <= 0.5;
      const t = firstHalf ? value / 0.5 : (value - 0.5) / 0.5;

      const aStart = 0.02 * CIRC;
      const aMid = 0.45 * CIRC;
      const aEnd = 0.02 * CIRC;
      const a = firstHalf ? aStart + (aMid - aStart) * t : aMid + (aEnd - aMid) * t;

      const oStart = 0;
      const oMid = -0.17 * CIRC;
      const oEnd = -0.6 * CIRC;
      const o = firstHalf ? oStart + (oMid - oStart) * t : oMid + (oEnd - oMid) * t;

      circleRef.current?.setNativeProps({
        strokeDasharray: [a, CIRC],
        strokeDashoffset: o,
      });
    });
    return () => phase.removeListener(id);
  }, [phase]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  //useEffect(() => {
  //  const t = setTimeout(() => navigation.replace('Onboarding'), 3000);
  //  return () => clearTimeout(t);
  //}, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.container}>
        <Animated.Image
          source={require('../assets/image_loder.png')}
          style={[
            styles.logo,
            {
              width: logoSize,
              height: logoSize,
              marginTop: logoMarginTop,
              opacity: logoOpacity,
              transform: [
                { perspective: 1000 },
                { translateY: logoTranslateY },
                { scale: logoScale },
              ],
            },
          ]}
          accessibilityLabel="Loader image"
        />

        <Animated.View
          style={[
            styles.spinnerWrap,
            { transform: [{ rotate: spin }], bottom: spinnerBottom },
          ]}
        >
          <Svg width={SPINNER_SIZE} height={SPINNER_SIZE} viewBox="0 0 52 52">
            <Circle
              ref={circleRef}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={STROKE_W}
              strokeLinecap="round"
              strokeDasharray={[0.02 * CIRC, CIRC]}
              strokeDashoffset={0}
            />
          </Svg>
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
    paddingTop: Platform.select({ ios: 16, android: 24 }),
  },
  logo: {
    resizeMode: 'contain',
  },
  spinnerWrap: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
