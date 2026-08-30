'use client';

import { useState, KeyboardEvent, ClipboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
}

export default function TagsInput({ tags = [], onChange, placeholder, dir = 'rtl' }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTags = (newTagsStr: string) => {
    const newTags = newTagsStr
      .split(/,|،/)
      .map(t => t.trim())
      .filter(t => t && !tags.includes(t));
    
    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === '،') {
      e.preventDefault();
      addTags(inputValue);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTags(inputValue);
      setInputValue('');
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addTags(pastedText);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={`w-full border border-gray-200 rounded-lg focus-within:ring-2 focus-within:border-transparent focus-within:ring-main min-h-[50px] p-2 flex flex-wrap gap-2 items-center bg-white transition-all`} dir={dir}>
      {tags.map((tag, index) => (
        <span key={index} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
          {tag}
          <button 
            type="button" 
            onClick={() => removeTag(index)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : (dir === 'rtl' ? 'أضف المزيد...' : 'Add more...')}
        className="flex-1 min-w-[160px] outline-none bg-transparent px-2 py-1 text-gray-700 placeholder:text-gray-400"
        dir={dir}
      />
    </div>
  );
}
