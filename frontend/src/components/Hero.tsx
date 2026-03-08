import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Search, Heart, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-mesh min-h-[calc(100vh-80px)] flex items-center py-16 sm:py-24">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo and Title */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center space-x-4 mb-8"
          >
            <div className="p-4 bg-teal-600 rounded-3xl shadow-xl shadow-teal-500/30 animate-float">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            <span className="gradient-text">{t('home.title')}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-2xl text-teal-700 font-semibold mb-6"
          >
            {t('home.subtitle')}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            {t('home.description')}
          </motion.p>

          {/* Action Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
          >
            <Link
              to="/complaint"
              className="group premium-card p-10 hover:border-red-100"
            >
              <div className="flex flex-col items-center">
                <div className="p-5 bg-red-50 rounded-2xl mb-6 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                  <FileText className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {t('home.fileComplaint')}
                </h3>
                <p className="text-slate-500 text-center leading-relaxed font-medium">
                  {t('complaint.anonymous')}
                </p>
              </div>
            </Link>

            <Link
              to="/feedback"
              className="group premium-card p-10 hover:border-emerald-100"
            >
              <div className="flex flex-col items-center">
                <div className="p-5 bg-emerald-50 rounded-2xl mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {t('home.giveFeedback')}
                </h3>
                <p className="text-slate-500 text-center leading-relaxed font-medium">
                  Share your positive experiences and suggestions
                </p>
              </div>
            </Link>

            <Link
              to="/track"
              className="group premium-card p-10 hover:border-blue-100"
            >
              <div className="flex flex-col items-center">
                <div className="p-5 bg-blue-50 rounded-2xl mb-6 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {t('home.trackComplaint')}
                </h3>
                <p className="text-slate-500 text-center leading-relaxed font-medium">
                  {t('admin.state')} & {t('admin.caseId')} Tracking
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Statistics Section with Modern Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto pt-16 border-t border-slate-200"
          >
            <div className="flex items-center justify-center space-x-4 group">
              <div className="p-3 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
                <Zap className="h-6 w-6 text-teal-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-slate-900">24/7</div>
                <div className="text-slate-500 font-medium">Real-time Support</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 group">
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-slate-900">100%</div>
                <div className="text-slate-500 font-medium">Encrypted & Secure</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 group">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <Globe className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-slate-900">Multilingual</div>
                <div className="text-slate-500 font-medium">3 Local Languages</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;