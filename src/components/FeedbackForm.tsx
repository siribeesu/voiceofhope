import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Star, CheckCircle, AlertCircle } from 'lucide-react';
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
  const { t } = useLanguage();
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FeedbackFormData>({
    defaultValues: {
      isAnonymous: false,
      type: 'suggestion'
    }
  });

  const isAnonymous = watch('isAnonymous');

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', color: 'bg-blue-100 text-blue-600' },
    { value: 'compliment', label: 'Compliment', color: 'bg-green-100 text-green-600' },
    { value: 'concern', label: 'Concern', color: 'bg-yellow-100 text-yellow-600' },
  ];

  const categories = [
    'Medical Care Quality',
    'Nursing Services',
    'Cleanliness & Hygiene',
    'Food Services',
    'Appointment Scheduling',
    'Billing & Insurance',
    'Facilities & Equipment',
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
        message: 'Thank you for your feedback! Your input helps us improve our services.'
      });
      reset();
      setSelectedRating(0);
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Feedback
            </h1>
            <p className="text-gray-600">
              Help us improve our healthcare services with your valuable input.
            </p>
          </div>

          {submissionResult && (
            <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
              submissionResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {submissionResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm font-medium ${
                submissionResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {submissionResult.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                {...register('isAnonymous')}
                className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="isAnonymous" className="ml-2 text-sm font-medium text-gray-900">
                Submit anonymously
              </label>
            </div>

            {/* Personal Information (if not anonymous) */}
            {!isAnonymous && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('patientName', { required: !isAnonymous })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: !isAnonymous })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feedback Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {feedbackTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register('type', { required: true })}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${type.color}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register('category', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating (Optional)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= selectedRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                rows={6}
                {...register('message', { required: true, minLength: 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Please share your feedback, suggestions, or concerns..."
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">
                  Feedback message is required (minimum 10 characters)
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;