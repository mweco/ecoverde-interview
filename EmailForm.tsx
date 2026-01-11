import React, { useState } from 'react';

interface EmailFormProps {
  onComplete: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }
    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    onComplete(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-ecoverde-border text-center">
        
        <div className="mb-6 flex justify-center">
           <div className="h-16 w-16 bg-ecoverde-light text-ecoverde-green rounded-full flex items-center justify-center text-3xl">
             ✉️
           </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">Vielen Dank für das Gespräch!</h2>
        <p className="text-gray-600 mb-6">
          Damit wir Ihnen Ihr persönliches Testimonial als PDF zusenden können, benötigen wir noch Ihre E-Mail-Adresse.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-ecoverde-border border px-4 py-3 focus:border-ecoverde-green focus:ring-1 focus:ring-ecoverde-green outline-none transition-colors"
              placeholder="name@unternehmen.ch"
            />
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
            Testimonial erstellen
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;