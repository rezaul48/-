import React, { useState } from 'react';
import { Employee, AttendanceRecord, TRANSLATIONS } from '../types';
import { FileText, Download, Search, Calendar, Filter } from 'lucide-react';

interface ReportsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  lang: 'en' | 'bn';
}

const Reports: React.FC<ReportsProps> = ({ employees, attendance, lang }) => {
  const t = TRANSLATIONS[lang];
  
  // State for filtering
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchName, setSearchName] = useState('');
  const [searchID, setSearchID] = useState('');

  // Filter Logic
  const filteredRecords = attendance.filter(record => {
    const emp = employees.find(e => e.id === record.employeeId);
    
    // 1. Filter by Date (Exact match)
    const matchesDate = record.date === selectedDate;

    // 2. Filter by Name (Partial match, case insensitive)
    const matchesName = emp 
      ? emp.name.toLowerCase().includes(searchName.toLowerCase())
      : false;

    // 3. Filter by ID (Partial match)
    const matchesID = record.employeeId.includes(searchID);

    return matchesDate && matchesName && matchesID;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Absent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Late': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to download.");
      return;
    }

    const headers = ['Date', 'Employee Name', 'ID', 'Status', 'Check In Time'];
    const rows = filteredRecords.map(record => {
      const emp = employees.find(e => e.id === record.employeeId);
      // Escape values to ensure CSV format doesn't break
      const safeVal = (val: string) => `"${val.replace(/"/g, '""')}"`;
      
      return [
        safeVal(record.date),
        safeVal(emp ? emp.name : 'Unknown Employee'),
        safeVal(record.employeeId),
        safeVal(record.status),
        safeVal(record.checkInTime || '-')
      ].join(',');
    });

    // Add BOM for Excel UTF-8 compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hazira_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Download Button */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <FileText className="text-primary" />
           {t.reports}
        </h2>
        <button 
            onClick={handleDownloadCSV}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition shadow-md font-medium ${filteredRecords.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={filteredRecords.length === 0}
        >
            <Download size={18} />
            {t.downloadReport}
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
          />
        </div>

        {/* Name Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t.searchByName}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
          />
        </div>

        {/* ID Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t.searchByID}
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:outline-none text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Employee</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Check In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p>{t.noRecords}</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const emp = employees.find(e => e.id === record.employeeId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                        {record.date}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {emp ? emp.name : 'Unknown Employee'}
                      </td>
                      <td className="p-4 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {record.employeeId}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                        {record.checkInTime || '-'}
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

export default Reports;