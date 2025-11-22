import React from 'react';
import { Wand2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-full mb-6 ring-1 ring-white/10">
        <Wand2 className="w-10 h-10 text-secondary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-indigo-200 mb-4">
        Toonify Me
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl">
        Upload your photo and let our AI magically transform you into a cartoon character. 
        Choose your favorite style and see the magic happen!
      </p>
    </header>
  );
};
