import React, { useState } from 'react';
import { AppState, TRANSLATIONS, CompanyInfo } from '../types';
import { User, Settings, Moon, Globe, Edit2, Check, X, Upload } from 'lucide-react';

interface ProfileProps {
  state: AppState;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  onUpdateCompany: (info: CompanyInfo) => void;
}

const Profile: React.FC<ProfileProps> = ({ state, toggleDarkMode, toggleLanguage, onUpdateCompany }) => {
  const t = TRANSLATIONS[state.language];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanyInfo>(state.company);

  const handleSave = () => {
    onUpdateCompany(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(state.company);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, ownerPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header / Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        
        {isEditing ? (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4 border-b pb-2 dark:border-gray-700">
              <Edit2 size={20} className="text-primary" />
              {t.editProfile}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.companyName}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.ownerName}</label>
                <input 
                  type="text" 
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.ownerPhotoUrl}</label>
                <div className="flex items-start gap-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                  <div className="relative group shrink-0">
                    <img 
                      src={formData.ownerPhoto} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-sm" 
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                      <Upload size={24} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div className="flex flex-col justify-center h-24">
                     <p className="text-sm text-gray-500 mb-3 hidden sm:block">Upload a new profile picture. Recommended size: 200x200px.</p>
                     <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200 transition shadow-sm w-fit">
                        <Upload size={16} />
                        {t.uploadPhoto}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                     </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-blue-600 transition flex items-center gap-2 font-medium shadow-md shadow-blue-500/30"
              >
                <Check size={18} />
                {t.saveChanges}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative">
            <button 
              onClick={() => { setFormData(state.company); setIsEditing(true); }}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-primary transition bg-gray-100 dark:bg-gray-700 rounded-lg"
              title={t.editProfile}
            >
              <Edit2 size={20} />
            </button>

            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <img 
                  src={state.company.ownerPhoto} 
                  alt="Owner" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{state.company.ownerName}</h1>
              <p className="text-primary font-medium text-lg">Owner & CEO</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                Managing Director of {state.company.name}. Dedicated to ensuring efficient workforce management.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
          <Settings className="text-gray-400" />
          {t.settings}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${state.darkMode ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                <Moon size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">{t.darkMode}</p>
                <p className="text-sm text-gray-500">{state.darkMode ? 'On' : 'Off'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${state.darkMode ? 'bg-primary' : 'bg-gray-300'}`}>
               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${state.darkMode ? 'left-7' : 'left-1'}`} />
            </div>
          </button>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          >
             <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <Globe size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 dark:text-white">{t.language}</p>
                <p className="text-sm text-gray-500">{state.language === 'bn' ? 'বাংলা' : 'English'}</p>
              </div>
            </div>
             <div className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm font-bold text-gray-600 dark:text-gray-200">
               {state.language.toUpperCase()}
             </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;