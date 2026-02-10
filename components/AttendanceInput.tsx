import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, TRANSLATIONS } from '../types';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface AttendanceInputProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (records: AttendanceRecord[]) => void;
  lang: 'en' | 'bn';
}

const AttendanceInput: React.FC<AttendanceInputProps> = ({ employees, attendance, onMarkAttendance, lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Helper to get existing record
  const getExistingRecord = (empId: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === selectedDate);
  };

  const getInitialStatus = (empId: string): AttendanceStatus | null => {
    const record = getExistingRecord(empId);
    return record ? record.status : null;
  };

  const getInitialOvertime = (empId: string): number => {
    const record = getExistingRecord(empId);
    return record?.overtimeHours || 0;
  };

  const [statusChanges, setStatusChanges] = useState<Record<string, AttendanceStatus>>({});
  const [overtimeChanges, setOvertimeChanges] = useState<Record<string, number>>({});

  const handleStatusChange = (empId: string, status: AttendanceStatus) => {
    setStatusChanges(prev => ({ ...prev, [empId]: status }));
  };

  const handleOvertimeChange = (empId: string, hours: string) => {
    const numHours = parseFloat(hours);
    if (!isNaN(numHours) && numHours >= 0) {
      setOvertimeChanges(prev => ({ ...prev, [empId]: numHours }));
    } else if (hours === '') {
       setOvertimeChanges(prev => ({ ...prev, [empId]: 0 }));
    }
  };

  const handleSave = () => {
    // Merge changes with existing data or defaults
    const newRecords: AttendanceRecord[] = employees.map(emp => {
      // Determine Status: Changed > Existing > Default (null, effectively handled by not saving if not set)
      const currentStatus = statusChanges[emp.id] || getInitialStatus(emp.id);
      
      // Determine Overtime: Changed > Existing > 0
      // Note: We use 'undefined' check for changes because 0 is a valid value
      const currentOvertime = overtimeChanges[emp.id] !== undefined 
        ? overtimeChanges[emp.id] 
        : getInitialOvertime(emp.id);

      if (!currentStatus) return null; // Skip if no status set

      return {
        id: `${selectedDate}-${emp.id}`,
        employeeId: emp.id,
        date: selectedDate,
        status: currentStatus,
        checkInTime: new Date().toLocaleTimeString(),
        overtimeHours: currentOvertime
      };
    }).filter((r): r is AttendanceRecord => r !== null);
    
    onMarkAttendance(newRecords);
    alert("Attendance & Overtime Saved!");
    setStatusChanges({});
    setOvertimeChanges({});
  };

  const getStatus = (empId: string) => statusChanges[empId] || getInitialStatus(empId);
  const getOvertime = (empId: string) => overtimeChanges[empId] !== undefined ? overtimeChanges[empId] : getInitialOvertime(empId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <Calendar className="text-primary" /> 
           {t.attendance}
        </h2>
        <div className="flex items-center gap-4">
           <input 
             type="date" 
             value={selectedDate} 
             onChange={(e) => {
                setSelectedDate(e.target.value);
                setStatusChanges({});
                setOvertimeChanges({});
             }}
             className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
           />
           <button 
             onClick={handleSave}
             className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30"
           >
             {t.save}
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">SL</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Present</th>
                <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Absent</th>
                <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Leave</th>
                <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Late</th>
                <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">{t.overtimeHours}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.length === 0 ? (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">No employees found. Add some from the Employee List.</td>
                </tr>
              ) : (
                employees.map((emp, index) => {
                const currentStatus = getStatus(emp.id);
                const currentOT = getOvertime(emp.id);
                const isAbsentOrLeave = currentStatus === 'Absent' || currentStatus === 'Leave';

                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="p-4 text-gray-600 dark:text-gray-400">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                           {emp.name.substring(0,2).toUpperCase()}
                        </div>
                        {emp.name}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-500 dark:text-gray-400">#{emp.id}</td>
                    
                    {/* Status Radio Buttons */}
                    <td className="p-4 text-center">
                      <StatusRadio 
                        name={`status-${emp.id}`} 
                        checked={currentStatus === 'Present'} 
                        onChange={() => handleStatusChange(emp.id, 'Present')} 
                        color="text-green-500"
                        bg="bg-green-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                       <StatusRadio 
                        name={`status-${emp.id}`} 
                        checked={currentStatus === 'Absent'} 
                        onChange={() => {
                          handleStatusChange(emp.id, 'Absent');
                          handleOvertimeChange(emp.id, '0'); // Reset OT if absent
                        }} 
                         color="text-red-500"
                         bg="bg-red-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                       <StatusRadio 
                        name={`status-${emp.id}`} 
                        checked={currentStatus === 'Leave'} 
                        onChange={() => {
                          handleStatusChange(emp.id, 'Leave');
                          handleOvertimeChange(emp.id, '0'); // Reset OT if on leave
                        }} 
                         color="text-yellow-500"
                         bg="bg-yellow-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                       <StatusRadio 
                        name={`status-${emp.id}`} 
                        checked={currentStatus === 'Late'} 
                        onChange={() => handleStatusChange(emp.id, 'Late')} 
                         color="text-orange-500"
                         bg="bg-orange-500"
                      />
                    </td>
                    
                    {/* Overtime Input */}
                    <td className="p-4 text-center">
                        <input 
                            type="number" 
                            min="0"
                            max="24"
                            disabled={isAbsentOrLeave}
                            value={currentOT}
                            onChange={(e) => handleOvertimeChange(emp.id, e.target.value)}
                            className={`w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-primary outline-none transition
                              ${isAbsentOrLeave 
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed' 
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                              }
                            `}
                        />
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusRadio = ({ name, checked, onChange, color, bg }: any) => (
  <label className="inline-flex items-center cursor-pointer">
    <input 
      type="radio" 
      name={name} 
      checked={checked} 
      onChange={onChange}
      className="hidden"
    />
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? `border-${color.split('-')[1]}-500` : 'border-gray-300 dark:border-gray-600'}`}>
      {checked && <div className={`w-3 h-3 rounded-full ${bg}`} />}
    </div>
  </label>
);

export default AttendanceInput;