
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PromptTemplate } from '../types';
import { CopyIcon, ResetIcon } from './icons';

interface PromptCardProps {
  template: PromptTemplate;
  isActive: boolean;
  onCopy: (prompt: string) => void;
}

const EditableField: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
}> = ({ value, onChange }) => {
  const handleInput = useCallback((e: React.FormEvent<HTMLSpanElement>) => {
    const newText = e.currentTarget.textContent || '';
    onChange(newText.replace(/\(|\)/g, ''));
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-violet-400 focus:bg-violet-500/30 transition-all cursor-text"
    >
      {value}
    </span>
  );
};

export const PromptCard: React.FC<PromptCardProps> = ({ template, isActive, onCopy }) => {
  const [isFlipped, setFlipped] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(template.defaults);
  const [copyStatus, setCopyStatus] = useState(false);

  const generatedPrompt = useMemo(() => {
    const promptText = template.structure
      .map(part => (typeof part === 'string' ? part : (fieldValues[part.key] || '')))
      .join('');

    if (template.format === 'json') {
      const json = {
        prompt: promptText,
        negative_prompt: "عکس استودیویی، کیفیت بیش از حد بالا، رندر دیجیتال بی‌نقص، نورپردازی سینمایی، پس‌زمینه خیلی تمیز یا غیر طبیعی"
      };
      if(template.id === 'polaroid' && fieldValues['pol_face2'] === template.defaults['pol_face']){
          fieldValues['pol_face2'] = fieldValues['pol_face']
      }
      return JSON.stringify(json, null, 2);
    }
    return promptText;
  }, [fieldValues, template]);

  useEffect(() => {
    if (!isActive) {
      setFlipped(false);
    }
    setFieldValues(template.defaults);
  }, [isActive, template]);


  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFieldValues(template.defaults);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      onCopy(generatedPrompt);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  return (
    <div 
        className={`w-full h-full transition-transform duration-500`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        onClick={() => !isFlipped && isActive && setFlipped(true)}
    >
        {/* Card Front */}
        <div 
            className="absolute w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-opacity duration-300 bg-cover bg-center"
            style={{
                backfaceVisibility: 'hidden',
                opacity: isFlipped ? 0 : 1,
                backgroundImage: template.imageUrl ? `url(${template.imageUrl})` : 'none',
                backgroundColor: !template.imageUrl ? '#0f1724' : undefined
            }}
        >
            <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>
            <div className="relative text-center">
                <h2 className="text-3xl font-bold text-white z-10">{template.name}</h2>
                <p className="mt-4 text-lg text-slate-300 z-10">برای ویرایش کلیک کنید</p>
            </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl flex flex-col p-4 sm:p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="flex-grow overflow-y-auto pr-2 text-slate-200 text-base sm:text-lg leading-relaxed sm:leading-loose">
                {template.structure.map((part, index) =>
                typeof part === 'string' ? (
                    <span key={index}>{part}</span>
                ) : (
                    <EditableField
                    key={`${part.key}-${index}`}
                    value={fieldValues[part.key]}
                    onChange={(newValue) => handleFieldChange(part.key, newValue)}
                    />
                )
                )}
            </div>
            <div className="flex-shrink-0 flex items-center justify-between gap-4 pt-4 mt-auto border-t border-white/10">
                <button
                    onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
                    className="px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
                >
                    بستن
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        className="p-3 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="بازنشانی مقادیر"
                    >
                        <ResetIcon />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                        className={`p-3 rounded-full transition-colors ${
                        copyStatus ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
                        }`}
                        aria-label="کپی پرامت"
                    >
                        <CopyIcon />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};