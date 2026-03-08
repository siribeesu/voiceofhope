import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getComplaintByTrackingId } from '../services/firebaseService';
import { Complaint } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const TrackComplaint: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const result = await getComplaintByTrackingId(trackingId.trim());
      if (result) {
        setComplaint(result);
      } else {
        setError('Complaint not found. Please verify your Tracking ID.');
      }
    } catch (err) {
      setError('System lookup failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'investigating': return <Search className="h-5 w-5 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'closed': return <ShieldCheck className="h-5 w-5 text-slate-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'investigating': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-12 sm:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-6 sm:p-14 bg-white/90 backdrop-blur-sm"
        >
          <div className="text-center mb-10 sm:mb-12">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              className="p-4 bg-teal-50 rounded-[2rem] inline-block mb-6 shadow-sm shadow-teal-500/10"
            >
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('home.trackComplaint')}
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto">
              Monitor the progress of your inquiry with high-precision tracking.
            </p>
          </div>

          <form onSubmit={handleTrack} className="mb-10 sm:mb-12">
            <div className="relative group flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="VOH-XXXXXX"
                  className="input-field pl-14 h-14 sm:h-16 text-base sm:text-lg font-mono tracking-wider w-full"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !trackingId.trim()}
                className="bg-slate-900 text-white px-8 h-14 sm:h-16 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-900/10"
              >
                {isLoading ? 'Seeking...' : 'Track Now'}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-4 shadow-lg shadow-red-500/5"
              >
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm font-bold text-red-800 tracking-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {complaint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 relative">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-6">
                    <div className="space-y-1 w-full sm:w-auto">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('admin.state')}</span>
                      <div className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all shadow-sm ${getStatusColor(complaint.status)}`}>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(complaint.status)}
                          <span>{t(`status.${complaint.status}`)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mr-1">{t('admin.caseId')}</span>
                      <p className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{complaint.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-slate-400 mb-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.classification')}</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 capitalize px-1">{t(`category.${complaint.category}`)}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-slate-400 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.initiated')}</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 px-1">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 sm:mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Case Record</span>
                    <div className="p-5 sm:p-6 bg-white border border-slate-100 rounded-3xl text-slate-600 font-medium leading-relaxed italic shadow-sm text-sm sm:text-base">
                      "{complaint.description}"
                    </div>
                  </div>

                  <AnimatePresence>
                    {(complaint.adminNotes || complaint.resolution) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 pt-8 sm:pt-10 border-t border-slate-200"
                      >
                        {complaint.adminNotes && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-blue-500">
                              <ShieldCheck className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Administrative Note</span>
                            </div>
                            <div className="p-5 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-3xl text-blue-900 font-bold text-sm shadow-sm">
                              {complaint.adminNotes}
                            </div>
                          </div>
                        )}

                        {complaint.resolution && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-emerald-500">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Resolution Statement</span>
                            </div>
                            <div className="p-5 sm:p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-emerald-900 font-black text-sm shadow-sm">
                              {complaint.resolution}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackComplaint;