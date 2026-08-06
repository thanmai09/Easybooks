// TypeScript Interfaces

export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'Online' | 'Card' | 'Credit';
  status: 'Paid' | 'Unpaid' | 'Partial';
  notes?: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: 'Inventory' | 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Transport' | 'Other';
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Online' | 'Card' | 'Credit';
  status: 'Paid' | 'Pending';
  description: string;
  reference?: string;
}

export interface CustomerPaymentHistory {
  date: string;
  amount: number;
  type: 'Payment' | 'Purchase';
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName?: string;
  address?: string;
  pendingPayment: number;
  notes?: string;
  createdAt: string;
  paymentHistory: CustomerPaymentHistory[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  unit: 'pcs' | 'kg' | 'liters' | 'box' | 'meter';
  supplierName?: string;
}

export interface CAClient {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  gstStatus: 'Filed' | 'Pending' | 'Overdue';
  lastFilingDate: string;
  turnoverCurrentYear: number;
  taxDue: number;
}

export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    lowStock: boolean;
    pendingPayment: boolean;
    weeklyDigest: boolean;
  };
}

// Raw Static Mock Data (Fallback)

const initialProducts: Product[] = [
  { id: 'p1', name: 'Fortune Soya Health Oil 1L', sku: 'FSO-101', category: 'Grocery', purchasePrice: 140, sellingPrice: 165, currentStock: 45, minStockLevel: 10, unit: 'pcs', supplierName: 'Adani Wilmar Ltd' },
  { id: 'p2', name: 'Ashirvaad Shudh Chakki Atta 5kg', sku: 'ASA-202', category: 'Grocery', purchasePrice: 220, sellingPrice: 260, currentStock: 8, minStockLevel: 15, unit: 'pcs', supplierName: 'ITC Agro' },
  { id: 'p3', name: 'Amul Butter 500g', sku: 'AB-303', category: 'Dairy', purchasePrice: 235, sellingPrice: 275, currentStock: 12, minStockLevel: 5, unit: 'pcs', supplierName: 'Amul Milk Union' },
  { id: 'p4', name: 'Tata Salt 1kg', sku: 'TS-404', category: 'Grocery', purchasePrice: 22, sellingPrice: 28, currentStock: 80, minStockLevel: 20, unit: 'pcs', supplierName: 'Tata Consumer' },
  { id: 'p5', name: 'Maggi 2-Min Noodles 12-Pack', sku: 'MN-505', category: 'Packaged Food', purchasePrice: 156, sellingPrice: 180, currentStock: 3, minStockLevel: 8, unit: 'box', supplierName: 'Nestle India' },
  { id: 'p6', name: 'Coca Cola 750ml', sku: 'CC-606', category: 'Beverages', purchasePrice: 32, sellingPrice: 40, currentStock: 50, minStockLevel: 15, unit: 'pcs', supplierName: 'Hindustan Coca-Cola' },
  { id: 'p7', name: 'Parle-G Gold Biscuit 1kg', sku: 'PG-707', category: 'Packaged Food', purchasePrice: 95, sellingPrice: 110, currentStock: 25, minStockLevel: 10, unit: 'pcs', supplierName: 'Parle Products' },
];

