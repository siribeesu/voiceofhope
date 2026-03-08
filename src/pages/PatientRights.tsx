import React from 'react';
import { Shield, Eye, FileText, Users, Heart, Scale } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PatientRights: React.FC = () => {
  const { t } = useLanguage();

  const rights = [
    {
      icon: Heart,
      title: "Right to Quality Care",
      description: "Every patient has the right to receive competent, safe, and appropriate healthcare services that meet professional standards.",
      details: [
        "Access to qualified healthcare professionals",
        "Evidence-based treatment protocols",
        "Safe and hygienic medical environment",
        "Continuity of care when needed"
      ]
    },
    {
      icon: FileText,
      title: "Right to Information",
      description: "Patients have the right to complete, accurate, and understandable information about their health condition and treatment options.",
      details: [
        "Clear explanation of diagnosis and prognosis",
        "Information about treatment options and risks",
        "Access to medical records",
        "Cost transparency for all services"
      ]
    },
    {
      icon: Eye,
      title: "Right to Privacy",
      description: "Personal health information must be kept confidential and shared only with authorized individuals involved in your care.",
      details: [
        "Confidential medical consultations",
        "Secure storage of medical records",
        "Control over information sharing",
        "Privacy during examinations and procedures"
      ]
    },
    {
      icon: Users,
      title: "Right to Participation",
      description: "Patients have the right to actively participate in healthcare decisions and treatment planning.",
      details: [
        "Informed consent for all procedures",
        "Right to refuse treatment",
        "Participation in treatment decisions",
        "Access to second opinions"
      ]
    },
    {
      icon: Scale,
      title: "Right to Non-Discrimination",
      description: "Healthcare services must be provided without discrimination based on any personal characteristics or circumstances.",
      details: [
        "Equal treatment regardless of background",
        "Cultural sensitivity and respect",
        "Language interpretation services",
        "Accommodation for disabilities"
      ]
    },
    {
      icon: Shield,
      title: "Right to File Complaints",
      description: "Patients have the right to voice concerns and file complaints about healthcare services without fear of retaliation.",
      details: [
        "Anonymous complaint filing",
        "Protection from retaliation",
        "Timely investigation of concerns",
        "Right to appeal decisions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-4 bg-blue-500 rounded-2xl inline-block mb-6">
            <Scale className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Patient Rights</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Understanding your fundamental rights as a healthcare patient is essential 
            for receiving quality care and advocating for yourself and others.
          </p>
        </div>
      </div>

      {/* Rights Sections */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rights.map((right, index) => {
              const IconComponent = right.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-teal-100 rounded-lg flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {right.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {right.description}
                      </p>
                      <ul className="space-y-2">
                        {right.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-700 text-sm flex items-start">
                            <span className="text-teal-500 mr-2 mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SDG 16 Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                UN Sustainable Development Goal 16
              </h2>
              <p className="text-lg text-gray-600">
                "Promote peaceful and inclusive societies for sustainable development, 
                provide access to justice for all and build effective, accountable and 
                inclusive institutions at all levels."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-teal-600 mb-2">16.6</div>
                <p className="text-gray-700 text-sm">
                  Develop effective, accountable and transparent institutions
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-teal-600 mb-2">16.7</div>
                <p className="text-gray-700 text-sm">
                  Ensure responsive, inclusive and representative decision-making
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-teal-600 mb-2">16.10</div>
                <p className="text-gray-700 text-sm">
                  Ensure public access to information and protect fundamental freedoms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Know Your Rights, Use Your Voice
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Understanding your rights empowers you to advocate for better healthcare. 
            If any of these rights have been violated, don't hesitate to file a complaint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/complaint'}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              File a Complaint
            </button>
            <button
              onClick={() => window.location.href = '/feedback'}
              className="bg-white text-teal-600 border border-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              Share Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRights;