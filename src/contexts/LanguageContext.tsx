import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.faqs': 'FAQs',
    'nav.rights': 'Patient Rights',
    'nav.admin': 'Admin',
    
    // Home
    'home.title': 'Voice of Hope',
    'home.subtitle': 'Your Healthcare Feedback & Complaint Platform',
    'home.description': 'Empowering patients through transparent healthcare feedback. File complaints, share experiences, and help improve healthcare services for everyone.',
    'home.fileComplaint': 'File a Complaint',
    'home.giveFeedback': 'Give Feedback',
    'home.trackComplaint': 'Track Complaint',
    
    // Complaint Form
    'complaint.title': 'File a Complaint',
    'complaint.anonymous': 'File Anonymously',
    'complaint.name': 'Full Name',
    'complaint.email': 'Email',
    'complaint.phone': 'Phone Number',
    'complaint.category': 'Category',
    'complaint.description': 'Describe your complaint',
    'complaint.urgency': 'Urgency Level',
    'complaint.submit': 'Submit Complaint',
    'complaint.success': 'Complaint submitted successfully! Your Complaint ID is:',
    
    // Categories
    'category.medical_care': 'Medical Care',
    'category.billing': 'Billing Issues',
    'category.staff_behavior': 'Staff Behavior',
    'category.facilities': 'Facilities',
    'category.privacy': 'Privacy Concerns',
    'category.other': 'Other',
    
    // Urgency
    'urgency.low': 'Low',
    'urgency.medium': 'Medium',
    'urgency.high': 'High',
    'urgency.critical': 'Critical',
    
    // Status
    'status.pending': 'Pending',
    'status.investigating': 'Investigating',
    'status.resolved': 'Resolved',
    'status.closed': 'Closed',
    
    // Chat
    'chat.title': 'Healthcare Assistant',
    'chat.placeholder': 'Type your message...',
    'chat.welcome': 'Hello! I\'m here to help you with healthcare complaints and questions. How can I assist you today?',
    
    // Footer
    'footer.tagline': 'Empowering patients through transparent healthcare feedback',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.faqs': 'पूछे जाने वाले प्रश्न',
    'nav.rights': 'मरीज़ के अधिकार',
    'nav.admin': 'एडमिन',
    
    // Home
    'home.title': 'आशा की आवाज़',
    'home.subtitle': 'आपका स्वास्थ्य सेवा फीडबैक और शिकायत प्लेटफॉर्म',
    'home.description': 'पारदर्शी स्वास्थ्य सेवा फीडबैक के माध्यम से मरीज़ों को सशक्त बनाना। शिकायतें दर्ज करें, अनुभव साझा करें, और सभी के लिए स्वास्थ्य सेवाओं में सुधार में मदद करें।',
    'home.fileComplaint': 'शिकायत दर्ज करें',
    'home.giveFeedback': 'फीडबैक दें',
    'home.trackComplaint': 'शिकायत ट्रैक करें',
    
    // Complaint Form
    'complaint.title': 'शिकायत दर्ज करें',
    'complaint.anonymous': 'गुमनाम रूप से दर्ज करें',
    'complaint.name': 'पूरा नाम',
    'complaint.email': 'ईमेल',
    'complaint.phone': 'फोन नंबर',
    'complaint.category': 'श्रेणी',
    'complaint.description': 'अपनी शिकायत का वर्णन करें',
    'complaint.urgency': 'तात्कालिकता स्तर',
    'complaint.submit': 'शिकायत जमा करें',
    'complaint.success': 'शिकायत सफलतापूर्वक जमा की गई! आपकी शिकायत ID है:',
    
    // Categories
    'category.medical_care': 'चिकित्सा देखभाल',
    'category.billing': 'बिलिंग समस्याएं',
    'category.staff_behavior': 'स्टाफ व्यवहार',
    'category.facilities': 'सुविधाएं',
    'category.privacy': 'गोपनीयता की चिंताएं',
    'category.other': 'अन्य',
    
    // Chat
    'chat.title': 'स्वास्थ्य सहायक',
    'chat.placeholder': 'अपना संदेश टाइप करें...',
    'chat.welcome': 'नमस्ते! मैं स्वास्थ्य सेवा शिकायतों और प्रश्नों में आपकी मदद के लिए यहाँ हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?',
  },
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.about': 'మా గురించి',
    'nav.faqs': 'తరచుగా అడిగే ప్రశ్నలు',
    'nav.rights': 'రోగి హక్కులు',
    'nav.admin': 'అడ్మిన్',
    
    // Home
    'home.title': 'ఆశా స్వరం',
    'home.subtitle': 'మీ ఆరోగ్య సేవా ఫీడ్‌బ్యాక్ మరియు ఫిర్యాదు వేదిక',
    'home.description': 'పారదర్శక ఆరోగ్య సేవా ఫీడ్‌బ్యాక్ ద్వారా రోగులను శక్తివంతం చేయడం। ఫిర్యాదులు దాఖలు చేయండి, అనుభవాలను పంచుకోండి, మరియు అందరికీ ఆరోగ్య సేవలను మెరుగుపరచడంలో సహాయపడండి।',
    'home.fileComplaint': 'ఫిర్యాదు దాఖలు చేయండి',
    'home.giveFeedback': 'ఫీడ్‌బ్యాక్ ఇవ్వండి',
    'home.trackComplaint': 'ఫిర్యాదును ట్రాక్ చేయండి',
    
    // Complaint Form
    'complaint.title': 'ఫిర్యాదు దాఖలు చేయండి',
    'complaint.anonymous': 'అజ్ఞాతంగా దాఖలు చేయండి',
    'complaint.name': 'పూర్తి పేరు',
    'complaint.email': 'ఈమెయిల్',
    'complaint.phone': 'ఫోన్ నంబర్',
    'complaint.category': 'వర్గం',
    'complaint.description': 'మీ ఫిర్యాదును వివరించండి',
    'complaint.urgency': 'అత్యవసర స్థాయి',
    'complaint.submit': 'ఫిర్యాదు సమర్పించండి',
    'complaint.success': 'ఫిర్యాదు విజయవంతంగా సమర్పించబడింది! మీ ఫిర్యాదు ID:',
    
    // Chat
    'chat.title': 'ఆరోగ్య సహాయకుడు',
    'chat.placeholder': 'మీ సందేశాన్ని టైప్ చేయండి...',
    'chat.welcome': 'నమస్కారం! ఆరోగ్య సేవా ఫిర్యాదులు మరియు ప్రశ్నలలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};