'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function JournalDrawer({
  isOpen,
  onClose,
  reflections,
  onDelete,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  reflections: any[];
  onDelete: (timestamp: number) => void;
  onSelect: (reflection: any) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-4/5 bg-[var(--card-bg)] text-[var(--foreground)] rounded-t-3xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Reflections</h2>
              <button onClick={onClose} className="p-2 rounded-full opacity-60">✕</button>
            </div>
            
            <div className="space-y-4">
              {reflections.map((ref) => (
                <div 
                  key={ref.timestamp} 
                  onClick={() => onSelect(ref)}
                  className="p-4 rounded-xl border border-black/5 bg-[var(--background)] cursor-pointer hover:border-[#D4AF37]/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs opacity-60">{new Date(ref.timestamp).toLocaleDateString()}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ref.timestamp);
                      }} 
                      className="text-xs text-red-500 hover:text-red-600 p-1"
                    >
                      Delete
                    </button>
                  </div>
                  <h4 className="font-semibold text-sm">{ref.query}</h4>
                  <p className="text-sm mt-1 line-clamp-2 italic opacity-80">“{ref.verseText}”</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
