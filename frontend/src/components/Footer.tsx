import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Globe, Shield, MessageSquare, ListTodo } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 bg-teal-500 rounded-lg group-hover:bg-teal-600 transition-colors">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{t('home.title')}</span>
            </Link>

            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-teal-900/40">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">oversight@voiceofhope.org</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-400 hover:text-teal-400 transition-colors cursor-pointer group">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-teal-900/40">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">Direct Advocacy: +1 (800) HOPE-AID</span>
              </div>
            </div>
          </div>

          {/* Navigational Nodes */}
          <div className="md:col-span-3 space-y-8">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-teal-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('footer.navNodes')}</h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: t('nav.home'), path: '/' },
                { name: t('nav.about'), path: '/about' },
                { name: t('nav.faqs'), path: '/faqs' },
                { name: t('nav.rights'), path: '/patient-rights' }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center group">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-3 group-hover:bg-teal-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Protocols */}
          <div className="md:col-span-4 space-y-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-teal-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('footer.activeProtocols')}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/complaint" className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-teal-500/30 transition-all group">
                <div className="p-2 bg-slate-800 rounded-xl group-hover:text-teal-400">
                  <ListTodo className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{t('home.fileComplaint')}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Secure Submission</p>
                </div>
              </Link>
              <Link to="/track" className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-teal-500/30 transition-all group">
                <div className="p-2 bg-slate-800 rounded-xl group-hover:text-teal-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{t('home.trackComplaint')}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Real-time status</p>
                </div>
              </Link>
              <Link to="/feedback" className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-teal-500/30 transition-all group">
                <div className="p-2 bg-slate-800 rounded-xl group-hover:text-teal-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{t('home.giveFeedback')}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Observation Report</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Legal & Versioning */}
        <div className="mt-20 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">
            {t('footer.legal')}
          </p>
          <div className="flex items-center space-x-8">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">{t('footer.privacy')}</span>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">{t('footer.terms')}</span>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">{t('footer.sdg')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;