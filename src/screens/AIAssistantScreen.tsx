import { AI_CHEF_API_KEY } from '@env';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Text from "../components/CustomText";
import { useTheme } from "../context/ThemeContext";
import { AIMessage } from '../types/Burger';

const AIAssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Burger Chef Assistant! 🍔 I can help you with burger recipes, cooking tips, ingredient substitutions, and answer any questions about making delicious burgers. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, isDarkMode } = useTheme()

  const quickQuestions = [
    'How to make a perfect patty?',
    'Best cheese for burgers?',
    'Vegetarian burger ideas',
    'Cooking temperature tips',
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const burgerPrompt = `
      You are an AI Burger Chef Assistant 🍔.
      You help users with burger recipes, patty tips, ingredient substitutions, and cooking techniques.
      Answer helpfully, friendly, and like a fun burger expert.
      User: ${userMessage}
    `;

    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/chat',
        {
          message: burgerPrompt,
          model: 'command-r',
          chat_history: [],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${AI_CHEF_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.text ?? 'Hmm... I couldn’t think of a good answer!';
    } catch (error: any) {
      console.error('Cohere API error:', error?.response?.data || error.message || error);
      return 'Sorry, I’m having trouble responding right now. Please try again later!';
    }
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiText = await generateAIResponse(text);

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const MessageBubble: React.FC<{ message: AIMessage }> = ({ message }) => (
    <View style={[
      styles.messageBubble,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const QuickQuestionButton: React.FC<{ question: string }> = ({ question }) => (
    <TouchableOpacity
      style={styles.quickButton}
      onPress={() => sendMessage(question)}
    >
      <Text style={styles.quickButtonText}>{question}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={isDarkMode ? colors.statusBar : "#8B0000"} 
      barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <Image
            source={{ uri : "https://img.icons8.com/fluency-systems-regular/48/chatbot.png"}}
            style={{ width: 18, height: 18, tintColor: 'white', marginRight: 8, top: 4 }}
          /> 
          <Text weight='semiBold' style={styles.headerTitle}>AI Burger Chef</Text>
        </View>
        <Text style={styles.headerSubtitle}>Your personal cooking assistant</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={5}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <Text style={styles.typingText}>AI Chef is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickQuestions.map((question, index) => (
                <QuickQuestionButton key={index} question={question} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                fontFamily: 'Poppins-Regular',
              },
            ]}
            placeholder="Ask me anything about burgers..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
          >
            <Image
              source={{ uri: "https://img.icons8.com/puffy-filled/32/sent.png" }}
              style={{
                width: 22,
                height: 22,
                tintColor: !inputText.trim() ? '#999' : '#B91C1C',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: "#8B0000",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomStartRadius: 60,
    borderBottomEndRadius: 60,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 15,
    borderRadius: 20,
    padding: 20,
  },
  userMessage: {
    backgroundColor: '#B91C1C',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 5,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  typingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  quickButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  quickButtonText: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 13,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'rgba(243, 241, 241, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AIAssistantScreen;