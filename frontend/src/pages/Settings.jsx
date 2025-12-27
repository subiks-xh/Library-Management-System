import { useState } from "react";
import {
  CogIcon,
  BuildingLibraryIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  CloudIcon,
  UserGroupIcon,
  DocumentTextIcon,
  LanguageIcon,
  PaintBrushIcon,
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    libraryName: "Tamil Nadu College Library",
    address: "123 College Road, Chennai, Tamil Nadu 600001",
    phone: "+91 44 12345678",
    email: "library@tncollege.edu.in",
    website: "https://www.tncollege.edu.in/library",
    workingHours: "9:00 AM - 8:00 PM",
    libraryCode: "TNCL001",

    // System Settings
    language: "english",
    theme: "light",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    enableAI: true,
    enableNotifications: true,
    enableQRCodes: true,
    enableDigitalLibrary: true,

    // Library Rules
    maxBooksPerStudent: 5,
    loanPeriod: 14,
    renewalPeriod: 7,
    maxRenewals: 2,
    finePerDay: 5,
    reservationPeriod: 7,
    overdueNoticeDays: 3,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    reminderDays: [1, 3, 7],
    overdueNotifications: true,
    reservationNotifications: true,
    newBookNotifications: false,

    // Security Settings
    sessionTimeout: 30,
    passwordExpiry: 90,
    twoFactorAuth: false,
    loginAttempts: 3,
    auditLogs: true,
    dataBackup: true,
    autoBackup: true,

    // Integration Settings
    cloudSync: false,
    apiAccess: true,
    thirdPartyIntegrations: false,
    exportFormats: ["pdf", "excel", "csv"],
  });

  const settingsTabs = [
    { id: "general", name: "General", icon: BuildingLibraryIcon },
    { id: "system", name: "System", icon: CogIcon },
    { id: "library", name: "Library Rules", icon: DocumentTextIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
    { id: "integrations", name: "Integrations", icon: CloudIcon },
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    // Here you would implement the actual save logic
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      console.log("Resetting settings to default");
      // Implement reset logic here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings & Configuration</h1>
        <p className="page-subtitle">
          Configure system settings, library rules, and integrations
        </p>
      </div>

      {/* Settings Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200">
            <nav className="space-y-1 p-4">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Library Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Library Name
                      </label>
                      <input
                        type="text"
                        value={settings.libraryName}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "libraryName",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Library Code
                      </label>
                      <input
                        type="text"
                        value={settings.libraryCode}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "libraryCode",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={settings.address}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "address",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={settings.website}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "website",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        value={settings.workingHours}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "workingHours",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    System Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "language",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="english">English</option>
                        <option value="tamil">Tamil</option>
                        <option value="hindi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) =>
                          handleSettingChange("system", "theme", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "currency",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "timezone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">
                          America/New_York
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "dateFormat",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Feature Settings
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "enableAI",
                        label: "Enable AI Features",
                        description:
                          "AI recommendations, smart search, and analytics",
                      },
                      {
                        key: "enableNotifications",
                        label: "Enable Notifications",
                        description: "Email, SMS, and push notifications",
                      },
                      {
                        key: "enableQRCodes",
                        label: "Enable QR Codes",
                        description: "QR code generation and scanning features",
                      },
                      {
                        key: "enableDigitalLibrary",
                        label: "Enable Digital Library",
                        description: "E-books, videos, and digital resources",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {feature.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[feature.key]}
                            onChange={(e) =>
                              handleSettingChange(
                                "system",
                                feature.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "library" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Library Rules & Limits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Books per Student
                      </label>
                      <input
                        type="number"
                        value={settings.maxBooksPerStudent}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "maxBooksPerStudent",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Period (days)
                      </label>
                      <input
                        type="number"
                        value={settings.loanPeriod}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "loanPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Renewal Period (days)
                      </label>
                      <input
                        type="number"
                        value={settings.renewalPeriod}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "renewalPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Renewals
                      </label>
                      <input
                        type="number"
                        value={settings.maxRenewals}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "maxRenewals",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fine per Day (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.finePerDay}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "finePerDay",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reservation Period (days)
                      </label>
                      <input
                        type="number"
                        value={settings.reservationPeriod}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "reservationPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overdue Notice (days before due)
                      </label>
                      <input
                        type="number"
                        value={settings.overdueNoticeDays}
                        onChange={(e) =>
                          handleSettingChange(
                            "library",
                            "overdueNoticeDays",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description: "Send notifications via email",
                      },
                      {
                        key: "smsNotifications",
                        label: "SMS Notifications",
                        description: "Send notifications via SMS",
                      },
                      {
                        key: "pushNotifications",
                        label: "Push Notifications",
                        description: "Browser push notifications",
                      },
                      {
                        key: "overdueNotifications",
                        label: "Overdue Notifications",
                        description: "Notify when books are overdue",
                      },
                      {
                        key: "reservationNotifications",
                        label: "Reservation Notifications",
                        description: "Notify when reserved books are available",
                      },
                      {
                        key: "newBookNotifications",
                        label: "New Book Notifications",
                        description: "Notify about new book arrivals",
                      },
                    ].map((notification) => (
                      <div
                        key={notification.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {notification.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {notification.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[notification.key]}
                            onChange={(e) =>
                              handleSettingChange(
                                "notifications",
                                notification.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Days (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={settings.reminderDays.join(", ")}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "reminderDays",
                          e.target.value
                            .split(",")
                            .map((d) => parseInt(d.trim()))
                            .filter((d) => !isNaN(d))
                        )
                      }
                      placeholder="1, 3, 7"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Days before due date to send reminders
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "sessionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "passwordExpiry",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.loginAttempts}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "loginAttempts",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "twoFactorAuth",
                        label: "Two-Factor Authentication",
                        description: "Enable 2FA for enhanced security",
                      },
                      {
                        key: "auditLogs",
                        label: "Audit Logs",
                        description: "Keep detailed logs of system activities",
                      },
                      {
                        key: "dataBackup",
                        label: "Data Backup",
                        description:
                          "Regular data backup for disaster recovery",
                      },
                      {
                        key: "autoBackup",
                        label: "Automatic Backup",
                        description: "Schedule automatic backups",
                      },
                    ].map((security) => (
                      <div
                        key={security.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {security.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {security.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[security.key]}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                security.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    System Integrations
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "cloudSync",
                        label: "Cloud Synchronization",
                        description: "Sync data with cloud storage services",
                      },
                      {
                        key: "apiAccess",
                        label: "API Access",
                        description:
                          "Enable REST API for third-party integrations",
                      },
                      {
                        key: "thirdPartyIntegrations",
                        label: "Third-party Integrations",
                        description: "Connect with external library systems",
                      },
                    ].map((integration) => (
                      <div
                        key={integration.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {integration.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {integration.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[integration.key]}
                            onChange={(e) =>
                              handleSettingChange(
                                "integrations",
                                integration.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Formats
                    </label>
                    <div className="space-y-2">
                      {["pdf", "excel", "csv", "json", "xml"].map((format) => (
                        <label key={format} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.exportFormats.includes(format)}
                            onChange={(e) => {
                              const newFormats = e.target.checked
                                ? [...settings.exportFormats, format]
                                : settings.exportFormats.filter(
                                    (f) => f !== format
                                  );
                              handleSettingChange(
                                "integrations",
                                "exportFormats",
                                newFormats
                              );
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {format}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reset to Default
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
