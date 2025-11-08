
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { CloseIcon, CopyIcon, StarIcon, TrashIcon } from './icons';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: HistoryItem[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const FavoriteListItem: React.FC<{
  item: HistoryItem;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ item, onToggleFavorite, onDelete }) => {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedText = item.text.length > 120 ? item.text.substring(0, 120) + '...' : item.text;

  return (
    <li className="bg-[#0f1724]/50 p-3 rounded-lg flex flex-col gap-3">
      <p className="flex-grow text-slate-300 text-sm whitespace-pre-wrap break-words font-mono h-20 overflow-hidden">
        {truncatedText}
      </p>
      <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-2">
        <button
          onClick={handleCopy}
          className={`p-2 rounded-md transition-colors ${
            isCopied ? 'bg-emerald-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-white'
          }`}
          aria-label="کپی"
        >
          <CopyIcon />
        </button>
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="p-2 rounded-md text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
          aria-label="حذف از علاقه‌مندی"
        >
          <StarIcon filled={true} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
          aria-label="حذف"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onToggleFavorite, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold">پرامت‌های مورد علاقه</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <CloseIcon />
          </button>
        </header>
        <div className="flex-grow overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لیست علاقه‌مندی‌ها خالی است.</p>
          ) : (
            <ul className="space-y-3">
              {favorites.map((item) => (
                <FavoriteListItem
                  key={item.id}
                  item={item}
                  onToggleFavorite={onToggleFavorite}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
