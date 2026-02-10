import React, { useState } from 'react';
import { Employee, AttendanceRecord, TRANSLATIONS } from '../types';
import { DollarSign, Printer, Calculator } from 'lucide-react';

interface AccountsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  lang: 'en' | 'bn';
}

const Accounts: React.FC<AccountsProps> = ({ employees, attendance, lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedEmp, setSelectedEmp] = useState<string>(employees[0]?.id || '');

  const calculateStats = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return null;

    const empRecords = attendance.filter(a => a.employeeId === empId);
    
    // Simplistic Calculation Logic
    const dailyRate = emp.salary / 30;
    
    // Count days (In real app, filter by current month/week)
    const presentDays = empRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const leaveDays = empRecords.filter(r => r.status === 'Leave').length; // Assuming paid leave
    
    const payableDays = presentDays + leaveDays;
    const earnedTotal = Math.round(payableDays * dailyRate);

    // Mock weekly/monthly for demo using the total available data
    const weeklyEarned = Math.round(Math.min(payableDays, 7) * dailyRate); 
    const dailyIncome = Math.round(dailyRate);

    return {
      dailyIncome,
      weeklyEarned, // This is just a simulation based on logic
      totalEarned: earnedTotal,
      presentDays,
      leaveDays,
      salary: emp.salary,
      name: emp.name,
      id: emp.id
    };
  };

  const stats = selectedEmp ? calculateStats(selectedEmp) : null;

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <Calculator className="text-primary" />
           {t.accounts}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
           <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">Select Employee</h3>
           <div className="space-y-2 max-h-[400px] overflow-y-auto">
             {employees.map(emp => (
               <button
                 key={emp.id}
                 onClick={() => setSelectedEmp(emp.id)}
                 className={`w-full text-left p-3 rounded-lg transition flex items-center justify-between ${selectedEmp === emp.id ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
               >
                 <span className="font-medium">{emp.name}</span>
                 <span className="text-xs opacity-70">#{emp.id}</span>
               </button>
             ))}
           </div>
        </div>

        {/* Details & Pay Slip */}
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              {/* Income Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <p className="text-sm text-blue-600 dark:text-blue-300">{t.dailyIncome}</p>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-100">৳{stats.dailyIncome}</h4>
                 </div>
                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                    <p className="text-sm text-purple-600 dark:text-purple-300">{t.weeklyIncome} (Est)</p>
                    <h4 className="text-xl font-bold text-purple-800 dark:text-purple-100">৳{stats.weeklyEarned}</h4>
                 </div>
                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <p className="text-sm text-green-600 dark:text-green-300">Total Earned (To Date)</p>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-100">৳{stats.totalEarned}</h4>
                 </div>
              </div>

              {/* Pay Slip View */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" id="payslip">
                 <div className="border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-6 mb-6">
                   <div className="flex justify-between items-start">
                     <div>
                       <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Pay Slip</h1>
                       <p className="text-sm text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                       <h2 className="font-bold text-lg text-gray-800 dark:text-white">Hazira Pro System</h2>
                       <p className="text-xs text-gray-500">Dhaka, Bangladesh</p>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 mb-8">
                   <div>
                     <p className="text-xs text-gray-400 uppercase font-semibold">Employee Details</p>
                     <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">{stats.name}</p>
                     <p className="text-sm text-gray-600 dark:text-gray-400">ID: {stats.id}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-400 uppercase font-semibold">Payment Period</p>
                     <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">Current Month</p>
                   </div>
                 </div>

                 <table className="w-full mb-8">
                   <thead>
                     <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm text-gray-500 dark:text-gray-300">
                       <th className="p-3 rounded-l-lg">Description</th>
                       <th className="p-3 text-right">Days</th>
                       <th className="p-3 rounded-r-lg text-right">Amount</th>
                     </tr>
                   </thead>
                   <tbody className="text-gray-700 dark:text-gray-300">
                     <tr className="border-b border-gray-100 dark:border-gray-700">
                       <td className="p-3">Basic Salary (Monthly)</td>
                       <td className="p-3 text-right">30</td>
                       <td className="p-3 text-right">৳{stats.salary}</td>
                     </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                       <td className="p-3">Attendance Earnings (Pro-rata)</td>
                       <td className="p-3 text-right">{stats.presentDays + stats.leaveDays}</td>
                       <td className="p-3 text-right font-bold">৳{stats.totalEarned}</td>
                     </tr>
                   </tbody>
                 </table>

                 <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500">
                      * System generated slip
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Net Payable</p>
                      <p className="text-3xl font-bold text-primary">৳{stats.totalEarned}</p>
                    </div>
                 </div>

                 <div className="mt-8 flex justify-end print:hidden">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition">
                       <Printer size={16} /> Print Slip
                    </button>
                 </div>
              </div>
            </>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
               Select an employee to view details.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;