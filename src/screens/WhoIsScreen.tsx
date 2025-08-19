import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  Easing,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, CategoryKey } from '../../App';
import { JOKES_BY_CAT } from '../data/jokes';

type Props = NativeStackScreenProps<RootStackParamList, 'WhoIs'>;

const BASE_H = 844;

const ROUND_CATEGORY: CategoryKey = 'RUGBY';

const CATEGORY_META: Record<
  CategoryKey,
  {
    label: string;
    image: any;
    distractors: string[];
  }
> = {
  FOOTBALL: {
    label: 'Footballer',
    image: require('../assets/football_player.png'),
    distractors: [
      'Rugby player',
      'Swimmer',
      'Tennis player',
      'Hockey player',
      'Basketball player',
    ],
  },
  HOCKEY: {
    label: 'Hockey player',
    image: require('../assets/hockey_player.png'),
    distractors: ['Footballer', 'Swimmer', 'Tennis player', 'Basketball player'],
  },
  TENNIS: {
    label: 'Tennis player',
    image: require('../assets/tennis_player.png'),
    distractors: ['Footballer', 'Hockey player', 'Basketball player'],
  },
  BASKETBALL: {
    label: 'Basketball player',
    image: require('../assets/basketball_player.png'),
    distractors: ['Footballer', 'Tennis player', 'Hockey player'],
  },
  KGB: {
    label: 'KGB player',
    image: require('../assets/kgb_player.png'),
    distractors: [
      'Footballer',
      'Tennis player',
      'Hockey player',
      'Basketball player',
    ],
  },
  RUGBY: {
    label: 'Rugby player',
    image: require('../assets/rugby_player.png'),
    distractors: [
      'Footballer',
      'Basketball player',
      'Hockey player',
      'Tennis player',
      'Swimmer',
    ],
  },
};

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(a: T[]) => {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const JOKES_WITH_RUGBY = {
  ...JOKES_BY_CAT,
  RUGBY: [
    "My ball is a strange shape, but I'm used to it.",
    "When I run, the only way to stop me is with a hug... a really strong one.",
    "If I get caught, either I fall or he falls.",
    "We don't run for speed, we run for the battering ram.",
    "After a game, my uniform weighs twice as much - from the dirt and sweat.",
    "My favorite moment of the match is when an opponent flies back off my shoulder.",
    "If I fall, it means I've dragged someone with me.",
    "We always pass backwards to move forward.",
    "To play this game, you have to love pain... and give it a little.",
    "When I have the ball, I suddenly become very popular with my opponents.",
  ],
};

export default function WhoIsScreen({ navigation }: Props) {
  const { width, height } = Dimensions.get('window');
  const s = useMemo(() => Math.min(1, height / BASE_H), [height]);

  const headerBtn = Math.round(77 * s);
  const whoIsW = Math.round(174 * s);
  const whoIsH = Math.round(77 * s);
   
  const whoGroupW = Math.round(450 * s);  
  const whoGroupH = Math.round(500 * s);  
  const whoIsWhoW = Math.round(450 * s);
  const whoIsWhoH = Math.round(500 * s);

  const startW = Math.round(236 * s);
  const startH = Math.round(85 * s);

  const redW = Math.round(225 * s);
  const redH = Math.round(258 * s);
  const jokeBoxW = Math.round(344 * s);
  const jokeBoxH = Math.round(138 * s);

  const ctaW = Math.round(190 * s);
  const ctaH = Math.round(84 * s);

  const [step, setStep] = useState<'intro' | 'jokes' | 'guess' | 'result'>(
    'intro',
  );

  const meta = CATEGORY_META[ROUND_CATEGORY];
  const [options, setOptions] = useState<string[]>([]);
  const [won, setWon] = useState<boolean | null>(null);

  useEffect(() => {
    if (step === 'guess') {
      const wrong = pickRandom(meta.distractors);
      setOptions(shuffle([meta.label, wrong]));
    }
  }, [step, meta.label]);

  const jokesPool = JOKES_WITH_RUGBY[ROUND_CATEGORY] ?? [];
  const randomOrder = useMemo(() => {
    const idxs = Array.from({ length: jokesPool.length }, (_, i) => i);
    return shuffle(idxs);
  }, [jokesPool.length]);

  const [jokeIdx, setJokeIdx] = useState(0);
  const jokeText = jokesPool[randomOrder[jokeIdx]] ?? '';

  const continueJokes = () => {
    if (jokeIdx + 1 < randomOrder.length) {
      animateJokeOutIn(() => setJokeIdx(jokeIdx + 1));
    } else {
      setStep('guess');
    }
  };

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeBlock = useRef(new Animated.Value(0)).current;
  const slideBlock = useRef(new Animated.Value(16)).current;
  const jokeOpacity = useRef(new Animated.Value(1)).current;
  
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const contentTranslate = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeHeader, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fadeBlock, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideBlock, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeHeader, fadeBlock, slideBlock]);

  useEffect(() => {
    contentFade.setValue(0);
    contentScale.setValue(0.9);
    contentTranslate.setValue(step === 'result' ? 150 : 300); 

    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, contentFade, contentScale, contentTranslate]);

  const animateJokeOutIn = (change: () => void) => {
    Animated.timing(jokeOpacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      change();
      Animated.timing(jokeOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: 'I just completed the game "Who Is"!',
        url: 'https://www.example.com', 
        title: 'Check out this awesome game!',
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const Header = (
    <Animated.View
      style={[
        styles.headerRow,
        {
          opacity: fadeHeader,
          paddingHorizontal: Math.round(16 * s),
          marginTop: Math.round(20 * s),
        },
      ]}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
        <Image
          source={require('../assets/btn_back.png')}
          style={{ width: headerBtn, height: headerBtn, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      <Image
        source={require('../assets/who_is.png')}
        style={{ width: whoIsW, height: whoIsH, resizeMode: 'contain' }}
      />
      <Image
        source={require('../assets/image_loder.png')}
        style={{ width: headerBtn, height: headerBtn, resizeMode: 'contain' }}
      />
    </Animated.View>
  );

  const Intro = (
    <Animated.View
      style={{
        alignItems: 'center',
        opacity: contentFade,
        transform: [{ translateY: contentTranslate }, { scale: contentScale }],
      }}
    >
      <Image
        source={require('../assets/who_group.png')}
        style={{
          width: whoGroupW,
          height: whoGroupH,
          resizeMode: 'contain',
          marginTop: Math.round(30 * s),
        }}
      />
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setStep('jokes')}
        style={{ marginTop: Math.round(16 * s) }}
      >
        <Image
          source={require('../assets/yes_start.png')}
          style={{ width: startW, height: startH, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const Jokes = (
    <Animated.View
      style={{
        alignItems: 'center',
        opacity: contentFade,
        transform: [{ translateY: contentTranslate }, { scale: contentScale }],
        marginTop: Math.round(50 * s),
      }}
    >
      <View>
        <Image
          source={require('../assets/red_jokers.png')}
          style={{
            width: redW,
            height: redH,
            resizeMode: 'contain',
          }}
        />
        <View style={{
          position: 'absolute',
          top: Math.round(10 * s),
          right: Math.round(10 * s),
          backgroundColor: 'white',
          borderRadius: Math.round(15 * s),
          width: Math.round(30 * s),
          height: Math.round(30 * s),
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}>
          <Text style={{
            color: '#0E1525',
            fontSize: Math.round(10 * s),
            fontWeight: 'bold',
          }}>
            {jokeIdx + 1}/{randomOrder.length}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.jokeBox,
          {
            width: jokeBoxW,
            height: jokeBoxH,
            borderRadius: Math.round(22 * s),
          },
        ]}
      >
        <Animated.Text
          style={{
            color: '#EAF0FF',
            fontSize: Math.max(14, Math.round(16 * s)),
            lineHeight: Math.round(22 * s),
            textAlign: 'center',
            paddingHorizontal: Math.round(16 * s),
            opacity: jokeOpacity,
          }}
        >
          {jokeText}
        </Animated.Text>
      </View>
      <TouchableOpacity
        onPress={continueJokes}
        activeOpacity={0.9}
        style={{ marginTop: Math.round(32 * s) }}
      >
        <Image
          source={require('../assets/continue.png')}
          style={{ width: ctaW, height: ctaH, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const Guess = (
    <Animated.View
      style={{
        alignItems: 'center',
        opacity: contentFade,
        transform: [{ translateY: contentTranslate }, { scale: contentScale }],
      }}
    >
      <Image
        source={require('../assets/who_is_who.png')}
        style={{
          width: whoIsWhoW,
          height: whoIsWhoH,
          resizeMode: 'contain',
          marginTop: Math.round(30 * s),
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: Math.round(14 * s),
          position: 'absolute',
          bottom: Math.round(0 * s),
          width: '100%',
        }}
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.9}
            onPress={() => {
              setWon(opt === meta.label);
              setStep('result');
            }}
            style={[
              styles.pill,
              {
                paddingVertical: Math.round(22 * s),
                paddingHorizontal: Math.round(18 * s),
              },
            ]}
          >
            <Text style={[styles.pillText, { fontSize: Math.round(14 * s) }]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const Result = (
    <Animated.View
      style={{
        alignItems: 'center',
        opacity: contentFade,
        transform: [{ translateX: contentTranslate }, { scale: contentScale }],
      }}
    >
      {won ? (
        <>
          <View style={{ marginTop: Math.round(30 * s), alignItems: 'center' }}>
            <Image
              source={require('../assets/answer.png')}
              style={{
                width: Math.round(450 * s),
                height: Math.round(500 * s),
                resizeMode: 'contain',
              }}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onShare}
              style={{
                marginTop: Math.round(16 * s),
                width: Math.round(72 * s),
                height: Math.round(72 * s),
              }}
            >
              <Image
                source={require('../assets/btn_share.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{
          alignItems: 'center',
          marginTop: Math.round(20 * s),
        }}>
          <Image
            source={require('../assets/image_onbording.png')}
            style={{
              width: Math.round(400 * s),
              height: Math.round(500 * s),
              resizeMode: 'contain',
              marginTop: Math.round(12 * s),
            }}
          />
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: Math.round(32 * s),
              marginTop: Math.round(8 * s),
            }}
          >
            OH…{'\n'}Try again
          </Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        {Header}
        <View style={{ flex: 1 }}>
          {step === 'intro' && Intro}
          {step === 'jokes' && Jokes}
          {step === 'guess' && Guess}
          {step === 'result' && Result}
        </View>
        <View style={{ height: Math.round(8 * s) }} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jokeBox: {
    backgroundColor: 'rgba(11,21,38,0.72)',
    borderWidth: 1,
    borderColor: '#233B63',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    paddingHorizontal: 18,
  },
  pillText: {
    color: '#0E1525',
    fontWeight: '800',
  },
});