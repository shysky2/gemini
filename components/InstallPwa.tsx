import React, { useEffect, useState } from 'react';
import { Download, X, Share, MoreVertical, Smartphone } from 'lucide-react';
import { Button } from './Button';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Handle Android/Desktop Chrome install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If it's iOS or if we haven't seen the prompt after a few seconds on mobile, 
    // we might want to show the button anyway to open the manual guide.
    const timer = setTimeout(() => {
      if (!deferredPrompt && (isIosDevice || /Android/.test(navigator.userAgent))) {
        setIsVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Desktop automatic flow
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      // iOS or Manual Android flow
      setShowManualGuide(true);
    }
  };

  if (!isVisible && !showManualGuide) return null;

  return (
    <>
      {/* Floating Install Button */}
      {isVisible && !showManualGuide && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-800/95 backdrop-blur-md border border-primary/30 p-4 rounded-2xl shadow-2xl z-40 animate-fade-in-up flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Install App</h3>
            <p className="text-xs text-slate-300 mt-1">Add to home screen for full experience</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <Button 
              onClick={handleInstallClick}
              variant="primary"
              className="py-2 px-4 text-xs h-auto"
            >
              Install
            </Button>
          </div>
        </div>
      )}

      {/* Manual Install Guide Modal */}
      {showManualGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowManualGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-primary" />
              Install Guide
            </h3>

            <div className="space-y-6">
              {isIOS ? (
                // iOS Instructions
                <div className="space-y-4 text-slate-300">
                  <p>To install on iPhone/iPad:</p>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full text-primary font-bold">1</span>
                      <span>Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> button in Safari.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full text-primary font-bold">2</span>
                      <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                // Android Manual Instructions (if auto prompt failed)
                <div className="space-y-4 text-slate-300">
                  <p>To install on Android:</p>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full text-primary font-bold">1</span>
                      <span>Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> <strong>Menu</strong> button (three dots) in Chrome.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full text-primary font-bold">2</span>
                      <span>Select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                    </li>
                  </ol>
                </div>
              )}

              <Button 
                onClick={() => setShowManualGuide(false)}
                className="w-full mt-4"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};