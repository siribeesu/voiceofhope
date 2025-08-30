import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Search, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-teal-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo and Title */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="p-3 bg-teal-500 rounded-2xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              {t('home.title')}
            </h1>
          </div>
          
          <p className="text-xl text-teal-600 font-medium mb-4">
            {t('home.subtitle')}
          </p>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            {t('home.description')}
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/complaint"
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-red-100 rounded-full mb-4 group-hover:bg-red-200 transition-colors">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('home.fileComplaint')}
                </h3>
                <p className="text-gray-600 text-center">
                  Report issues and concerns anonymously with full confidentiality
                </p>
              </div>
            </Link>

            <Link
              to="/feedback"
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('home.giveFeedback')}
                </h3>
                <p className="text-gray-600 text-center">
                  Share your positive experiences and suggestions for improvement
                </p>
              </div>
            </Link>

            <Link
              to="/track"
              className="group bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('home.trackComplaint')}
                </h3>
                <p className="text-gray-600 text-center">
                  Monitor the status and progress of your submitted complaints
                </p>
              </div>
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">24/7</div>
              <div className="text-gray-600">Available Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">100%</div>
              <div className="text-gray-600">Confidential</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">3</div>
              <div className="text-gray-600">Languages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;