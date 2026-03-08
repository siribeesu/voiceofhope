import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Star, CheckCircle, AlertCircle, User, Mail, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitFeedback } from '../services/firebaseService';
import { useLanguage } from '../contexts/LanguageContext';

interface FeedbackFormData {
  type: 'suggestion' | 'compliment' | 'concern';
  category: string;
  message: string;
  rating?: number;
  isAnonymous: boolean;
  patientName?: string;
  email?: string;
}

const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const { language } = useLanguage();

  const { register, handleSubmit, watch, reset, setValue } = useForm<FeedbackFormData>({
    defaultValues: {
      isAnonymous: false,
      type: 'suggestion'
    }
  });

  const isAnonymous = watch('isAnonymous');
  const messageValue = watch('message');

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
          const currentText = messageValue || '';
          setValue('message', currentText + (currentText ? ' ' : '') + transcript.trim());
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [language, messageValue, setValue]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', color: 'text-blue-600' },
    { value: 'compliment', label: 'Compliment', color: 'text-emerald-600' },
    { value: 'concern', label: 'Concern', color: 'text-amber-600' },
  ] as const;

  const categories = [
    'Medical Care Quality',
    'Nursing Services',
    'Cleanliness & Hygiene',
    'Food Services',
    'Communication',
    'Other'
  ];

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      await submitFeedback({
        ...data,
        rating: selectedRating || undefined,
      });

      setSubmissionResult({
        success: true,
        message: 'Your experience has been recorded. Thank you for your feedback.'
      });
      reset();
      setSelectedRating(0);
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'Submission failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-8 sm:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="premium-card p-6 sm:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-4 bg-emerald-50 rounded-2xl inline-block mb-6 shadow-sm shadow-emerald-500/10"
            >
              <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Share Feedback
            </h1>
            <p className="text-slate-500 text-sm sm:text-lg italic px-4">
              Your insights help us improve healthcare for everyone.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submissionResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mb-10 p-5 rounded-2xl flex items-start space-x-4 ${submissionResult.success
                  ? 'bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-500/5'
                  : 'bg-red-50 border border-red-100 shadow-lg shadow-red-500/5'
                  }`}
              >
                <div className={`p-2 rounded-full ${submissionResult.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {submissionResult.success ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm sm:text-base ${submissionResult.success ? 'text-emerald-900' : 'text-red-900'}`}>
                    {submissionResult.success ? 'Success' : 'Error'}
                  </h4>
                  <p className={`mt-1 text-xs sm:text-sm font-medium ${submissionResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                    {submissionResult.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
              <input
                type="checkbox"
                id="isAnonymous"
                {...register('isAnonymous')}
                className="h-5 w-5 text-teal-600 border-slate-300 rounded-lg focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="isAnonymous" className="ml-3 text-sm font-bold text-slate-700 cursor-pointer">
                Submit Anonymously
              </label>
            </div>

            <AnimatePresence>
              {!isAnonymous && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        {...register('patientName', { required: !isAnonymous })}
                        className="input-field pl-12"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        {...register('email', { required: !isAnonymous })}
                        className="input-field pl-12"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type of Feedback</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {feedbackTypes.map((type) => (
                  <label
                    key={type.value}
                    className="relative flex flex-col items-center p-3 sm:p-4 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50/30 has-[:checked]:scale-105"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register('type', { required: true })}
                      className="sr-only"
                    />
                    <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center ${type.color}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <div className="relative">
                <select
                  {...register('category', { required: true })}
                  className="input-field appearance-none cursor-pointer pr-10"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-center block">Rating</label>
              <div className="flex space-x-3 sm:space-x-4 bg-slate-50/50 p-4 sm:p-6 rounded-3xl border border-slate-100 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 sm:h-10 sm:w-10 transition-all ${star <= (hoveredRating || selectedRating)
                        ? 'text-amber-400 fill-current'
                        : 'text-slate-200'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-50 text-teal-600'
                    }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>
              <textarea
                rows={5}
                {...register('message', { required: true, minLength: 10 })}
                className="input-field resize-none min-h-[140px]"
                placeholder="Share your detailed experience or use voice..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary w-full flex items-center justify-center space-x-3 h-14 sm:h-16 mt-8"
            >
              <span className="font-black uppercase tracking-widest text-xs">Record Feedback</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;