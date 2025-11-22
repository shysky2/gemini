import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultArea } from './components/ResultArea';
import { Button } from './components/Button';
import { InstallPwa } from './components/InstallPwa';
import { generateCartoonImage } from './services/gemini';
import { CartoonStyle, GeneratedImageResult, ImageUploadState } from './types';
import { Palette } from 'lucide-react';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageUploadState>({
    file: null,
    base64Data: null,
    mimeType: null,
    previewUrl: null
  });

  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>(CartoonStyle.Pixar3D);
  const [generatedResult, setGeneratedResult] = useState<GeneratedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!imageState.base64Data || !imageState.mimeType) return;

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const resultBase64 = await generateCartoonImage(
        imageState.base64Data, 
        imageState.mimeType, 
        selectedStyle
      );
      
      setGeneratedResult({
        imageUrl: resultBase64,
        style: selectedStyle
      });
    } catch (err) {
      setError("Failed to generate cartoon. Please try a different image or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        
        {/* Style Selector */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="bg-card border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300 font-medium min-w-fit">
              <Palette className="w-5 h-5 text-secondary" />
              <span>Choose Style:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full">
              {Object.values(CartoonStyle).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedStyle === style 
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/25 font-medium' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload */}
          <div className="flex flex-col gap-6">
            <UploadArea 
              imageState={imageState} 
              onImageChange={setImageState} 
            />
            
            <Button 
              onClick={handleGenerate}
              disabled={!imageState.file}
              isLoading={isLoading}
              className="w-full py-4 text-lg shadow-xl shadow-primary/20"
            >
              Generate Cartoon
            </Button>
          </div>

          {/* Right Column: Result */}
          <div className="h-full">
             <ResultArea 
               isLoading={isLoading}
               result={generatedResult}
               error={error}
             />
          </div>

        </div>

        {/* Features / Info Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-slate-400">
          <div className="p-6 bg-card/30 rounded-xl border border-white/5">
            <h3 className="text-white font-semibold mb-2">High Quality AI</h3>
            <p className="text-sm">Powered by Google Gemini 2.5 Flash for rapid and stunning image transformations.</p>
          </div>
          <div className="p-6 bg-card/30 rounded-xl border border-white/5">
            <h3 className="text-white font-semibold mb-2">Multiple Styles</h3>
            <p className="text-sm">From 3D Pixar aesthetics to classic anime and vintage comic styles.</p>
          </div>
          <div className="p-6 bg-card/30 rounded-xl border border-white/5">
            <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm">Processing happens on the fly. We don't store your personal photos.</p>
          </div>
        </div>

      </main>
      
      <InstallPwa />
    </div>
  );
};

export default App;