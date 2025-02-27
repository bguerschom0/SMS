import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Tabs for different settings sections
  const [activeTab, setActiveTab] = useState('general');

  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Sample School',
    address: '123 Education St, Learning City',
    contactEmail: 'info@sampleschool.edu',
    contactPhone: '+1 234 567 8900',
    currency: 'USD',
    academicYear: '2025',
    receiptPrefix: 'RCT',
    logoUrl: '',
  });

  // State for fee types
  const [feeTypes, setFeeTypes] = useState([
    { id: 1, name: 'Tuition Fee', amount: 500, isActive: true },
    { id: 2, name: 'Registration Fee', amount: 100, isActive: true },
    { id: 3, name: 'Library Fee', amount: 50, isActive: true },
  ]);

  // State for new fee type
  const [newFeeType, setNewFeeType] = useState({
    name: '',
    amount: '',
    isActive: true,
  });

  // State for expense types
  const [expenseTypes, setExpenseTypes] = useState([
    { id: 1, name: 'Salaries', isActive: true },
    { id: 2, name: 'Utilities', isActive: true },
    { id: 3, name: 'Supplies', isActive: true },
  ]);

  // State for new expense type
  const [newExpenseType, setNewExpenseType] = useState({
    name: '',
    isActive: true,
  });

  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    feeReminders: true,
    paymentReceipts: true,
    monthlyReports: true,
  });

  // State to track if a form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle general settings change
  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle notification settings change
  const handleNotificationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle new fee type change
  const handleNewFeeTypeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFeeType((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle new expense type change
  const handleNewExpenseTypeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExpenseType((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add new fee type
  const handleAddFeeType = (e) => {
    e.preventDefault();
    if (!newFeeType.name || !newFeeType.amount) return;

    const id = Math.max(0, ...feeTypes.map((ft) => ft.id)) + 1;
    setFeeTypes((prev) => [
      ...prev,
      { ...newFeeType, id, amount: parseFloat(newFeeType.amount) },
    ]);
    setNewFeeType({ name: '', amount: '', isActive: true });
  };

  // Add new expense type
  const handleAddExpenseType = (e) => {
    e.preventDefault();
    if (!newExpenseType.name) return;

    const id = Math.max(0, ...expenseTypes.map((et) => et.id)) + 1;
    setExpenseTypes((prev) => [...prev, { ...newExpenseType, id }]);
    setNewExpenseType({ name: '', isActive: true });
  };

  // Toggle fee type active status
  const toggleFeeTypeStatus = (id) => {
    setFeeTypes((prev) =>
      prev.map((ft) =>
        ft.id === id ? { ...ft, isActive: !ft.isActive } : ft
      )
    );
  };

  // Toggle expense type active status
  const toggleExpenseTypeStatus = (id) => {
    setExpenseTypes((prev) =>
      prev.map((et) =>
        et.id === id ? { ...et, isActive: !et.isActive } : et
      )
    );
  };

  // Save general settings
  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to save the settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('General settings saved successfully!');
    } catch (error) {
      console.error('Failed to save general settings:', error);
      alert('Failed to save general settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save notification settings
  const handleSaveNotificationSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to save the settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      alert('Failed to save notification settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <form onSubmit={handleSaveGeneralSettings}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="schoolName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={generalSettings.schoolName}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="academicYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Academic Year
                  </label>
                  <input
                    type="text"
                    id="academicYear"
                    name="academicYear"
                    value={generalSettings.academicYear}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="receiptPrefix"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Receipt Number Prefix
                  </label>
                  <input
                    type="text"
                    id="receiptPrefix"
                    name="receiptPrefix"
                    value={generalSettings.receiptPrefix}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="logoUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    School Logo URL
                  </label>
                  <input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    value={generalSettings.logoUrl}
                    onChange={handleGeneralSettingsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a URL for your school logo. It will appear on reports
                    and receipts.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </div>
        );

      case 'feeTypes':
        return (
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fee Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feeTypes.map((feeType) => (
                    <tr key={feeType.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {feeType.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${feeType.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            feeType.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {feeType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => toggleFeeTypeStatus(feeType.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {feeType.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Fee Type
              </h3>
              <form
                onSubmit={handleAddFeeType}
                className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fee Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newFeeType.name}
                    onChange={handleNewFeeTypeChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={newFeeType.amount}
                      onChange={handleNewFeeTypeChange}
                      required
                      min="0"
                      step="0.01"
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button type="submit" variant="primary">
                    Add Fee Type
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'expenseTypes':
        return (
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Expense Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenseTypes.map((expenseType) => (
                    <tr key={expenseType.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expenseType.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            expenseType.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {expenseType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            toggleExpenseTypeStatus(expenseType.id)
                          }
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {expenseType.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Expense Type
              </h3>
              <form
                onSubmit={handleAddExpenseType}
                className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="expenseName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expense Name
                  </label>
                  <input
                    type="text"
                    id="expenseName"
                    name="name"
                    value={newExpenseType.name}
                    onChange={handleNewExpenseTypeChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <Button type="submit" variant="primary">
                    Add Expense Type
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <form onSubmit={handleSaveNotificationSettings}>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationSettingsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="emailNotifications"
                      className="font-medium text-gray-700"
                    >
                      Enable Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive system notifications via email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="feeReminders"
                      name="feeReminders"
                      type="checkbox"
                      checked={notificationSettings.feeReminders}
                      onChange={handleNotificationSettingsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="feeReminders"
                      className="font-medium text-gray-700"
                    >
                      Fee Due Reminders
                    </label>
                    <p className="text-gray-500">
                      Send automatic reminders when fees are due.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="paymentReceipts"
                      name="paymentReceipts"
                      type="checkbox"
                      checked={notificationSettings.paymentReceipts}
                      onChange={handleNotificationSettingsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="paymentReceipts"
                      className="font-medium text-gray-700"
                    >
                      Payment Receipts
                    </label>
                    <p className="text-gray-500">
                      Send receipt emails when payments are recorded.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="monthlyReports"
                      name="monthlyReports"
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={handleNotificationSettingsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="monthlyReports"
                      className="font-medium text-gray-700"
                    >
                      Monthly Reports
                    </label>
                    <p className="text-gray-500">
                      Receive monthly financial reports via email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'feeTypes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('feeTypes')}
          >
            Fee Types
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenseTypes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('expenseTypes')}
          >
            Expense Types
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </nav>
      </div>

      <Card>
        <div className="p-6">{renderTabContent()}</div>
      </Card>
    </div>
  );
};

export default Settings;
