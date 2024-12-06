import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import Icon from '@react-native-vector-icons/fontawesome6';

// Constants
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollY = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);

  const headerHeight = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP,
    );
    return {height};
  });

  const imageSize = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [80, 40],
      Extrapolate.CLAMP,
    );
    return {width: size, height: size};
  });

  const animatedPaddingTopTab = useAnimatedStyle(() => {
    const paddingTop = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP,
    );
    return {paddingTop};
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
    pagerRef.current?.setPage(tabIndex);
  };

  const renderTabButton = (tabIndex: number, title: string) => (
    <TouchableOpacity
      key={title}
      style={[styles.tabButton, activeTab === tabIndex && styles.activeTab]}
      onPress={() => handleTabChange(tabIndex)}>
      <Text style={styles.tabText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderFlatList = (tabIndex: number) => (
    <Animated.FlatList
      data={Array.from(
        {length: 20},
        (_, i) => `Item ${i + 1} - Tab ${tabIndex + 1}`,
      )}
      contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT + 50}}
      renderItem={({item}) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      onScroll={onScroll}
      scrollEventThrottle={12}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <Animated.View style={[styles.header, headerHeight]}>
        <TouchableOpacity style={styles.leftButton}>
          <Icon name="chevron-left" size={20} color="#fff" iconStyle="solid" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Animated.Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={[styles.avatar, imageSize]}
          />
          <Text style={styles.headerTitle}>Cristiano Ronaldo</Text>
        </View>
        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.rightButton}>
            <Icon
              name="magnifying-glass"
              size={20}
              color="#fff"
              iconStyle="solid"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightButton}>
            <Icon name="user" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tabs */}
      <Animated.View style={[styles.tabsContainer, animatedPaddingTopTab]}>
        {['Tab 1', 'Tab 2', 'Tab 3'].map((title, index) =>
          renderTabButton(index, title),
        )}
      </Animated.View>

      {/* PagerView */}
      <PagerView
        style={{flex: 1}}
        ref={pagerRef}
        initialPage={0}
        onPageSelected={e => setActiveTab(e.nativeEvent.position)}>
        {[0, 1, 2].map(tabIndex => (
          <View key={tabIndex} style={styles.page}>
            {renderFlatList(tabIndex)}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    backgroundColor: '#1E9fF0',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  leftButton: {
    position: 'absolute',
    left: 16,
    paddingVertical: 8,
    top: StatusBar.currentHeight || 20,
  },
  rightButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16,
    top: StatusBar.currentHeight || 20,
  },
  rightButton: {marginLeft: 16, paddingVertical: 8},
  headerContent: {flexDirection: 'column', alignItems: 'center', flex: 1},
  avatar: {borderRadius: 40},
  headerTitle: {color: '#FFF', fontSize: 18, fontWeight: 'bold'},
  tabsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  tabButton: {paddingVertical: 10},
  activeTab: {borderBottomWidth: 2, borderBottomColor: '#1E9fF0'},
  tabText: {fontSize: 16, color: '#000'},
  page: {flex: 1},
  itemContainer: {padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  itemText: {fontSize: 16},
});

export default ProfileScreen;
