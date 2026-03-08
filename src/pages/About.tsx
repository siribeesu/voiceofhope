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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Voice of Hope</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering patients through transparent healthcare feedback and fostering trust 
            between healthcare providers and the communities they serve.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To create a safe, confidential platform where patients can voice their concerns, 
              share feedback, and contribute to the continuous improvement of healthcare services 
              while upholding the highest standards of privacy and dignity.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="p-4 bg-teal-100 rounded-full inline-block mb-4">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Complete confidentiality and anonymity protection for all users.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusive Access</h3>
              <p className="text-gray-600">
                Multilingual support ensuring everyone can participate.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full inline-block mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Action Oriented</h3>
              <p className="text-gray-600">
                Every complaint is tracked and addressed with appropriate action.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full inline-block mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Care</h3>
              <p className="text-gray-600">
                Treating every concern with empathy and understanding.
              </p>
            </div>
          </div>

          {/* SDG 16 Section */}
          <div className="bg-teal-50 rounded-xl p-8 border border-teal-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Supporting UN Sustainable Development Goal 16
              </h3>
              <p className="text-lg text-gray-700">
                "Peace, Justice and Strong Institutions"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Promoting accountable and transparent healthcare institutions</li>
                  <li>• Ensuring equal access to justice for all patients</li>
                  <li>• Building effective and inclusive healthcare governance</li>
                  <li>• Protecting fundamental freedoms in healthcare settings</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Impact Areas</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Strengthening healthcare accountability mechanisms</li>
                  <li>• Reducing corruption and improving transparency</li>
                  <li>• Ensuring responsive and inclusive healthcare policies</li>
                  <li>• Promoting rule of law in healthcare delivery</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <p className="text-gray-600 mb-6">
              Have questions about our platform or need additional support?
            </p>
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> support@voiceofhope.org
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="text-gray-700">
                <strong>Hours:</strong> 24/7 Support Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;