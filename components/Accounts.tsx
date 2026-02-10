import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, TRANSLATIONS } from '../types';
import { DollarSign, Printer, Calculator, Clock, Download, Loader2, Calendar, Search, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AccountsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  lang: 'en' | 'bn';
}

const Accounts: React.FC<AccountsProps> = ({ employees, attendance, lang }) => {
  const t = TRANSLATIONS[lang];
  
  // Date State - Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedEmp, setSelectedEmp] = useState<string>(employees[0]?.id || '');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Filter Employees List based on Search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.id.includes(searchQuery)
    );
  }, [employees, searchQuery]);

  const calculateStats = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return null;

    // Filter attendance by Date Range AND Employee ID
    const empRecords = attendance.filter(a => {
        return a.employeeId === empId && 
               a.date >= startDate && 
               a.date <= endDate;
    });
    
    // Calculation Logic
    const dailyRate = emp.salary / 30;
    const hourlyRate = dailyRate / 8; // Assuming 8 hour work day
    
    // Count days
    const presentDays = empRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const leaveDays = empRecords.filter(r => r.status === 'Leave').length; // Assuming paid leave
    
    // Calculate Overtime
    const totalOvertimeHours = empRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
    const overtimePay = Math.round(totalOvertimeHours * hourlyRate);

    const payableDays = presentDays + leaveDays;
    const baseEarned = Math.round(payableDays * dailyRate);
    const totalEarned = baseEarned + overtimePay;

    // Mock weekly/monthly for demo using the total available data
    const weeklyEarned = Math.round(Math.min(payableDays, 7) * dailyRate) + Math.round((totalOvertimeHours / 4) * hourlyRate); 
    const dailyIncome = Math.round(dailyRate);

    return {
      dailyIncome,
      weeklyEarned,
      baseEarned,
      overtimePay,
      totalEarned,
      presentDays,
      leaveDays,
      totalOvertimeHours,
      salary: emp.salary,
      name: emp.name,
      id: emp.id,
      avatar: emp.avatar
    };
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('payslip');
    if (!element || !stats) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Handle cross-origin images like avatars
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Payslip_${stats.name.replace(/\s+/g, '_')}_${startDate}_to_${endDate}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const stats = selectedEmp ? calculateStats(selectedEmp) : null;

  return (
    <div className="space-y-6">
       {/* Header & Filter Controls */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Calculator className="text-primary" />
              {t.accounts}
            </h2>
         </div>
         
         {/* Filter Inputs */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
             {/* From Date */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">{t.fromDate}</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                   <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>
             </div>

             {/* To Date */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">{t.toDate}</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                   <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>
             </div>
             
             {/* Employee Search */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Find Employee</label>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                   <input 
                      type="text" 
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
           <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Filter size={18} />
              Employee List
           </h3>
           <div className="space-y-2 overflow-y-auto flex-1 pr-2">
             {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                 <button
                   key={emp.id}
                   onClick={() => setSelectedEmp(emp.id)}
                   className={`w-full text-left p-3 rounded-lg transition flex items-center gap-3 ${selectedEmp === emp.id ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30'}`}
                 >
                   {emp.avatar ? (
                     <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                   ) : (
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedEmp === emp.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                       {emp.name.substring(0,2).toUpperCase()}
                     </div>
                   )}
                   <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{emp.name}</p>
                      <p className="text-xs opacity-70">#{emp.id}</p>
                   </div>
                 </button>
               ))
             ) : (
               <div className="text-center py-8 text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-30"/>
                  <p>No matches found</p>
               </div>
             )}
           </div>
        </div>

        {/* Details & Pay Slip */}
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              {/* Income Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <p className="text-sm text-blue-600 dark:text-blue-300">{t.dailyIncome}</p>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-100">৳{stats.dailyIncome}</h4>
                 </div>
                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                    <p className="text-sm text-purple-600 dark:text-purple-300">Days Present</p>
                    <h4 className="text-xl font-bold text-purple-800 dark:text-purple-100">{stats.presentDays + stats.leaveDays} Days</h4>
                 </div>
                 <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                    <p className="text-sm text-orange-600 dark:text-orange-300">{t.totalOvertime}</p>
                    <h4 className="text-xl font-bold text-orange-800 dark:text-orange-100">{stats.totalOvertimeHours} Hrs</h4>
                 </div>
                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                    <p className="text-sm text-green-600 dark:text-green-300">Net Payable</p>
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

                 <div className="flex gap-6 mb-8 items-start">
                   {stats.avatar && (
                     <img 
                        src={stats.avatar} 
                        alt="Employee" 
                        className="w-20 h-20 rounded-md object-cover border-2 border-gray-200 dark:border-gray-600"
                     />
                   )}
                   <div className="flex-1 grid grid-cols-2 gap-8">
                     <div>
                       <p className="text-xs text-gray-400 uppercase font-semibold">Employee Details</p>
                       <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">{stats.name}</p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">ID: {stats.id}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-gray-400 uppercase font-semibold">{t.paymentPeriod}</p>
                       <p className="font-bold text-lg text-gray-800 dark:text-white mt-1">{startDate} <span className="text-sm text-gray-400">to</span> {endDate}</p>
                     </div>
                   </div>
                 </div>

                 <table className="w-full mb-8">
                   <thead>
                     <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm text-gray-500 dark:text-gray-300">
                       <th className="p-3 rounded-l-lg">Description</th>
                       <th className="p-3 text-right">Qty/Days</th>
                       <th className="p-3 rounded-r-lg text-right">Amount</th>
                     </tr>
                   </thead>
                   <tbody className="text-gray-700 dark:text-gray-300">
                     <tr className="border-b border-gray-100 dark:border-gray-700">
                       <td className="p-3">Basic Salary (Monthly Config)</td>
                       <td className="p-3 text-right">30 Days</td>
                       <td className="p-3 text-right">৳{stats.salary}</td>
                     </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                       <td className="p-3">Earned Salary (Attendance Based)</td>
                       <td className="p-3 text-right">{stats.presentDays + stats.leaveDays} Days</td>
                       <td className="p-3 text-right">৳{stats.baseEarned}</td>
                     </tr>
                     <tr className="border-b border-gray-100 dark:border-gray-700 bg-orange-50/50 dark:bg-orange-900/10">
                       <td className="p-3 flex items-center gap-2">
                           <Clock size={14} className="text-orange-500"/> 
                           {t.overtime}
                       </td>
                       <td className="p-3 text-right">{stats.totalOvertimeHours} Hrs</td>
                       <td className="p-3 text-right font-medium text-orange-600 dark:text-orange-400">+ ৳{stats.overtimePay}</td>
                     </tr>
                   </tbody>
                 </table>

                 <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500">
                      * System generated slip based on filtered date range.
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Net Payable</p>
                      <p className="text-3xl font-bold text-primary">৳{stats.totalEarned}</p>
                    </div>
                 </div>

                 {/* Action Buttons - Hidden in PDF via data-html2canvas-ignore */}
                 <div className="mt-8 flex justify-end gap-3 print:hidden" data-html2canvas-ignore>
                    <button 
                      onClick={handleDownloadPDF} 
                      disabled={isGeneratingPdf}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                       {isGeneratingPdf ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
                       {t.downloadPDF}
                    </button>
                    <button 
                      onClick={() => window.print()} 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
                    >
                       <Printer size={16} /> Print Slip
                    </button>
                 </div>
              </div>
            </>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12">
               <div className="text-center">
                 <Calculator size={48} className="mx-auto mb-4 opacity-20"/>
                 <p>Select an employee from the list to view pay slip.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;