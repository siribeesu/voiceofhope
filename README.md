<<<<<<< HEAD
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

## Important Deployment Notes
1. **Firebase Configuration**: Ensure `serviceAccountKey.json` is in the `/backend` folder.
2. **Environment Variables**: Update `.env` in the `/frontend` folder with your production API URL if not serving from the same host.
3. **Database**: Ensure Firebase Firestore is initialized and rules allow the backend to read/write.

## Live Demo
[Voice of Hope - Live](https://68b24395f002a9e3bfbf6094--voice-of-hope.netlify.app/)
=======
link:https://68b24395f002a9e3bfbf6094--voice-of-hope.netlify.app/
>>>>>>> 541a51696114d8fbf4eb2adfa798981069cace1f
