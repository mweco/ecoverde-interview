import React from 'react';

interface IntroPageProps {
  onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 fade-in bg-white sm:bg-transparent">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-ecoverde-border text-center">
        
        {/* ecoverde Logo Graphic (Simplified) */}
        <div className="mb-8 flex justify-center">
            <svg className="w-20 h-20 text-ecoverde-green" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-sans">Willkommen bei ecoverde</h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Wir möchten Ihre Erfolgsgeschichte als Baumpartner auf unserer Webseite teilen.
          Dazu führen wir ein kurzes, digitales Interview mit Ihnen.
        </p>

        <div className="text-left bg-ecoverde-light p-6 rounded-lg mb-8 border border-[#bcebd3]">
          <h3 className="font-bold text-ecoverde-green mb-3 uppercase text-xs tracking-wider">Der Ablauf</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="bg-white text-ecoverde-green font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs border border-ecoverde-green flex-shrink-0">1</span>
              <span>Kurzes Chat-Interview (3 Fragen)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-white text-ecoverde-green font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs border border-ecoverde-green flex-shrink-0">2</span>
              <span>Automatische Erstellung Ihres Testimonials</span>
            </li>
            <li className="flex items-start">
              <span className="bg-white text-ecoverde-green font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs border border-ecoverde-green flex-shrink-0">3</span>
              <span>Foto-Upload & Digitale Unterschrift</span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Das Ergebnis erhalten Sie als PDF per E-Mail für Ihre Unterlagen.
        </p>

        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-pill shadow-md text-lg font-bold text-white bg-ecoverde-green hover:bg-[#089c6b] transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ecoverde-green"
        >
          Interview Starten
        </button>
      </div>
    </div>
  );
};

export default IntroPage;