const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@gmail.com',
    businessName: 'Rajesh General Store',
    address: 'Sector 15, Noida, UP',
    pendingPayment: 4200,
    createdAt: '2026-05-10',
    notes: 'Regular customer, usually pays via UPI at end of month.',
    paymentHistory: [
      { date: '2026-08-01', amount: 5000, type: 'Payment', description: 'Cleared July pending balance' },
      { date: '2026-08-03', amount: 4200, type: 'Purchase', description: 'Bought grocery stock' }
    ]
  },
  {
    id: 'c2',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya.sharma@yahoo.com',
    pendingPayment: 0,
    createdAt: '2026-06-15',
    notes: 'Pays instantly via Cash or GPay.',
    paymentHistory: [
      { date: '2026-07-28', amount: 1500, type: 'Purchase', description: 'Purchased cosmetics' },
      { date: '2026-07-28', amount: 1500, type: 'Payment', description: 'Paid via GPay' }
    ]
  },
  {
    id: 'c3',
    name: 'Manish Gupta',
    phone: '+91 76543 21098',
    email: 'manish.gupta@outlook.com',
    businessName: 'Gupta Wholesale',
    address: 'Chandni Chowk, Delhi',
    pendingPayment: 18500,
    createdAt: '2026-04-20',
    notes: 'Requires invoice statement printed every month.',
    paymentHistory: [
      { date: '2026-08-02', amount: 18500, type: 'Purchase', description: 'Bulk packaged food order' }
    ]
  },
  {
    id: 'c4',
    name: 'Anjali Verma',
    phone: '+91 99887 76655',
    email: 'anjali.verma@gmail.com',
    pendingPayment: 850,
    createdAt: '2026-07-02',
    notes: 'Prefers Home delivery.',
    paymentHistory: [
      { date: '2026-08-04', amount: 850, type: 'Purchase', description: 'Grocery items' }
    ]
  }
];

const initialSales: Sale[] = [
  {
    id: 's1',
    invoiceNumber: 'INV-2026-001',
    customerId: 'c1',
    customerName: 'Rajesh Kumar',
    date: '2026-08-03',
    items: [
      { id: 'p1', name: 'Fortune Soya Health Oil 1L', quantity: 10, price: 165, total: 1650 },
      { id: 'p2', name: 'Ashirvaad Shudh Chakki Atta 5kg', quantity: 5, price: 260, total: 1300 },
      { id: 'p3', name: 'Amul Butter 500g', quantity: 4, price: 275, total: 1100 }
    ],
    subtotal: 4050,
    tax: 202.5,
    discount: 52.5,
    total: 4200,
    paymentMethod: 'Credit',
    status: 'Unpaid',
    notes: 'To be collected with monthly bill.'
  },
  {
    id: 's2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'c2',
    customerName: 'Priya Sharma',
    date: '2026-08-04',
    items: [
      { id: 'p4', name: 'Tata Salt 1kg', quantity: 5, price: 28, total: 140 },
      { id: 'p6', name: 'Coca Cola 750ml', quantity: 10, price: 40, total: 400 },
      { id: 'p7', name: 'Parle-G Gold Biscuit 1kg', quantity: 2, price: 110, total: 220 }
    ],
    subtotal: 760,
    tax: 38,
    discount: 0,
    total: 798,
    paymentMethod: 'Online',
    status: 'Paid',
    notes: 'Paid via GPay.'
  },
  {
    id: 's3',
    invoiceNumber: 'INV-2026-003',
    customerId: 'c3',
    customerName: 'Manish Gupta',
    date: '2026-08-05',
    items: [
      { id: 'p5', name: 'Maggi 2-Min Noodles 12-Pack', quantity: 20, price: 180, total: 3600 },
      { id: 'p2', name: 'Ashirvaad Shudh Chakki Atta 5kg', quantity: 30, price: 260, total: 7800 },
      { id: 'p1', name: 'Fortune Soya Health Oil 1L', quantity: 30, price: 165, total: 4950 }
    ],
    subtotal: 16350,
    tax: 817.5,
    discount: 167.5,
    total: 17000,
    paymentMethod: 'Credit',
    status: 'Partial',
    notes: 'Paid 5000 cash advance, balance 12000 as credit.'
  },
  {
    id: 's4',
    invoiceNumber: 'INV-2026-004',
    customerId: 'c4',
    customerName: 'Anjali Verma',
    date: '2026-08-05',
    items: [
      { id: 'p4', name: 'Tata Salt 1kg', quantity: 2, price: 28, total: 56 },
      { id: 'p7', name: 'Parle-G Gold Biscuit 1kg', quantity: 4, price: 110, total: 440 }
    ],
    subtotal: 496,
    tax: 24.8,
    discount: 0,
    total: 520.8,
    paymentMethod: 'Cash',
    status: 'Paid'
  }
];

