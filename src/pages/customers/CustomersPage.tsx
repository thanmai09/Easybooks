import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit3, Eye, Phone, Mail, MessageCircle, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { 
  getCustomers, 
  saveCustomers, 
  getSettings
} from '../../mock';
import type { Customer, CustomerPaymentHistory } from '../../mock';

export const CustomersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [pendingPayment, setPendingPayment] = useState(0);
  const [notes, setNotes] = useState('');

  // Collect Payment quick state
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCustomers(getCustomers());

    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      triggerAddNew();
      navigate('/customers', { replace: true });
    }
  }, [location]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerAddNew = () => {
    setName('');
    setPhone('');
    setEmail('');
    setBusinessName('');
    setAddress('');
    setPendingPayment(0);
    setNotes('');
    setIsAddOpen(true);
  };

  const triggerEdit = (cust: Customer) => {
    setActiveCustomer(cust);
    setName(cust.name);
    setPhone(cust.phone);
    setEmail(cust.email);
    setBusinessName(cust.businessName || '');
    setAddress(cust.address || '');
    setNotes(cust.notes || '');
    setIsEditOpen(true);
  };

  const triggerDelete = (cust: Customer) => {
    setActiveCustomer(cust);
    setIsDeleteOpen(true);
  };

  const triggerProfile = (cust: Customer) => {
    setActiveCustomer(cust);
    setPaymentAmount(0);
    setIsProfileOpen(true);
  };

  // Add Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill in name and contact number.');
      return;
    }

    const newCust: Customer = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      email,
      businessName: businessName || undefined,
      address: address || undefined,
      pendingPayment,
      notes: notes || undefined,
      createdAt: '2026-08-05',
      paymentHistory: pendingPayment > 0 
        ? [{ date: '2026-08-05', amount: pendingPayment, type: 'Purchase', description: 'Opening Credit Balance' }]
        : []
    };

    const updated = [...customers, newCust];
    saveCustomers(updated);
    setCustomers(updated);
    setIsAddOpen(false);
    triggerToast(`Added Customer ${name} to directory.`);
  };

  // Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    const updated = customers.map(c => 
      c.id === activeCustomer.id 
        ? { ...c, name, phone, email, businessName: businessName || undefined, address: address || undefined, notes: notes || undefined }
        : c
    );
    saveCustomers(updated);
    setCustomers(updated);
    setIsEditOpen(false);
    triggerToast(`Updated profile details for ${name}.`);
  };

  // Delete Submit
  const handleDeleteSubmit = () => {
    if (!activeCustomer) return;
    const updated = customers.filter(c => c.id !== activeCustomer.id);
    saveCustomers(updated);
    setCustomers(updated);
    setIsDeleteOpen(false);
    triggerToast(`Customer ${activeCustomer.name} deleted.`);
  };

  // WhatsApp reminder
  const handleSendReminder = (cust: Customer) => {
    triggerToast(`Reminded ${cust.name} via WhatsApp regarding credit due: ${settings.currency}${cust.pendingPayment}.`);
  };

  // Collect pending payment
  const handleCollectPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || paymentAmount <= 0) return;

    const nextPending = Math.max(0, activeCustomer.pendingPayment - paymentAmount);
    
    const newRecord: CustomerPaymentHistory = {
      date: '2026-08-05',
      amount: paymentAmount,
      type: 'Payment',
      description: 'Collected cash credit payment'
    };

    const updated = customers.map(c => {
      if (c.id === activeCustomer.id) {
        return {
          ...c,
          pendingPayment: nextPending,
          paymentHistory: [newRecord, ...c.paymentHistory]
        };
      }
      return c;
    });

    saveCustomers(updated);
    setCustomers(updated);

    // Refresh active customer state inside modal
    const current = updated.find(c => c.id === activeCustomer.id);
    if (current) setActiveCustomer(current);

    setPaymentAmount(0);
    triggerToast(`Collected ${settings.currency}${paymentAmount} from ${activeCustomer.name}.`);
  };

  // Search filter logic
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase())) ||
    c.phone.includes(search)
  );

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <MessageCircle size={16} className="text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Customer Khata Directory</h2>
          <p className="text-xs font-semibold text-slate-400">Track client contact ledger and pending credit books</p>
        </div>
        <Button onClick={triggerAddNew} icon={<Plus size={16} />}>
          Add New Customer
        </Button>
      </div>

      {/* Search Filter Card */}
      <Card className="p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by customer name, store name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-semibold"
          />
        </div>
      </Card>

      {/* Customer List Table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Business / Store</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Line</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Due</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Action Pings</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs font-bold">
                    No customers found in directory.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{cust.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {cust.businessName || <span className="text-slate-400 font-medium">Personal Account</span>}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{cust.phone}</td>
                    <td className="px-6 py-4 text-xs font-extrabold text-slate-900">
                      {cust.pendingPayment > 0 ? (
                        <span className="text-amber-600">{settings.currency}{cust.pendingPayment.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-600">{settings.currency}0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {cust.pendingPayment > 0 ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSendReminder(cust)}
                          className="bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] !py-1 !px-2.5"
                          icon={<MessageCircle size={12} />}
                        >
                          Ping WhatsApp
                        </Button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">No pending credit</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-right flex justify-end gap-2.5">
                      <button 
                        onClick={() => triggerProfile(cust)} 
                        className="p-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-slate-400 transition-colors"
                        title="Ledger Statement Profile"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => triggerEdit(cust)} 
                        className="p-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-slate-400 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => triggerDelete(cust)} 
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-accent-rose rounded-lg text-slate-400 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* ADD CUSTOMER MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Customer Profile"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleAddSubmit}>
              Create Customer
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Customer Full Name"
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone Line"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. customer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Business / Shop Name (Optional)"
              placeholder="e.g. Rajesh Retail"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Billing Address (Optional)"
              placeholder="e.g. Shop No. 5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="Opening Credit Udhar Balance"
              type="number"
              value={pendingPayment === 0 ? '' : pendingPayment}
              onChange={(e) => setPendingPayment(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <TextArea
            label="Internal Customer Notes"
            placeholder="e.g. Regular wholesale buyer..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* EDIT CUSTOMER MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Profile of ${activeCustomer?.name}`}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleEditSubmit}>
              Save Profile
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Customer Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone Line"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Business / Shop Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <Input
            label="Billing Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextArea
            label="Internal Customer Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMER PROFILE STATEMENT & PAYMENT COLLECTION MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title={`${activeCustomer?.name} - Ledger Khata Statement`}
        size="lg"
        footer={
          <Button variant="primary" onClick={() => setIsProfileOpen(false)}>
            Close Statement
          </Button>
        }
      >
        {activeCustomer && (
          <div className="flex flex-col md:flex-row gap-6 text-left text-xs text-slate-600 font-medium">
            {/* Left metadata summary panel */}
            <div className="flex-1 flex flex-col gap-5 border-r border-slate-100 pr-0 md:pr-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{activeCustomer.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{activeCustomer.businessName || 'Personal Credit Account'}</p>
              </div>

              <div className="flex flex-col gap-3 py-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Total Credit Due</span>
                <span className={`text-2xl font-black ${activeCustomer.pendingPayment > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {settings.currency}{activeCustomer.pendingPayment.toLocaleString()}
                </span>
                {activeCustomer.pendingPayment > 0 && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="mt-1"
                    icon={<MessageCircle size={13} />}
                    onClick={() => handleSendReminder(activeCustomer)}
                  >
                    WhatsApp Alert reminder
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>{activeCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span>{activeCustomer.email || 'No email saved'}</span>
                </div>
              </div>

              {activeCustomer.notes && (
                <div className="p-3 bg-brand-50/20 border border-brand-100/50 rounded-xl">
                  <h5 className="font-bold text-[9px] text-slate-400 uppercase mb-1">Owner Notes</h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{activeCustomer.notes}</p>
                </div>
              )}
            </div>

            {/* Right payment collections & logs ledger */}
            <div className="flex-1 flex flex-col gap-5 pl-0 md:pl-2">
              {/* Payment collector form */}
              {activeCustomer.pendingPayment > 0 && (
                <Card className="!p-4 bg-slate-50 border-slate-200/50">
                  <form onSubmit={handleCollectPayment} className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Record Credit Payment</h4>
                    <div className="flex gap-3.5 items-end">
                      <div className="flex-1">
                        <Input
                          label="Amount Collected"
                          type="number"
                          min={1}
                          max={activeCustomer.pendingPayment}
                          value={paymentAmount === 0 ? '' : paymentAmount}
                          onChange={(e) => setPaymentAmount(Math.min(activeCustomer.pendingPayment, parseFloat(e.target.value) || 0))}
                          icon={<DollarSign size={14} />}
                          className="!py-2 text-xs"
                        />
                      </div>
                      <Button type="submit" variant="secondary" className="!py-2 rounded-xl text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        Collect
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* Transactions log list */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Payment Activity Log</h4>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {activeCustomer.paymentHistory.length === 0 ? (
                    <p className="py-8 text-center text-slate-400 text-xs font-semibold">No payments logged yet.</p>
                  ) : (
                    activeCustomer.paymentHistory.map((log, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="text-left flex flex-col gap-1 overflow-hidden pr-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${log.type === 'Payment' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {log.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 truncate">{log.description}</span>
                          <span className="text-[8px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> {log.date}
                          </span>
                        </div>
                        <span className={`text-xs font-extrabold ${log.type === 'Payment' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {log.type === 'Payment' ? '-' : '+'}{settings.currency}{log.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Customer Profile"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSubmit}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <p className="text-xs text-slate-500 font-semibold leading-normal text-left">
          Are you sure you want to delete profile card of <span className="text-slate-800 font-bold">{activeCustomer?.name}</span>? All pending credit tracking data and transaction histories will be cleared.
        </p>
      </Modal>
    </div>
  );
};
