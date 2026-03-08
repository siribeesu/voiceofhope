import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle, User, Mail, Phone, FileText } from 'lucide-react';
import { submitComplaint } from '../services/firebaseService';
import { useLanguage } from '../contexts/LanguageContext';
import { Complaint } from '../types';

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
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);
  const { t } = useLanguage();
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ComplaintFormData>({
    defaultValues: {
      isAnonymous: false,
      urgency: 'medium',
      category: 'medical_care'
    }
  });

  const isAnonymous = watch('isAnonymous');

  const categories = [
    { value: 'medical_care', label: t('category.medical_care') },
    { value: 'billing', label: t('category.billing') },
    { value: 'staff_behavior', label: t('category.staff_behavior') },
    { value: 'facilities', label: t('category.facilities') },
    { value: 'privacy', label: t('category.privacy') },
    { value: 'other', label: t('category.other') },
  ];

  const urgencyLevels = [
    { value: 'low', label: t('urgency.low'), color: 'text-green-600' },
    { value: 'medium', label: t('urgency.medium'), color: 'text-yellow-600' },
    { value: 'high', label: t('urgency.high'), color: 'text-orange-600' },
    { value: 'critical', label: t('urgency.critical'), color: 'text-red-600' },
  ];

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const complaintId = await submitComplaint({
        ...data,
        status: 'pending',
      });
      
      setSubmissionResult({
        success: true,
        message: `${t('complaint.success')} ${complaintId}`
      });
      reset();
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'Failed to submit complaint. Please try again.'
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
            <div className="p-3 bg-teal-100 rounded-full inline-block mb-4">
              <FileText className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('complaint.title')}
            </h1>
            <p className="text-gray-600">
              Your voice matters. Help us improve healthcare services.
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
                {t('complaint.anonymous')}
              </label>
            </div>

            {/* Personal Information (if not anonymous) */}
            {!isAnonymous && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline h-4 w-4 mr-1" />
                    {t('complaint.name')}
                  </label>
                  <input
                    type="text"
                    {...register('patientName', { required: !isAnonymous })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.patientName && (
                    <p className="text-red-600 text-sm mt-1">Name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" />
                    {t('complaint.email')}
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: !isAnonymous,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {t('complaint.phone')}
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('complaint.category')}
              </label>
              <select
                {...register('category', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('complaint.urgency')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {urgencyLevels.map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      value={level.value}
                      {...register('urgency', { required: true })}
                      className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span className={`ml-2 text-sm font-medium ${level.color}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('complaint.description')}
              </label>
              <textarea
                rows={6}
                {...register('description', { required: true, minLength: 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Please provide detailed information about your complaint..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  Description is required (minimum 10 characters)
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : t('complaint.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;