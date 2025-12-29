# Studio Direction - Project References

Web application for managing and presenting project portfolios to clients.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Storage
   - Get your Firebase configuration from Project Settings
   - Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Configure Firebase Security Rules:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Note:** These are permissive rules for development. Implement proper security rules for production.

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (AdminLayout, Sidebar)
│   ├── ui/             # UI components (Button, Input, Modal, etc.)
│   ├── projects/       # Project-related components
│   ├── pages/          # Page builder components
│   └── presentation/   # Presentation/slider components
├── pages/              # Route page components
│   ├── admin/         # Admin pages
│   └── public/        # Public presentation pages
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configs
│   ├── firebase.js    # Firebase initialization
│   └── storage.js     # Storage helpers
├── context/           # React contexts
│   └── AuthContext.jsx
├── App.jsx            # Router setup
├── main.jsx           # Entry point
└── index.css          # Tailwind imports + global styles
```

## 🔐 Authentication

- Password: `direkcija2025`
- Admin routes (`/admin/*`) are protected
- Auth state is stored in localStorage

## 🛠 Tech Stack

- **React 18** + **Vite**
- **React Router v6**
- **Tailwind CSS** (black/white theme only)
- **Firebase** (Firestore + Storage)
- **Swiper.js** (sliders)
- **@dnd-kit** (drag & drop)
- **Lucide React** (icons)
- **React Hot Toast** (notifications)

## 📝 Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase configuration values.

## 🚢 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure rewrites for SPA routing in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📄 License

ISC

