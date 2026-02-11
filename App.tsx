import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileBarChart, 
  Users, 
  Wallet, 
  UserCircle, 
  Wand2,
  Banknote,
  Menu,
  X
} from 'lucide-react';

// Components
import Dashboard from './components/Dashboard';
import AttendanceInput from './components/AttendanceInput';
import Reports from './components/Reports';
import EmployeeList from './components/EmployeeList';
import Accounts from './components/Accounts';
import Profile from './components/Profile';
import ImageEditor from './components/ImageEditor';
import Transactions from './components/Transactions';

// Types and Data
import { AppState, AttendanceRecord, Employee, Transaction, TRANSLATIONS, CompanyInfo } from './types';

// Mock Initial Data (Used only if no local storage data exists)
const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1001', name: 'Abdul Karim', address: 'Mirpur, Dhaka', mobile: '01711223344', salary: 15000 },
  { id: '1002', name: 'Nasrin Akter', address: 'Uttara, Dhaka', mobile: '01911223344', salary: 18000 },
  { id: '1003', name: 'Kamal Hossain', address: 'Savar, Dhaka', mobile: '01811223344', salary: 12000 },
];

const STORAGE_KEY = 'hazira-pro-data-v1';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize state from localStorage or use defaults
  const [state, setState] = useState<AppState>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure transactions array exists for old data migrations
        if (!parsed.transactions) parsed.transactions = [];
        return parsed;
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
    // Default Initial State
    return {
      employees: INITIAL_EMPLOYEES,
      attendance: [],
      transactions: [],
      company: {
        name: 'Alpha Tech Solutions',
        ownerName: 'Md. Owner Rahman',
        ownerPhoto: 'https://picsum.photos/200/200'
      },
      darkMode: false,
      language: 'bn' // Default to Bangla as per prompt
    };
  });

  // --- EFFECTS ---
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save data to local storage", error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
         alert("Storage full! Please try uploading smaller images or clearing old data.");
      }
    }
  }, [state]);

  // Dark mode class toggle
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // --- HANDLERS ---
  const toggleDarkMode = () => setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  const toggleLanguage = () => setState(prev => ({ ...prev, language: prev.language === 'en' ? 'bn' : 'en' }));
  
  const handleUpdateCompanyName = (name: string) => {
    setState(prev => ({ ...prev, company: { ...prev.company, name } }));
  };

  const handleUpdateCompany = (company: CompanyInfo) => {
    setState(prev => ({ ...prev, company }));
  };

  const handleAddEmployee = (emp: Employee) => {
    setState(prev => ({ ...prev, employees: [...prev.employees, emp] }));
  };

  const handleUpdateEmployee = (originalId: string, updatedEmp: Employee) => {
    setState(prev => {
      const idChanged = originalId !== updatedEmp.id;
      const updatedEmployees = prev.employees.map(emp => emp.id === originalId ? updatedEmp : emp);
      let updatedAttendance = prev.attendance;
      if (idChanged) {
        updatedAttendance = prev.attendance.map(record => 
          record.employeeId === originalId 
            ? { ...record, employeeId: updatedEmp.id, id: record.id.replace(originalId, updatedEmp.id) }
            : record
        );
      }
      return { ...prev, employees: updatedEmployees, attendance: updatedAttendance };
    });
  };

  const handleRemoveEmployee = (id: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== id),
      attendance: prev.attendance.filter(a => a.employeeId !== id),
      transactions: prev.transactions.filter(t => t.employeeId !== id)
    }));
  };

  const handleMarkAttendance = (newRecords: AttendanceRecord[]) => {
    setState(prev => {
      const filtered = prev.attendance.filter(
        old => !newRecords.some(newRec => newRec.employeeId === old.employeeId && newRec.date === old.date)
      );
      return { ...prev, attendance: [...filtered, ...newRecords] };
    });
  };

  const handleAddTransaction = (tx: Transaction) => {
    setState(prev => ({ ...prev, transactions: [tx, ...prev.transactions] }));
  };

  const handleUpdateTransaction = (id: string, updatedTx: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? updatedTx : t)
    }));
  };

  const handleRemoveTransaction = (id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  // --- NAVIGATION CONFIG ---
  const t = TRANSLATIONS[state.language];
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'attendance', label: t.attendance, icon: ClipboardCheck },
    { id: 'reports', label: t.reports, icon: FileBarChart },
    { id: 'employees', label: t.employees, icon: Users },
    { id: 'transactions', label: t.transactions, icon: Banknote },
    { id: 'accounts', label: t.accounts, icon: Wallet },
    { id: 'aiStudio', label: t.aiStudio, icon: Wand2 },
    { id: 'profile', label: t.profile, icon: UserCircle },
  ];

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} onUpdateCompanyName={handleUpdateCompanyName} lang={state.language} />;
      case 'attendance':
        return <AttendanceInput employees={state.employees} attendance={state.attendance} onMarkAttendance={handleMarkAttendance} lang={state.language} />;
      case 'reports':
        return <Reports employees={state.employees} attendance={state.attendance} lang={state.language} />;
      case 'employees':
        return <EmployeeList 
                  employees={state.employees} 
                  onAddEmployee={handleAddEmployee} 
                  onUpdateEmployee={handleUpdateEmployee}
                  onRemoveEmployee={handleRemoveEmployee} 
                  lang={state.language} 
                />;
      case 'transactions':
        return <Transactions 
                  employees={state.employees} 
                  transactions={state.transactions} 
                  onAddTransaction={handleAddTransaction} 
                  onUpdateTransaction={handleUpdateTransaction}
                  onRemoveTransaction={handleRemoveTransaction} 
                  lang={state.language} 
                />;
      case 'accounts':
        return <Accounts employees={state.employees} attendance={state.attendance} transactions={state.transactions} lang={state.language} />;
      case 'aiStudio':
        return <ImageEditor lang={state.language} />;
      case 'profile':
        return <Profile state={state} toggleDarkMode={toggleDarkMode} toggleLanguage={toggleLanguage} onUpdateCompany={handleUpdateCompany} />;
      default:
        return <Dashboard state={state} onUpdateCompanyName={handleUpdateCompanyName} lang={state.language} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Hazira Pro
              </span>
            </div>
            <button className="lg:hidden text-gray-500" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-blue-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <img src={state.company.ownerPhoto} alt="User" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{state.company.ownerName}</p>
                <p className="text-xs text-gray-500 truncate">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-gray-800 dark:text-white">
            {navItems.find(i => i.id === activeTab)?.label || t.dashboard}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;