const initialExpenses: Expense[] = [
  { id: 'e1', expenseNumber: 'EXP-2026-001', category: 'Rent', amount: 15000, date: '2026-08-01', paymentMethod: 'Online', status: 'Paid', description: 'Monthly shop rent' },
  { id: 'e2', expenseNumber: 'EXP-2026-002', category: 'Utilities', amount: 2450, date: '2026-08-02', paymentMethod: 'Online', status: 'Paid', description: 'Electricity Bill' },
  { id: 'e3', expenseNumber: 'EXP-2026-003', category: 'Salaries', amount: 8000, date: '2026-08-05', paymentMethod: 'Cash', status: 'Paid', description: 'Salary for helper Raju' },
  { id: 'e4', expenseNumber: 'EXP-2026-004', category: 'Inventory', amount: 12000, date: '2026-08-04', paymentMethod: 'Online', status: 'Paid', description: 'Purchased grocery stock from wholesaler' },
  { id: 'e5', expenseNumber: 'EXP-2026-005', category: 'Marketing', amount: 1500, date: '2026-08-05', paymentMethod: 'Card', status: 'Pending', description: 'Pamphlet distribution print' }
];

const initialCAClients: CAClient[] = [
  { id: 'cac1', businessName: 'Aman Retail Mart', ownerName: 'Aman Bansal', phone: '+91 99887 71122', email: 'aman.retail@gmail.com', gstStatus: 'Filed', lastFilingDate: '2026-07-20', turnoverCurrentYear: 1850000, taxDue: 0 },
  { id: 'cac2', businessName: 'Organic Greens Store', ownerName: 'Sumit Joshi', phone: '+91 99112 23344', email: 'sumit.greens@gmail.com', gstStatus: 'Pending', lastFilingDate: '2026-06-18', turnoverCurrentYear: 920000, taxDue: 18500 },
  { id: 'cac3', businessName: 'Classic Salons & Spa', ownerName: 'Rekha Sen', phone: '+91 98877 66221', email: 'rekha.classic@yahoo.com', gstStatus: 'Overdue', lastFilingDate: '2026-05-15', turnoverCurrentYear: 1450000, taxDue: 45000 }
];

const defaultSettings: BusinessSettings = {
  businessName: 'Apna Bazar Groceries',
  ownerName: 'Sunil Malhotra',
  email: 'sunil.apnabazar@gmail.com',
  phone: '+91 95550 12345',
  address: 'Shop No. 12, Green View Market, Sector 62, Noida, UP - 201301',
  gstin: '09AAAAA1111A1Z1',
  currency: '₹',
  language: 'English',
  theme: 'light',
  notifications: {
    lowStock: true,
    pendingPayment: true,
    weeklyDigest: false
  }
};

// LocalStorage Keys
const KEYS = {
  SALES: 'ac_pwa_sales',
  EXPENSES: 'ac_pwa_expenses',
  CUSTOMERS: 'ac_pwa_customers',
  PRODUCTS: 'ac_pwa_products',
  CA_CLIENTS: 'ac_pwa_ca_clients',
  SETTINGS: 'ac_pwa_settings'
};

// Initialize LocalStorage with default mock data if empty
export const initializeMockDB = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
  }
  if (!localStorage.getItem(KEYS.SALES)) {
    localStorage.setItem(KEYS.SALES, JSON.stringify(initialSales));
  }
  if (!localStorage.getItem(KEYS.EXPENSES)) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(initialExpenses));
  }
  if (!localStorage.getItem(KEYS.CA_CLIENTS)) {
    localStorage.setItem(KEYS.CA_CLIENTS, JSON.stringify(initialCAClients));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
};

// DB Getter/Setter Functions

