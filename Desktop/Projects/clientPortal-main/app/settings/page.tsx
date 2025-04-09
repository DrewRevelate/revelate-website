"use client";

import DashboardLayout from '@/components/layout/Dashboard';
import { useState } from 'react';
import { FiUser, FiLock, FiBell, FiBriefcase, FiSave, FiUpload, FiMoon, FiSun } from 'react-icons/fi';

export default function Settings() {
  // State for dark mode toggle (would be connected to a global state in a real app)
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings navigation */}
      <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
        <div className="w-full md:w-64 mb-6 md:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <nav className="flex flex-col p-2 space-y-1">
              <a
                href="#profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20"
              >
                <FiUser className="mr-3 h-5 w-5" />
                Profile
              </a>
              <a
                href="#password"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiLock className="mr-3 h-5 w-5" />
                Password
              </a>
              <a
                href="#notifications"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiBell className="mr-3 h-5 w-5" />
                Notifications
              </a>
              <a
                href="#company"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiBriefcase className="mr-3 h-5 w-5" />
                Company
              </a>
            </nav>
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1 space-y-6">
          {/* Profile section */}
          <section id="profile" className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your personal information
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <FiUser className="h-6 w-6" />
                    </div>
                    <div className="ml-5">
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <FiUpload className="h-4 w-4 inline-block mr-2" />
                        Change Avatar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="John"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="Doe"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setDarkMode(false)}
                      className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                        !darkMode 
                          ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FiSun className="h-5 w-5 mr-2" />
                      Light Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setDarkMode(true)}
                      className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                        darkMode 
                          ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FiMoon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiSave className="h-4 w-4 inline-block mr-2" />
                Save
              </button>
            </div>
          </section>

          {/* Password section */}
          <section id="password" className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Password
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your password
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    autoComplete="current-password"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    autoComplete="new-password"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    autoComplete="new-password"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiSave className="h-4 w-4 inline-block mr-2" />
                Update Password
              </button>
            </div>
          </section>

          {/* Notifications section */}
          <section id="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your notification preferences
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-project-updates"
                        name="email-project-updates"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-project-updates" className="font-medium text-gray-700 dark:text-gray-300">Project updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive emails when projects are updated or new tasks are added.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-meeting-reminders"
                        name="email-meeting-reminders"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-meeting-reminders" className="font-medium text-gray-700 dark:text-gray-300">Meeting reminders</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive email reminders for upcoming meetings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-document-updates"
                        name="email-document-updates"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-document-updates" className="font-medium text-gray-700 dark:text-gray-300">Document updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive emails when new documents are added or updated.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Portal Notifications</h3>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="portal-all-updates"
                        name="portal-all-updates"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="portal-all-updates" className="font-medium text-gray-700 dark:text-gray-300">All updates</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive portal notifications for all updates.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="portal-direct-messages"
                        name="portal-direct-messages"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="portal-direct-messages" className="font-medium text-gray-700 dark:text-gray-300">Direct messages</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive portal notifications for direct messages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiSave className="h-4 w-4 inline-block mr-2" />
                Save Preferences
              </button>
            </div>
          </section>

          {/* Company section */}
          <section id="company" className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Company Information
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your company details
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-6">
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="Acme Corporation"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <input
                    type="url"
                    name="company-website"
                    id="company-website"
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="https://www.example.com"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="company-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <textarea
                    id="company-address"
                    name="company-address"
                    rows={3}
                    className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    defaultValue="123 Main St, Anytown, USA 12345"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="company-industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Industry
                  </label>
                  <select
                    id="company-industry"
                    name="company-industry"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    defaultValue="technology"
                  >
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="button"
                className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiSave className="h-4 w-4 inline-block mr-2" />
                Save Company Info
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
