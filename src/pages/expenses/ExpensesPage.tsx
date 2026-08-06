import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Edit3, TrendingDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  getExpenses, 
  saveExpenses, 
  getSettings
} from '../../mock';
import type { Expense } from '../../mock';

export const ExpensesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);

  // Form State
  const [category, setCategory] = useState<'Inventory' | 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Transport' | 'Other'>('Other');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('2026-08-05');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'Card' | 'Credit'>('Cash');
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setExpenses(getExpenses());

    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      triggerAddNew();
      navigate('/expenses', { replace: true });
    }
  }, [location]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerAddNew = () => {
    setCategory('Other');
    setAmount(0);
    setDate('2026-08-05');
    setPaymentMethod('Cash');
    setStatus('Paid');
    setDescription('');
    setReference('');
    setIsAddOpen(true);
  };

  const triggerEdit = (exp: Expense) => {
    setActiveExpense(exp);
    setCategory(exp.category);
    setAmount(exp.amount);
    setDate(exp.date);
    setPaymentMethod(exp.paymentMethod);
    setStatus(exp.status);
    setDescription(exp.description);
    setReference(exp.reference || '');
    setIsEditOpen(true);
  };

  const triggerDelete = (exp: Expense) => {
    setActiveExpense(exp);
    setIsDeleteOpen(true);
  };

  // Add Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) {
      alert('Please fill in amount and description.');
      return;
    }

    const nextNum = expenses.length + 1;
    const newExpense: Expense = {
      id: `e-${Math.random().toString(36).substr(2, 9)}`,
      expenseNumber: `EXP-2026-${String(nextNum).padStart(3, '0')}`,
      category,
      amount,
      date,
      paymentMethod,
      status,
      description,
      reference
    };

    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    setExpenses(updated);
    setIsAddOpen(false);
    triggerToast(`Added expense of ${settings.currency}${amount} successfully!`);
  };

  // Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExpense) return;

    const updated = expenses.map(exp => 
      exp.id === activeExpense.id 
        ? { ...exp, category, amount, date, paymentMethod, status, description, reference }
        : exp
    );
    saveExpenses(updated);
    setExpenses(updated);
    setIsEditOpen(false);
    triggerToast(`Expense ${activeExpense.expenseNumber} updated successfully.`);
  };

  // Delete Submit
  const handleDeleteSubmit = () => {
    if (!activeExpense) return;
    const updated = expenses.filter(e => e.id !== activeExpense.id);
    saveExpenses(updated);
    setExpenses(updated);
    setIsDeleteOpen(false);
    triggerToast(`Expense record ${activeExpense.expenseNumber} deleted.`);
  };

  // Monthly summary calculations
  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingMonthlyExpenses = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  const paidMonthlyExpenses = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);

  // Filters logic
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) || 
                          e.expenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoriesOptions = [
    { value: 'Inventory', label: 'Inventory / Purchases' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Utilities', label: 'Utilities (Electricity, Water)' },
    { value: 'Salaries', label: 'Salaries (Employee Wages)' },
    { value: 'Marketing', label: 'Marketing / Printing' },
    { value: 'Transport', label: 'Transport / Fuel' },
    { value: 'Other', label: 'Other Expenses' }
  ];

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Dynamic Toast Feedback Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <TrendingDown size={16} className="text-accent-rose" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Expenses Ledger</h2>
          <p className="text-xs font-semibold text-slate-400">Record shop bills, vendor payments, and operational costs</p>
        </div>
        <Button onClick={triggerAddNew} icon={<Plus size={16} />} className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 focus:ring-rose-500">
          Record New Expense
        </Button>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="border-rose-100 bg-rose-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Outflow</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
            {settings.currency}{totalMonthlyExpenses.toLocaleString()}
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">all logged expenses</p>
        </Card>
        
        <Card className="border-emerald-100 bg-emerald-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Paid Bills</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
            {settings.currency}{paidMonthlyExpenses.toLocaleString()}
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">cleared payments</p>
        </Card>

        <Card className="border-amber-100 bg-amber-50/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Dues</span>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
            {settings.currency}{pendingMonthlyExpenses.toLocaleString()}
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">payments yet to clear</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by description or expense number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-semibold"
          />
        </div>

        <div className="w-full sm:w-48 flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <Select
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'Inventory', label: 'Inventory / Stock' },
              { value: 'Rent', label: 'Shop Rent' },
              { value: 'Utilities', label: 'Utilities' },
              { value: 'Salaries', label: 'Salaries' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Other', label: 'Other' }
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="!py-2 text-xs"
          />
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">EXP No.</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Mode</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-xs font-bold">
                    No expense transactions matching the query.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{exp.expenseNumber}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/50 text-[10px] uppercase tracking-wider font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{exp.description}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{exp.date}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{exp.paymentMethod}</td>
                    <td className="px-6 py-4 text-xs font-extrabold text-slate-900">{settings.currency}{exp.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs">
                      <Badge variant={exp.status === 'Paid' ? 'success' : 'warning'}>
                        {exp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-right flex justify-end gap-2.5">
                      <button 
                        onClick={() => triggerEdit(exp)} 
                        className="p-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-slate-400 transition-colors"
                        title="Edit Expense"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => triggerDelete(exp)} 
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-accent-rose rounded-lg text-slate-400 transition-colors"
                        title="Delete Record"
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
      {/* ADD EXPENSE MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record Shop Expense"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleAddSubmit}>
              Record Bill
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              options={categoriesOptions}
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
            />
            <Input
              label="Bill Amount"
              type="number"
              min={1}
              value={amount === 0 ? '' : amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Filing Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Payment Mode"
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Online', label: 'Online / GPay' },
                { value: 'Card', label: 'Card' },
                { value: 'Credit', label: 'Credit (Supplier Udhar)' }
              ]}
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
            />
            <Select
              label="Clearance Status"
              options={[
                { value: 'Paid', label: 'Paid' },
                { value: 'Pending', label: 'Pending Dues' }
              ]}
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
            />
          </div>

          <Input
            label="Bill Description"
            placeholder="e.g. Raju Helper Wages"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Reference ID / Invoice Attachment (UI only)"
            placeholder="e.g. TXN98765432"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* EDIT EXPENSE MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Expense ${activeExpense?.expenseNumber}`}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleEditSubmit}>
              Save Updates
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              options={categoriesOptions}
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
            />
            <Input
              label="Bill Amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Filing Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Payment Mode"
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Online', label: 'Online / GPay' },
                { value: 'Card', label: 'Card' },
                { value: 'Credit', label: 'Credit (Supplier Udhar)' }
              ]}
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
            />
            <Select
              label="Clearance Status"
              options={[
                { value: 'Paid', label: 'Paid' },
                { value: 'Pending', label: 'Pending Dues' }
              ]}
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
            />
          </div>

          <Input
            label="Bill Description"
            placeholder="e.g. Electric bill for shop"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Reference ID"
            placeholder="e.g. Ref No."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Expense Record"
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
          Are you sure you want to delete expense record <span className="text-slate-800 font-bold">{activeExpense?.expenseNumber}</span> for <span className="text-slate-800 font-bold">{settings.currency}{activeExpense?.amount}</span>? This action cannot be reverted.
        </p>
      </Modal>
    </div>
  );
};
