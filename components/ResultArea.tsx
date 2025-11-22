import React from 'react';
import { Download, Sparkles, AlertCircle } from 'lucide-react';
import { GeneratedImageResult } from '../types';
import { Button } from './Button';

interface ResultAreaProps {
  isLoading: boolean;
  result: GeneratedImageResult | null;
  error: string | null;
}

export const ResultArea: React.FC<ResultAreaProps> = ({ isLoading, result, error }) => {
  
  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `toonified-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-card/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-secondary" />
        Cartoon Result
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center border-2 border-slate-700/50 rounded-xl bg-slate-800/30 relative overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-white animate-pulse">Dreaming up your cartoon self...</p>
            <p className="text-sm text-slate-400 mt-2">This usually takes about 5-10 seconds.</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center text-center p-6 text-red-400">
            <AlertCircle className="w-12 h-12 mb-3" />
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm opacity-80 mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && !result && (
          <div className="text-center p-8 opacity-40">
            <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto mb-4 blur-xl"></div>
            <p>Your masterpiece will appear here</p>
          </div>
        )}

        {result && !isLoading && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 animate-fade-in">
            <img 
              src={result.imageUrl} 
              alt="Generated Cartoon" 
              className="max-h-[300px] w-auto rounded-lg shadow-2xl shadow-primary/20 object-contain mb-4"
            />
            <div className="flex gap-4 mt-auto">
              <Button onClick={handleDownload} variant="secondary" className="text-sm py-2 px-4">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
