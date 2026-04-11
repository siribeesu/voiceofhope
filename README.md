# Voice of Hope
A healthcare feedback and complaint platform.

## Project Structure
- **/frontend**: React + Vite + TypeScript + Tailwind CSS application.
- **/backend**: Node.js + Express + Firebase Admin SDK server.

## Quick Start (Deployment Ready)
The project is configured for easy deployment. Use the unified commands from the root directory:

### 1. Installation
Install all dependencies for both frontend and backend:
```bash
npm run install:all
```

### 2. Building for Production
Build the optimized frontend:
```bash
npm run build:frontend
```

### 3. Running the Server
Start the production server (serves both API and Frontend):
```bash
npm start
```

### 4. Development
Run both frontend and backend in development mode:
```bash
npm run dev
```

## Configuration & Security
### 1. Frontend Setup
Create a `.env` file in the `/frontend` directory using the following template:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```
*Note: The `VITE_API_URL` should point to your backend server.*

### 2. Backend Setup
- Place your `serviceAccountKey.json` inside the `/backend` directory.
- Ensure your `.env` in the `/backend` directory has the correct `PORT`.

### 3. Firebase Rules
The project includes `firestore.rules` and `storage.rules` at the root. You can deploy these using the Firebase CLI or copy them to the Firebase Console.
- **Firestore**: Allows public creation of complaints and restricted admin access.
- **Storage**: Limits evidence uploads to 10MB and specific formats (Audio, Video, Images, Docs).

## Live Demo
[Voice of Hope - Live](https://68b24395f002a9e3bfbf6094--voice-of-hope.netlify.app/)
