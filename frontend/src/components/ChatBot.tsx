import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, X, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatMessage } from '../types';
import { analyzeSentiment } from '../utils/sentiment';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true); // TTS enabled by default
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Speech Recognition & Synthesis Setup
  const recognitionRef = useRef<any>(null);
  const synthesisRef = window.speechSynthesis;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = t('chat.welcome');
      setMessages([{
        id: '1',
        text: welcomeText,
        isBot: true,
        timestamp: new Date(),
        language
      }]);
      if (isSpeaking) speakText(welcomeText);
    }
  }, [isOpen, t, language]);

  const speakText = (text: string) => {
    if (!isSpeaking) return;
    synthesisRef.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN'
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    synthesisRef.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('STT Error:', err);
      }
    }
  };

  const getMemoryContext = () => {
    const lastUserMsg = [...messages].reverse().find(m => !m.isBot);
    return lastUserMsg ? lastUserMsg.text.toLowerCase() : '';
  };

  const processIntent = (userMessage: string): { response: string; action?: () => void } => {
    const msg = userMessage.toLowerCase();
    const sentiment = analyzeSentiment(msg);
    const context = getMemoryContext();

    // Sentiment-based prefix
    let prefix = '';
    if (sentiment === 'critical' || sentiment === 'urgent') {
      prefix = language === 'hi'
        ? "मुझे आपकी स्थिति के बारे में सुनकर बहुत दुख हुआ। मैं तुरंत आपकी मदद करने की कोशिश करता हूँ। "
        : language === 'te'
          ? "మీ పరిస్థితి గురించి విన్నందుకు నేను చాలా విచారిస్తున్నాను। నేను వెంటనే మీకు సహాయం చేస్తాను। "
          : "I am deeply sorry to hear about your situation. I will prioritize assisting you immediately. ";
    }

    // Keywords
    const complaintKeys = ['file', 'submit', 'new complaint', 'शिकायत दर्ज', 'ఫిర్యాదు', 'complaint'];
    const trackKeys = ['track', 'status', 'where', 'ट्रैक', 'ట్రాక్', 'my case'];
    const rightsKeys = ['rights', 'patient rights', 'अधिकार', 'హక్కులు'];

    // Action Intents
    if (complaintKeys.some(key => msg.includes(key))) {
      return {
        response: prefix + (language === 'hi' ? "मैं आपको शिकायत सबमिशन पेज पर ले जा रहा हूं।" : "Navigating to the complaint submission page."),
        action: () => navigate('/complaint')
      };
    }

    if (trackKeys.some(key => msg.includes(key))) {
      return {
        response: prefix + (language === 'hi' ? "ट्रैकिंग पोर्टल पर जा रहे हैं।" : "Going to the tracking portal."),
        action: () => navigate('/track')
      };
    }

    // Context-sensitive follow-ups
    if (msg.includes('yes') || msg.includes('yeah') || msg.includes('हाँ') || msg.includes('అవును')) {
      if (complaintKeys.some(key => context.includes(key))) {
        return { response: "Great, redirecting you to file a complaint now...", action: () => navigate('/complaint') };
      }
    }

    if (rightsKeys.some(key => msg.includes(key))) {
      return {
        response: prefix + (language === 'hi' ? "मरीजों के अधिकारों में गोपनीयता और सम्मानजनक देखभाल शामिल है।" : "Patient rights include privacy, consent, and respectful care.")
      };
    }

    return {
      response: prefix + (language === 'hi'
        ? "मैं समझ सकता हूँ। क्या आप शिकायत दर्ज करना चाहेंगे या किसी मामले को ट्रैक करना चाहेंगे?"
        : "I understand. Would you like to file a new complaint or track an existing one?")
    };
  };

  const handleSendMessage = async (forcedText?: string) => {
    const text = forcedText || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const result = processIntent(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        isBot: true,
        timestamp: new Date(),
        language
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      if (isSpeaking) speakText(result.response);
      if (result.action) setTimeout(result.action, 2000);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[60] bg-teal-600 text-white p-5 rounded-[2rem] shadow-2xl transition-all ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <MessageCircle className="h-7 w-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-[70] w-[90vw] sm:w-[420px] h-[600px] max-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-600 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">{t('chat.title')}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsSpeaking(!isSpeaking);
                    if (isSpeaking) synthesisRef.cancel();
                  }}
                  className={`p-2 rounded-xl transition-colors ${isSpeaking ? 'text-teal-400 bg-teal-400/10' : 'text-slate-400 hover:bg-slate-800'}`}
                  title={isSpeaking ? "Mute Assistant" : "Unmute Assistant"}
                >
                  {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${msg.isBot ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'bg-teal-600 text-white shadow-lg shadow-teal-600/10'
                    }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('chat.placeholder')}
                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-500 transition-all outline-none text-sm font-medium"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="absolute right-2 p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-600/20"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={toggleListening}
                  className={`p-4 rounded-2xl transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;