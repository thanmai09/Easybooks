import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Edit3, Package, AlertTriangle, Boxes } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  getProducts, 
  saveProducts, 
  getSettings 
} from '../../mock';
import type { Product } from '../../mock';

export const InventoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [minStockLevel, setMinStockLevel] = useState(5);
  const [unit, setUnit] = useState<'pcs' | 'kg' | 'liters' | 'box' | 'meter'>('pcs');
  const [supplierName, setSupplierName] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts());

    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      triggerAddNew();
      navigate('/inventory', { replace: true });
    }
  }, [location]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerAddNew = () => {
    const nextNum = products.length + 1;
    setName('');
    setSku(`SKU-${String(nextNum).padStart(3, '0')}`);
    setCategory('Grocery');
    setPurchasePrice(0);
    setSellingPrice(0);
    setCurrentStock(0);
    setMinStockLevel(5);
    setUnit('pcs');
    setSupplierName('');
    setIsAddOpen(true);
  };

  const triggerEdit = (p: Product) => {
    setActiveProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setPurchasePrice(p.purchasePrice);
    setSellingPrice(p.sellingPrice);
    setCurrentStock(p.currentStock);
    setMinStockLevel(p.minStockLevel);
    setUnit(p.unit);
    setSupplierName(p.supplierName || '');
    setIsEditOpen(true);
  };

  const triggerDelete = (p: Product) => {
    setActiveProduct(p);
    setIsDeleteOpen(true);
  };

  // Add Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || purchasePrice <= 0 || sellingPrice <= 0) {
      alert('Please fill in name, SKU, and prices.');
      return;
    }

    const newProduct: Product = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      name,
      sku,
      category,
      purchasePrice,
      sellingPrice,
      currentStock,
      minStockLevel,
      unit,
      supplierName: supplierName || undefined
    };

    const updated = [...products, newProduct];
    saveProducts(updated);
    setProducts(updated);
    setIsAddOpen(false);
    triggerToast(`Added product "${name}" to stock inventory.`);
  };

  // Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const updated = products.map(p => 
      p.id === activeProduct.id 
        ? { ...p, name, sku, category, purchasePrice, sellingPrice, currentStock, minStockLevel, unit, supplierName: supplierName || undefined }
        : p
    );
    saveProducts(updated);
    setProducts(updated);
    setIsEditOpen(false);
    triggerToast(`Product "${name}" updated successfully.`);
  };

  // Delete Submit
  const handleDeleteSubmit = () => {
    if (!activeProduct) return;
    const updated = products.filter(p => p.id !== activeProduct.id);
    saveProducts(updated);
    setProducts(updated);
    setIsDeleteOpen(false);
    triggerToast(`Product "${activeProduct.name}" removed from stock list.`);
  };

  // Stats
  const totalItems = products.length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
  const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0);

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesLowStock = !lowStockFilter || p.currentStock <= p.minStockLevel;
    return matchesSearch && matchesCategory && matchesLowStock;
  });


  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-[slideUp_0.2s_ease-out] text-xs font-semibold">
          <Package size={16} className="text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Stock Inventory Ledger</h2>
          <p className="text-xs font-semibold text-slate-400">Manage products, current quantities, suppliers, and stock reordering</p>
        </div>
        <Button onClick={triggerAddNew} icon={<Plus size={16} />}>
          Add New Product
        </Button>
      </div>

      {/* Inventory Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Products</span>
            <Boxes size={16} className="text-brand-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">{totalItems} Items</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">active products catalogs</p>
        </Card>

        <Card className="border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Valuation</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Asset Value</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2">{settings.currency}{totalStockValue.toLocaleString()}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">based on purchase / wholesale price</p>
        </Card>

        <Card className={`border-slate-100 ${lowStockProducts.length > 0 ? 'bg-rose-50/10 border-rose-100/50' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle size={16} className={lowStockProducts.length > 0 ? 'text-accent-rose animate-pulse' : 'text-slate-400'} />
          </div>
          <h3 className={`text-2xl font-extrabold mt-2 ${lowStockProducts.length > 0 ? 'text-accent-rose' : 'text-slate-800'}`}>
            {lowStockProducts.length} Alerts
          </h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">items below min inventory threshold</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search products by title name or SKU code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-semibold"
          />
        </div>

        {/* Categories */}
        <div className="w-full md:w-48 flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <Select
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'Grocery', label: 'Groceries' },
              { value: 'Packaged Food', label: 'Packaged Food' },
              { value: 'Beverages', label: 'Beverages' },
              { value: 'Dairy', label: 'Dairy' },
              { value: 'Pharmacy', label: 'Pharmacy' },
              { value: 'Apparel', label: 'Apparel' },
              { value: 'Cosmetics', label: 'Cosmetics' },
              { value: 'Other', label: 'Other' }
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="!py-2 text-xs"
          />
        </div>

        {/* Low Stock checkbox toggle */}
        <div className="w-full md:w-auto shrink-0 flex items-center gap-2.5 px-2">
          <input
            id="low_stock_chk"
            type="checkbox"
            checked={lowStockFilter}
            onChange={(e) => setLowStockFilter(e.target.checked)}
            className="w-4.5 h-4.5 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="low_stock_chk" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
            Low Stock Alerts Only
          </label>
        </div>
      </Card>

      {/* Stock Table */}
      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU Code</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Buy Price</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Sell Price</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Qty</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs font-bold">
                    No products catalog matches the query filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = p.currentStock <= p.minStockLevel;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{p.sku}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{p.name}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{settings.currency}{p.purchasePrice}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{settings.currency}{p.sellingPrice}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold ${isLowStock ? 'text-accent-rose' : 'text-slate-800'}`}>
                            {p.currentStock} {p.unit}
                          </span>
                          {isLowStock && (
                            <Badge variant="danger" size="sm">
                              Low Stock (Min {p.minStockLevel})
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-right flex justify-end gap-2.5">
                        <button 
                          onClick={() => triggerEdit(p)} 
                          className="p-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-slate-400 transition-colors"
                          title="Edit Stock Item"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(p)} 
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-accent-rose rounded-lg text-slate-400 transition-colors"
                          title="Remove Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* ADD PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Product to Stock"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleAddSubmit}>
              Create Product
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4.5 text-left font-semibold">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Product Title Name"
              placeholder="e.g. Britannia Marie Gold 250g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="SKU Code Bar"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Product Category Niche"
              options={[
                { value: 'Grocery', label: 'Grocery Items' },
                { value: 'Packaged Food', label: 'Packaged Food' },
                { value: 'Beverages', label: 'Beverages' },
                { value: 'Dairy', label: 'Dairy' },
                { value: 'Pharmacy', label: 'Pharmacy' },
                { value: 'Apparel', label: 'Apparel' },
                { value: 'Cosmetics', label: 'Cosmetics' },
                { value: 'Other', label: 'Other Category' }
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Unit of Measurement"
              options={[
                { value: 'pcs', label: 'Pieces (pcs)' },
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'liters', label: 'Liters' },
                { value: 'box', label: 'Box / Packs' },
                { value: 'meter', label: 'Meters' }
              ]}
              value={unit}
              onChange={(e: any) => setUnit(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={`Purchase Cost Price (${settings.currency})`}
              type="number"
              value={purchasePrice === 0 ? '' : purchasePrice}
              onChange={(e) => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
            <Input
              label={`Selling Retail Price (${settings.currency})`}
              type="number"
              value={sellingPrice === 0 ? '' : sellingPrice}
              onChange={(e) => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Initial Stock Quantity"
              type="number"
              value={currentStock === 0 ? '' : currentStock}
              onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Min Alert Threshold Stock Level"
              type="number"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <Input
            label="Supplier / Distributor Name (Optional)"
            placeholder="e.g. ITC Wholesale Agents"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* EDIT PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Product ${activeProduct?.sku}`}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="button" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4.5 text-left font-semibold">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Product Title Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="SKU Code Bar"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Product Category Niche"
              options={[
                { value: 'Grocery', label: 'Grocery Items' },
                { value: 'Packaged Food', label: 'Packaged Food' },
                { value: 'Beverages', label: 'Beverages' },
                { value: 'Dairy', label: 'Dairy' },
                { value: 'Pharmacy', label: 'Pharmacy' },
                { value: 'Apparel', label: 'Apparel' },
                { value: 'Cosmetics', label: 'Cosmetics' },
                { value: 'Other', label: 'Other Category' }
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Unit of Measurement"
              options={[
                { value: 'pcs', label: 'Pieces (pcs)' },
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'liters', label: 'Liters' },
                { value: 'box', label: 'Box / Packs' },
                { value: 'meter', label: 'Meters' }
              ]}
              value={unit}
              onChange={(e: any) => setUnit(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label={`Purchase Cost Price (${settings.currency})`}
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
            <Input
              label={`Selling Retail Price (${settings.currency})`}
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Current Stock Quantity"
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <Input
              label="Min Alert Threshold Stock Level"
              type="number"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>

          <Input
            label="Supplier / Distributor Name"
            placeholder="e.g. ITC Wholesale Agents"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Stock Item"
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
          Are you sure you want to remove item <span className="text-slate-800 font-bold">{activeProduct?.name}</span> ({activeProduct?.sku}) from active catalogs?
        </p>
      </Modal>
    </div>
  );
};
