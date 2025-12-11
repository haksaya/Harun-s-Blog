import React from 'react';
import { PlusCircle } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  onNewPostClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, onNewPostClick }) => {
  return (
    <header className="pt-12 pb-8 px-6 md:px-12 mb-4">
      <div className="flex justify-between items-start max-w-4xl">
        <div className="cursor-pointer group" onClick={onHomeClick}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#3a3a3a] group-hover:text-seth-yellow transition-colors font-sans">
            Harun'un Güncesi
            </h1>
            <p className="text-gray-500 text-xs mt-2 font-sans font-bold tracking-widest uppercase">
                Go Make Something Happen
            </p>
        </div>
        
        <button 
            onClick={onNewPostClick}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-seth-yellow hover:text-white text-gray-600 px-4 py-2 rounded-none transition-all duration-300 text-xs font-sans font-bold uppercase tracking-wider"
        >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">New Idea</span>
        </button>
      </div>
    </header>
  );
};