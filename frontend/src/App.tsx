import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ComplaintForm from './components/ComplaintForm';
import FeedbackForm from './components/FeedbackForm';
import TrackComplaint from './components/TrackComplaint';
import ChatBot from './components/ChatBot';
import About from './pages/About';
import FAQs from './pages/FAQs';
import PatientRights from './pages/PatientRights';
import AdminDashboard from './components/AdminDashboard';
import UtilityBar from './components/UtilityBar';

import { AccessibilityProvider } from './contexts/AccessibilityContext';

function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <UtilityBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/complaint" element={<ComplaintForm />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/about" element={<About />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/patient-rights" element={<PatientRights />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </Router>
      </LanguageProvider>
    </AccessibilityProvider>
  );
}

export default App;