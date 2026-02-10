import React from 'react';
import { AppState, TRANSLATIONS } from '../types';
import { User, Settings, Moon, Globe } from 'lucide-react';

interface ProfileProps {
  state: AppState;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

const Profile: React.FC<ProfileProps> = ({ state, toggleDarkMode, toggleLanguage }) => {
  const t = TRANSLATIONS[state.language];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
             <img 
               src={state.company.ownerPhoto} 
               alt="Owner" 
               className="w-full h-full object-cover"
             />
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition">
            <Settings size={16} />
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{state.company.ownerName}</h1>
          <p className="text-primary font-medium text-lg">Owner & CEO</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            Managing Director of {state.company.name}. Dedicated to ensuring efficient workforce management.
          </p>
        </div>
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