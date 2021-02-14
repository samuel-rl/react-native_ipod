import React from 'react';
import {View, StyleSheet, Image, Text, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  scrollTo,
  useAnimatedGestureHandler,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  ITEM_TOTAL_SIZE,
  CIRCLE_GESTURE_SIZE,
  MARGIN_BORDER,
  MUSIC_ITEM_SIZE,
  BORDER_WIDTH_LIST_MUSIC,
  MARGIN_LIST_MUSIC,
  INNER_BALL_SIZE,
  CIRCLE_GESTURE_WIDTH,
} from '../utils/Constants';
import {data} from '../utils/Database';

function IpodView() {
  const position = useSharedValue(0);
  const animatedRef = useAnimatedRef<Animated.ScrollView>();

  const scrollToNearestItem = (offset: number) => {
    'worklet';
    let minDistance;
    let minDistanceIndex = 0;
    for (let i = 0; i < data.length; ++i) {
      const distance = Math.abs(i * ITEM_TOTAL_SIZE - offset);
      if (minDistance === undefined) {
        minDistance = distance;
      } else {
        if (distance < minDistance) {
          minDistance = distance;
          minDistanceIndex = i;
        }
      }
    }
    scrollTo(animatedRef, minDistanceIndex * ITEM_TOTAL_SIZE, 0, true);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      position.value = e.contentOffset.x;
    },
    onEndDrag: (e) => {
      scrollToNearestItem(e.contentOffset.x);
    },
    onMomentumEnd: (e) => {
      scrollToNearestItem(e.contentOffset.x);
    },
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (e: PanGestureHandlerEventPayload, ctx: any) => {
      ctx.start = {x: e.x, y: e.y};
      ctx.last = ctx.start;
    },
    onActive: (e, ctx) => {
      const currentPoz = {x: e.x, y: e.y};
      const lastPoz = ctx.last;
      ctx.last = currentPoz;
      if (currentPoz.x === lastPoz.x && lastPoz.y === currentPoz.y) {
        return;
      }
      const changeVector = {
        x: currentPoz.x - lastPoz.x,
        y: currentPoz.y - lastPoz.y,
      };
      const toCenterV = {
        x: CIRCLE_GESTURE_SIZE / 2 - lastPoz.x,
        y: CIRCLE_GESTURE_SIZE / 2 - lastPoz.y,
      };
      const crossProd =
        changeVector.x * toCenterV.y - changeVector.y * toCenterV.x;
      if (crossProd === 0) {
        return;
      }
      const dist = Math.sqrt(changeVector.x ** 2 + changeVector.y ** 2);
      const sign = crossProd < 0 ? -1 : 1;
      const arr = [0, ITEM_TOTAL_SIZE * (data.length - 1)];
      position.value = interpolate(
        position.value + sign * dist * 5,
        arr,
        arr,
        Extrapolate.CLAMP,
      );
      scrollTo(animatedRef, position.value, 0, false);
    },
    onEnd: () => {
      scrollToNearestItem(position.value);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.listMusic}>
        <Animated.ScrollView
          ref={animatedRef}
          horizontal={true}
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}>
          {data.map(({artist, title, cover}, index: number) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const uas = useAnimatedStyle(() => {
              let style: ViewStyle = {
                opacity: 1,
                transform: [{scale: 1.05}],
              };
              const itemDistance =
                Math.abs(position.value - index * ITEM_TOTAL_SIZE) /
                ITEM_TOTAL_SIZE;
              if (itemDistance >= 0.5) {
                style.opacity = 0.5;
                style.transform = [{scale: 1}];
              } else if (itemDistance > 3) {
                style.opacity = 0;
              }
              return style;
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.item,
                  uas,
                  {
                    marginLeft:
                      index === 0 ? MARGIN_BORDER : MUSIC_ITEM_SIZE.margin,
                    marginRight:
                      index === data.length - 1
                        ? MARGIN_BORDER
                        : MUSIC_ITEM_SIZE.margin,
                  },
                ]}>
                <Image
                  style={styles.cover}
                  source={{
                    uri: cover,
                  }}
                />
                <Text style={[styles.artist, styles.textSong]}>{artist}</Text>
                <Text style={[styles.title, styles.textSong]}>{title}</Text>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.gestureContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.gestureCircle}>
            <View style={styles.icones}>
              <View style={[styles.containerIcone, styles.centerIcon]}>
                <Text style={styles.iconeMenu}>MENU</Text>
              </View>
              <View style={[styles.containerIcone, styles.iconesSkip]}>
                <Image
                  source={require('../assets/skip-backward.png')}
                  style={{}}
                />
                <Image
                  source={require('../assets/skip-forward.png')}
                  style={{}}
                />
              </View>
              <View style={[styles.containerIcone, styles.centerIcon]}>
                <Image
                  source={require('../assets/play-pause.png')}
                  style={styles.iconePlay}
                />
              </View>
            </View>
            <View style={styles.innerCircle} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b9bccf',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  listMusic: {
    backgroundColor: '#000',
    flex: 4,
    borderColor: '#000',
    borderWidth: BORDER_WIDTH_LIST_MUSIC,
    marginHorizontal: MARGIN_LIST_MUSIC,
    borderRadius: 8,
    marginTop: 20,
  },
  item: {
    width: MUSIC_ITEM_SIZE.size,
    marginHorizontal: MUSIC_ITEM_SIZE.margin,
    marginVertical: 20,
    flexDirection: 'column',
  },
  gestureContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: MUSIC_ITEM_SIZE.size,
    height: MUSIC_ITEM_SIZE.size,
  },
  textSong: {
    color: '#fff',
    textAlign: 'center',
  },
  artist: {
    marginTop: 8,
    fontSize: 12,
  },
  title: {
    fontSize: 16,
  },
  gestureCircle: {
    borderRadius: CIRCLE_GESTURE_SIZE,
    width: CIRCLE_GESTURE_SIZE,
    height: CIRCLE_GESTURE_SIZE,
    margin: 20,
    backgroundColor: '#000',
  },
  innerCircle: {
    position: 'absolute',
    width: INNER_BALL_SIZE,
    height: INNER_BALL_SIZE,
    borderRadius: INNER_BALL_SIZE,
    top: CIRCLE_GESTURE_WIDTH,
    left: CIRCLE_GESTURE_WIDTH,
    backgroundColor: '#D3D3D3',
  },
  icones: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerIcone: {
    height: CIRCLE_GESTURE_WIDTH,
    flexDirection: 'column',
  },
  centerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconePlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeMenu: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  iconesSkip: {
    marginHorizontal: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default IpodView;
