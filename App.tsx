import React, { useState } from 'react';
import { AppState, PartnerDetails, ChatMessage, TestimonialData } from './types';
import IntroPage from './components/IntroPage';
import ConsentForm from './components/ConsentForm';
import ChatInterface from './components/ChatInterface';
import EmailForm from './components/EmailForm';
import TestimonialPreview from './components/TestimonialPreview';
import { generateTestimonialFromChat } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [partnerDetails, setPartnerDetails] = useState<PartnerDetails | null>(null);
  const [testimonialData, setTestimonialData] = useState<TestimonialData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleStartIntro = () => {
    setAppState(AppState.CONSENT);
  }

  const handleConsentComplete = (details: PartnerDetails) => {
    setPartnerDetails(details);
    setAppState(AppState.CHAT);
  };

  const handleChatFinish = (history: ChatMessage[]) => {
    setChatHistory(history);
    setAppState(AppState.EMAIL_INPUT);
  };

  const handleEmailComplete = async (email: string) => {
    if (partnerDetails) {
        setPartnerDetails({ ...partnerDetails, email });
    }
    setAppState(AppState.GENERATING);
    try {
      const data = await generateTestimonialFromChat(chatHistory);
      setTestimonialData(data);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error("Failed to generate testimonial", error);
      alert("Es gab einen Fehler bei der Generierung. Bitte versuchen Sie es erneut.");
      setAppState(AppState.CHAT); // Go back to chat on error
    }
  };

  const handleRestart = () => {
    setPartnerDetails(null);
    setTestimonialData(null);
    setChatHistory([]);
    setAppState(AppState.INTRO);
  };

  return (
    <div className="h-full w-full bg-ecoverde-light flex flex-col">
        {/* Navigation / Header - Only show if not in Intro */}
        {appState !== AppState.INTRO && (
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-ecoverde-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-ecoverde-green font-bold text-xl tracking-tight flex items-center gap-2">
                   {/* Abstract Leaf Icon */}
                   <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                   </svg>
                   ecoverde feedback
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:flex">
                 <span className={appState === AppState.CONSENT ? "text-ecoverde-blue" : ""}>Start</span>
                 <span>/</span>
                 <span className={appState === AppState.CHAT ? "text-ecoverde-blue" : ""}>Interview</span>
                 <span>/</span>
                 <span className={appState === AppState.EMAIL_INPUT ? "text-ecoverde-blue" : ""}>Email</span>
                 <span>/</span>
                 <span className={appState === AppState.RESULT ? "text-ecoverde-blue" : ""}>Fertig</span>
              </div>
            </div>
          </div>
        </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full overflow-hidden">
          
          {appState === AppState.INTRO && (
            <IntroPage onStart={handleStartIntro} />
          )}

          {appState === AppState.CONSENT && (
            <ConsentForm onComplete={handleConsentComplete} />
          )}

          {appState === AppState.CHAT && partnerDetails && (
            <ChatInterface 
              partnerDetails={partnerDetails} 
              onFinish={handleChatFinish} 
            />
          )}

          {appState === AppState.EMAIL_INPUT && (
            <EmailForm onComplete={handleEmailComplete} />
          )}

          {appState === AppState.GENERATING && (
            <div className="flex flex-col items-center justify-center h-3/4 space-y-6 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-ecoverde-green opacity-20 rounded-full animate-ping"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg border border-ecoverde-light">
                  <div className="animate-spin h-10 w-10 border-4 border-ecoverde-green border-t-transparent rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">Verarbeite Antworten...</h3>
                <p className="text-gray-500 mt-2">Wir erstellen Ihr Testimonial</p>
              </div>
            </div>
          )}

          {appState === AppState.RESULT && testimonialData && partnerDetails && (
            <TestimonialPreview 
              data={testimonialData} 
              partner={partnerDetails}
              chatHistory={chatHistory}
              onRestart={handleRestart}
            />
          )}
        </main>
    </div>
  );
};

export default App;