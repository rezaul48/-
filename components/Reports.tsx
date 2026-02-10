import React from 'react';
import { Employee, AttendanceRecord, TRANSLATIONS } from '../types';
import { FileText, Download } from 'lucide-react';

interface ReportsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  lang: 'en' | 'bn';
}

const Reports: React.FC<ReportsProps> = ({ employees, attendance, lang }) => {
  const t = TRANSLATIONS[lang];

  // Flatten and sort data
  // Show all records, sorted by date (desc)
  const sortedRecords = [...attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    const headers = ['Date', 'Employee Name', 'ID', 'Status', 'Check In Time'];
    const rows = sortedRecords.map(record => {
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
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <FileText className="text-primary" />
           {t.reports}
        </h2>
        <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-md font-medium"
        >
            <Download size={18} />
            {t.downloadReport}
        </button>
      </div>

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
              {sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No attendance records found.</td>
                </tr>
              ) : (
                sortedRecords.map((record) => {
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