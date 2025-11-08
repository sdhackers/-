
import React, { useState, useMemo, useEffect } from 'react';
import { PromptTemplate } from '../types';
import { CloseIcon } from './icons';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTemplate: Omit<PromptTemplate, 'id' | 'format'>) => void;
}

const FormInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; placeholder?: string }> = 
({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0f1724] border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  </div>
);

const FormTextarea: React.FC<{ label: string; value: string; onChange: (val: string) => void; placeholder?: string; hint?: string }> = 
({ label, value, onChange, placeholder, hint }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full bg-[#0f1724] border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
        />
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
);


export const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [structureText, setStructureText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [defaults, setDefaults] = useState<Record<string, string>>({});

    const placeholders = useMemo(() => {
        const matches = structureText.match(/\(([^)]+)\)/g) || [];
        return [...new Set(matches.map(m => m.slice(1, -1)))];
    }, [structureText]);

    useEffect(() => {
        setDefaults(prev => {
            const newDefaults: Record<string, string> = {};
            for (const key of placeholders) {
                newDefaults[key] = prev[key] || '';
            }
            return newDefaults;
        });
    }, [placeholders]);
    
    const handleDefaultChange = (key: string, value: string) => {
        setDefaults(prev => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setName('');
        setStructureText('');
        setImageUrl('');
        setDefaults({});
    }

    const handleSave = () => {
        if (!name || !structureText) {
            alert('نام پروفایل و ساختار پرامت اجباری است.');
            return;
        }

        const structure = structureText.split(/(\([^)]+\))/g).filter(Boolean).map(part => {
            const match = part.match(/^\(([^)]+)\)$/);
            if (match) {
                return { key: match[1] };
            }
            return part;
        });

        onSave({
            name,
            structure,
            defaults,
            imageUrl: imageUrl || undefined,
        });
        resetForm();
    };
    
    const handleClose = () => {
        resetForm();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div
                className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-xl font-bold">افزودن پروفایل جدید</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <CloseIcon />
                    </button>
                </header>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <FormInput label="نام پروفایل" value={name} onChange={setName} placeholder="مثلا: پرامت برای داستان کوتاه" />
                    <FormTextarea 
                        label="ساختار پرامت" 
                        value={structureText} 
                        onChange={setStructureText} 
                        placeholder="یک داستان درباره (شخصیت) در (مکان) بنویس."
                        hint="متغیرهای خود را داخل پرانتز قرار دهید. مثال: (نام_متغیر)"
                    />
                    <FormInput label="آدرس تصویر پس‌زمینه (اختیاری)" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
                    
                    {placeholders.length > 0 && (
                        <div className="pt-4 border-t border-slate-700">
                            <h3 className="text-lg font-semibold mb-2 text-slate-200">مقادیر پیش‌فرض</h3>
                            <div className="space-y-3">
                                {placeholders.map(key => (
                                    <FormInput 
                                        key={key}
                                        label={`متغیر: ${key}`} 
                                        value={defaults[key] || ''}
                                        onChange={(val) => handleDefaultChange(key, val)}
                                        placeholder={`مقدار پیش‌فرض برای (${key})`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <footer className="flex justify-end items-center gap-3 p-4 border-t border-white/10 flex-shrink-0">
                    <button onClick={handleClose} className="px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors text-slate-300">
                        انصراف
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-6 py-2 text-sm rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        disabled={!name || !structureText}
                    >
                        ذخیره پروفایل
                    </button>
                </footer>
            </div>
        </div>
    );
};
