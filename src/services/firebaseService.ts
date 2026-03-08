import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Complaint, Feedback } from '../types';

// Generate unique complaint ID
const generateComplaintId = (): string => {
  const prefix = 'VOH';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Complaint services
export const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const complaintId = generateComplaintId();
    const docRef = await addDoc(collection(db, 'complaints'), {
      ...complaintData,
      complaintId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending'
    });
    return complaintId;
  } catch (error) {
    console.error('Error submitting complaint:', error);
    throw new Error('Failed to submit complaint');
  }
};

export const getComplaintByTrackingId = async (trackingId: string): Promise<Complaint | null> => {
  try {
    const q = query(collection(db, 'complaints'), where('complaintId', '==', trackingId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Complaint;
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw new Error('Failed to fetch complaint');
  }
};

export const getAllComplaints = async (): Promise<Complaint[]> => {
  try {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Complaint[];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw new Error('Failed to fetch complaints');
  }
};

export const updateComplaintStatus = async (
  complaintId: string, 
  status: Complaint['status'], 
  adminNotes?: string,
  resolution?: string
): Promise<void> => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      status,
      adminNotes: adminNotes || '',
      resolution: resolution || '',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw new Error('Failed to update complaint');
  }
};

// Feedback services
export const submitFeedback = async (feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<void> => {
  try {
    await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
};

export const getAllFeedback = async (): Promise<Feedback[]> => {
  try {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Feedback[];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
};