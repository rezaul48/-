import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { Wand2, Upload, ImageIcon, Loader2, Download } from 'lucide-react';

interface ImageEditorProps {
  lang: 'en' | 'bn';
}

const ImageEditor: React.FC<ImageEditorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image || !prompt) return;

    setLoading(true);
    try {
      const editedImage = await editImageWithGemini(image, prompt);
      setResultImage(editedImage);
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Failed to edit image. Please try again. Ensure your API Key supports the Gemini 2.5 Flash Image model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Wand2 size={32} className="text-yellow-300" />
          {t.aiStudio}
        </h2>
        <p className="text-purple-100 opacity-90 max-w-2xl">
          Powered by Gemini 2.5 Flash. Upload a photo and use magic words like "Make it cyberpunk", "Remove background", or "Add sunglasses".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
           <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
             <Upload size={20} /> Source
           </h3>
           
           <div 
             className="flex-grow border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer relative overflow-hidden group min-h-[300px]"
             onClick={() => !image && fileInputRef.current?.click()}
           >
              {image ? (
                <>
                  <img src={image} alt="Source" className="w-full h-full object-contain p-2" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImage(null); setResultImage(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">{t.uploadImage}</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG supported</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
           </div>

           <div className="mt-6">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Magic Prompt</label>
             <div className="flex gap-2">
               <input
                 type="text"
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder={t.imagePromptPlaceholder}
                 className="flex-grow p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
               />
               <button
                 onClick={handleGenerate}
                 disabled={!image || !prompt || loading}
                 className={`px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 transition ${!image || !prompt || loading ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 shadow-lg'}`}
               >
                 {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
                 {loading ? t.processing : t.generate}
               </button>
             </div>
           </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
           <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
             <Wand2 size={20} /> {t.result}
           </h3>
           
           <div className="flex-grow border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center relative min-h-[300px]">
             {resultImage ? (
                <img src={resultImage} alt="Generated" className="w-full h-full object-contain p-2 animate-fade-in" />
             ) : (
                <div className="text-center text-gray-400">
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                      <p>Creating magic...</p>
                    </div>
                  ) : (
                    <p>Generated image will appear here</p>
                  )}
                </div>
             )}
           </div>

           {resultImage && (
             <a 
               href={resultImage} 
               download="gemini-magic.png" 
               className="mt-6 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition"
             >
               <Download size={18} /> Download Result
             </a>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;