"use client";

import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { FiClock, FiDownload, FiFilter, FiCalendar, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

export default function TimeTracking() {
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState('all-time');
  
  // Define status type to match the keys in statusColors
  type TimePackageStatus = 'Active' | 'Completed' | 'Expired' | 'Upcoming';

  // Sample data for time packages
  const timePackages = [
    { 
      id: 1,
      name: 'Monthly Retainer - Q1 2025', 
      hours: 40,
      hoursUsed: 28.5,
      hoursRemaining: 11.5,
      purchaseDate: 'January 1, 2025',
      expirationDate: 'March 31, 2025',
      status: 'Active' as TimePackageStatus,
      percentUsed: 71.25
    },
    { 
      id: 2,
      name: 'Project Add-on - CRM Integration', 
      hours: 20,
      hoursUsed: 12,
      hoursRemaining: 8,
      purchaseDate: 'February 15, 2025',
      expirationDate: 'May 15, 2025',
      status: 'Active' as TimePackageStatus,
      percentUsed: 60
    },
    { 
      id: 3,
      name: 'Monthly Retainer - Q4 2024', 
      hours: 40,
      hoursUsed: 40,
      hoursRemaining: 0,
      purchaseDate: 'October 1, 2024',
      expirationDate: 'December 31, 2024',
      status: 'Completed' as TimePackageStatus,
      percentUsed: 100
    },
  ];
  
  // Sample data for time entries
  const timeEntries = [
    { 
      id: 1,
      date: 'March 15, 2025',
      project: 'CRM Integration',
      task: 'API Development',
      description: 'Created authentication endpoints and initial API documentation',
      hours: 3.5,
      consultant: 'Jason Patel',
      timePackage: 'Monthly Retainer - Q1 2025'
    },
    { 
      id: 2,
      date: 'March 12, 2025',
      project: 'CRM Integration',
      task: 'Database Configuration',
      description: 'Set up database schema and migration scripts',
      hours: 2,
      consultant: 'Sarah Miller',
      timePackage: 'Monthly Retainer - Q1 2025'
    },
    { 
      id: 3,
      date: 'March 10, 2025',
      project: 'Data Visualization Dashboard',
      task: 'Requirements Gathering',
      description: 'Meeting to discuss dashboard requirements and key metrics',
      hours: 1.5,
      consultant: 'Alex Thompson',
      timePackage: 'Monthly Retainer - Q1 2025'
    },
    { 
      id: 4,
      date: 'March 8, 2025',
      project: 'CRM Integration',
      task: 'Project Planning',
      description: 'Created project timeline and resource allocation plan',
      hours: 2.5,
      consultant: 'Alex Thompson',
      timePackage: 'Monthly Retainer - Q1 2025'
    },
    { 
      id: 5,
      date: 'March 5, 2025',
      project: 'CRM Integration',
      task: 'Initial Data Migration',
      description: 'Completed the initial data migration from legacy systems',
      hours: 4,
      consultant: 'Sarah Miller',
      timePackage: 'Monthly Retainer - Q1 2025'
    },
    { 
      id: 6,
      date: 'February 20, 2025',
      project: 'CRM Integration',
      task: 'System Design',
      description: 'Finalized system architecture and component design',
      hours: 3,
      consultant: 'Jason Patel',
      timePackage: 'Project Add-on - CRM Integration'
    },
  ];

  // Status colors for time packages
  const statusColors: Record<TimePackageStatus, string> = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Upcoming': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  };

  // Filter the time entries based on selected time period
  const getFilteredTimeEntries = () => {
    if (timePeriod === 'all-time') {
      return timeEntries;
    }
    
    const today = new Date();
    let cutoffDate = new Date();
    
    switch (timePeriod) {
      case 'this-month':
        cutoffDate.setDate(1);
        break;
      case 'last-month':
        cutoffDate.setMonth(today.getMonth() - 1, 1);
        today.setDate(0); // Last day of previous month
        break;
      case 'this-quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        cutoffDate.setMonth(quarter * 3, 1);
        break;
      case 'last-quarter':
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        cutoffDate.setMonth(lastQuarter * 3, 1);
        today.setMonth(Math.floor(today.getMonth() / 3) * 3, 0);
        break;
      default:
        return timeEntries;
    }
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate && entryDate <= today;
    });
  };

  const filteredTimeEntries = getFilteredTimeEntries();
  
  // Calculate total hours for filtered entries
  const totalHours = filteredTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track and manage your purchased time
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiCreditCard className="w-4 h-4 mr-2" />
            Purchase Time
          </button>
        </div>
      </div>

      {/* Time packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {timePackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white dark:bg-gray-800 border ${
              pkg.status === 'Active' ? 'border-primary-200 dark:border-primary-800' : 'border-gray-200 dark:border-gray-700'
            } rounded-lg shadow-md overflow-hidden ${
              pkg.status === 'Active' ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pkg.name}
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[pkg.status]}`}>
                  {pkg.status}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Usage</span>
                  <span className="text-gray-700 dark:text-gray-300">{pkg.percentUsed}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      pkg.percentUsed >= 90 ? 'bg-red-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${pkg.percentUsed}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Total Hours:</div>
                  <div className="text-right font-medium text-gray-900 dark:text-white">{pkg.hours} hrs</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Hours Used:</div>
                  <div className="text-right font-medium text-gray-900 dark:text-white">{pkg.hoursUsed} hrs</div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Hours Remaining:</div>
                  <div className="text-right font-medium text-gray-900 dark:text-white">{pkg.hoursRemaining} hrs</div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-x-2 text-sm">
                    <div className="text-gray-500 dark:text-gray-400">Purchase Date:</div>
                    <div className="text-right text-gray-700 dark:text-gray-300">{pkg.purchaseDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-sm mt-1">
                    <div className="text-gray-500 dark:text-gray-400">Expiration Date:</div>
                    <div className="text-right text-gray-700 dark:text-gray-300">{pkg.expirationDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Time entries section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Time Entries
            </h2>
            <div className="mt-3 sm:mt-0 flex items-center space-x-3">
              <div className="relative">
                <select
                  id="time-period"
                  name="time-period"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all-time">All Time</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="last-quarter">Last Quarter</option>
                </select>
              </div>
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiDownload className="-ml-0.5 mr-2 h-4 w-4" />
                Export
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Total: {totalHours} hours
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Consultant
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTimeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {entry.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {entry.task}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="max-w-xs truncate">
                      {entry.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {entry.consultant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {entry.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Purchase History Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Time Purchase History
          </h2>
          <Link
            href="#"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
          >
            View All <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    February 15, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Project Add-on - CRM Integration
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    20
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <a 
                      href="#"
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    January 1, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Monthly Retainer - Q1 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    40
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <a 
                      href="#"
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    October 1, 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Monthly Retainer - Q4 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    40
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <a 
                      href="#"
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
