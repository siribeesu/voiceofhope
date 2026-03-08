import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle, User, Mail, FileText, Upload, Film, X, Mic, MicOff, Download, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { submitComplaint } from '../services/firebaseService';
import { useLanguage } from '../contexts/LanguageContext';
import { Complaint } from '../types';
import { jsPDF } from 'jspdf';
import { analyzeSentiment } from '../utils/sentiment';

interface ComplaintFormData {
  patientName?: string;
  email?: string;
  phone?: string;
  category: Complaint['category'];
  description: string;
  urgency: Complaint['urgency'];
  isAnonymous: boolean;
}

const ComplaintForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string; trackingId?: string; data?: any } | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string; name: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  const { register, handleSubmit, watch, reset, setValue } = useForm<ComplaintFormData>({
    defaultValues: {
      isAnonymous: false,
      urgency: 'medium',
      category: 'medical_care'
    }
  });

  const isAnonymous = watch('isAnonymous');
  const descriptionValue = watch('description');

  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
          const currentText = descriptionValue || '';
          setValue('description', currentText + (currentText ? ' ' : '') + transcript.trim());
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [language, descriptionValue, setValue]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + evidenceFiles.length > 5) {
      alert('Maximum 5 files allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setEvidenceFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, {
          url: reader.result as string,
          type: file.type,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls = await Promise.all(files.map(async (file) => {
      const storageRef = ref(storage, `evidence/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }));
    return urls;
  };

  const generateReceipt = (trackingId: string, data: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 118, 110); // Teal 700
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('VOICE OF HOPE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Official Complaint Receipt', 105, 30, { align: 'center' });

    // Content
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFontSize(12);
    doc.text(`Tracking ID: ${trackingId}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);
    doc.text(`Category: ${t(`category.${data.category}`)}`, 20, 80);
    doc.text(`Urgency: ${data.urgency.toUpperCase()}`, 20, 90);
    doc.text(`Anonymous: ${data.isAnonymous ? 'Yes' : 'No'}`, 20, 100);

    if (!data.isAnonymous) {
      doc.text(`Patient Name: ${data.patientName}`, 20, 110);
      doc.text(`Email: ${data.email}`, 20, 120);
    }

    doc.setFontSize(14);
    doc.text('Description:', 20, 140);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(data.description, 170);
    doc.text(splitText, 20, 150);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('This is a digitally generated receipt for your records.', 105, 280, { align: 'center' });

    doc.save(`VOH-Receipt-${trackingId}.pdf`);
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const evidenceUrls = await uploadFiles(evidenceFiles);
      const sentiment = analyzeSentiment(data.description);

      const complaintId = await submitComplaint({
        ...data,
        status: 'pending',
        evidenceUrls,
        sentiment
      });

      setSubmissionResult({
        success: true,
        message: `${t('complaint.success')} Your Tracking ID is below.`,
        trackingId: complaintId,
        data
      });
      reset();
      setEvidenceFiles([]);
      setPreviews([]);
    } catch (error: any) {
      setSubmissionResult({
        success: false,
        message: error.message || 'Failed to submit complaint. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-8 sm:py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full"
      >
        <div className="premium-card p-6 sm:p-12 shadow-2xl">
          <div className="text-center mb-10 sm:mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-4 bg-teal-50 rounded-2xl inline-block mb-6 shadow-sm shadow-teal-500/10"
            >
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-teal-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight px-2">
              {t('complaint.title')}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {submissionResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mb-10 p-6 rounded-3xl flex flex-col items-center text-center space-y-6 ${submissionResult.success
                  ? 'bg-emerald-50 border-2 border-emerald-100 shadow-xl shadow-emerald-500/10'
                  : 'bg-red-50 border border-red-100'
                  }`}
              >
                <div className={`p-4 rounded-full ${submissionResult.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {submissionResult.success ? (
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className={`text-2xl font-black ${submissionResult.success ? 'text-emerald-900' : 'text-red-900'}`}>
                    {submissionResult.success ? 'Submission Confirmed' : 'Error Occurred'}
                  </h4>
                  <p className={`mt-2 text-lg font-medium ${submissionResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                    {submissionResult.message}
                  </p>
                  {submissionResult.trackingId && (
                    <div className="mt-6 bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm inline-block">
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Your Tracking ID</p>
                      <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{submissionResult.trackingId}</p>
                    </div>
                  )}
                </div>

                {submissionResult.success && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => generateReceipt(submissionResult.trackingId!, submissionResult.data)}
                      className="flex-1 flex items-center justify-center space-x-3 bg-emerald-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Receipt</span>
                    </button>
                    <button
                      onClick={() => setSubmissionResult(null)}
                      className="flex-1 flex items-center justify-center space-x-3 bg-white text-emerald-600 border-2 border-emerald-100 p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>Submit Another</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Anonymous Toggle */}
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors cursor-pointer group">
              <input
                type="checkbox"
                id="isAnonymous"
                {...register('isAnonymous')}
                className="h-6 w-6 text-teal-600 border-slate-300 rounded-lg focus:ring-teal-500 cursor-pointer transition-all group-hover:scale-110"
              />
              <label htmlFor="isAnonymous" className="ml-4 text-sm font-black text-slate-700 cursor-pointer uppercase tracking-widest">
                {t('complaint.anonymous')}
              </label>
            </div>

            {/* Personal Information */}
            <AnimatePresence>
              {!isAnonymous && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          {...register('patientName', { required: !isAnonymous })}
                          placeholder="Ex: John Doe"
                          className="input-field pl-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="email"
                          {...register('email', { required: !isAnonymous })}
                          placeholder="johndoe@example.com"
                          className="input-field pl-12"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select {...register('category', { required: true })} className="input-field cursor-pointer">
                  <option value="medical_care">{t('category.medical_care')}</option>
                  <option value="billing">{t('category.billing')}</option>
                  <option value="staff_behavior">{t('category.staff_behavior')}</option>
                  <option value="facilities">{t('category.facilities')}</option>
                  <option value="privacy">{t('category.privacy')}</option>
                  <option value="other">{t('category.other')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Urgency</label>
                <select {...register('urgency', { required: true })} className="input-field cursor-pointer font-bold uppercase tracking-wider">
                  <option value="low" className="text-emerald-600">Low Priority</option>
                  <option value="medium" className="text-blue-600">Standard</option>
                  <option value="high" className="text-orange-600">Urgent</option>
                  <option value="critical" className="text-red-600">Critical / Emergency</option>
                </select>
              </div>
            </div>

            {/* Description with Voice-to-Text */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Detailed Narrative
                </label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  <span>{isListening ? 'Stop' : 'Speak'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                {...register('description', { required: true, minLength: 10 })}
                className="input-field resize-none min-h-[160px] italic shadow-inner"
                placeholder="Please describe your experience in detail. Use the microphone to speak if preferred..."
              />
            </div>

            {/* Multi-File Evidence Upload */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Evidence Materials
                </label>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{evidenceFiles.length} / 5 Files</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <AnimatePresence>
                  {previews.map((preview, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group"
                    >
                      {preview.type.startsWith('image/') ? (
                        <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                          <Film className="h-6 w-6 text-teal-500 mb-1" />
                          <p className="text-[8px] font-bold text-slate-600 truncate w-full px-1">{preview.name}</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}

                  {evidenceFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center hover:border-teal-400 hover:bg-teal-50/30 transition-all group"
                    >
                      <Upload className="h-6 w-6 text-slate-300 group-hover:text-teal-500 transition-colors" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">Add File</span>
                    </button>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary w-full h-16 flex items-center justify-center space-x-3 shadow-xl shadow-teal-600/20 active:translate-y-1"
            >
              {isSubmitting ? (
                <div className="spinner border-teal-200/30 border-t-white" />
              ) : (
                <>
                  <FileCheck className="h-5 w-5" />
                  <span className="font-black uppercase tracking-widest text-sm">Submit Complaint</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintForm;