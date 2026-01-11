
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TestimonialData, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INTERVIEWER_INSTRUCTION = `
Du bist "Tim", ein Kundenbetreuer bei ecoverde.
Deine Aufgabe ist es, Feedback von Baumpartnern in der Sie-Form einzuholen.
Der Ton ist professionell, vertrauenswürdig und freundlich.

Stelle nacheinander EXAKT diese 3 strategischen Fragen:
1. Entscheidungsgrund für ecoverde?
2. Zufriedenheit mit Beratung/digitalem Prozess?
3. Weiterempfehlung?

Nutze konsequent die Höflichkeitsform "Sie".
`;

let chatSession: Chat | null = null;

export const startInterviewSession = async (partnerName: string, companyName: string): Promise<string> => {
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: INTERVIEWER_INSTRUCTION,
      temperature: 0.7,
    },
  });

  const initialPrompt = `Ich bin ${partnerName} von ${companyName}. Starten Sie das Interview.`;
  try {
    const response = await chatSession.sendMessage({ message: initialPrompt });
    return response.text;
  } catch (error) {
    return "Guten Tag! Schön, dass Sie da sind. Was war der ausschlaggebende Grund für Ihre Entscheidung zu ecoverde?";
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) throw new Error("Chat session not initialized");
  const response = await chatSession.sendMessage({ message });
  return response.text;
};

export const generateTestimonialFromChat = async (history: ChatMessage[]): Promise<TestimonialData> => {
  const conversationText = history.map(msg => `${msg.role}: ${msg.text}`).join('\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Erstelle ein Testimonial (JSON) aus diesem Gespräch: ${conversationText}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          quote: { type: Type.STRING },
          fullStory: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['headline', 'quote', 'fullStory', 'tags']
      }
    }
  });
  return JSON.parse(response.text) as TestimonialData;
};
