import { Menu } from 'lucide-react-native';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import {
  COLORS,
  getThemedStyles,
  GLASS_COLORS,
  SPACING,
} from '../../styles/theme';
import { useState, useRef } from 'react';

const windowHeight = Dimensions.get('window').height;

export default function AthenaMenu() {
  const [menuWidth, setMenuWidth] = useState(0);
  const [showValue, setShowValue] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const isDarkMode = useColorScheme() === 'dark';
  const menuMargin = Animated.add(SPACING.LG, animatedWidth);
  const borderWidth = showValue ? 1 : 0;

  const toggleMenu = () => {
    const opening = menuWidth === 0;
    const newWidth = opening ? 300 : 0;
    if (!opening) setShowValue(false);
    Animated.timing(animatedWidth, {
      toValue: newWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setMenuWidth(newWidth);
      if (opening) setShowValue(true);
    });
  };

  const borderColor = isDarkMode ? '#1F1F1F' : '#D3D3D3';
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.sidebar,
          getThemedStyles(isDarkMode).container,
          {
            width: animatedWidth,
            borderRightWidth: borderWidth,
            borderColor: borderColor,
          },
        ]}
      >
        {/* <AthenaChats
          showValue={showValue}
          toggleMenu={toggleMenu}
        /> */}
      </Animated.View>
      <Animated.View
        style={[styles.button, { marginLeft: menuMargin }]}
        onTouchStart={toggleMenu}
      >
        <Menu size={20} color={COLORS.PRIMARY} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  button: {
    width: 38,
    height: 38,
    marginLeft: SPACING.LG + 300,
    marginTop: SPACING.SM,
    padding: SPACING.SM,
    zIndex: 1000,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: GLASS_COLORS.PRIMARY_BACKGROUND,
    borderColor: GLASS_COLORS.PRIMARY_BORDER,
  },
  sidebar: {
    position: 'absolute',
    backgroundColor: '#151515',
    borderRightWidth: 1,
    zIndex: 1000,
    width: 300,
    height: windowHeight,
  },
});
