import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQs: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs: FAQ[] = [
    {
      question: "How do I file a complaint?",
      answer: "You can file a complaint by clicking on 'File a Complaint' on our homepage. You can choose to submit anonymously or provide your contact information. Fill out the form with details about your concern, select the appropriate category and urgency level, then submit.",
      category: "General"
    },
    {
      question: "Is my complaint really anonymous?",
      answer: "Yes, when you select the anonymous option, we do not collect or store any personally identifiable information. Your complaint will be processed without revealing your identity to anyone, including healthcare administrators.",
      category: "Privacy"
    },
    {
      question: "How can I track my complaint?",
      answer: "After submitting a complaint, you'll receive a unique tracking ID (format: VOH-XXXXXX-XXXX). Use this ID on our 'Track Complaint' page to monitor the status and progress of your complaint.",
      category: "Tracking"
    },
    {
      question: "How long does it take to resolve complaints?",
      answer: "Resolution times depend on urgency level: Critical (within 24 hours), High (1-3 days), Medium (3-7 days), Low (7-14 days). Complex cases may require additional time, but we'll keep you updated.",
      category: "Timeline"
    },
    {
      question: "What types of complaints can I file?",
      answer: "You can file complaints about medical care quality, billing issues, staff behavior, facility conditions, privacy concerns, and other healthcare-related matters. We take all complaints seriously.",
      category: "General"
    },
    {
      question: "Can I submit feedback instead of a complaint?",
      answer: "Absolutely! We encourage positive feedback, suggestions for improvement, and general comments about your healthcare experience. Use our 'Give Feedback' option to share your thoughts.",
      category: "Feedback"
    },
    {
      question: "What are my rights as a patient?",
      answer: "Patients have numerous rights including quality care, informed consent, privacy, dignity, participation in care decisions, and the right to file complaints. Visit our Patient Rights page for comprehensive information.",
      category: "Rights"
    },
    {
      question: "Is this platform available in other languages?",
      answer: "Yes, Voice of Hope supports English, Hindi (हिंदी), and Telugu (తెలుగు). You can switch languages using the globe icon in the header. Our chatbot also provides multilingual assistance.",
      category: "Language"
    },
    {
      question: "Who sees my complaint?",
      answer: "Complaints are reviewed by trained healthcare administrators and patient advocates. Access is restricted to authorized personnel only, and all staff are bound by strict confidentiality agreements.",
      category: "Privacy"
    },
    {
      question: "What happens after I submit a complaint?",
      answer: "Your complaint is reviewed within 24 hours, assigned to the appropriate department, investigated thoroughly, and you'll receive updates via your tracking ID. We aim for fair and timely resolution of all concerns.",
      category: "Process"
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about filing complaints and using our platform.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium mt-1">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="pl-16">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-teal-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-teal-100 mb-6">
            Our multilingual chatbot is available 24/7 to assist you with any questions 
            or help you navigate our platform.
          </p>
          <button
            onClick={() => {/* This would trigger the chatbot */}}
            className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Chat with Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQs;