import {Dimensions, StatusBar} from 'react-native';
const {width} = Dimensions.get('window');

const MUSIC_ITEM_SIZE = {
  size: 150,
  margin: 10,
};

const BORDER_WIDTH_LIST_MUSIC = 3;
const MARGIN_LIST_MUSIC = 10;
const MUSIC_ITEM_FULL_SIZE = MUSIC_ITEM_SIZE.size + MUSIC_ITEM_SIZE.margin * 2;
const MARGIN_BORDER = (width - MUSIC_ITEM_FULL_SIZE) / 2;

const CIRCLE_GESTURE_SIZE = width / 1.2;
const CIRCLE_GESTURE_WIDTH = CIRCLE_GESTURE_SIZE / 4.2;
const INNER_BALL_SIZE = CIRCLE_GESTURE_SIZE - CIRCLE_GESTURE_WIDTH * 2;
const ITEM_TOTAL_SIZE = MUSIC_ITEM_SIZE.size + MUSIC_ITEM_SIZE.margin * 2;

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

export {
  width,
  MUSIC_ITEM_SIZE,
  STATUS_BAR_HEIGHT,
  BORDER_WIDTH_LIST_MUSIC,
  MARGIN_LIST_MUSIC,
  MARGIN_BORDER,
  INNER_BALL_SIZE,
  ITEM_TOTAL_SIZE,
};