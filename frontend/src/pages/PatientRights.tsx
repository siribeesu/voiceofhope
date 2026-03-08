import React from 'react';
import { Shield, Eye, FileText, Users, Heart, Scale } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PatientRights: React.FC = () => {
  const { t } = useLanguage();

  const rights = [
    {
      icon: Heart,
      title: "Right to Quality Care",
      description: "Every patient has the right to receive competent, safe, and appropriate healthcare services.",
      details: [
        "Qualified healthcare professionals",
        "Safe and hygienic environment",
        "Continuity of care"
      ]
    },
    {
      icon: FileText,
      title: "Right to Information",
      description: "Patients have the right to complete and accurate information about their health condition.",
      details: [
        "Clear diagnosis explanation",
        "Access to medical records",
        "Cost transparency"
      ]
    },
    {
      icon: Eye,
      title: "Right to Privacy",
      description: "Personal health information must be kept confidential and shared only with authorized individuals.",
      details: [
        "Confidential consultations",
        "Secure record storage",
        "Privacy during procedures"
      ]
    },
    {
      icon: Users,
      title: "Right to Participation",
      description: "Patients have the right to actively participate in healthcare decisions and treatment planning.",
      details: [
        "Informed consent",
        "Right to refuse treatment",
        "Second opinions"
      ]
    },
    {
      icon: Scale,
      title: "Right to Non-Discrimination",
      description: "Healthcare services must be provided without discrimination based on any personal characteristics.",
      details: [
        "Equal treatment background",
        "Cultural sensitivity",
        "Disability accommodation"
      ]
    },
    {
      icon: Shield,
      title: "Right to File Complaints",
      description: "Patients have the right to voice concerns and file complaints without fear of retaliation.",
      details: [
        "Anonymous filing",
        "Retaliation protection",
        "Timely investigation"
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
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('rights.title')}</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            {t('rights.description')}
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
                <div key={index} className="premium-card p-8 group">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-teal-50 rounded-2xl group-hover:bg-teal-600 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="h-7 w-7 text-teal-600 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {right.title}
                      </h3>
                      <p className="text-slate-500 mb-6 leading-relaxed font-medium">
                        {right.description}
                      </p>
                      <ul className="space-y-3">
                        {right.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-slate-600 text-sm font-bold flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-3" />
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
    </div>
  );
};

export default PatientRights;