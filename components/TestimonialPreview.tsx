import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { TestimonialData, PartnerDetails, ChatMessage } from '../types';
import SignaturePad from './SignaturePad';

interface TestimonialPreviewProps {
  data: TestimonialData;
  partner: PartnerDetails;
  chatHistory: ChatMessage[];
  onRestart: () => void;
}

const TestimonialPreview: React.FC<TestimonialPreviewProps> = ({ data, partner, chatHistory, onRestart }) => {
  const [image, setImage] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    if (!signature) {
      alert("Bitte unterschreiben Sie das Dokument vor dem Senden.");
      return;
    }

    setIsGeneratingPdf(true);
    const doc = new jsPDF();

    // -- HEADER --
    doc.setFillColor(9, 174, 119); // ecoverde Green
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("ecoverde - Partner Feedback", 10, 13);

    // -- PARTNER INFO --
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    let yPos = 40;

    // Portrait Image in PDF
    if (image) {
        try {
            // Circular clipping is hard in basic jsPDF, we just add the square image
            // aspect ratio check would be good, but assuming reasonable input
            doc.addImage(image, 'JPEG', 150, 30, 40, 40); 
        } catch (e) {
            console.error("Could not add image to PDF", e);
        }
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Partner: ${partner.companyName}`, 10, yPos);
    yPos += 7;
    doc.text(`Kontakt: ${partner.contactName}`, 10, yPos);
    yPos += 7;
    if (partner.email) {
        doc.text(`E-Mail: ${partner.email}`, 10, yPos);
        yPos += 15;
    } else {
        yPos += 8;
    }

    // -- GENERATED TESTIMONIAL --
    doc.setFillColor(242, 249, 243); // Light Green bg
    doc.rect(10, yPos, 190, 50, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(9, 174, 119);
    doc.text(data.headline, 15, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "italic");
    const splitQuote = doc.splitTextToSize(`"${data.quote}"`, 180);
    doc.text(splitQuote, 15, yPos);
    
    yPos += 15;
    doc.setFont("helvetica", "normal");
    const splitStory = doc.splitTextToSize(data.fullStory, 180);
    doc.text(splitStory, 15, yPos);
    yPos = Math.max(yPos + 30, 120);

    // -- Q&A TRANSCRIPT --
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(9, 174, 119);
    doc.text("Interview Protokoll", 10, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    chatHistory.forEach((msg) => {
        if (msg.role === 'model' && msg.id !== 'init') {
            doc.setFont("helvetica", "bold");
            doc.text("ecoverde:", 10, yPos);
            const question = doc.splitTextToSize(msg.text, 160);
            doc.text(question, 35, yPos);
            yPos += (question.length * 5) + 3;
        } else if (msg.role === 'user') {
            doc.setFont("helvetica", "normal");
            doc.text("Partner:", 10, yPos);
            const answer = doc.splitTextToSize(msg.text, 160);
            doc.text(answer, 35, yPos);
            yPos += (answer.length * 5) + 5;
        }
        
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });

    // -- SIGNATURE --
    if (yPos > 240) {
        doc.addPage();
        yPos = 30;
    } else {
        yPos += 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Digitale Unterschrift / Freigabe", 10, yPos);
    yPos += 5;
    if (signature) {
        doc.addImage(signature, 'PNG', 10, yPos, 60, 30);
    }
    
    const dateStr = new Date().toLocaleDateString('de-DE');
    doc.setFontSize(8);
    doc.text(`Datum: ${dateStr}`, 10, yPos + 35);
    doc.text("Dieses Dokument wurde digital erstellt und freigegeben.", 10, yPos + 40);

    const filename = `ecoverde_Feedback_${partner.companyName.replace(/\s/g, '_')}.pdf`;
    doc.save(filename);
    
    // Simulate Sending via Mailto
    setTimeout(() => {
        setIsGeneratingPdf(false);
        const mailBody = `Das Feedback-PDF wurde heruntergeladen. Bitte fügen Sie es dieser E-Mail bei.\n\nPartner: ${partner.companyName}\nKontakt: ${partner.contactName}\nEmail: ${partner.email || '-'}`;
        window.location.href = `mailto:marketing@ecoverde.ch?subject=Neues Feedback von ${partner.companyName}&body=${encodeURIComponent(mailBody)}`;
    }, 1000);
  };

  return (
    <div className="h-full overflow-y-auto pb-10 fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER PROFILE SECTION */}
        <div className="text-center">
            <div className="relative inline-block mt-4 mb-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 mx-auto flex items-center justify-center relative group">
                    {image ? (
                        <img src={image} alt="Portrait" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                             <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                             <span className="text-[10px] uppercase font-bold">Kein Bild</span>
                        </div>
                    )}
                    {/* Overlay for upload */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-ecoverde-blue font-semibold hover:underline mt-2"
                >
                    + Foto hochladen
                </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{partner.contactName}</h2>
            <p className="text-ecoverde-green font-semibold">{partner.companyName}</p>
        </div>

        {/* GENERATED CONTENT */}
        <div className="bg-white rounded-xl shadow-sm border border-ecoverde-border p-6 sm:p-8">
            <span className="inline-block px-3 py-1 bg-[#E6F4EA] text-ecoverde-green text-xs font-bold rounded-pill mb-4 border border-[#bcebd3]">
                Generiertes Testimonial
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{data.headline}</h3>
            <p className="text-gray-600 mb-6">{data.fullStory}</p>
            <blockquote className="border-l-4 border-ecoverde-blue pl-4 italic text-gray-800 bg-gray-50 py-2 rounded-r">
                "{data.quote}"
            </blockquote>
        </div>

        {/* Q&A LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-ecoverde-border p-6 sm:p-8">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Interview Details</h4>
            <div className="space-y-6">
                {chatHistory.filter(m => m.id !== 'init').map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                            {msg.role === 'user' ? partner.contactName : 'ecoverde'}
                         </span>
                         <div className={`rounded-lg p-3 text-sm max-w-[90%] ${msg.role === 'user' ? 'bg-ecoverde-light text-gray-800 border border-ecoverde-border' : 'bg-gray-100 text-gray-600'}`}>
                            {msg.text}
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-ecoverde-border p-6 sm:p-8">
             <h4 className="font-bold text-gray-800 mb-4">Digitale Freigabe</h4>
             <p className="text-sm text-gray-500 mb-4">
                Bitte unterschreiben Sie hier, um die Inhalte freizugeben.
             </p>
             <SignaturePad onEnd={setSignature} />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-4">
             <button
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className={`w-full py-4 text-white font-bold rounded-pill shadow-md transition-all flex items-center justify-center gap-2 ${isGeneratingPdf ? 'bg-gray-400' : 'bg-ecoverde-green hover:bg-[#089c6b]'}`}
             >
                {isGeneratingPdf ? 'Erstelle PDF...' : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Bestätigen & PDF Senden
                    </>
                )}
             </button>
             
             <button
                onClick={onRestart}
                className="text-gray-500 text-sm hover:underline text-center"
             >
                Abbrechen & Neu starten
             </button>
        </div>

      </div>
    </div>
  );
};

export default TestimonialPreview;