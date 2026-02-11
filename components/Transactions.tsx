import React, { useState } from 'react';
import { Employee, Transaction, TransactionType, TRANSLATIONS } from '../types';
import { Banknote, Plus, Trash2, Search, Calendar, Edit2, X, AlertTriangle } from 'lucide-react';

interface TransactionsProps {
  employees: Employee[];
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (id: string, tx: Transaction) => void;
  onRemoveTransaction: (id: string) => void;
  lang: 'en' | 'bn';
}

const Transactions: React.FC<TransactionsProps> = ({ employees, transactions, onAddTransaction, onUpdateTransaction, onRemoveTransaction, lang }) => {
  const t = TRANSLATIONS[lang];
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  
  // Form State
  const [empId, setEmpId] = useState(employees[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('Advance');
  const [note, setNote] = useState('');

  const resetForm = () => {
    setEmpId(employees[0]?.id || '');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('Advance');
    setNote('');
    setEditingTxId(null);
    setShowForm(false);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setEmpId(tx.employeeId);
    setAmount(tx.amount.toString());
    setDate(tx.date);
    setType(tx.type);
    setNote(tx.note);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      onRemoveTransaction(txToDelete);
      setTxToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !amount) return;

    const transactionData: Transaction = {
      id: editingTxId || Date.now().toString(),
      employeeId: empId,
      amount: Number(amount),
      date,
      type,
      note
    };

    if (editingTxId) {
      onUpdateTransaction(editingTxId, transactionData);
    } else {
      onAddTransaction(transactionData);
    }
    
    resetForm();
  };

  const filteredTx = transactions.filter(tx => {
    const emp = employees.find(e => e.id === tx.employeeId);
    const search = searchQuery.toLowerCase();
    return emp?.name.toLowerCase().includes(search) || tx.employeeId.includes(search) || tx.note.toLowerCase().includes(search);
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Delete Confirmation Modal */}
      {txToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.confirmDeleteTxTitle}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t.confirmDeleteTxMessage}</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setTxToDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg shadow-red-500/20"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <Banknote className="text-primary" />
           {t.transactions}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder={t.searchPlaceholder}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
             />
          </div>
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> {t.addTransaction}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-primary/20 animate-fade-in relative">
          <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
          <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">
            {editingTxId ? (lang === 'bn' ? 'লেনদেন এডিট করুন' : 'Edit Transaction') : t.addTransaction}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.name}</label>
              <select 
                value={empId} 
                onChange={e => setEmpId(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              >
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.amount} (৳)</label>
              <input 
                required 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.date}</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.type}</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as TransactionType)}
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Advance">{t.advance}</option>
                <option value="Salary">{t.salary}</option>
                <option value="Bonus">{t.bonus}</option>
                <option value="Others">{t.others}</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.note}</label>
              <input 
                type="text" 
                value={note} 
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. For medical emergency"
                className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="lg:col-span-3 flex justify-end gap-3 mt-2">
               <button type="button" onClick={resetForm} className="px-6 py-2 text-gray-500 font-medium">{t.cancel}</button>
               <button type="submit" className="px-8 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition shadow-md">
                 {editingTxId ? (lang === 'bn' ? 'আপডেট করুন' : 'Update') : t.save}
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50 border-b dark:border-gray-700 text-xs uppercase text-gray-500 font-bold">
                <th className="p-4">{t.date}</th>
                <th className="p-4">{t.name}</th>
                <th className="p-4">{t.type}</th>
                <th className="p-4">{t.amount}</th>
                <th className="p-4">{t.note}</th>
                <th className="p-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                     <Banknote size={48} className="mx-auto mb-4 opacity-10" />
                     <p>No transactions found.</p>
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  const emp = employees.find(e => e.id === tx.employeeId);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
                         <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-primary" />
                           {tx.date}
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                           {emp?.avatar ? (
                             <img src={emp.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                           ) : (
                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 flex items-center justify-center text-xs font-bold">
                               {emp?.name.charAt(0)}
                             </div>
                           )}
                           <div>
                             <p className="font-bold text-gray-800 dark:text-white text-sm">{emp?.name || 'Unknown'}</p>
                             <p className="text-xs text-gray-400">ID: {tx.employeeId}</p>
                           </div>
                         </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          tx.type === 'Advance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          tx.type === 'Salary' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-800 dark:text-white">
                         ৳{tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                         {tx.note || '-'}
                      </td>
                      <td className="p-4 text-center">
                         <div className="flex justify-center gap-2">
                           <button 
                             onClick={() => handleEdit(tx)}
                             className="text-gray-300 hover:text-primary transition p-1.5 rounded-lg hover:bg-primary/10"
                             title={t.edit}
                           >
                             <Edit2 size={18} />
                           </button>
                           <button 
                             onClick={() => setTxToDelete(tx.id)}
                             className="text-gray-300 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-500/10"
                             title={t.delete}
                           >
                             <Trash2 size={18} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;