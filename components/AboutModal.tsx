import React from 'react';
import { CloseIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-sm text-center p-8 shadow-2xl relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors">
            <CloseIcon />
        </button>
        <p className="text-xl text-slate-200">
          نوشته شده با علاقه برای ماهی
        </p>
        <p className="mt-2 text-lg text-slate-400">
          توسط گربه
        </p>
      </div>
    </div>
  );
};
