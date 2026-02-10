import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AppState, TRANSLATIONS, AttendanceRecord, Employee } from '../types';
import { Clock, Users, UserCheck, UserX, CalendarOff, DollarSign, Edit2, Check } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onUpdateCompanyName: (name: string) => void;
  lang: 'en' | 'bn';
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdateCompanyName, lang }) => {
  const t = TRANSLATIONS[lang];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.company.name);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = state.attendance.filter(a => a.date === todayStr);

  const totalEmployees = state.employees.length;
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const absentCount = todayAttendance.filter(a => a.status === 'Absent').length;
  const leaveCount = todayAttendance.filter(a => a.status === 'Leave').length;
  // Assuming "Late" is technically present but marked differently. 
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  
  // Total effectively present for salary calculation stats
  const totalPresentEffectively = presentCount + lateCount; 
  
  // Estimate daily salary expense for *today* based on attendance
  // Simple logic: Sum of (Daily Salary) for all Present/Late employees.
  // Daily Salary = Monthly / 30
  const dailySalaryExpense = state.employees.reduce((acc, emp) => {
    const record = todayAttendance.find(a => a.employeeId === emp.id);
    if (record && (record.status === 'Present' || record.status === 'Late' || record.status === 'Leave')) {
      return acc + (emp.salary / 30);
    }
    return acc;
  }, 0);

  const chartData = [
    { name: t.totalPresent, value: totalPresentEffectively, color: '#10b981' }, // Green
    { name: t.totalAbsent, value: absentCount, color: '#ef4444' }, // Red
    { name: t.totalLeave, value: leaveCount, color: '#f59e0b' }, // Amber
  ];

  const handleSaveName = () => {
    onUpdateCompanyName(tempName);
    setIsEditingName(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)}
                className="text-2xl font-bold bg-gray-100 dark:bg-gray-700 border rounded px-2 py-1 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button onClick={handleSaveName} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{state.company.name}</h1>
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition">
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-xl font-mono text-primary font-semibold">
            <Clock size={24} />
            {currentTime.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US')}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.totalEmployees} value={totalEmployees} icon={<Users size={24} />} color="bg-blue-500" />
        <StatCard title={t.totalPresent} value={totalPresentEffectively} icon={<UserCheck size={24} />} color="bg-green-500" />
        <StatCard title={t.totalAbsent} value={absentCount} icon={<UserX size={24} />} color="bg-red-500" />
        <StatCard title={t.salaryExpense} value={Math.round(dailySalaryExpense).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')} prefix={lang === 'en' ? '৳' : '৳'} icon={<DollarSign size={24} />} color="bg-purple-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Today's Attendance Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary / Placeholder for other widgets */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Late Arrivals</span>
              <span className="font-bold text-orange-500">{lateCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">On Leave</span>
              <span className="font-bold text-yellow-500">{leaveCount}</span>
            </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300">Attendance Rate</span>
              <span className="font-bold text-primary">
                {totalEmployees > 0 ? Math.round((totalPresentEffectively / totalEmployees) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; prefix?: string }> = ({ title, value, icon, color, prefix }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-full text-white ${color} shadow-lg shadow-${color}/30`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
        {prefix}{value}
      </h3>
    </div>
  </div>
);

export default Dashboard;