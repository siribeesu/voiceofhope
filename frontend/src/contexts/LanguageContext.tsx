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
    'chat.title': 'Health Care Assistance',
    'chat.active': 'Active Support',
    'chat.placeholder': 'Type your message...',
    'chat.welcome': 'Hello! I\'m here to help you with healthcare complaints and questions. How can I assist you today?',

    // Footer
    'footer.description': 'Empowering patients through secure feedback channels and transparent oversight systems.',
    'footer.navNodes': 'Explore',
    'footer.activeProtocols': 'Quick Actions',
    'footer.legal': 'VOICE OF HOPE ADVOCACY. SECURED CORE V2.4.0',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.sdg': 'UN SDG Compliance',

    // FAQs
    'faq.title': 'Knowledge Base',
    'faq.subtitle': '',
    'faq.ctaTitle': 'Complex Inquiry?',
    'faq.ctaDesc': 'Initiate a direct session with our AI Assistant for real-time guidance.',
    'faq.chatButton': 'Chat with Assistant',
    'faq.q1': 'How do I file a complaint?',
    'faq.a1': 'Navigate to the "Quick Actions" or "Home" section and select "File a Complaint". You can choose between full anonymity or identified reporting.',
    'faq.q2': 'Is my complaint really anonymous?',
    'faq.a2': 'Yes. When the "Anonymity" mode is activated, our systems purge all metadata and identifying tags.',
    'faq.q3': 'How can I track my complaint?',
    'faq.a3': 'Each submission generates a unique cryptographic ID (VOH-XXXXXX). Use the "Track Complaint" portal.',
    'faq.q4': 'How long does it take for resolution?',
    'faq.a4': 'Critical cases are reviewed within 24 hours. General cases may take 3-14 days.',
    'faq.q5': 'What types of complaints are accepted?',
    'faq.a5': 'Quality of care, billing issues, facilities, and staff behavior.',
    'faq.q6': 'Can I submit positive feedback?',
    'faq.a6': 'Yes, use the "Submit Feedback" section for observations and compliments.',

    // Admin
    'admin.oversight': 'System Oversight',
    'admin.awaiting': 'Awaiting Action',
    'admin.inProgress': 'In Progress',
    'admin.resolved': 'Resolved Now',
    'admin.totalFeedback': 'Total Feedback',
    'admin.activeInquiries': 'Active Inquiries',
    'admin.caseId': 'Case ID',
    'admin.classification': 'Classification',
    'admin.state': 'State',
    'admin.initiated': 'Initiated',
    'about.title': 'About Voice of Hope',
    'about.mission': 'Empowering patients through transparent feedback and fostering trust.',
    'rights.title': 'Patient Rights & Responsibilities',
    'rights.description': 'Ensuring quality care and respect for all patients.',
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
    'home.subtitle': 'आपका स्वास्थ्य सेवा फीडबैक और प्लेटफॉर्म',
    'home.description': 'पारदर्शी स्वास्थ्य सेवा फीडबैक के माध्यम से मरीज़ों को सशक्त बनाना। शिकायतें दर्ज करें, अनुभव साझा करें और स्वास्थ्य सेवाओं में सुधार में मदद करें।',
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
    'complaint.success': 'शिकायत सफलतापूर्वक जमा की गई! आपकी आईडी:',

    // Categories
    'category.medical_care': 'चिकित्सा देखभाल',
    'category.billing': 'बिलिंग मुद्दे',
    'category.staff_behavior': 'स्टाफ व्यवहार',
    'category.facilities': 'सुविधाएं',
    'category.privacy': 'गोपनीयता चिंताएं',
    'category.other': 'अन्य',

    // Urgency
    'urgency.low': 'कम',
    'urgency.medium': 'मध्यम',
    'urgency.high': 'उच्च',
    'urgency.critical': 'गंभीर',

    // Status
    'status.pending': 'लंबित',
    'status.investigating': 'जांच जारी',
    'status.resolved': 'सुलझाया गया',
    'status.closed': 'बंद',

    // Chat
    'chat.title': 'स्वास्थ्य देखभाल सहायता',
    'chat.active': 'सक्रिय सहायता',
    'chat.placeholder': 'अपना संदेश लिखें...',
    'chat.welcome': 'नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ। मैं आज आपकी क्या मदद कर सकता हूँ?',

    // Footer
    'footer.description': 'मरीजों को उच्च-एन्क्रिप्शन फीडबैक और पारदर्शी प्रणालियों के माध्यम से सशक्त बनाना।',
    'footer.navNodes': 'एक्सप्लोर करें',
    'footer.activeProtocols': 'त्वरित कार्य',
    'footer.legal': 'आशा की आवाज़ एडवोकेसी। सुरक्षित कोर V2.4.0',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.sdg': 'संयुक्त राष्ट्र SDG अनुपालन',

    // FAQs
    'faq.title': 'ज्ञानकोश',
    'faq.subtitle': '',
    'faq.ctaTitle': 'जटिल प्रश्न?',
    'faq.ctaDesc': 'मार्गदर्शन के लिए हमारे AI सहायक के साथ सीधा सत्र शुरू करें।',
    'faq.chatButton': 'सहायक से बात करें',
    'faq.q1': 'मैं शिकायत कैसे दर्ज करूं?',
    'faq.a1': '"शिकायत दर्ज करें" चुनें और फॉर्म भरें। आप गुमनाम रहना चुन सकते हैं।',
    'faq.q2': 'क्या मेरी शिकायत वास्तव में गुमनाम है?',
    'faq.a2': 'हाँ, गुमनाम विकल्प चुनने पर हम कोई व्यक्तिगत जानकारी एकत्र नहीं करते हैं।',
    'faq.q3': 'मैं अपनी शिकायत को कैसे ट्रैक कर सकता हूं?',
    'faq.a3': 'प्रत्येक सबमिशन एक ट्रैकिंग आईडी उत्पन्न करता है। "शिकायत ट्रैक करें" पोर्टल का उपयोग करें।',
    'faq.q4': 'समाधान में कितना समय लगता है?',
    'faq.a4': 'गंभीर मामलों की 24 घंटे के भीतर समीक्षा की जाती है। अन्य में 3-14 दिन लगते हैं।',
    'faq.q5': 'किस प्रकार की शिकायतें स्वीकार की जाती हैं?',
    'faq.a5': 'चिकित्सा देखभाल, बिलिंग, सुविधाएं और स्टाफ का व्यवहार।',
    'faq.q6': 'क्या मैं फीडबैक दे सकता हूँ?',
    'faq.a6': 'हाँ, "फीडबैक दें" सेक्शन का उपयोग करें।',

    // Admin
    'admin.oversight': 'सिस्टम ओवरसाइट',
    'admin.awaiting': 'कार्रवाई की प्रतीक्षा',
    'admin.inProgress': 'प्रगति पर',
    'admin.resolved': 'सुलझाया गया',
    'admin.totalFeedback': 'कुल फीडबैक',
    'admin.activeInquiries': 'सक्रिय पूछताछ',
    'admin.caseId': 'केस आईडी',
    'admin.classification': 'वर्गीकरण',
    'admin.state': 'राज्य',
    'admin.initiated': 'शुरू किया गया',
    'about.title': 'Voice of Hope के बारे में',
    'about.mission': 'पारदर्शी प्रतिक्रिया के माध्यम से मरीजों को सशक्त बनाना और विश्वास को बढ़ावा देना।',
    'rights.title': 'मरीज के अधिकार और जिम्मेदारियां',
    'rights.description': 'सभी मरीजों के लिए गुणवत्तापूर्ण देखभाल और सम्मान सुनिश्चित करना।',
  },
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.about': 'మా గురించి',
    'nav.faqs': 'ప్రశ్నలు',
    'nav.rights': 'రోగి హక్కులు',
    'nav.admin': 'అడ్మిన్',

    // Home
    'home.title': 'ఆశా స్వరం',
    'home.subtitle': 'మీ ఆరోగ్య సేవా వేదిక',
    'home.description': 'పారదర్శక ఫీడ్‌బ్యాక్ ద్వారా రోగులను శక్తివంతం చేయడం। ఫిర్యాదులు దాఖలు చేయండి మరియు సేవలను మెరుగుపరచడంలో సహాయపడండి।',
    'home.fileComplaint': 'ఫిర్యాదు చేయండి',
    'home.giveFeedback': 'ఫీడ్‌బ్యాక్ ఇవ్వండి',
    'home.trackComplaint': 'ట్రాక్ చేయండి',

    // Complaint Form
    'complaint.title': 'ఫిర్యాదు దాఖలు చేయండి',
    'complaint.anonymous': 'అజ్ఞాతంగా దాఖలు చేయండి',
    'complaint.name': 'పూర్తి పేరు',
    'complaint.email': 'ఈమెయిల్',
    'complaint.phone': 'ఫోన్ నంబర్',
    'complaint.category': 'వర్గం',
    'complaint.description': 'మీ ఫిర్యాదును వివరించండి',
    'complaint.urgency': 'అత్యవసర స్థాయి',
    'complaint.submit': 'సమర్పించండి',
    'complaint.success': 'విజయవంతంగా సమర్పించబడింది! మీ ఐడి:',

    // Categories
    'category.medical_care': 'వైద్య సంరక్షణ',
    'category.billing': 'బిల్లింగ్ సమస్యలు',
    'category.staff_behavior': 'సిబ్బంది ప్రవర్తన',
    'category.facilities': 'సౌకర్యాలు',
    'category.privacy': 'గోప్యత ఆందోళనలు',
    'category.other': 'ఇతర',

    // Urgency
    'urgency.low': 'తక్కువ',
    'urgency.medium': 'మధ్యస్థం',
    'urgency.high': 'ఎక్కువ',
    'urgency.critical': 'అత్యవసరం',

    // Status
    'status.pending': 'పెండింగ్',
    'status.investigating': 'విచారణలో ఉంది',
    'status.resolved': 'పరిష్కరించబడింది',
    'status.closed': 'ముగించబడింది',

    // Chat
    'chat.title': 'ఆరోగ్య సంరక్షణ సహాయం',
    'chat.active': 'క్రియాశీల మద్దతు',
    'chat.placeholder': 'మీ సందేశాన్ని టైప్ చేయండి...',
    'chat.welcome': 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',

    // Footer
    'footer.description': 'రోగులను పారదర్శక పద్ధతుల ద్వారా శక్తివంతం చేయడం।',
    'footer.navNodes': 'అన్వేషించండి',
    'footer.activeProtocols': 'త్వరిత చర్యలు',
    'footer.legal': 'వాయిస్ ఆఫ్ హోప్ అడ్వకేసీ। కోర్ V2.4.0',
    'footer.privacy': 'గోప్యతా విధానం',
    'footer.terms': 'నిబంధనలు',
    'footer.sdg': 'UN SDG వర్తింపు',

    // FAQs
    'faq.title': 'నాలెడ్జ్ బేస్',
    'faq.subtitle': '',
    'faq.ctaTitle': 'సందేహం ఉందా?',
    'faq.ctaDesc': 'సహాయం కోసం మా AI తో సెషన్ ప్రారంభించండి।',
    'faq.chatButton': 'సహాయకుడితో చాట్ చేయండి',
    'faq.q1': 'నేను ఫిర్యాదు ఎలా చేయాలి?',
    'faq.a1': '"ఫిర్యాదు చేయండి" ఎంచుకోండి మరియు ఫారమ్ నింపండి। మీరు అజ్ఞాతంగా ఉండవచ్చు।',
    'faq.q2': 'నా ఫిర్యాదు నిజంగా అజ్ఞాతమా?',
    'faq.a2': 'అవును, మేము ఎటువంటి వ్యక్తిగత సమాచారాన్ని సేకరించము।',
    'faq.q3': 'నేను నా ఫిర్యాదును ఎలా ట్రాక్ చేయాలి?',
    'faq.a3': 'ప్రతి సమర్పణ ఒక ట్రాకింగ్ ఐడిని సృష్టిస్తుంది। "ట్రాక్ చేయండి" పోర్టల్ ఉపయోగించండి।',
    'faq.q4': 'పరిష్కారానికి ఎంత సమయం పడుతుంది?',
    'faq.a4': 'అత్యవసర కేసులు 24 గంటల్లో సమీక్షించబడతాయి। ఇతరులకు 3-14 రోజులు పడుతుంది।',
    'faq.q5': 'ఎటువంటి ఫిర్యాదులు అంగీకరించబడతాయి?',
    'faq.a5': 'వైద్య సంరక్షణ, బిల్లింగ్, సౌకర్యాలు మరియు సిబ్బంది ప్రవర్తన।',
    'faq.q6': 'నేను ఫీడ్‌బ్యాక్ ఇవ్వవచ్చా?',
    'faq.a6': 'అవును, "ఫీడ్‌బ్యాక్ ఇవ్వండి" విభాగాన్ని ఉపయోగించండి।',

    // Admin
    'admin.oversight': 'సిస్టమ్ ఓవర్‌సైట్',
    'admin.awaiting': 'చర్య కోసం వేచి ఉంది',
    'admin.inProgress': 'ప్రగతిలో ఉంది',
    'admin.resolved': 'పరిష్కరించబడింది',
    'admin.totalFeedback': 'మొత్తం ఫీడ్‌బ్యాక్',
    'admin.activeInquiries': 'క్రియాశీల విచారణలు',
    'admin.caseId': 'కేస్ ఐడి',
    'admin.classification': 'వర్గీకరణ',
    'admin.state': 'స్థితి',
    'admin.initiated': 'ప్రారంభించబడింది',
    'about.title': 'Voice of Hope గురించి',
    'about.mission': 'పారదర్శక అభిప్రాయం ద్వారా రోగులను శక్తివంతం చేయడం మరియు నమ్మకాన్ని పెంచడం।',
    'rights.title': 'రోగి హక్కులు మరియు బాధ్యతలు',
    'rights.description': 'రోగులందరికీ నాణ్యమైన సంరక్షణ మరియు గౌరవాన్ని నిర్ధారించడం।',
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