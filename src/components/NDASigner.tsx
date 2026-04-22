import React, { useState } from 'react';
import { db, setDoc, doc, Timestamp, OperationType, handleFirestoreError } from '../firebase';
import { Reveal } from './Layout';
import { ShieldCheck, PenTool } from 'lucide-react';

interface NDASignerProps {
  user: { uid: string; email: string | null; displayName: string | null };
  onSigned: () => void;
}

export const NDASigner = ({ user, onSigned }: NDASignerProps) => {
  const [fullName, setFullName] = useState(user.displayName || '');
  const [isSigning, setIsSigning] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !fullName) return;

    setIsSigning(true);
    try {
      const signedAtDate = new Date();

      // 1. Write to Firestore directly from client
      try {
        await setDoc(doc(db, 'ndas', user.uid), {
          uid: user.uid,
          email: user.email || '',
          fullName: fullName,
          signedAt: Timestamp.fromDate(signedAtDate),
          ipAddress: 'Client-side signature',
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `ndas/${user.uid}`);
      }

      // 2. Call API to generate PDF and send email
      const response = await fetch('/api/sign-nda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email || '',
          fullName: fullName,
          signedAt: signedAtDate.toISOString(),
          ipAddress: 'Client-side signature', // In a real app, you'd get this from the server
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error details:', errorData);
        throw new Error(`Failed to process NDA signing: ${errorData?.details || 'Unknown error'}`);
      }

      onSigned();
    } catch (error) {
      console.error('NDA Signing Error:', error);
      alert('There was an error signing the NDA. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Reveal className="max-w-2xl mx-auto">
      <div className="editorial-card p-12 bg-white border-accent/20 shadow-2xl shadow-accent/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-ink">Mutual Non-Disclosure Agreement</h3>
            <p className="text-xs text-muted uppercase tracking-widest font-bold">Stage 2 Due Diligence</p>
          </div>
        </div>

        <div className="prose prose-sm max-h-60 overflow-y-auto mb-8 p-6 bg-bg/50 rounded border border-rule/30 text-[13px] leading-relaxed text-muted font-light">
          <p className="font-bold text-ink mb-4">1. PURPOSE</p>
          <p className="mb-4">The parties wish to explore a business opportunity of mutual interest and in connection with this opportunity, a party (the "Disclosing Party") may disclose to the other party (the "Receiving Party") certain confidential technical and business information which the Disclosing Party desires the Receiving Party to treat as confidential.</p>
          
          <p className="font-bold text-ink mb-4">2. CONFIDENTIAL INFORMATION</p>
          <p className="mb-4">"Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, including but not limited to technical data, trade secrets, financial models, biological time series algorithms, and hardware specifications.</p>
          
          <p className="font-bold text-ink mb-4">3. NON-USE AND NON-DISCLOSURE</p>
          <p className="mb-4">The Receiving Party shall not use the Confidential Information for any purpose except to evaluate and engage in discussions concerning the potential business relationship.</p>
          
          <p className="font-bold text-ink mb-4">4. DURATION</p>
          <p>This agreement shall remain in effect for a period of five (5) years from the date of signature.</p>
        </div>

        <form onSubmit={handleSign} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Full Legal Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-bg border border-rule/50 p-4 rounded focus:outline-none focus:border-accent transition-colors font-serif text-lg"
              placeholder="Enter your full name"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-accent"
            />
            <span className="text-xs text-muted leading-relaxed group-hover:text-ink transition-colors">
              I have read and agree to the terms of the Mutual Non-Disclosure Agreement. I understand that access to stage 2 materials is strictly confidential.
            </span>
          </label>

          <button 
            type="submit"
            disabled={!agreed || !fullName || isSigning}
            className="w-full bg-brand text-white py-5 rounded font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigning ? (
              "Executing Agreement..."
            ) : (
              <>
                <PenTool className="w-4 h-4" /> Execute & Unlock Materials
              </>
            )}
          </button>
        </form>
      </div>
    </Reveal>
  );
};
