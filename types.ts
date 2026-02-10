export type Language = 'en' | 'bn';

export interface Employee {
  id: string;
  name: string;
  address: string;
  mobile: string;
  salary: number; // Monthly salary
  avatar?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO Date string YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  overtimeHours?: number; // New field for overtime
}

export interface CompanyInfo {
  name: string;
  ownerName: string;
  ownerPhoto: string;
}

export interface AppState {
  employees: Employee[];
  attendance: AttendanceRecord[];
  company: CompanyInfo;
  darkMode: boolean;
  language: Language;
}

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    reports: 'Reports',
    employees: 'Employees',
    accounts: 'Accounts',
    profile: 'Profile',
    aiStudio: 'AI Studio',
    totalEmployees: 'Total Employees',
    totalPresent: 'Total Present',
    totalAbsent: 'Total Absent',
    totalLeave: 'Total Leave',
    salaryExpense: 'Est. Salary Expense',
    companyName: 'Company Name',
    save: 'Save',
    addEmployee: 'Add Employee',
    updateEmployee: 'Update Employee',
    edit: 'Edit',
    name: 'Name',
    id: 'ID',
    address: 'Address',
    mobile: 'Mobile',
    salary: 'Salary',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    generatePaySlip: 'Generate Pay Slip',
    dailyIncome: 'Daily Income',
    weeklyIncome: 'Weekly Income',
    monthlyIncome: 'Monthly Income',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    editImage: 'Edit Image with AI',
    imagePromptPlaceholder: 'e.g., Add a retro filter, remove background...',
    generate: 'Generate',
    uploadImage: 'Upload Image',
    result: 'Result',
    processing: 'Processing...',
    downloadReport: 'Download CSV',
    searchByName: 'Search by Name...',
    searchByID: 'Search by ID...',
    noRecords: 'No attendance records found for this criteria.',
    overtime: 'Overtime',
    overtimeHours: 'OT (Hrs)',
    overtimeRate: 'OT Rate',
    overtimePay: 'Overtime Pay',
    totalOvertime: 'Total Overtime',
    editProfile: 'Edit Profile',
    ownerName: 'Owner Name',
    ownerPhotoUrl: 'Owner Photo',
    uploadPhoto: 'Upload Photo',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    downloadPDF: 'Download PDF',
    confirmDeleteTitle: 'Delete Employee',
    confirmDeleteMessage: 'Are you sure you want to delete this employee? This action cannot be undone.',
    delete: 'Delete',
    fromDate: 'From Date',
    toDate: 'To Date',
    searchPlaceholder: 'Search Name or ID',
    paymentPeriod: 'Payment Period',
    photo: 'Photo',
    removePhoto: 'Remove Photo',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    attendance: 'হাজিরা',
    reports: 'রিপোর্ট',
    employees: 'কর্মচারী তালিকা',
    accounts: 'একাউন্ট',
    profile: 'প্রোফাইল',
    aiStudio: 'এআই স্টুডিও',
    totalEmployees: 'মোট কর্মচারী',
    totalPresent: 'মোট উপস্থিতি',
    totalAbsent: 'মোট অনুপস্থিতি',
    totalLeave: 'মোট ছুটি',
    salaryExpense: 'মোট উপস্থিতির বেতন',
    companyName: 'কোম্পানির নাম',
    save: 'সেভ করুন',
    addEmployee: 'কর্মচারী যোগ করুন',
    updateEmployee: 'কর্মচারী আপডেট করুন',
    edit: 'এডিট',
    name: 'নাম',
    id: 'আইডি',
    address: 'ঠিকানা',
    mobile: 'মোবাইল',
    salary: 'বেতন',
    actions: 'অ্যাকশন',
    status: 'স্ট্যাটাস',
    date: 'তারিখ',
    generatePaySlip: 'পে স্লিপ তৈরি করুন',
    dailyIncome: 'দৈনিক আয়',
    weeklyIncome: 'সাপ্তাহিক আয়',
    monthlyIncome: 'মাসিক আয়',
    settings: 'সেটিংস',
    darkMode: 'ডার্ক মোড',
    language: 'ভাষা',
    editImage: 'এআই দিয়ে ছবি এডিট করুন',
    imagePromptPlaceholder: 'যেমন: একটি রেট্রো ফিল্টার যোগ করুন...',
    generate: 'তৈরি করুন',
    uploadImage: 'ছবি আপলোড',
    result: 'ফলাফল',
    processing: 'প্রসেসিং হচ্ছে...',
    downloadReport: 'রিপোর্ট ডাউনলোড',
    searchByName: 'নাম দিয়ে খুঁজুন...',
    searchByID: 'আইডি দিয়ে খুঁজুন...',
    noRecords: 'এই তথ্যের সাথে কোনো হাজিরার রেকর্ড পাওয়া যায়নি।',
    overtime: 'ওভারটাইম',
    overtimeHours: 'ওভারটাইম (ঘন্টা)',
    overtimeRate: 'ওভারটাইম রেট',
    overtimePay: 'ওভারটাইম টাকা',
    totalOvertime: 'মোট ওভারটাইম',
    editProfile: 'প্রোফাইল এডিট করুন',
    ownerName: 'মালিকের নাম',
    ownerPhotoUrl: 'মালিকের ছবি',
    uploadPhoto: 'ছবি আপলোড করুন',
    cancel: 'বাতিল',
    saveChanges: 'পরিবর্তন সেভ করুন',
    downloadPDF: 'পিডিএফ ডাউনলোড',
    confirmDeleteTitle: 'কর্মচারী মুছুন',
    confirmDeleteMessage: 'আপনি কি নিশ্চিত যে আপনি এই কর্মচারীকে মুছে ফেলতে চান? এই কাজটি ফিরিয়ে আনা যাবে না।',
    delete: 'মুছুন',
    fromDate: 'শুরুর তারিখ',
    toDate: 'শেষ তারিখ',
    searchPlaceholder: 'নাম বা আইডি দিয়ে খুঁজুন',
    paymentPeriod: 'পেমেন্ট সময়কাল',
    photo: 'ছবি',
    removePhoto: 'ছবি মুছুন',
  }
};