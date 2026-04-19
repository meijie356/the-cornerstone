'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ContactDrawer({ isOpen, onClose, email }: ContactDrawerProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Using Formspree as the suggested standard for static/Next.js sites
      const response = await fetch(`https://formspree.io/f/mqakvweb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          _replyto: email, // Submission goes to J's email
          subject: 'New Contact from The Cornerstone',
        }),
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[var(--background)] rounded-t-[32px] shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto border-t border-black/5"
          >
            <div className="max-w-xl mx-auto">
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Contact</h2>
                <button onClick={onClose} className="p-2 opacity-50 hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                {/* LinkedIn Link Section */}
                <div className="bg-[var(--card-bg)] p-4 rounded-2xl border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0077B5] p-2 rounded-lg text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Professional Profile</p>
                      <p className="text-xs opacity-60">Connect on LinkedIn</p>
                    </div>
                  </div>
                  <a 
                    href="https://www.linkedin.com/in/jie-mei-b4125b78" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-widest text-[#A68A64] hover:opacity-70 transition-opacity"
                  >
                    View
                  </a>
                </div>

                {/* Contact Form Section */}
                <div className="space-y-4">
                  <p className="text-sm opacity-60 px-1">Or send a direct message below:</p>
                  
                  {formStatus === 'success' ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-10 space-y-3"
                    >
                      <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-serif text-lg">Message Sent</p>
                      <p className="text-sm opacity-60">I'll get back to you as soon as possible.</p>
                      <button 
                        onClick={() => setFormStatus('idle')}
                        className="text-xs font-bold uppercase tracking-widest text-[#A68A64] pt-4"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          required
                          type="text"
                          name="name"
                          placeholder="Your name"
                          className="w-full p-4 rounded-xl border border-black/5 bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <input
                          required
                          type="email"
                          name="email"
                          placeholder="Your email"
                          className="w-full p-4 rounded-xl border border-black/5 bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <textarea
                          required
                          name="message"
                          rows={4}
                          placeholder="Your message..."
                          className="w-full p-4 rounded-xl border border-black/5 bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full py-4 bg-[#4A5D4E] text-white rounded-xl font-medium hover:bg-[#3D4D3E] transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                      </button>
                      {formStatus === 'error' && (
                        <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>
                      )}
                    </form>
                  )}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-[10px] uppercase tracking-widest opacity-30">The Cornerstone v1.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
