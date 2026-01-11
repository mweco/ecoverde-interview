import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PartnerDetails } from '../types';
import { sendMessageToGemini, startInterviewSession } from '../services/geminiService';

interface ChatInterfaceProps {
  partnerDetails: PartnerDetails;
  onFinish: (history: ChatMessage[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ partnerDetails, onFinish }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true); // Initial loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    const initChat = async () => {
      const initialResponse = await startInterviewSession(partnerDetails.contactName, partnerDetails.companyName);
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: initialResponse
        }
      ]);
      setIsTyping(false);
    };
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-4xl mx-auto shadow-xl rounded-none sm:rounded-xl overflow-hidden my-0 sm:my-8 border border-ecoverde-border">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-ecoverde-border">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-ecoverde-green rounded-full flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Tim von ecoverde</h2>
            <p className="text-gray-500 text-xs">Interview mit {partnerDetails.companyName}</p>
          </div>
        </div>
        <button
          onClick={() => onFinish(messages)}
          className="bg-ecoverde-blue hover:bg-[#2a55aa] text-white text-xs font-bold px-4 py-2 rounded-pill transition-colors shadow-sm"
        >
          Absenden
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#F9FAFB] scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 text-base shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-ecoverde-green text-white rounded-2xl rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex space-x-1 items-center">
              <div className="w-2 h-2 bg-ecoverde-green rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-ecoverde-green rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-ecoverde-green rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-ecoverde-border">
        <div className="flex items-end space-x-2 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreiben Sie hier Ihre Antwort..."
            className="flex-1 resize-none bg-gray-50 border-gray-200 focus:border-ecoverde-green focus:ring-1 focus:ring-ecoverde-green rounded-2xl p-4 min-h-[60px] max-h-[150px] text-base border focus:outline-none pr-12"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-3 bottom-3 bg-ecoverde-green hover:bg-[#089c6b] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;