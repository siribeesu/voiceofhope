import React, { useState } from 'react';
import { Phone, ShieldAlert, Eye, Type, X, ChevronRight, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../contexts/AccessibilityContext';

const UtilityBar: React.FC = () => {
    const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHotline, setShowHotline] = useState(false);

    const emergencyContacts = [
        { name: 'Hospital Emergency', phone: '102', icon: Siren },
        { name: 'Security Core', phone: '+91 99999 88888', icon: ShieldAlert },
        { name: 'Patient Advocacy', phone: '1800-456-789', icon: Phone },
    ];

    return (
        <div className="fixed left-8 bottom-8 z-[100] flex flex-col-reverse items-start gap-4">
            {/* Accessibility Controls */}
            <div className="flex flex-col-reverse gap-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-slate-800 transition-colors"
                >
                    {isExpanded ? <X className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </motion.button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex flex-col-reverse gap-2"
                        >
                            <button
                                onClick={toggleHighContrast}
                                className={`p-4 rounded-2xl shadow-xl transition-all ${highContrast ? 'bg-teal-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
                                    }`}
                                title="Toggle High Contrast"
                            >
                                <Eye className="h-6 w-6" />
                            </button>
                            <button
                                onClick={toggleLargeText}
                                className={`p-4 rounded-2xl shadow-xl transition-all ${largeText ? 'bg-teal-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
                                    }`}
                                title="Toggle Large Text"
                            >
                                <Type className="h-6 w-6" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Emergency Hotline */}
            <div className="flex flex-col items-start">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHotline(!showHotline)}
                    className="p-4 bg-red-600 text-white rounded-2xl shadow-2xl hover:bg-red-700 transition-colors animate-pulse-subtle"
                >
                    <Siren className="h-6 w-6" />
                </motion.button>

                <AnimatePresence>
                    {showHotline && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mb-4 bg-white rounded-[2rem] p-6 shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] border border-red-100 min-w-[280px] relative"
                        >
                            <button
                                onClick={() => setShowHotline(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <h4 className="text-red-600 font-black text-xs uppercase tracking-widest mb-4 flex items-center">
                                <ShieldAlert className="h-4 w-4 mr-2" />
                                Emergency Help
                            </h4>
                            <div className="space-y-3">
                                {emergencyContacts.map((contact) => (
                                    <a
                                        key={contact.name}
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white rounded-xl text-red-600 group-hover:scale-110 transition-transform">
                                                <contact.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-red-900/50">{contact.name}</p>
                                                <p className="text-sm font-black text-red-900">{contact.phone}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-red-300" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UtilityBar;
