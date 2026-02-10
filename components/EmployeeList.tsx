import React, { useState } from 'react';
import { Employee, TRANSLATIONS } from '../types';
import { UserPlus, Trash2, Search, Phone, MapPin, DollarSign, AlertTriangle, X, Fingerprint, Edit2, Camera, Upload } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (originalId: string, emp: Employee) => void;
  onRemoveEmployee: (id: string) => void;
  lang: 'en' | 'bn';
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onAddEmployee, onUpdateEmployee, onRemoveEmployee, lang }) => {
  const t = TRANSLATIONS[lang];
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  
  // Form State
  const [customId, setCustomId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [salary, setSalary] = useState('');
  const [avatar, setAvatar] = useState<string>('');

  const generateId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setMobile('');
    setSalary('');
    setCustomId('');
    setAvatar('');
    setEditingEmployeeId(null);
    setShowForm(false);
  };

  const handleToggleForm = () => {
    if (!showForm) {
      // Opening form in "Add" mode
      setEditingEmployeeId(null);
      setCustomId(generateId());
      setName('');
      setAddress('');
      setMobile('');
      setSalary('');
      setAvatar('');
    }
    setShowForm(!showForm);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setCustomId(emp.id);
    setName(emp.name);
    setAddress(emp.address);
    setMobile(emp.mobile);
    setSalary(emp.salary.toString());
    setAvatar(emp.avatar || '');
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if ID already exists (excluding the current employee if we are editing)
    if (employees.some(e => e.id === customId && e.id !== editingEmployeeId)) {
        alert(lang === 'bn' ? 'এই আইডি ইতিমধ্যে ব্যবহৃত হয়েছে!' : 'This ID is already in use!');
        return;
    }

    const newEmployee: Employee = {
      id: customId || generateId(),
      name,
      address,
      mobile,
      salary: Number(salary) || 0,
      avatar: avatar || undefined
    };

    if (editingEmployeeId) {
      onUpdateEmployee(editingEmployeeId, newEmployee);
    } else {
      onAddEmployee(newEmployee);
    }
    
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      onRemoveEmployee(employeeToDelete);
      setEmployeeToDelete(null);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.confirmDeleteTitle}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t.confirmDeleteMessage}</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setEmployeeToDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
         <div className="flex items-center gap-2 w-full md:w-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <UserPlus className="text-primary" />
              {t.employees}
            </h2>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder={lang === 'bn' ? "নাম বা আইডি দিয়ে খুঁজুন..." : "Search by Name or ID..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
                />
            </div>
            
            <button 
              onClick={handleToggleForm}
              className="w-full sm:w-auto px-6 py-2 bg-secondary hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {t.addEmployee}
            </button>
         </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-primary/20 animate-fade-in relative">
          <button 
             onClick={resetForm} 
             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
             <X size={20} />
          </button>
          <div className="mb-6">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
               {editingEmployeeId ? <Edit2 size={20} className="text-primary"/> : <UserPlus size={20} className="text-secondary"/>}
               {editingEmployeeId ? t.updateEmployee : t.addEmployee}
             </h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Photo Upload Section */}
                <div className="flex flex-col items-center gap-3">
                   <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-sm flex items-center justify-center overflow-hidden group">
                      {avatar ? (
                        <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={40} className="text-gray-300 dark:text-gray-500" />
                      )}
                      
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Upload className="text-white" size={24} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                   </div>
                   
                   {avatar && (
                     <button 
                        type="button" 
                        onClick={() => setAvatar('')} 
                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                     >
                       <X size={12} /> {t.removePhoto}
                     </button>
                   )}
                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.photo}</span>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.name}</label>
                      <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white" placeholder="e.g. Rahim Uddin" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.id || 'ID'}</label>
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            required 
                            value={customId} 
                            onChange={e => setCustomId(e.target.value)} 
                            className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white font-mono" 
                            placeholder="1001" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.mobile}</label>
                      <input required value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white" placeholder="017..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.address}</label>
                      <input required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white" placeholder="Dhaka, Bangladesh" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.salary} (Monthly)</label>
                      <input required type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white" placeholder="15000" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 font-medium">{t.cancel}</button>
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition font-medium">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(emp)}
                  className="text-gray-300 hover:text-primary transition p-1"
                  title={t.edit}
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => setEmployeeToDelete(emp.id)}
                  className="text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition p-1"
                  title={t.delete}
                >
                  <Trash2 size={18} />
                </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {emp.avatar ? (
                <img 
                  src={emp.avatar} 
                  alt={emp.name} 
                  className="w-12 h-12 rounded-full object-cover shadow-lg shadow-blue-500/20 border-2 border-white dark:border-gray-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-blue-500/20 shadow-lg">
                  {emp.name.charAt(0)}
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{emp.name}</h3>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400">ID: {emp.id}</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
               <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Phone size={14} />
                 </div>
                 {emp.mobile}
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                   <MapPin size={14} />
                 </div>
                 {emp.address}
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                   <DollarSign size={14} />
                 </div>
                 <span className="font-semibold text-gray-900 dark:text-white">
                    {lang === 'en' ? '৳' : '৳'}{emp.salary.toLocaleString()}
                 </span>
                 <span className="text-xs text-gray-400">/ Month</span>
               </div>
            </div>
          </div>
        ))}
        
        {employees.length === 0 && !showForm && !searchQuery && (
           <div className="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
             <UserPlus size={48} className="mx-auto mb-4 opacity-20" />
             <p>No employees yet. Click "Add Employee" to start.</p>
           </div>
        )}

        {employees.length > 0 && filteredEmployees.length === 0 && (
           <div className="col-span-full py-12 text-center text-gray-400">
             No employees found matching "{searchQuery}".
           </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;