import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Receipt,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  getSales, 
  saveSales, 
  getCustomers, 
  getProducts, 
  saveProducts,
  getSettings
} from '../../mock';
import type { Sale, SaleItem } from '../../mock';

export const SalesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();
  
  // State
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState(getCustomers());
  const [products, setProducts] = useState(getProducts());
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeSale, setActiveSale] = useState<Sale | null>(null);

  // Form State for Add/Edit
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState('2026-08-05');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [taxPercent, setTaxPercent] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online' | 'Card' | 'Credit'>('Cash');
  const [status, setStatus] = useState<'Paid' | 'Unpaid' | 'Partial'>('Paid');
  const [notes, setNotes] = useState('');

  // Selected product input helper state
  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSales(getSales());
    setCustomers(getCustomers());
    setProducts(getProducts());
    
    // Check if redirect query action=new exists
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      triggerAddNew();
      // Clear query params
      navigate('/sales', { replace: true });
    }
  }, [location]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerAddNew = () => {
    const list = getSales();
    const nextNum = list.length + 1;
    setInvoiceNumber(`INV-2026-${String(nextNum).padStart(3, '0')}`);
    setCustomerId(getCustomers()[0]?.id || '');
    setDate('2026-08-05');
    setItems([]);
    setTaxPercent(5);
    setDiscountAmount(0);
    setPaymentMethod('Cash');
    setStatus('Paid');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedProdId) return;
    const prod = products.find(p => p.id === selectedProdId);
    if (!prod) return;

    // Check if already in sale items list
    const existing = items.find(item => item.id === selectedProdId);
    if (existing) {
      setItems(items.map(item => 
        item.id === selectedProdId 
          ? { ...item, quantity: item.quantity + selectedQty, total: (item.quantity + selectedQty) * item.price }
          : item
      ));
    } else {
      setItems([...items, {
        id: prod.id,
        name: prod.name,
        quantity: selectedQty,
        price: prod.sellingPrice,
        total: selectedQty * prod.sellingPrice
      }]);
    }
    
    setSelectedProdId('');
    setSelectedQty(1);
  };

  const handleRemoveItem = (prodId: string) => {
    setItems(items.filter(item => item.id !== prodId));
  };

  const getCalculatedTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = (subtotal * taxPercent) / 100;
    const total = subtotal + tax - discountAmount;
    return { subtotal, tax, total };
  };

  // Add Sale Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one product item to the invoice.');
      return;
    }

    const { subtotal, tax, total } = getCalculatedTotals();
    const customer = customers.find(c => c.id === customerId);

    const newSale: Sale = {
      id: `s-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      customerId,
      customerName: customer ? customer.name : 'Walk-in Customer',
      date,
      items,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      status,
      notes
    };

    // Update sales list
    const updatedSales = [newSale, ...sales];
    saveSales(updatedSales);
    setSales(updatedSales);

    // Subtract product inventory stock levels
    const updatedProducts = products.map(p => {
      const soldItem = items.find(item => item.id === p.id);
      if (soldItem) {
        return { ...p, currentStock: Math.max(0, p.currentStock - soldItem.quantity) };
      }
      return p;
    });
    saveProducts(updatedProducts);
    setProducts(updatedProducts);

    setIsAddOpen(false);
    triggerToast(`Created Invoice ${invoiceNumber} successfully!`);
  };

  // Delete Sale
  const handleDeleteSubmit = () => {
    if (!activeSale) return;
    const updated = sales.filter(s => s.id !== activeSale.id);
    saveSales(updated);
    setSales(updated);
    setIsDeleteOpen(false);
    triggerToast(`Invoice ${activeSale.invoiceNumber} has been deleted.`);
  };

  // View sale details
  const triggerView = (sale: Sale) => {
    setActiveSale(sale);
    setIsViewOpen(true);
  };

  // Delete trigger
  const triggerDelete = (sale: Sale) => {
    setActiveSale(sale);
    setIsDeleteOpen(true);
  };

  // Filter & Search Logic
  const filteredSales = sales.filter(s => {
    const matchesSearch = s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
                          s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || s.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const { subtotal: formSubtotal, total: formTotal } = getCalculatedTotals();

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Dynamic Toast Feedback Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <Receipt size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sales Register</h2>
          <p className="text-xs font-semibold text-slate-400">View and issue invoices for your customer orders</p>
        </div>
        <Button onClick={triggerAddNew} icon={<Plus size={16} />}>
          Create New Invoice
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-semibold"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44 flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partial', label: 'Partial' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!py-2 text-xs"
          />
        </div>

        {/* Payment Filter */}
        <div className="w-full md:w-44 flex items-center gap-2">
          <Receipt size={14} className="text-slate-400 shrink-0" />
          <Select
            options={[
              { value: 'All', label: 'All Payments' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Online', label: 'Online' },
              { value: 'Card', label: 'Card' },
              { value: 'Credit', label: 'Credit' }
            ]}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="!py-2 text-xs"
          />
        </div>
      </Card>

      {/* Sales List Table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Mode</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs font-bold">
                    No sales matches your search filter parameters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{sale.invoiceNumber}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{sale.customerName}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{sale.date}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{sale.paymentMethod}</td>
                    <td className="px-6 py-4 text-xs font-extrabold text-slate-900">{settings.currency}{sale.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs">
                      <Badge variant={sale.status === 'Paid' ? 'success' : sale.status === 'Partial' ? 'warning' : 'danger'}>
                        {sale.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-right flex justify-end gap-2.5">
                      <button 
                        onClick={() => triggerView(sale)} 
                        className="p-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-slate-400 transition-colors"
                        title="View Invoice"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => triggerDelete(sale)} 
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-accent-rose rounded-lg text-slate-400 transition-colors"
                        title="Delete Invoice"
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
      {/* NEW INVOICE MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Issue New Sale Invoice"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleAddSubmit}>
              Submit Sale
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-6 text-left">
          {/* Details segment */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              disabled
              className="bg-slate-50 text-slate-400"
            />
            <Select
              label="Customer Select"
              options={customers.map(c => ({ value: c.id, label: c.name }))}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <Input
              label="Invoice Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Add product item section */}
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Add Items list</h4>
            <div className="grid sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <Select
                  label="Select Item Product"
                  options={[
                    { value: '', label: '-- Select Item --' },
                    ...products.map(p => ({ value: p.id, label: `${p.name} (Stock: ${p.currentStock})` }))
                  ]}
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="text-xs !py-2"
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-xs !py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  fullWidth
                  className="!py-2 rounded-xl text-xs"
                  onClick={handleAddItem}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Added list layout table */}
            {items.length > 0 && (
              <div className="mt-4 border border-slate-100 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left font-bold text-slate-500">
                      <th className="p-2.5 pl-4">Item Name</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                      <th className="p-2.5 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 pl-4 font-semibold text-slate-700">{item.name}</td>
                        <td className="p-2.5 text-center font-semibold text-slate-600">{item.quantity}</td>
                        <td className="p-2.5 text-right text-slate-600">{settings.currency}{item.price}</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">{settings.currency}{item.total}</td>
                        <td className="p-2.5 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-accent-rose hover:text-red-700"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pricing settings, payments */}
          <div className="grid sm:grid-cols-2 gap-8 pt-2">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Payment Mode"
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Online', label: 'Online / UPI' },
                    { value: 'Card', label: 'Card' },
                    { value: 'Credit', label: 'Credit (Udhar)' }
                  ]}
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                />
                <Select
                  label="Filing Status"
                  options={[
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Unpaid', label: 'Unpaid' },
                    { value: 'Partial', label: 'Partial Paid' }
                  ]}
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                />
              </div>
              <TextArea
                label="Invoice Notes"
                placeholder="Include short internal details or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Calculations summaries */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col gap-3 text-xs font-semibold text-slate-600 justify-center">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-slate-800 font-bold">{settings.currency}{formSubtotal}</span>
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <span>GST Tax (Govt %):</span>
                <div className="w-20">
                  <Input 
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Math.max(0, parseInt(e.target.value) || 0))}
                    className="!py-1 !px-2 text-right text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span>Discount amount ({settings.currency}):</span>
                <div className="w-24">
                  <Input 
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="!py-1 !px-2 text-right text-xs"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-200/60 my-1" />

              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Net Total Invoice:</span>
                <span className="text-brand-600 text-base">{settings.currency}{formTotal}</span>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* VIEW INVOICE MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Sales Invoice Sheet"
        size="md"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" icon={<Download size={14} />} onClick={() => triggerToast('Downloaded PDF statement successfully!')}>
              PDF
            </Button>
            <Button variant="primary" onClick={() => setIsViewOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        {activeSale && (
          <div className="flex flex-col gap-6 text-left text-xs text-slate-600 font-medium">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{settings.businessName}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{settings.address}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-slate-800">{activeSale.invoiceNumber}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Issue Date: {activeSale.date}</p>
              </div>
            </div>

            {/* Bill to metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-[10px] text-slate-400 uppercase">Customer Billing</h5>
                <h4 className="text-xs font-bold text-slate-700 mt-1">{activeSale.customerName}</h4>
              </div>
              <div>
                <h5 className="font-bold text-[10px] text-slate-400 uppercase">Payment Summary</h5>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  Method: {activeSale.paymentMethod}
                </p>
                <div className="mt-1">
                  <Badge variant={activeSale.status === 'Paid' ? 'success' : activeSale.status === 'Partial' ? 'warning' : 'danger'}>
                    {activeSale.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Items breakdown list */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-left font-bold text-slate-500">
                    <th className="p-3 pl-4">Product details</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right pr-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSale.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-3 pl-4 font-bold text-slate-700">{it.name}</td>
                      <td className="p-3 text-center font-bold text-slate-600">{it.quantity}</td>
                      <td className="p-3 text-right">{settings.currency}{it.price}</td>
                      <td className="p-3 text-right font-extrabold text-slate-800 pr-4">{settings.currency}{it.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Computations list */}
            <div className="w-64 ml-auto flex flex-col gap-2.5 border-t border-slate-100 pt-4 font-semibold">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-slate-800 font-bold">{settings.currency}{activeSale.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax Added:</span>
                <span className="text-slate-800 font-bold">{settings.currency}{activeSale.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount applied:</span>
                <span className="text-slate-800 font-bold">-{settings.currency}{activeSale.discount}</span>
              </div>
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Invoice Total:</span>
                <span className="text-brand-600 text-base">{settings.currency}{activeSale.total}</span>
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
        title="Delete Sale Invoice Record"
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
          Are you sure you want to delete invoice <span className="text-slate-800 font-bold">{activeSale?.invoiceNumber}</span>? This action is permanent and cannot be undone. Product stocks will not be automatically restored.
        </p>
      </Modal>
    </div>
  );
};
