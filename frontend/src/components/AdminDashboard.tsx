import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getAllComplaints, updateComplaintStatus, getAllFeedback } from '../services/firebaseService';
import { Complaint, Feedback } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Shield,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Eye,
  EyeOff,
  X,
  Search,
  ChevronRight,
  User,
  Image as ImageIcon,
  Music,
  Film,
  FileCheck
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Remove autofill for admin login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [activeTab, setActiveTab] = useState<'complaints' | 'feedback'>('complaints');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [complaintsData, feedbackData] = await Promise.all([
        getAllComplaints(),
        getAllFeedback()
      ]);
      setComplaints(complaintsData);
      setFeedback(feedbackData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(`Dashboard failed to load data: ${error.message}. Please check console or backend logs.`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleUpdateComplaint = async (complaintId: string, status: Complaint['status']) => {
    try {
      await updateComplaintStatus(complaintId, status, adminNotes, resolution);
      await loadData();
      setSelectedComplaint(null);
      setAdminNotes('');
      setResolution('');
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint');
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

  const getUrgencyColor = (urgency: Complaint['urgency']) => {
    switch (urgency) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-10 max-w-md w-full bg-white/90 backdrop-blur-sm"
        >
          <div className="text-center mb-10">
            <div className="p-4 bg-teal-600 rounded-3xl inline-block mb-6 shadow-xl shadow-teal-500/20">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 font-medium">Securely access the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@voiceofhope.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full flex items-center justify-center h-14"
            >
              {isLoading ? (
                <div className="spinner border-teal-200/30 border-t-white" />
              ) : (
                <span className="font-black uppercase tracking-wider text-sm">Sign In to Dashboard</span>
              )}
            </button>
            <div className="mt-6 text-center text-xs text-slate-500">
              <span className="block font-semibold mb-1">Demo Admin Credentials</span>
              <span>Email: <span className="font-mono">admin@voiceofhope.com</span></span><br />
              <span>Password: <span className="font-mono">admin123</span></span>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const investigatingComplaints = complaints.filter(c => c.status === 'investigating').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2rem] p-8 mb-10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('admin.oversight')}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-bold text-sm tracking-wide uppercase">Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: t('admin.awaiting'), value: pendingComplaints, icon: Clock, color: 'amber' },
            { label: t('admin.inProgress'), value: investigatingComplaints, icon: AlertTriangle, color: 'blue' },
            { label: t('admin.resolved'), value: resolvedComplaints, icon: CheckCircle, color: 'emerald' },
            { label: t('admin.totalFeedback'), value: feedback.length, icon: MessageSquare, color: 'indigo' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`premium-card p-6 border-transparent hover:border-slate-200`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-4 bg-slate-50 rounded-2xl`}>
                  <stat.icon className={`h-7 w-7 text-slate-600`} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex space-x-4 mb-6 relative z-10">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'complaints'
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Manage Complaints
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'feedback'
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Review Feedback
          </button>
        </div>

        {/* Complaints Table */}
        {activeTab === 'complaints' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="premium-card overflow-hidden bg-white/70 backdrop-blur-sm"
        >
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('admin.activeInquiries')}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Quick filter..."
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  {[t('admin.caseId'), t('admin.classification'), t('complaint.urgency'), t('admin.state'), t('admin.initiated'), ''].map(h => (
                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.length > 0 ? complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-teal-50/20 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-slate-700 font-mono">
                      #{complaint.complaintId}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-600 capitalize">
                      {complaint.category.replace('_', ' ')}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`flex items-center text-xs font-black uppercase tracking-wider ${getUrgencyColor(complaint.urgency)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-current animate-pulse`} />
                        {t(`urgency.${complaint.urgency}`)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(complaint.status)}`}>
                        {t(`status.${complaint.status}`)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-500">
                      {complaint.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-teal-600 hover:text-white hover:bg-teal-600 transition-all transform hover:scale-110 active:scale-95 group-hover:shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Search className="h-12 w-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No cases found in archives</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        ) : (
          /* Feedback Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {feedback.length > 0 ? feedback.map((fb) => (
              <div key={fb.id} className="premium-card p-6 bg-white flex flex-col h-full border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      fb.type === 'compliment' ? 'bg-emerald-100 text-emerald-700' :
                      fb.type === 'concern' ? 'bg-amber-100 text-amber-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {fb.type}
                    </span>
                    <p className="text-xs font-bold text-slate-400 mt-2">{fb.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  {fb.rating && (
                    <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      <span className="text-sm font-black text-amber-600">{fb.rating}/5</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm font-bold text-slate-600 capitalize mb-2">{fb.category.replace('_', ' ')}</p>
                <div className="text-slate-800 text-sm font-medium italic bg-slate-50 p-4 rounded-2xl flex-grow border border-slate-100 mb-4">
                  "{fb.message}"
                </div>
                
                <div className="mt-auto flex items-center space-x-2 text-xs font-bold text-slate-400">
                  <User className="h-4 w-4" />
                  <span>{fb.isAnonymous ? 'Anonymous Reviewer' : (fb.patientName || 'Unknown User')}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 premium-card py-20 text-center flex flex-col items-center">
                <MessageSquare className="h-12 w-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No feedback submitted yet</p>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedComplaint(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center space-x-5">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Case Evaluation</h2>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                        Reference #{selectedComplaint.complaintId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-10 space-y-10 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initiator Identity</span>
                      </div>
                      <p className="font-black text-slate-900">{selectedComplaint.patientName || 'ANONYMOUS SOURCE'}</p>
                      {selectedComplaint.email && <p className="text-xs font-bold text-slate-500">{selectedComplaint.email}</p>}
                    </div>
                    <div className="space-y-2 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="flex items-center space-x-2 mb-1">
                        <Shield className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('admin.classification')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-black text-slate-900 capitalize">{selectedComplaint.category.replace('_', ' ')}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${getUrgencyColor(selectedComplaint.urgency)}`}>
                          {t(`urgency.${selectedComplaint.urgency}`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Case Narrative</span>
                    <div className="mt-2 text-slate-700 text-lg leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 font-medium whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </div>
                  </div>

                  {(selectedComplaint.evidenceUrls && selectedComplaint.evidenceUrls.length > 0) || selectedComplaint.evidenceUrl ? (
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Evidence Portfolio</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          ...(selectedComplaint.evidenceUrls || []),
                          ...(selectedComplaint.evidenceUrl ? [selectedComplaint.evidenceUrl] : [])
                        ].map((url, index) => {
                          const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)/);
                          const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)/);
                          const isAudio = url.toLowerCase().match(/\.(mp3|wav|ogg)/);
                          const isPdf = url.toLowerCase().match(/\.pdf/);

                          return (
                            <div key={index} className={`p-5 rounded-3xl border flex items-center justify-between group relative overflow-hidden transition-all hover:shadow-lg ${
                              isImage ? 'bg-teal-50 border-teal-100' :
                              isVideo ? 'bg-blue-50 border-blue-100' :
                              isAudio ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'
                            }`}>
                              <div className="flex items-center space-x-4 relative z-10">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                  {isImage ? <ImageIcon className="h-5 w-5 text-teal-600" /> :
                                   isVideo ? <Film className="h-5 w-5 text-blue-600" /> :
                                   isAudio ? <Music className="h-5 w-5 text-amber-600" /> :
                                   <FileText className="h-5 w-5 text-indigo-600" />}
                                </div>
                                <div className="overflow-hidden">
                                  <p className={`font-black text-xs uppercase tracking-tight truncate ${
                                    isImage ? 'text-teal-900' :
                                    isVideo ? 'text-blue-900' :
                                    isAudio ? 'text-amber-900' : 'text-indigo-900'
                                  }`}>
                                    {isImage ? 'Image Attachment' :
                                     isVideo ? 'Video Evidence' :
                                     isAudio ? 'Audio Recording' : 'Document Evidence'}
                                  </p>
                                  <p className="text-[10px] font-bold opacity-40 truncate">Resource Attachment #{index + 1}</p>
                                </div>
                              </div>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-xl text-white transition-all transform hover:scale-110 active:scale-95 relative z-10 ${
                                  isImage ? 'bg-teal-600 hover:bg-teal-700' :
                                  isVideo ? 'bg-blue-600 hover:bg-blue-700' :
                                  isAudio ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-8 pt-8 border-t border-slate-100">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-900 ml-1">Confidential Oversight Notes</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Document internal investigative steps..."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-900 ml-1">Definitive Resolution</label>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Document the final outcome communicated to the source..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-10 pb-4">
                    <button
                      onClick={() => handleUpdateComplaint(selectedComplaint.id, 'investigating')}
                      className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Initiate Probe
                    </button>
                    <button
                      onClick={() => handleUpdateComplaint(selectedComplaint.id, 'resolved')}
                      className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      Confirm Resolution
                    </button>
                    <button
                      onClick={() => handleUpdateComplaint(selectedComplaint.id, 'closed')}
                      className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                    >
                      Terminate Case
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;