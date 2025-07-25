import { useEffect, useState } from "react";
import DownloadButton from "./components/DownloadButton";
import EmailPrompt from "./components/EmailPrompt";
import Hero from "./components/Hero";
import InputForm from "./components/InputForm";
import NoteCard from "./components/NoteCard";
import StatsFooter from "./components/StatsFooter";
import {
  getUserEmailFromStorage,
  incrementUserNotes,
  saveUser,
  saveUserEmailToStorage,
} from "./utils/firebase";
import { generateSummary } from "./utils/generateSummary";
import { extractVideoId, getYouTubeTranscript } from "./utils/getTranscript";

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("English");

  // Check for existing user email on app load
  useEffect(() => {
    const storedEmail = getUserEmailFromStorage();
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      setShowEmailPrompt(true);
    }
  }, []);

  // Handle email submission
  const handleEmailSubmit = async (email) => {
    try {
      await saveUser(email);
      saveUserEmailToStorage(email);
      setUserEmail(email);
      setShowEmailPrompt(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user information. Please try again.");
    }
  };

  // Handle note generation
  const handleGenerateNote = async ({ url, language }) => {
    if (!userEmail) {
      setShowEmailPrompt(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedNote(null);
    setCurrentVideoUrl(url);
    setCurrentLanguage(language);

    try {
      // Extract video ID
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }

      // Get transcript
      const transcript = await getYouTubeTranscript(videoId);

      // Generate summary
      const summary = await generateSummary(transcript, language);

      // Update user stats
      await incrementUserNotes(userEmail);

      setGeneratedNote(summary);
    } catch (error) {
      console.error("Error generating note:", error);
      alert(error.message || "Failed to generate note. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <Hero />

          {/* Input Form */}
          <InputForm onSubmit={handleGenerateNote} isLoading={isGenerating} />

          {/* Generated Note */}
          {generatedNote && (
            <>
              <NoteCard
                content={generatedNote}
                videoUrl={currentVideoUrl}
                language={currentLanguage}
              />
              <DownloadButton
                content={generatedNote}
                videoUrl={currentVideoUrl}
                language={currentLanguage}
              />
            </>
          )}

          {/* Stats Footer */}
          <StatsFooter />
        </div>

        {/* Footer */}
        <footer className="relative mt-20">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent"></div>

          {/* Top decorative line */}
          <div className="relative">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="relative container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Main footer content */}
              <div className="text-center space-y-8">
                {/* Brand section */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold gradient-text">NoteQuik</h3>
                  <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
                    Transform any YouTube tutorial into beautifully formatted
                    learning notes. Available in English and Bengali.
                  </p>
                </div>

                {/* Contact section */}
                <div className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-white/10">
                  <h4 className="text-white font-semibold mb-4 text-lg">
                    Get in Touch
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <a
                          href="mailto:mislam.tauhidul@gmail.com"
                          className="text-white/80 hover:text-primary transition-colors text-sm"
                        >
                          Support & Feedback
                        </a>
                      </div>
                    </div>
                    <div className="group">
                      <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <svg
                          className="w-5 h-5 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <a
                          href="https://mirtauid.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/80 hover:text-secondary transition-colors text-sm"
                        >
                          Portfolio
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats section */}
                <div className="flex justify-center items-center space-x-6 text-white/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-sm">Live & Active</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">🇧🇩 Made in Bangladesh</span>
                  </div>
                </div>

                {/* Bottom section */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <p className="text-white/40 text-sm">
                      © 2025 NoteQuik. Crafted with ❤️ for learners everywhere.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-white/30">
                      <span>Built with React + Vite</span>
                      <div className="w-1 h-1 rounded-full bg-white/30"></div>
                      <span>Powered by AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </footer>
      </div>

      {/* Email Prompt Modal */}
      <EmailPrompt
        isOpen={showEmailPrompt}
        onSubmit={handleEmailSubmit}
        onClose={() => setShowEmailPrompt(false)}
      />
    </div>
  );
}

export default App;
