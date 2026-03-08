import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      question: t('faq.q1'),
      answer: t('faq.a1'),
      category: t('category.other')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
      category: t('category.privacy')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
      category: t('nav.faqs')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
      category: t('category.other')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
      category: t('category.medical_care')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
      category: t('nav.rights')
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <div className="min-h-screen bg-mesh py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="p-4 bg-teal-50 rounded-2xl inline-block mb-6">
            <HelpCircle className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t('faq.title')}
          </h1>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.span
              whileHover={{ scale: 1.05 }}
              key={category}
              className="px-5 py-2 bg-white border border-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm shadow-slate-200/50"
            >
              {category}
            </motion.span>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card overflow-hidden bg-white/80 backdrop-blur-sm border-transparent hover:border-teal-500/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center group"
              >
                <div className="flex items-center space-x-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl transition-all ${openFAQ === index ? 'bg-teal-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pl-20">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-slate-600 font-medium leading-relaxed italic">
                          "{faq.answer}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Help CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-1 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-[3rem] shadow-2xl shadow-teal-500/20"
        >
          <div className="bg-slate-900 rounded-[2.8rem] p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{t('faq.ctaTitle')}</h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
                {t('faq.ctaDesc')}
              </p>
              <button
                onClick={handleOpenChat}
                className="button-primary !bg-white !text-slate-900 hover:!bg-teal-50 flex items-center mx-auto space-x-3 group"
              >
                <MessageSquare className="h-5 w-5 text-teal-600 group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase tracking-widest text-xs">{t('faq.chatButton')}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQs;