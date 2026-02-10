import React, { useState } from 'react';
import { Employee, TRANSLATIONS } from '../types';
import { UserPlus, Trash2, Search, Phone, MapPin, DollarSign } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onRemoveEmployee: (id: string) => void;
  lang: 'en' | 'bn';
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onAddEmployee, onRemoveEmployee, lang }) => {
  const t = TRANSLATIONS[lang];
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [salary, setSalary] = useState('');

  const generateId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      id: generateId(),
      name,
      address,
      mobile,
      salary: Number(salary) || 0,
    };
    onAddEmployee(newEmployee);
    setName('');
    setAddress('');
    setMobile('');
    setSalary('');
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
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
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto px-6 py-2 bg-secondary hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {t.addEmployee}
            </button>
         </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-primary/20 animate-fade-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.name}</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Rahim Uddin" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.mobile}</label>
              <input required value={mobile} onChange={e => setMobile(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="017..." />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.address}</label>
              <input required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Dhaka, Bangladesh" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.salary} (Monthly)</label>
              <input required type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="15000" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition relative group">
            <button 
              onClick={() => onRemoveEmployee(emp.id)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {emp.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{emp.name}</h3>
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">ID: {emp.id}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
               <div className="flex items-center gap-2">
                 <Phone size={14} />
                 {emp.mobile}
               </div>
               <div className="flex items-center gap-2">
                 <MapPin size={14} />
                 {emp.address}
               </div>
               <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                 <DollarSign size={14} />
                 {lang === 'en' ? '৳' : '৳'}{emp.salary.toLocaleString()} / Month
               </div>
            </div>
          </div>
        ))}
        
        {employees.length === 0 && !showForm && !searchQuery && (
           <div className="col-span-full py-12 text-center text-gray-400">
             No employees yet. Click "Add Employee" to start.
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