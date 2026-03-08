import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
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
        setError('Complaint not found. Please check your tracking ID.');
      }
    } catch (err) {
      setError('Failed to fetch complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'investigating':
        return <Search className="h-5 w-5 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'investigating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('home.trackComplaint')}
            </h1>
            <p className="text-gray-600">
              Enter your complaint ID to check the status and progress.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your complaint ID (e.g., VOH-123456-ABCD)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !trackingId.trim()}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Complaint Details */}
          {complaint && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Complaint Details
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(complaint.status)}
                    <span className="capitalize">{t(`status.${complaint.status}`)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Complaint ID
                    </label>
                    <p className="text-lg font-mono text-gray-900">{complaint.complaintId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Category
                    </label>
                    <p className="text-gray-900 capitalize">{t(`category.${complaint.category}`)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Urgency
                    </label>
                    <p className="text-gray-900 capitalize">{t(`urgency.${complaint.urgency}`)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Submitted
                    </label>
                    <p className="text-gray-900">{complaint.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 bg-white p-4 rounded-lg border border-gray-200">
                    {complaint.description}
                  </p>
                </div>

                {complaint.adminNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Admin Notes
                    </label>
                    <p className="text-gray-900 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {complaint.adminNotes}
                    </p>
                  </div>
                )}

                {complaint.resolution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Resolution
                    </label>
                    <p className="text-gray-900 bg-green-50 p-4 rounded-lg border border-green-200">
                      {complaint.resolution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h3 className="text-sm font-medium text-teal-800 mb-2">Need Help?</h3>
            <p className="text-sm text-teal-700">
              If you can't find your complaint or need assistance, please use our chatbot or contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;