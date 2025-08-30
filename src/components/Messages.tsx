import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';

import { COLORS, getThemedStyles } from '../styles/theme';

import { MessageInterface } from '../interfaces/Message.model';
import { Content } from '@google/genai';

export function Messages({ messages }: { messages: Content[] }) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        {messages.map((msg, index) => (
          <Message key={index} actor={msg.role!} text={msg.parts![0].text!} />
        ))}
      </ScrollView>
    </View>
  );
}

const Message = ({ actor, text }: MessageInterface) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.messageContainer,
        actor === 'model' ? styles.atenaMessage : styles.yourMessage,
      ]}
    >
      <Text style={[getThemedStyles(isDarkMode).text, styles.messageText]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 125,
    zIndex: 10,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  messageContainer: {
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '90%',
  },

  atenaMessage: {
    backgroundColor: COLORS.PRIMARY,
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },

  yourMessage: {
    backgroundColor: '#8e8e8fff',
    alignSelf: 'flex-end',
    marginRight: 30,
  },

  messageText: {
    color: 'white',
    textAlign: 'left',
  },
});
