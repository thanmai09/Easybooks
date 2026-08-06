import React, { useState } from 'react';
import { 
  Store, 
  Globe, 
  Bell, 
  User, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import { getSettings, saveSettings } from '../../mock';
import type { BusinessSettings } from '../../mock';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(getSettings());
  const [activeTab, setActiveTab] = useState<'profile' | 'localization' | 'notifications'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [gstin, setGstin] = useState(settings.gstin || '');

  const [currency, setCurrency] = useState(settings.currency);
  const [language, setLanguage] = useState(settings.language);
  const [theme, setTheme] = useState(settings.theme);

  const [lowStock, setLowStock] = useState(settings.notifications.lowStock);
  const [pendingPayment, setPendingPayment] = useState(settings.notifications.pendingPayment);
  const [weeklyDigest, setWeeklyDigest] = useState(settings.notifications.weeklyDigest);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: BusinessSettings = {
      businessName,
      ownerName,
      email,
      phone,
      address,
      gstin: gstin || undefined,
      currency,
      language,
      theme,
      notifications: {
        lowStock,
        pendingPayment,
        weeklyDigest
      }
    };

    saveSettings(updated);
    setSettings(updated);
    
    // Dispatch a custom storage event so other components update immediately if needed
    window.dispatchEvent(new Event('storage'));
    
    triggerToast('Settings configuration saved successfully!');
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <Sparkles size={16} className="text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Business Settings</h2>
        <p className="text-xs font-semibold text-slate-400">Configure business profiles, print currencies, and app alerts</p>
      </div>

      {/* Settings Navigation Tabs & Layout grid */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left tabs selector */}
        <div className="md:col-span-3 flex flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-100 font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs transition-colors ${activeTab === 'profile' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Store size={15} />
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('localization')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs transition-colors ${activeTab === 'localization' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Globe size={15} />
            Regional & Theme
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs transition-colors ${activeTab === 'notifications' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Bell size={15} />
            System Notifications
          </button>
        </div>

        {/* Right tabs content details */}
        <div className="md:col-span-9">
          <Card className="shadow-xs border-slate-100">
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              
              {/* ------------------------------------------------------------- */}
              {/* PROFILE SETTINGS */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <User className="text-slate-400" size={18} />
                    <h3 className="text-sm font-bold text-slate-800">Business Profile Data</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Official Shop Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                    <Input
                      label="Owner Full Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="GST Tax Identification Number (GSTIN)"
                      placeholder="e.g. 09AAAAA1111A1Z1"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                    />
                    <Input
                      label="Business Phone Line"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Official Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <TextArea
                    label="Physical Store Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LOCALIZATION & THEME */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'localization' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Globe className="text-slate-400" size={18} />
                    <h3 className="text-sm font-bold text-slate-800">Regional & Aesthetics Preferences</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Currency Symbol Type"
                      options={[
                        { value: '₹', label: 'Indian Rupee (₹)' },
                        { value: '$', label: 'US Dollar ($)' },
                        { value: '€', label: 'Euro (€)' },
                        { value: '£', label: 'British Pound (£)' },
                        { value: '¥', label: 'Yen / Yuan (¥)' }
                      ]}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    />
                    <Select
                      label="Language Translations"
                      options={[
                        { value: 'English', label: 'English (US/UK)' },
                        { value: 'Hindi', label: 'Hindi (हिंदी)' },
                        { value: 'Spanish', label: 'Spanish (Español)' },
                        { value: 'Tamil', label: 'Tamil (தமிழ்)' }
                      ]}
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    />
                  </div>

                  <Select
                    label="Application Color Theme"
                    options={[
                      { value: 'light', label: 'Aesthetic Light Mode (Recommended)' },
                      { value: 'dark', label: 'Premium Dark Mode (Mock only)' }
                    ]}
                    value={theme}
                    onChange={(e: any) => setTheme(e.target.value)}
                  />
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* NOTIFICATION SETTINGS */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Bell className="text-slate-400" size={18} />
                    <h3 className="text-sm font-bold text-slate-800">System Alert Toggles</h3>
                  </div>

                  <div className="flex flex-col gap-4 font-semibold text-xs text-slate-600">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-slate-800">Low Stock Alert Notifications</span>
                        <span className="text-[10px] text-slate-400">Trigger warnings in dashboard when inventory items run low</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={lowStock}
                        onChange={(e) => setLowStock(e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded-md border-slate-350 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-slate-800">Pending Credit Khata Reminders</span>
                        <span className="text-[10px] text-slate-400">Display collection alarms for pending customer debts</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={pendingPayment}
                        onChange={(e) => setPendingPayment(e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded-md border-slate-350 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-slate-800">Weekly Audit email summaries</span>
                        <span className="text-[10px] text-slate-400">Draft weekly summary invoices copy directly to CA portal</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded-md border-slate-350 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" icon={<Save size={16} />}>
                  Save Settings
                </Button>
              </div>

            </form>
          </Card>
        </div>

      </div>
    </div>
  );
};