export const getProducts = (): Product[] => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getCustomers = (): Customer[] => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.CUSTOMERS) || '[]');
};

export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
};

export const getSales = (): Sale[] => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.SALES) || '[]');
};

export const saveSales = (sales: Sale[]) => {
  localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
};

export const getExpenses = (): Expense[] => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.EXPENSES) || '[]');
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getCAClients = (): CAClient[] => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.CA_CLIENTS) || '[]');
};

export const saveCAClients = (clients: CAClient[]) => {
  localStorage.setItem(KEYS.CA_CLIENTS, JSON.stringify(clients));
};

export const getSettings = (): BusinessSettings => {
  initializeMockDB();
  return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(defaultSettings));
};

export const saveSettings = (settings: BusinessSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// Aggregated / Analytical Data Generators

export const getFinancialSummary = () => {
  const sales = getSales();
  const expenses = getExpenses();
  const customers = getCustomers();
  const products = getProducts();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const pendingPayments = customers.reduce((sum, c) => sum + c.pendingPayment, 0);

  // Today's Date representation in mock data is '2026-08-05' for the demo
  const today = '2026-08-05';
  const todaySales = sales.filter(s => s.date === today).reduce((sum, s) => sum + s.total, 0);
  const todayExpenses = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);

  // Low stock products count
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;

  return {
    totalSales,
    totalExpenses,
    netProfit,
    pendingPayments,
    todaySales,
    todayExpenses,
    lowStockCount,
  };
};

// Sales Trends, Cash Flow, and Category Breakdown mock chart stats
export const getChartData = () => {
  const salesTrend = [
    { label: 'Mon', sales: 4200, expenses: 15000 },
    { label: 'Tue', sales: 6500, expenses: 2450 },
    { label: 'Wed', sales: 12000, expenses: 8000 },
    { label: 'Thu', sales: 9800, expenses: 4000 },
    { label: 'Fri', sales: 17500, expenses: 3500 },
    { label: 'Sat', sales: 22000, expenses: 6000 },
    { label: 'Sun', sales: 18000, expenses: 2000 }
  ];

  const expenseBreakdown = [
    { category: 'Inventory', amount: 12000, percentage: 40, color: '#4f46e5' },
    { category: 'Rent', amount: 15000, percentage: 50, color: '#06b6d4' },
    { category: 'Utilities', amount: 2450, percentage: 8, color: '#f59e0b' },
    { category: 'Other', amount: 500, percentage: 2, color: '#f43f5e' }
  ];

  const monthlyCashflow = [
    { month: 'Mar', inflow: 120000, outflow: 80000 },
    { month: 'Apr', inflow: 145000, outflow: 95000 },
    { month: 'May', inflow: 160000, outflow: 110000 },
    { month: 'Jun', inflow: 185000, outflow: 120000 },
    { month: 'Jul', inflow: 210000, outflow: 135000 },
    { month: 'Aug', inflow: 240000, outflow: 148000 }
  ];

  return {
    salesTrend,
    expenseBreakdown,
    monthlyCashflow
  };
};

// Notifications list
export const getNotifications = () => {
  const products = getProducts();
  const customers = getCustomers();
  const notifications: any[] = [];

  // Low stock notifications
  products.forEach(p => {
    if (p.currentStock <= p.minStockLevel) {
      notifications.push({
        id: `noti-low-${p.id}`,
        type: 'alert',
        title: 'Low Stock Alert',
        message: `${p.name} has only ${p.currentStock} ${p.unit} remaining.`,
        time: 'Just now'
      });
    }
  });

  // Pending payment reminders
  customers.forEach(c => {
    if (c.pendingPayment > 0) {
      notifications.push({
        id: `noti-pay-${c.id}`,
        type: 'reminder',
        title: 'Pending Payment',
        message: `${c.name} has a pending balance of ₹${c.pendingPayment}.`,
        time: '2 hours ago'
      });
    }
  });

  return notifications;
};
