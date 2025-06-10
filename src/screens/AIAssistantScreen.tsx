import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
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

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('patty') || lowerMessage.includes('meat')) {
      return 'For the perfect patty: Use 80/20 ground beef, don\'t overwork the meat, make a small indent in the center to prevent puffing, and season generously with salt and pepper just before cooking. Cook for 3-4 minutes per side for medium doneness! 🥩';
    }
    
    if (lowerMessage.includes('cheese')) {
      return 'Great cheese choices for burgers:\n• American - Classic melting\n• Cheddar - Sharp flavor\n• Swiss - Nutty taste\n• Pepper Jack - Spicy kick\n• Blue cheese - Bold flavor\n\nAdd cheese in the last minute of cooking for perfect melting! 🧀';
    }
    
    if (lowerMessage.includes('vegetarian') || lowerMessage.includes('veggie')) {
      return 'Delicious vegetarian options:\n• Black bean patties\n• Portobello mushroom caps\n• Quinoa and vegetable patties\n• Beyond/Impossible meat alternatives\n• Grilled halloumi cheese\n\nDon\'t forget to season well and add plenty of fresh toppings! 🥬';
    }
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('cook')) {
      return 'Burger cooking temperatures:\n• Rare: 120-125°F\n• Medium-rare: 130-135°F\n• Medium: 135-145°F\n• Medium-well: 145-155°F\n• Well-done: 155°F+\n\nAlways use a meat thermometer for food safety! 🌡️';
    }
    
    if (lowerMessage.includes('bun') || lowerMessage.includes('bread')) {
      return 'Best burger buns:\n• Brioche - Rich and buttery\n• Sesame seed - Classic choice\n• Pretzel buns - Unique flavor\n• Whole wheat - Healthier option\n• Potato buns - Soft and sweet\n\nAlways toast your buns for better texture! 🍞';
    }
    
    if (lowerMessage.includes('sauce') || lowerMessage.includes('condiment')) {
      return 'Popular burger sauces:\n• Classic: Ketchup, mustard, mayo\n• Special sauce: Mayo + ketchup + pickle relish\n• Aioli: Garlic mayo\n• BBQ sauce: Sweet and smoky\n• Chipotle mayo: Spicy and creamy\n\nExperiment with different combinations! 🥫';
    }
    
    if (lowerMessage.includes('topping')) {
      return 'Essential burger toppings:\n• Lettuce (iceberg or butter)\n• Tomato (thick slices)\n• Onion (red or white)\n• Pickles\n• Bacon\n• Avocado\n• Mushrooms\n\nLayer strategically: wet ingredients away from the bun! 🥬🍅';
    }
    
    // Default responses
    const defaultResponses = [
      'That\'s a great question! For the best burger experience, focus on quality ingredients and proper cooking techniques. What specific aspect would you like to know more about?',
      'I\'d love to help you with that! Burger making is an art. Could you be more specific about what you\'re looking for?',
      'Interesting! There are many ways to approach burger making. What\'s your current skill level, and what would you like to improve?',
      'Great question! The key to amazing burgers is in the details. What particular challenge are you facing?',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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
      <StatusBar backgroundColor="#B91C1C" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Burger Chef</Text>
        <Text style={styles.headerSubtitle}>Your personal cooking assistant</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            style={styles.textInput}
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
            <Text style={styles.sendButtonText}>→</Text>
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
  header: {
    backgroundColor: '#B91C1C',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
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
    padding: 15,
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
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 14,
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
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#B91C1C',
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