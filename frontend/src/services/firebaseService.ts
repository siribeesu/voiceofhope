import { Complaint, Feedback } from '../types';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || '';

// API services calling our Node.js Express backend

// Complaint services
export const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to submit complaint');
    }
    return data.complaintId;
  } catch (error) {
    console.error('Error submitting complaint:', error);
    throw new Error('Failed to submit complaint');
  }
};

export const getComplaintByTrackingId = async (trackingId: string): Promise<Complaint | null> => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/track/${trackingId}`);
    if (response.status === 404) {
      return null;
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch complaint');
    }

    // Dates need to be converted from ISO strings to Date objects
    const complaint = data.complaint;
    return {
      ...complaint,
      createdAt: new Date(complaint.createdAt),
      updatedAt: new Date(complaint.updatedAt),
    } as Complaint;
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw new Error('Failed to fetch complaint');
  }
};

export const getAllComplaints = async (): Promise<Complaint[]> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}/api/admin/complaints`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch complaints');
    }

    return data.complaints.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
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
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}/api/admin/complaints/${complaintId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, adminNotes, resolution }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to update complaint');
    }
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw new Error('Failed to update complaint');
  }
};

// Feedback services
export const submitFeedback = async (feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to submit feedback');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
};

export const getAllFeedback = async (): Promise<Feedback[]> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}/api/admin/feedback`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch feedback');
    }

    return data.feedback.map((f: any) => ({
      ...f,
      createdAt: new Date(f.createdAt),
    })) as Feedback[];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
};