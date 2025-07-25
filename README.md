# NoteQuik 🚀

Transform YouTube videos into smart learning notes instantly with AI-powered summarization.

## Features

- ✨ AI-powered summarization with OpenAI
- 🌐 Multi-language support (English & Bengali)
- 📱 Mobile-responsive design
- 📄 PDF download functionality
- 🔥 Modern glassmorphic UI
- 📊 Real-time user analytics with Firebase

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **UI**: shadcn/ui components
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore
- **AI**: OpenAI API
- **Transcript**: youtube-transcript library
- **Notifications**: Sonner

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firebase account
- OpenAI API key

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/mtauhidul/notequik.git
cd notequik

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Server Configuration
VITE_SERVER_URL=http://localhost:5001
```

### 3. Running the Application

#### Option 1: Run Both Services Together
```bash
pnpm run dev:full
```

#### Option 2: Run Services Separately

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
pnpm run dev
# Frontend runs on http://localhost:5174
```

## Usage

1. **Enter Email**: First-time users need to provide their email
2. **Paste YouTube URL**: Enter any YouTube video URL
3. **Select Language**: Choose English or Bengali for the notes
4. **Generate Notes**: AI processes the video transcript and creates formatted notes
5. **Download PDF**: Save the notes as a PDF file

## Author

**Mir Tauhidul Islam** 🇧🇩
- Portfolio: [mirtauid.com](https://mirtauid.com)
- Email: mislam.tauhidul@gmail.com
- GitHub: [@mtauhidul](https://github.com/mtauhidul)

**Transform any YouTube tutorial into beautifully formatted learning notes**

NoteQuik is a modern, mobile-responsive React web application that allows users to paste any YouTube video link, choose their preferred language (English or Bengali), and receive a beautifully summarized, easy-to-understand learning note that can be downloaded as a PDF.

![NoteQuik Preview](./src/assets/notequik_ui.png)

## ✨ Features

- **🎯 Single Page Application** - Clean, modern interface with no routing complexity
- **📱 Mobile Responsive** - Perfect experience on mobile, tablet, and desktop
- **🌐 Multi-language Support** - English and Bengali (বাংলা) support
- **📄 PDF Download** - Download your notes as beautifully formatted PDFs
- **📊 Analytics Dashboard** - Track user engagement and note generation stats
- **🔒 Privacy Focused** - Email collection for session tracking only
- **⚡ Lightning Fast** - Built with Vite for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Typography**: Urbanist font (Google Fonts)
- **Database**: Firebase Firestore
- **AI**: OpenAI API (GPT-3.5/4)
- **PDF Generation**: html2pdf.js
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/notequik.git
   cd notequik
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Configure Firebase**

   - Create a new Firebase project
   - Enable Firestore Database
   - Update `src/firebase/firebase.js` with your config

5. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── select.jsx
│   │   └── label.jsx
│   ├── Hero.jsx           # Landing section
│   ├── InputForm.jsx      # YouTube URL input
│   ├── EmailPrompt.jsx    # Email collection modal
│   ├── NoteCard.jsx       # Generated note display
│   ├── DownloadButton.jsx # PDF download functionality
│   └── StatsFooter.jsx    # Usage statistics
├── firebase/
│   └── firebase.js        # Firebase configuration
├── utils/
│   ├── getTranscript.js   # YouTube transcript extraction
│   ├── generateSummary.js # OpenAI integration
│   └── firebase.js        # Firestore utilities
├── lib/
│   └── utils.js           # Utility functions
├── App.jsx                # Main application component
├── main.jsx              # Application entry point
└── index.css             # Global styles and Tailwind
```

## 🎨 Design System

| Element                | Value                                |
| ---------------------- | ------------------------------------ |
| **Font**               | Urbanist (Google Fonts)              |
| **Primary Background** | `#000000` (Black)                    |
| **Primary Accent**     | `#7AFFA1` (Green)                    |
| **Secondary Accent**   | `#FFF87C` (Yellow)                   |
| **Tertiary Accent**    | `#DDCBF5` (Purple)                   |
| **Glass Effect**       | `backdrop-blur` + `rgba` backgrounds |

## 🔧 Configuration

### Firebase Setup

1. Create collections in Firestore:

   - `users` - User information and activity
   - `stats` - Global application statistics

2. User document structure:

   ```javascript
   {
     email: "user@example.com",
     firstSeen: Timestamp,
     lastSeen: Timestamp,
     visitCount: 3,
     notesGenerated: 5
   }
   ```

3. Stats document structure:
   ```javascript
   {
     totalUsers: 123,
     totalNotes: 432,
     lastUpdated: Timestamp
   }
   ```

### OpenAI Integration

For production use, implement a backend service to handle OpenAI API calls:

```javascript
// Example backend endpoint
app.post("/api/generate-summary", async (req, res) => {
  const { transcript, language } = req.body;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this video transcript into a concise, clear note for students. Use bullet points, explanations, and examples. ${
          language === "Bengali" ? "Translate to Bengali." : ""
        }\n\n${transcript}`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
    temperature: 0.7,
  });

  res.json({ summary: completion.choices[0].message.content });
});
```

## 📱 Mobile Responsiveness

NoteQuik is built with a mobile-first approach:

- **Mobile (320px+)**: Single column layout, touch-friendly buttons
- **Tablet (768px+)**: Optimized spacing and typography
- **Desktop (1024px+)**: Full-width layout with centered content

## 🔒 Privacy & Security

- **Email Collection**: Only for session tracking and analytics
- **Data Storage**: Minimal user data stored in Firestore
- **API Keys**: Environment variables for sensitive data
- **CORS**: Proper configuration for API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

## 📊 Analytics

NoteQuik tracks:

- **User Registration**: Email submissions
- **Note Generation**: Successful note creations
- **Global Statistics**: Total users and notes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for clean icons
- [Firebase](https://firebase.google.com/) for backend services
- [OpenAI](https://openai.com/) for AI-powered summaries

## 📞 Support

If you have any questions or need help:

- 📧 Email: mislam.tauhidul@gmail.com
- 🌐 Portfolio: [mirtauid.com](https://mirtauid.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/notequik/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/notequik/discussions)

---

**Made with ❤️ in Bangladesh 🇧🇩 for learners everywhere**
