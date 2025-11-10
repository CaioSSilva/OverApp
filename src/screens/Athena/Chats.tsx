import { CirclePlus, Trash } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  getThemedStyles,
  COLORS,
  GLASS_COLORS,
  SPACING,
} from '../../styles/theme';
import Button from '../../components/Button';
import React, { useContext } from 'react';
import { Chat } from '../../interfaces/Athena.model';
import AthenaContext from '../../contexts/AthenaContext';

const windowHeight = Dimensions.get('window').height;

interface AthenaChatsProps {
  showValue: boolean;
  toggleMenu: () => void;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function AthenaChats({
  showValue,
  toggleMenu,
  onCreateChat,
  onSelectChat,
  onDeleteChat,
}: AthenaChatsProps) {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const { chats, actualChatId } = useContext(AthenaContext);

  const handleCreateChat = () => {
    onCreateChat();
    toggleMenu();
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    toggleMenu();
  };

  const getChatName = (chat: Chat) => {
    if (chat.name) return chat.name;
    if (chat.messages.length > 0) {
      const firstUserMessage = chat.messages.find(m => m.role === 'user');
      return firstUserMessage?.content.substring(0, 30) + '...' || 'Chat';
    }
    return 'Novo Chat';
  };

  return (
    <>
      {showValue && (
        <View style={styles.sidebarContainer}>
          <Text style={[getThemedStyles(isDarkMode).text, styles.menuText]}>
            {t('athena.lastChats')}
          </Text>

          <ScrollView style={styles.chatsView}>
            {chats.map((chat) => {
              return (
                <TouchableOpacity
                  onPress={() => handleSelectChat(chat.id)}
                  style={[
                    styles.chatMenuContainer,
                    actualChatId === chat.id && styles.selectedBorder,
                  ]}
                  key={chat.id}
                >
                  <View style={styles.chatTextContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        getThemedStyles(isDarkMode).text,
                        styles.chatMenuText,
                      ]}
                    >
                      {getChatName(chat)}
                    </Text>
                    <TouchableOpacity onPress={() => onDeleteChat(chat.id)}>
                      <Trash size={16} color={COLORS.WARNING} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Button
            onPress={handleCreateChat}
            title={t('athena.newChat')}
            icon={
              <CirclePlus
                style={styles.moreIcon}
                size={22}
                color={COLORS.WHITE}
              />
            }
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
  moreIcon: {
    marginLeft: SPACING.SM,
  },
});
