import { useEffect, useState } from "react";
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';
import { toast, Toaster } from "sonner";
import DownloadButton from "./components/DownloadButton";
import EmailPrompt from "./components/EmailPrompt";
import Hero from "./components/Hero";
import InputForm from "./components/InputForm";
import NoteCard from "./components/NoteCard";
import StatsFooter from "./components/StatsFooter";
import {
  getUserEmailFromStorage,
  incrementUserNotes,
  initializeGlobalStats,
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
  const [shouldClearForm, setShouldClearForm] = useState(false);

  // Check for existing user email on app load
  useEffect(() => {
    const storedEmail = getUserEmailFromStorage();
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      setShowEmailPrompt(true);
    }

    // Initialize global stats document
    initializeGlobalStats();
  }, []);

  // Update document title based on state
  useEffect(() => {
    if (isGenerating) {
      document.title = "Generating Note... | NoteQuik";
    } else if (generatedNote) {
      document.title = "Note Ready! | NoteQuik";
    } else {
      document.title = "NoteQuik - Transform YouTube Videos into Smart Learning Notes";
    }
  }, [isGenerating, generatedNote]);

  // Handle email submission
  const handleEmailSubmit = async (email) => {
    try {
      await saveUser(email);
      saveUserEmailToStorage(email);
      setUserEmail(email);
      setShowEmailPrompt(false);
      
      // Track user registration
      track('User Registered', {
        email: email,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Welcome to NoteQuik! 🚀");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user information. Please try again.");
    }
  };

  // Handle form clear completion
  const handleFormClearComplete = () => {
    setShouldClearForm(false);
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

    // Track note generation attempt
    track('Note Generation Started', {
      videoUrl: url,
      language: language,
      userEmail: userEmail,
      timestamp: new Date().toISOString()
    });

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
      
      // Clear the form after successful generation
      setShouldClearForm(true);
      
      // Track successful note generation
      track('Note Generated Successfully', {
        videoId: videoId,
        language: language,
        transcriptLength: transcript.length,
        summaryLength: summary.length,
        userEmail: userEmail,
        timestamp: new Date().toISOString()
      });
      
      toast.success("Note generated successfully! 📝");
    } catch (error) {
      console.error("Error generating note:", error);
      
      // Track note generation failure
      track('Note Generation Failed', {
        videoUrl: url,
        language: language,
        error: error.message,
        userEmail: userEmail,
        timestamp: new Date().toISOString()
      });
      
      toast.error(error.message || "Failed to generate note. Please try again.");
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
          <InputForm 
            onSubmit={handleGenerateNote} 
            isLoading={isGenerating}
            shouldClear={shouldClearForm}
            onClearComplete={handleFormClearComplete}
          />

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
                          href="https://mirtauhid.com"
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
                      <div className="flex items-center space-x-1">
                        <span>Deployed on</span>
                        <svg className="w-4 h-4" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="m37.5274 0 37.9341 65.5618H-.4067L37.5274 0Z" fill="currentColor"/>
                        </svg>
                        <span className="font-medium">Vercel</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/30"></div>
                      <div className="flex items-center space-x-1">
                        <span>Powered by</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0734a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                        </svg>
                        <span className="font-medium">OpenAI</span>
                      </div>
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

      {/* Toast notifications */}
      <Toaster 
        theme="dark" 
        position="top-right"
        richColors
        closeButton
      />

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
