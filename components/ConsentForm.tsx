import React, { useState } from 'react';
import { PartnerDetails } from '../types';

interface ConsentFormProps {
  onComplete: (details: PartnerDetails) => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    if (!accepted) {
      setError('Bitte stimmen Sie der Veröffentlichung zu.');
      return;
    }
    onComplete({ contactName: name, companyName: company });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-ecoverde-border">
        <div className="text-center mb-8">
          {/* Logo Placeholder */}
          <div className="mb-6 flex justify-center">
            <div className="h-12 w-12 bg-ecoverde-green rounded-full flex items-center justify-center text-white font-bold text-xl">
              ev
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Ihre Meinung ist uns wichtig</h1>
          <p className="text-gray-600 font-light">
            Teilen Sie Ihre Erfahrungen mit ecoverde.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Ihr Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-ecoverde-border border px-4 py-3 focus:border-ecoverde-green focus:ring-1 focus:ring-ecoverde-green outline-none transition-colors"
              placeholder="Max Mustermann"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">Unternehmen / Organisation</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-md border-ecoverde-border border px-4 py-3 focus:border-ecoverde-green focus:ring-1 focus:ring-ecoverde-green outline-none transition-colors"
              placeholder="Muster GmbH"
            />
          </div>

          <div className="flex items-start bg-ecoverde-light p-4 rounded-lg">
            <div className="flex h-6 items-center">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-ecoverde-green focus:ring-ecoverde-green cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="font-medium text-gray-700 cursor-pointer">
                Ich stimme der Veröffentlichung zu
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Wir verwenden Ihre Antworten, um ein Testimonial für unsere Webseite und Marketingmaterialien zu erstellen.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-pill shadow-sm text-base font-bold text-white bg-ecoverde-green hover:bg-[#089c6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ecoverde-green transition-all transform hover:scale-[1.02]"
          >
            Jetzt starten
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsentForm;