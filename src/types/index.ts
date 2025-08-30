export interface Complaint {
  id: string;
  complaintId: string;
  patientName?: string;
  email?: string;
  phone?: string;
  category: 'medical_care' | 'billing' | 'staff_behavior' | 'facilities' | 'privacy' | 'other';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminNotes?: string;
  resolution?: string;
}

export interface Feedback {
  id: string;
  type: 'suggestion' | 'compliment' | 'concern';
  category: string;
  message: string;
  rating?: number;
  isAnonymous: boolean;
  patientName?: string;
  email?: string;
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  name: string;
}

export type Language = 'en' | 'hi' | 'te';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  language: Language;
}