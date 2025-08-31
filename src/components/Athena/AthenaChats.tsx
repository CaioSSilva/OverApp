import { CirclePlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {
  getThemedStyles,
  COLORS,
  GLASS_COLORS,
  SPACING,
} from '../../styles/theme';
import Button from '../Button';

const windowHeight = Dimensions.get('window').height;

interface AthenaChatsProps {
  showValue: boolean;
  toggleMenu: () => void;
}

export function AthenaChats({ showValue, toggleMenu }: AthenaChatsProps) {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      {showValue && (
        <View style={styles.sidebarContainer}>
          <Text style={[getThemedStyles(isDarkMode).text, styles.menuText]}>
            {t('athena.lastChats')}
          </Text>

          <ScrollView style={styles.chatsView}>
            <></>
          </ScrollView>
          <Button
            width={140}
            onPress={() => {
              toggleMenu();
            }}
            title={t('athena.newChat')}
            icon={<CirclePlus size={22} color={COLORS.WHITE} />}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    height: windowHeight - (Platform.OS === 'ios' ? 170 : 160),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: SPACING.MD,
    marginHorizontal: 'auto',
  },
  chatsView: {
    flex: 1,
    width: '100%',
    marginBottom: SPACING.MD,
  },
  chatMenuContainer: {
    borderRadius: 10,
    width: '100%',
    padding: SPACING.XS,
    backgroundColor: GLASS_COLORS.PRIMARY_BACKGROUND,
    marginVertical: SPACING.XS,
    borderWidth: 1,
    borderColor: GLASS_COLORS.WHITE_BORDER,
  },

  chatTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedBorder: {
    borderColor: COLORS.PRIMARY,
  },

  chatMenuText: {
    fontSize: 12,
    padding: SPACING.SM,
  },
});
