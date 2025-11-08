
import React, { useState, useCallback } from 'react';
import { PROMPT_TEMPLATES } from './constants';
import { PromptCard } from './components/PromptCard';
import { HistoryModal } from './components/HistoryModal';
import { AboutModal } from './components/AboutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AddProfileModal } from './components/AddProfileModal';
import { HistoryIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, PlusIcon } from './components/icons';
import { PromptTemplate, HistoryItem } from './types';

export default function App() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(PROMPT_TEMPLATES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryVisible, setHistoryVisible] = useState<boolean>(false);
  const [isFavoritesVisible, setFavoritesVisible] = useState<boolean>(false);
  const [isAboutVisible, setAboutVisible] = useState<boolean>(false);
  const [isAddProfileVisible, setAddProfileVisible] = useState<boolean>(false);
  const [swipeState, setSwipeState] = useState<{ x: number, animating: boolean }>({ x: 0, animating: false });

  const handleCopyToHistory = useCallback((promptText: string) => {
    setHistory(prev => [{ id: `prompt-${Date.now()}`, text: promptText, isFavorite: false }, ...prev]);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleAddNewTemplate = useCallback((newTemplate: Omit<PromptTemplate, 'id'>) => {
      const templateWithId: PromptTemplate = { ...newTemplate, id: `custom-${Date.now()}` };
      setTemplates(prev => {
        const updatedTemplates = [...prev, templateWithId];
        setCurrentIndex(updatedTemplates.length - 1);
        return updatedTemplates;
      });
      setAddProfileVisible(false);
  }, []);


  const handleSwipe = (direction: 'next' | 'prev') => {
    if (swipeState.animating) return;

    setSwipeState({ x: direction === 'next' ? -500 : 500, animating: true });

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex(prev => (prev + 1) % templates.length);
      } else {
        setCurrentIndex(prev => (prev - 1 + templates.length) % templates.length);
      }
      setSwipeState({ x: 0, animating: false });
    }, 300);
  };
  
  return (
    <div className="bg-[#0b1220] text-[#e6eef8] min-h-screen h-screen flex flex-col font-sans overflow-hidden p-4 sm:p-6">
      <header className="flex justify-between items-center mb-4 z-20 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold">سازنده پرامت</h1>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => setAboutVisible(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="درباره برنامه"
            >
              <InfoIcon />
            </button>
            <button 
              onClick={() => setAddProfileVisible(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="افزودن پروفایل جدید"
            >
              <PlusIcon />
            </button>
            <button 
              onClick={() => setFavoritesVisible(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="نمایش علاقه‌مندی‌ها"
            >
              <StarIcon />
            </button>
            <button 
              onClick={() => setHistoryVisible(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="نمایش تاریخچه"
            >
              <HistoryIcon />
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center relative w-full perspective-[1000px]">
        {/* Prev Button (Visually on the Right) */}
        <button 
          onClick={() => handleSwipe('prev')} 
          className="absolute left-2 sm:left-0 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-800/50 rounded-full hover:bg-slate-700/70 transition-colors backdrop-blur-sm"
          aria-label="قبلی"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>

        {/* Next Button (Visually on the Left) */}
        <button 
          onClick={() => handleSwipe('next')} 
          className="absolute right-2 sm:right-0 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-800/50 rounded-full hover:bg-slate-700/70 transition-colors backdrop-blur-sm"
          aria-label="بعدی"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        
        <div className="relative w-full max-w-lg h-[65vh] max-h-[550px]">
          {templates.map((template, index) => {
            const isCurrent = index === currentIndex;
            const zIndex = templates.length - Math.abs(currentIndex - index);
            const position = index - currentIndex;

            return (
              <div
                key={template.id}
                className="absolute w-full h-full transition-transform duration-300 ease-out"
                style={{
                  zIndex: isCurrent ? templates.length + 1 : zIndex,
                  transform: isCurrent 
                    ? `translateX(${swipeState.x}px) rotateZ(${swipeState.x / 40}deg)`
                    : `translateY(${position * -15}px) scale(${1 - Math.abs(position) * 0.05})`,
                  opacity: Math.abs(position) < 3 ? 1 : 0,
                  pointerEvents: isCurrent ? 'auto' : 'none'
                }}
              >
                <PromptCard
                  template={template}
                  isActive={isCurrent}
                  onCopy={handleCopyToHistory}
                />
              </div>
            );
          })}
        </div>
      </main>
      
      <HistoryModal 
        isOpen={isHistoryVisible} 
        onClose={() => setHistoryVisible(false)}
        history={history}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteItem}
      />
      <FavoritesModal
        isOpen={isFavoritesVisible}
        onClose={() => setFavoritesVisible(false)}
        favorites={history.filter(item => item.isFavorite)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteItem}
      />
      <AboutModal
        isOpen={isAboutVisible}
        onClose={() => setAboutVisible(false)}
      />
      <AddProfileModal
        isOpen={isAddProfileVisible}
        onClose={() => setAddProfileVisible(false)}
        onSave={handleAddNewTemplate}
      />
    </div>
  );
}