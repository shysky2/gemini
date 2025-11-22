import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageUploadState } from '../types';
import { fileToBase64 } from '../utils';

interface UploadAreaProps {
  imageState: ImageUploadState;
  onImageChange: (newState: ImageUploadState) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ imageState, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType, preview } = await fileToBase64(file);
        onImageChange({
          file,
          base64Data: base64,
          mimeType,
          previewUrl: preview
        });
      } catch (e) {
        console.error("Error reading file", e);
        alert("Could not read file.");
      }
    }
  };

  const clearImage = () => {
    onImageChange({
      file: null,
      base64Data: null,
      mimeType: null,
      previewUrl: null
    });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-card/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-primary" />
        Source Image
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 relative">
        {imageState.previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img 
              src={imageState.previewUrl} 
              alt="Preview" 
              className="max-h-[300px] w-auto rounded-lg shadow-2xl object-contain"
            />
            <button 
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-slate-300 font-medium mb-2">Click or drag image to upload</p>
            <p className="text-slate-500 text-sm">Supports JPG, PNG, WEBP</p>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${imageState.previewUrl ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
};
