import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, TRANSLATIONS } from '../types';
import { Calendar, User } from 'lucide-react';

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
    const newRecords: AttendanceRecord[] = employees.map((emp): AttendanceRecord | null => {
      // Determine Status: Changed > Existing > Default (null, effectively handled by not saving if not set)
      const currentStatus = statusChanges[emp.id] || getInitialStatus(emp.id);
      
      // Determine Overtime: Changed > Existing > 0
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
             className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
           />
           <button 
             onClick={handleSave}
             className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30"
           >
             {t.save}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            No employees found. Add some from the Employee List.
          </div>
        ) : (
          employees.map((emp) => {
            const currentStatus = getStatus(emp.id);
            const currentOT = getOvertime(emp.id);
            const isAbsentOrLeave = currentStatus === 'Absent' || currentStatus === 'Leave';

            return (
              <div key={emp.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
                {/* Top Line: Name and ID */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                   <div className="flex items-center gap-3">
                      {emp.avatar ? (
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                           {emp.name.substring(0,2).toUpperCase()}
                        </div>
                      )}
                      
                      <div>
                         <h3 className="font-bold text-gray-800 dark:text-white text-lg">{emp.name}</h3>
                         <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                           <User size={12} />
                           ID: {emp.id}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      {/* Placeholder for status badge if needed, currently empty to keep clean */}
                   </div>
                </div>

                {/* Second Line: Attendance Options & Overtime */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                   
                   {/* Status Buttons */}
                   <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
                      <SelectionButton 
                        label="P" 
                        fullLabel="Present"
                        selected={currentStatus === 'Present'} 
                        onClick={() => handleStatusChange(emp.id, 'Present')}
                        baseColor="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        activeColor="bg-green-500 text-white border-green-600 shadow-green-500/30"
                      />
                      <SelectionButton 
                        label="A"
                        fullLabel="Absent" 
                        selected={currentStatus === 'Absent'} 
                        onClick={() => {
                          handleStatusChange(emp.id, 'Absent');
                          handleOvertimeChange(emp.id, '0');
                        }}
                        baseColor="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                        activeColor="bg-red-500 text-white border-red-600 shadow-red-500/30"
                      />
                      <SelectionButton 
                        label="L"
                        fullLabel="Leave" 
                        selected={currentStatus === 'Leave'} 
                        onClick={() => {
                          handleStatusChange(emp.id, 'Leave');
                          handleOvertimeChange(emp.id, '0');
                        }}
                        baseColor="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                        activeColor="bg-yellow-500 text-white border-yellow-600 shadow-yellow-500/30"
                      />
                      <SelectionButton 
                        label="Lt" 
                        fullLabel="Late"
                        selected={currentStatus === 'Late'} 
                        onClick={() => handleStatusChange(emp.id, 'Late')}
                        baseColor="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                        activeColor="bg-orange-500 text-white border-orange-600 shadow-orange-500/30"
                      />
                   </div>

                   {/* Overtime Input */}
                   <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors w-full sm:w-auto justify-center sm:justify-end ${isAbsentOrLeave ? 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-50' : 'bg-white border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'}`}>
                       <span className="text-xs font-bold text-gray-500 uppercase px-2">{t.overtimeHours}</span>
                       <input 
                            type="number" 
                            min="0"
                            max="24"
                            disabled={isAbsentOrLeave}
                            value={currentOT === 0 ? '' : currentOT}
                            onChange={(e) => handleOvertimeChange(emp.id, e.target.value)}
                            placeholder="0"
                            className="w-16 p-2 text-center rounded bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary outline-none font-bold text-gray-800 dark:text-white"
                        />
                   </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

interface SelectionButtonProps {
  label: string;
  fullLabel: string;
  selected: boolean;
  onClick: () => void;
  baseColor: string;
  activeColor: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({ label, fullLabel, selected, onClick, baseColor, activeColor }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 sm:flex-none min-w-[60px] py-2 px-4 rounded-lg border font-bold text-sm transition-all duration-200
      flex flex-col items-center justify-center gap-0.5
      ${selected ? activeColor : baseColor}
      ${selected ? 'shadow-md transform scale-105' : 'hover:scale-[1.02]'}
    `}
  >
    <span className="text-lg leading-none">{label}</span>
    <span className="text-[10px] font-normal opacity-90">{fullLabel}</span>
  </button>
);

export default AttendanceInput;