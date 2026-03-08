const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Initialize Firebase Admin
// Note: You should download your service account key from Firebase Console
// and place it in the backend folder as 'serviceAccountKey.json'
// or set the GOOGLE_APPLICATION_CREDENTIALS environment variable.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware to verify Firebase ID Token
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Helper to detect "rubbish" or nonsense text (Simulated AI Detection)
const isRubbishText = (text) => {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed.length < 5) return true; // Too short is waste

    // 1. Check for excessive character repetition (e.g., "aaa")
    if (/(.)\1{2,}/.test(trimmed)) return true;

    // 2. Check for keyboard mash patterns
    const commonPatterns = ['asdf', 'hjkl', 'qwerty', 'zxcv', '1234', '5678', 'dfgh', 'jkl;', 'slgk'];
    if (commonPatterns.some(pattern => trimmed.toLowerCase().includes(pattern))) return true;

    // 3. Check for low vowel ratio if long enough
    const vowels = trimmed.match(/[aeiou]/gi);
    const vowelRatio = vowels ? vowels.length / trimmed.length : 0;
    if (vowelRatio < 0.1 && trimmed.length > 15) return true;

    // 4. Check for lack of spaces in long text
    if (trimmed.length > 20 && !trimmed.includes(' ')) return true;

    // 5. Check for "rubbish" keywords
    const wasteWords = ['rubbish', 'waste', 'nothing', 'nonsense', 'test text', 'sample text'];
    if (wasteWords.some(word => trimmed.toLowerCase() === word)) return true;

    return false;
};

// Helper to generate unique complaint ID
const generateComplaintId = () => {
    const prefix = 'VOH';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Routes

// Submit Complaint
app.post('/api/complaints', async (req, res) => {
    try {
        const complaintData = req.body;
        console.log('Received complaint submission:', complaintData);

        // AI Rubbish Detection
        if (isRubbishText(complaintData.description)) {
            console.log('Rubbish detected in description:', complaintData.description);
            return res.status(400).json({
                success: false,
                error: 'AI Analysis detected that you entered something waste. Please provide a clear and meaningful description of your complaint.'
            });
        }

        const complaintId = generateComplaintId();

        const docRef = await db.collection('complaints').add({
            ...complaintData,
            complaintId,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
            status: 'pending'
        });

        res.status(201).json({ success: true, complaintId, id: docRef.id });
    } catch (error) {
        console.error('SERVER ERROR SUBMITTING COMPLAINT:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to submit complaint' });
    }
});

// Get Complaint by Tracking ID
app.get('/api/complaints/track/:trackingId', async (req, res) => {
    try {
        const { trackingId } = req.params;
        const snapshot = await db.collection('complaints').where('complaintId', '==', trackingId).get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        res.json({
            success: true,
            complaint: {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            }
        });
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch complaint' });
    }
});

// Admin routes (protected)
app.use('/api/admin', verifyToken);

// Admin: Get all complaints
app.get('/api/admin/complaints', async (req, res) => {
    try {
        const snapshot = await db.collection('complaints').orderBy('createdAt', 'desc').get();
        const complaints = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            };
        });
        res.json({ success: true, complaints });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
    }
});

// Admin: Update complaint status
app.patch('/api/admin/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, resolution } = req.body;

        await db.collection('complaints').doc(id).update({
            status,
            adminNotes: adminNotes || '',
            resolution: resolution || '',
            updatedAt: admin.firestore.Timestamp.now()
        });

        res.json({ success: true, message: 'Complaint updated successfully' });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ success: false, error: 'Failed to update complaint' });
    }
});

// Submit Feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const feedbackData = req.body;
        await db.collection('feedback').add({
            ...feedbackData,
            createdAt: admin.firestore.Timestamp.now()
        });
        res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, error: 'Failed to submit feedback' });
    }
});

// Admin: Get all feedback
app.get('/api/admin/feedback', async (req, res) => {
    try {
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        const feedback = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            };
        });
        res.json({ success: true, feedback });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
