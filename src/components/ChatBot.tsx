import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([{
        id: '1',
        text: t('chat.welcome'),
        isBot: true,
        timestamp: new Date(),
        language
      }]);
    }
  }, [isOpen, t, language, messages.length]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // FAQ responses
    if (message.includes('complaint') && message.includes('track')) {
      return 'To track your complaint, go to the "Track Complaint" page and enter your complaint ID. You should have received this ID when you submitted your complaint.';
    }
    
    if (message.includes('anonymous')) {
      return 'Yes, you can file complaints completely anonymously. Just check the "File Anonymously" option when submitting your complaint.';
    }
    
    if (message.includes('urgent') || message.includes('emergency')) {
      return 'For medical emergencies, please call emergency services immediately. For urgent healthcare complaints, mark your submission as "Critical" urgency level.';
    }
    
    if (message.includes('rights') || message.includes('patient rights')) {
      return 'You can find detailed information about patient rights on our Patient Rights page. These include rights to quality care, privacy, informed consent, and more.';
    }
    
    if (message.includes('feedback')) {
      return 'You can submit feedback through our Feedback page. We accept suggestions, compliments, and concerns to help improve our healthcare services.';
    }
    
    if (message.includes('time') || message.includes('how long')) {
      return 'Complaint resolution times vary based on complexity and urgency. Typical response times are: Low (7-14 days), Medium (3-7 days), High (1-3 days), Critical (within 24 hours).';
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return 'Hello! I can help you with:\n• Filing complaints and feedback\n• Tracking complaint status\n• Understanding patient rights\n• General healthcare questions\n\nWhat would you like to know?';
    }
    
    // Default response
    return 'Thank you for your message. I can help you with complaints, feedback, tracking, and patient rights. For specific medical advice, please consult with a healthcare professional. Is there something specific I can help you with?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
        language
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">{t('chat.title')}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-teal-700 p-1 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex space-x-2 max-w-xs ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`p-2 rounded-full ${message.isBot ? 'bg-teal-100' : 'bg-blue-100'}`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-teal-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-xs">
                  <div className="p-2 rounded-full bg-teal-100">
                    <Bot className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;