import React from 'react';
import { Heart, Shield, Users, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-4 bg-teal-500 rounded-2xl inline-block mb-6">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('about.title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            {t('about.mission')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Objective</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              To create a safe, confidential platform where patients can voice their concerns,
              share feedback, and contribute to the continuous improvement of healthcare services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="p-4 bg-teal-100 rounded-full inline-block mb-4">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy</h3>
              <p className="text-gray-500 font-medium">Confidential & Anonymity</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access</h3>
              <p className="text-gray-500 font-medium">Multilingual Support</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full inline-block mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Action</h3>
              <p className="text-gray-500 font-medium">Tracked & Resolved</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full inline-block mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Empathy</h3>
              <p className="text-gray-500 font-medium">Patient-Centric Care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;