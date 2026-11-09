import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Boxes, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  FileSpreadsheet, 
  Plus, 
  Download, 
  ChevronRight,
  ChevronDown,
  Info,
  Menu,
  X,
  Search,
  Pencil,
  Trash2
} from 'lucide-react';

// Seed Series Jaket Venne Kids
const INITIAL_SERIES = [
  'Eira', 'Kavi', 'Elora', 'Aruna', 'Mysha', 'Spade', 
  'Gamblr', 'Pixie', 'Hakgyo', 'Sixn', 'Zeno', 'Obby', 
  'Elio', 'Ziva', 'Rava', 'Nasya', 'Aelio', 'Zavi', 
  'Hrly', 'Arka', 'Chester', 'Hero Series Atrax'
];

// 1. Kategori: Warna Polos (15 Varian)
const SOLID_COLORS = [
  { name: 'Denim', code: 'DNM', hex: '#4A6B82' },
  { name: 'Mustard', code: 'MST', hex: '#D99B26' },
  { name: 'Mint', code: 'MNT', hex: '#98D8C8' },
  { name: 'Dusty Pink', code: 'DPK', hex: '#DCAE96' },
  { name: 'Hitam', code: 'BLK', hex: '#1E293B' },
  { name: 'Dark Grey', code: 'DGR', hex: '#4B5563' },
  { name: 'Cream', code: 'CRM', hex: '#F5E6D3' },
  { name: 'Cappucino', code: 'CPC', hex: '#A67B5B' },
  { name: 'Burgundy', code: 'BRG', hex: '#6D1A36' },
  { name: 'Navy', code: 'NVY', hex: '#1B2A4A' },
  { name: 'Caramel', code: 'CML', hex: '#C67D3B' },
  { name: 'Olive', code: 'OLV', hex: '#556B2F' },
  { name: 'Sky Blue', code: 'SKY', hex: '#7BC4E2' },
  { name: 'Lilac', code: 'LLC', hex: '#C8A2C8' },
  { name: 'Coffee', code: 'CFE', hex: '#4B3621' }
];

// 2. Kategori: Kombinasi (14 Varian - 7 pasang bolak-balik)
const COMBO_PAIRS = [
  ['CP', 'Denim', 'CPDNM', 'DNMCP', '#A67B5B', '#4A6B82'],
  ['CP', 'Mustard', 'CPMST', 'MSTCP', '#A67B5B', '#D99B26'],
  ['CP', 'Dusty Pink', 'CPDPK', 'DPKCP', '#A67B5B', '#DCAE96'],
  ['CP', 'Mint', 'CPMNT', 'MNTCP', '#A67B5B', '#98D8C8'],
  ['CP', 'Dark Grey', 'CPDGR', 'DGRCP', '#A67B5B', '#4B5563'],
  ['CP', 'Coffee', 'CPCFE', 'CFECP', '#A67B5B', '#4B3621'],
  ['CP', 'Burgundy', 'CPBRG', 'BRGCP', '#A67B5B', '#6D1A36']
];

const COMBO_COLORS = COMBO_PAIRS.flatMap(([c1, c2, code1, code2, hex1, hex2]) => [
  { name: `${c1}-${c2}`, code: code1, hex: hex1, hex2: hex2, isCombo: true },
  { name: `${c2}-${c1}`, code: code2, hex: hex2, hex2: hex1, isCombo: true }
]);

// 3. Kategori: Plif (8 Varian - 4 pasang bolak-balik)
const PLIF_PAIRS = [
  ['WH', 'Caramel', 'WHCML', 'CMLWH', '#FFFFFF', '#C67D3B'],
  ['WH', 'Navy', 'WHNVY', 'NVYWH', '#FFFFFF', '#1B2A4A'],
  ['CP', 'Olive', 'CPOLV', 'OLVCP', '#A67B5B', '#556B2F'],
  ['Navy', 'Mustard', 'NVYMST', 'MSTNVY', '#1B2A4A', '#D99B26']
];

const PLIF_COLORS = PLIF_PAIRS.flatMap(([c1, c2, code1, code2, hex1, hex2]) => [
  { name: `${c1}-${c2}`, code: code1, hex: hex1, hex2: hex2, isCombo: true },
  { name: `${c2}-${c1}`, code: code2, hex: hex2, hex2: hex1, isCombo: true }
]);

const ALL_COLORS = [
  ...SOLID_COLORS.map(c => ({ ...c, type: 'Polos' })),
  ...COMBO_COLORS.map(c => ({ ...c, type: 'Kombinasi' })),
  ...PLIF_COLORS.map(c => ({ ...c, type: 'Plif' }))
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openColorDrawer, setOpenColorDrawer] = useState(null);
  const [colorFilterType, setColorFilterType] = useState('ALL'); // ALL, Polos, Kombinasi, Plif
  const [colorSearch, setColorSearch] = useState('');

  const [currentUser, setCurrentUser] = useState({
    id: 'USR-01',
    name: 'Aldo (Owner)',
    role: 'OWNER' // OWNER, ADMIN, GUDANG
  });

  // State Data Operasional
  const [skus, setSkus] = useState(() => {
    const saved = localStorage.getItem('vk_skus');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('vk_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vk_skus', JSON.stringify(skus));
  }, [skus]);

  useEffect(() => {
    localStorage.setItem('vk_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Helper Generate Kode SKU
  const generateSkuCode = (seriesName, colorName, sizeVal) => {
    const colorObj = ALL_COLORS.find(c => c.name === colorName);
    const colorCode = colorObj ? colorObj.code : colorName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
    const seriesCode = seriesName.replace(/\s+/g, '').toUpperCase().slice(0, 4);
    return `JKT-${seriesCode}-${colorCode}-${String(sizeVal).padStart(2, '0')}`;
  };

  // Kalkulasi Stok Aktual Otomatis
  const inventoryData = useMemo(() => {
    return skus.map(sku => {
      const skuTx = transactions.filter(t => t.skuId === sku.id && !t.isReversed);
      const totalIn = skuTx.filter(t => t.type === 'IN').reduce((acc, curr) => acc + curr.qty, 0);
      const totalOut = skuTx.filter(t => t.type === 'OUT').reduce((acc, curr) => acc + curr.qty, 0);
      const actualStock = (sku.initialStock || 0) + totalIn - totalOut;

      let status = 'In Stock';
      if (actualStock <= 0) status = 'Out of Stock';
      else if (actualStock <= (sku.minStock || 5)) status = 'Low Stock';

      return {
        ...sku,
        totalIn,
        totalOut,
        actualStock,
        status
      };
    });
  }, [skus, transactions]);

  // Rekap Data Berdasarkan Warna untuk Drawer Katalog Warna
  const colorCatalogData = useMemo(() => {
    return ALL_COLORS.map(colorObj => {
      const matchingSkus = inventoryData.filter(
        item => item.color.toLowerCase() === colorObj.name.toLowerCase()
      );
      const totalJaket = matchingSkus.reduce((acc, curr) => acc + curr.actualStock, 0);

      const seriesBreakdown = {};
      matchingSkus.forEach(item => {
        if (!seriesBreakdown[item.series]) {
          seriesBreakdown[item.series] = {
            series: item.series,
            totalSeriesStock: 0,
            sizes: []
          };
        }
        seriesBreakdown[item.series].totalSeriesStock += item.actualStock;
        seriesBreakdown[item.series].sizes.push(item);
      });

      return {
        ...colorObj,
        totalJaket,
        skuCount: matchingSkus.length,
        seriesList: Object.values(seriesBreakdown)
      };
    });
  }, [inventoryData]);

  const filteredColors = useMemo(() => {
    return colorCatalogData.filter(c => {
      const matchType = colorFilterType === 'ALL' || c.type === colorFilterType;
      const matchSearch = c.name.toLowerCase().includes(colorSearch.toLowerCase());
      return matchType && matchSearch;
    });
  }, [colorCatalogData, colorFilterType, colorSearch]);

  // Statistik Dashboard
  const stats = useMemo(() => {
    const totalSKU = inventoryData.length;
    const totalStock = inventoryData.reduce((acc, i) => acc + i.actualStock, 0);
    const totalIn = transactions.filter(t => t.type === 'IN' && !t.isReversed).reduce((acc, t) => acc + t.qty, 0);
    const totalOut = transactions.filter(t => t.type === 'OUT' && !t.isReversed).reduce((acc, t) => acc + t.qty, 0);
    const lowStockCount = inventoryData.filter(i => i.status === 'Low Stock').length;
    const outOfStockCount = inventoryData.filter(i => i.status === 'Out of Stock').length;

    const baseStock = inventoryData.reduce((acc, i) => acc + (i.initialStock || 0), 0) + totalIn;
    const outPercentage = baseStock > 0 ? ((totalOut / baseStock) * 100).toFixed(1) : 0;

    return { totalSKU, totalStock, totalIn, totalOut, lowStockCount, outOfStockCount, outPercentage };
  }, [inventoryData, transactions]);

  // Form Tambah SKU Baru
  const [skuModal, setSkuModal] = useState(false);
  const [newSku, setNewSku] = useState({
    series: INITIAL_SERIES[0],
    color: ALL_COLORS[0].name,
    size: '4',
    initialStock: 0,
    minStock: 5
  });

  const handleCreateSku = (e) => {
    e.preventDefault();
    const generatedSku = generateSkuCode(newSku.series, newSku.color, newSku.size);
    
    if (skus.some(s => s.skuCode === generatedSku)) {
      alert('SKU dengan variasi Series, Warna, dan Ukuran ini sudah ada!');
      return;
    }

    const skuItem = {
      id: `SKU-${Date.now()}`,
      skuCode: generatedSku,
      product: 'Jaket',
      series: newSku.series,
      color: newSku.color,
      size: newSku.size,
      initialStock: Number(newSku.initialStock),
      minStock: Number(newSku.minStock)
    };

    setSkus([...skus, skuItem]);
    setSkuModal(false);
  };

  // State & Fungsi Edit SKU
  const [editSkuModal, setEditSkuModal] = useState(null);

  const openEditModal = (skuItem) => {
    setEditSkuModal({
      id: skuItem.id,
      series: skuItem.series,
      color: skuItem.color,
      size: skuItem.size,
      initialStock: skuItem.initialStock,
      minStock: skuItem.minStock
    });
  };

  const handleUpdateSku = (e) => {
    e.preventDefault();
    const updatedSkuCode = generateSkuCode(editSkuModal.series, editSkuModal.color, editSkuModal.size);

    if (skus.some(s => s.skuCode === updatedSkuCode && s.id !== editSkuModal.id)) {
      alert('Variasi SKU ini sudah terdaftar pada item lain!');
      return;
    }

    setSkus(skus.map(s => s.id === editSkuModal.id ? {
      ...s,
      skuCode: updatedSkuCode,
      series: editSkuModal.series,
      color: editSkuModal.color,
      size: editSkuModal.size,
      initialStock: Number(editSkuModal.initialStock),
      minStock: Number(editSkuModal.minStock)
    } : s));

    setTransactions(transactions.map(t => t.skuId === editSkuModal.id ? {
      ...t,
      skuCode: updatedSkuCode,
      series: editSkuModal.series,
      color: editSkuModal.color,
      size: editSkuModal.size
    } : t));

    setEditSkuModal(null);
  };

  const handleDeleteSku = (skuItem) => {
    if (currentUser.role === 'GUDANG') {
      alert('Role GUDANG tidak memiliki akses untuk menghapus SKU.');
      return;
    }
    if (confirm(`Hapus SKU ${skuItem.skuCode} (${skuItem.color} - ${skuItem.series} Size ${skuItem.size})?`)) {
      setSkus(skus.filter(s => s.id !== skuItem.id));
    }
  };

  // Form Transaksi In / Out
  const [txModal, setTxModal] = useState(null);
  const [txForm, setTxForm] = useState({
    skuId: '',
    category: 'Hasil produksi',
    channel: 'Penjualan Shopee',
    qty: 1,
    referenceNo: '',
    notes: ''
  });

  const openQuickTx = (type, skuId) => {
    setTxForm({
      skuId: skuId,
      category: 'Hasil produksi',
      channel: 'Penjualan Shopee',
      qty: 1,
      referenceNo: '',
      notes: ''
    });
    setTxModal(type);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const selectedSku = inventoryData.find(i => i.id === txForm.skuId);
    if (!selectedSku) {
      alert('Pilih SKU terlebih dahulu!');
      return;
    }

    if (txModal === 'OUT' && txForm.qty > selectedSku.actualStock) {
      if (txForm.channel !== 'Koreksi stok negatif' || currentUser.role !== 'OWNER') {
        alert('Stok tidak mencukupi! Hanya OWNER yang dapat melakukan pengurangan melebihi stok via Koreksi Stok Negatif.');
        return;
      }
    }

    const newTx = {
      id: `TX-${Date.now()}`,
      skuId: txForm.skuId,
      skuCode: selectedSku.skuCode,
      series: selectedSku.series,
      color: selectedSku.color,
      size: selectedSku.size,
      type: txModal,
      category: txModal === 'IN' ? txForm.category : txForm.channel,
      qty: Number(txForm.qty),
      referenceNo: txForm.referenceNo || '-',
      notes: txForm.notes || '-',
      user: currentUser.name,
      role: currentUser.role,
      createdAt: new Date().toLocaleString('id-ID'),
      isReversed: false
    };

    setTransactions([newTx, ...transactions]);
    setTxModal(null);
    setTxForm({ skuId: '', category: 'Hasil produksi', channel: 'Penjualan Shopee', qty: 1, referenceNo: '', notes: '' });
  };

  const handleReverseTransaction = (txId) => {
    if (currentUser.role !== 'OWNER') {
      alert('Hanya role OWNER yang dapat melakukan pembatalan (reversal) transaksi.');
      return;
    }
    if (confirm('Apakah Anda yakin ingin membatalkan transaksi ini? Audit trail akan tetap tersimpan.')) {
      setTransactions(transactions.map(t => t.id === txId ? { ...t, isReversed: true, reversedBy: currentUser.name } : t));
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['SKU,Produk,Series,Warna,Ukuran,Stok Awal,Total Masuk,Total Keluar,Stok Aktual,Status'];
    const rows = inventoryData.map(i => 
      `"${i.skuCode}","${i.product}","${i.series}","${i.color}","${i.size}",${i.initialStock},${i.totalIn},${i.totalOut},${i.actualStock},"${i.status}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VenneKids_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* Overlay Gelap saat Sidebar dibuka di HP */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Responsif */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Boxes className="text-blue-500 w-6 h-6 shrink-0" /> VENNE KIDS
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">Inventory System</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'colors', label: 'Katalog Warna', icon: Palette },
              { id: 'inventory', label: 'Inventory / Stok', icon: Boxes },
              { id: 'history', label: 'Riwayat Transaksi', icon: History },
              { id: 'reports', label: 'Laporan', icon: FileSpreadsheet }
            ].map(menu => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => {
                    setActiveTab(menu.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{menu.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Switch Role */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3 rounded-lg mb-2">
            <div className="text-xs text-slate-400">Login Sebagai:</div>
            <div className="text-sm font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] font-bold text-blue-400 mt-0.5 tracking-wider uppercase">{currentUser.role}</div>
          </div>
          <div className="flex gap-1">
            {['OWNER', 'ADMIN', 'GUDANG'].map(r => (
              <button
                key={r}
                onClick={() => setCurrentUser({ id: `USR-${r}`, name: `Staff ${r}`, role: r })}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded border transition ${
                  currentUser.role === r ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-slate-800 capitalize truncate">
              {activeTab === 'colors' ? 'Katalog Warna Jaket' : activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setTxModal('IN')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-lg transition shadow-xs"
            >
              <ArrowDownToLine className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Barang</span> Masuk
            </button>
            <button
              onClick={() => setTxModal('OUT')}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-lg transition shadow-xs"
            >
              <ArrowUpFromLine className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Barang</span> Keluar
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total SKU Aktif</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1 md:mt-2">{stats.totalSKU}</div>
                  <div className="text-[11px] md:text-xs text-slate-500 mt-1">Polos, Kombinasi & Plif</div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stok Fisik</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-blue-600 mt-1 md:mt-2">{stats.totalStock}</div>
                  <div className="text-[11px] md:text-xs text-slate-500 mt-1">Pcs Tersisa di Gudang</div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Barang Keluar</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-rose-600 mt-1 md:mt-2">{stats.totalOut}</div>
                  <div className="text-[11px] md:text-xs text-slate-500 mt-1">Total keluar ({stats.outPercentage}%)</div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Stok Menipis / Habis</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-amber-500 mt-1 md:mt-2">
                    {stats.lowStockCount} <span className="text-xs md:text-sm font-normal text-slate-400">/ {stats.outOfStockCount}</span>
                  </div>
                  <div className="text-[11px] md:text-xs text-amber-600 mt-1">Perlu Restock</div>
                </div>
              </div>

              {/* Ringkasan Cepat di Dashboard */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">Status Stok Cepat</h3>
                  <button onClick={() => setActiveTab('colors')} className="text-xs md:text-sm text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                    Buka Drawer Warna <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full text-left text-xs md:text-sm min-w-[520px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase">
                        <th className="pb-3 pr-2">SKU</th>
                        <th className="pb-3 px-2">Warna</th>
                        <th className="pb-3 px-2">Series / Size</th>
                        <th className="pb-3 px-2">Stok Aktual</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 pl-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventoryData.slice(0, 5).map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3 pr-2 font-mono font-semibold text-slate-700">{item.skuCode}</td>
                          <td className="py-3 px-2 font-semibold text-slate-800">{item.color}</td>
                          <td className="py-3 px-2 text-slate-600">{item.series} - Size {item.size}</td>
                          <td className="py-3 px-2 font-bold text-slate-900">{item.actualStock} pcs</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                              item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 pl-2 text-right">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                              title="Edit SKU"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {inventoryData.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400 text-xs md:text-sm">
                            Belum ada variasi SKU. Buka menu <strong>Inventory / Stok</strong> atau <strong>Katalog Warna</strong> untuk menambahkan stok.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* KATALOG WARNA (DRAWER / ACCORDION) TAB */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 md:p-4 rounded-xl flex items-start md:items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-start md:items-center gap-3">
                  <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5 md:mt-0" />
                  <span>
                    Klik pada baris warna untuk membuka <strong>Drawer Rincian</strong>. Tersedia kategori <strong>Polos (15)</strong>, <strong>Kombinasi (14)</strong>, dan <strong>Plif (8)</strong>.
                  </span>
                </div>
                <button
                  onClick={() => setSkuModal(true)}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Tambah SKU
                </button>
              </div>

              {/* Filter Kategori Warna (Semua | Polos | Kombinasi | Plif) & Pencarian */}
              <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: 'ALL', label: `Semua (${ALL_COLORS.length})` },
                    { id: 'Polos', label: `Warna Polos (${SOLID_COLORS.length})` },
                    { id: 'Kombinasi', label: `Kombinasi (${COMBO_COLORS.length})` },
                    { id: 'Plif', label: `Plif (${PLIF_COLORS.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setColorFilterType(tab.id)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                        colorFilterType === tab.id ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari warna (misal: WH-Navy, Olive)..."
                    value={colorSearch}
                    onChange={e => setColorSearch(e.target.value)}
                    className="w-full lg:w-64 pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Daftar Drawer Warna */}
              <div className="space-y-2.5">
                {filteredColors.map(colorItem => {
                  const isOpen = openColorDrawer === colorItem.name;
                  return (
                    <div 
                      key={colorItem.name} 
                      className={`bg-white rounded-xl border transition-all overflow-hidden ${
                        isOpen ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <button
                        onClick={() => setOpenColorDrawer(isOpen ? null : colorItem.name)}
                        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {colorItem.isCombo ? (
                            <div className="w-8 h-8 rounded-full border border-slate-300 overflow-hidden flex shrink-0 shadow-inner">
                              <div className="w-1/2 h-full" style={{ backgroundColor: colorItem.hex }} />
                              <div className="w-1/2 h-full" style={{ backgroundColor: colorItem.hex2 }} />
                            </div>
                          ) : (
                            <div 
                              className="w-8 h-8 rounded-full border border-slate-300 shrink-0 shadow-inner"
                              style={{ backgroundColor: colorItem.hex }}
                            />
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-800 text-sm md:text-base">{colorItem.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                colorItem.type === 'Polos' ? 'bg-slate-100 text-slate-600' : 
                                colorItem.type === 'Kombinasi' ? 'bg-indigo-50 text-indigo-600' :
                                'bg-purple-50 text-purple-600'
                              }`}>
                                {colorItem.type}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">#{colorItem.code}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {colorItem.seriesList.length > 0 
                                ? `Tersedia di ${colorItem.seriesList.length} Series (${colorItem.skuCount} SKU)` 
                                : 'Belum ada SKU terdaftar di warna ini'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className={`text-sm md:text-base font-extrabold ${
                              colorItem.totalJaket > 0 ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                              {colorItem.totalJaket} Jaket
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Total Stok</div>
                          </div>
                          <div className={`p-1.5 rounded-lg transition-transform ${isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'text-slate-400'}`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      </button>

                      {/* Isi Drawer */}
                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500">
                              Daftar Series & Ukuran untuk warna <strong>{colorItem.name} ({colorItem.type})</strong>:
                            </span>
                            <button
                              onClick={() => {
                                setNewSku({ ...newSku, color: colorItem.name });
                                setSkuModal(true);
                              }}
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" /> Tambah Ukuran / Series di Warna Ini
                            </button>
                          </div>

                          {colorItem.seriesList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {colorItem.seriesList.map(sGroup => (
                                <div key={sGroup.series} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2.5">
                                    <div>
                                      <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Series</span>
                                      <h4 className="font-bold text-slate-800 text-sm">Jaket {sGroup.series}</h4>
                                    </div>
                                    <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-2.5 py-1 rounded-full">
                                      Total: {sGroup.totalSeriesStock} pcs
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {sGroup.sizes.map(sz => (
                                      <div key={sz.id} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                        <div>
                                          <div className="font-bold text-slate-800">Ukuran {sz.size}</div>
                                          <div className="font-mono text-[10px] text-slate-400">{sz.skuCode}</div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="font-extrabold text-slate-900 mr-1">{sz.actualStock} pcs</span>
                                          
                                          <button
                                            onClick={() => openQuickTx('IN', sz.id)}
                                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold rounded text-[11px]"
                                            title="Tambah Stok Masuk"
                                          >
                                            + Masuk
                                          </button>
                                          <button
                                            onClick={() => openQuickTx('OUT', sz.id)}
                                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded text-[11px]"
                                            title="Kurangi Stok Keluar"
                                          >
                                            - Keluar
                                          </button>
                                          <button
                                            onClick={() => openEditModal(sz)}
                                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            title="Edit SKU / Stok Awal"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-white rounded-lg border border-dashed border-slate-200">
                              <p className="text-xs md:text-sm text-slate-500">
                                Belum ada jaket yang diinput untuk warna <strong>{colorItem.name}</strong>.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INVENTORY / STOK TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-2 bg-white p-3 md:p-4 rounded-xl border border-slate-200">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSkuModal(true)}
                    className="flex-1 sm:flex-initial justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Tambah Variasi SKU
                  </button>
                  <button
                    onClick={exportCSV}
                    className="flex-1 sm:flex-initial justify-center flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm min-w-[720px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                      <tr>
                        <th className="p-3 md:p-4">SKU</th>
                        <th className="p-3 md:p-4">Warna</th>
                        <th className="p-3 md:p-4">Series</th>
                        <th className="p-3 md:p-4">Ukuran</th>
                        <th className="p-3 md:p-4 text-center">Stok Awal</th>
                        <th className="p-3 md:p-4 text-center text-emerald-600">Masuk</th>
                        <th className="p-3 md:p-4 text-center text-rose-600">Keluar</th>
                        <th className="p-3 md:p-4 text-center font-bold">Stok Aktual</th>
                        <th className="p-3 md:p-4">Status</th>
                        <th className="p-3 md:p-4 text-right">Aksi / Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventoryData.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 md:p-4 font-mono font-bold text-blue-600 whitespace-nowrap">{item.skuCode}</td>
                          <td className="p-3 md:p-4 font-semibold text-slate-800">{item.color}</td>
                          <td className="p-3 md:p-4 text-slate-600">{item.series}</td>
                          <td className="p-3 md:p-4 text-slate-600">{item.size}</td>
                          <td className="p-3 md:p-4 text-center text-slate-500">{item.initialStock}</td>
                          <td className="p-3 md:p-4 text-center font-medium text-emerald-600">+{item.totalIn}</td>
                          <td className="p-3 md:p-4 text-center font-medium text-rose-600">-{item.totalOut}</td>
                          <td className="p-3 md:p-4 text-center font-extrabold text-slate-900 bg-slate-50/50">{item.actualStock}</td>
                          <td className="p-3 md:p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                              item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => openQuickTx('IN', item.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded text-xs"
                                title="Barang Masuk"
                              >
                                +
                              </button>
                              <button
                                onClick={() => openQuickTx('OUT', item.id)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-xs"
                                title="Barang Keluar"
                              >
                                -
                              </button>
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                                title="Edit SKU / Ubah Stok Awal"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {currentUser.role !== 'GUDANG' && (
                                <button
                                  onClick={() => handleDeleteSku(item)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                                  title="Hapus SKU"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {inventoryData.length === 0 && (
                        <tr>
                          <td colSpan="10" className="p-8 text-center text-slate-400">
                            Data inventory masih kosong. Klik tombol <strong>Tambah Variasi SKU</strong> di atas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RIWAYAT TRANSAKSI TAB */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="p-3 md:p-4">Waktu</th>
                      <th className="p-3 md:p-4">SKU / Warna & Series</th>
                      <th className="p-3 md:p-4">Tipe</th>
                      <th className="p-3 md:p-4">Kategori / Saluran</th>
                      <th className="p-3 md:p-4">Jumlah</th>
                      <th className="p-3 md:p-4">User</th>
                      <th className="p-3 md:p-4">Aksi (Owner)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(t => (
                      <tr key={t.id} className={t.isReversed ? 'bg-slate-50 opacity-50' : 'hover:bg-slate-50'}>
                        <td className="p-3 md:p-4 text-xs text-slate-500 whitespace-nowrap">{t.createdAt}</td>
                        <td className="p-3 md:p-4">
                          <div className="font-mono font-bold text-slate-800">{t.skuCode}</div>
                          <div className="text-xs text-slate-500">{t.color} • {t.series} (Size {t.size})</div>
                        </td>
                        <td className="p-3 md:p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            t.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 text-slate-600">{t.category}</td>
                        <td className="p-3 md:p-4 font-bold text-slate-900 whitespace-nowrap">{t.qty} pcs</td>
                        <td className="p-3 md:p-4 text-xs text-slate-600">{t.user}</td>
                        <td className="p-3 md:p-4">
                          {t.isReversed ? (
                            <span className="text-xs text-rose-500 font-semibold italic">Dibatalkan</span>
                          ) : (
                            currentUser.role === 'OWNER' && (
                              <button
                                onClick={() => handleReverseTransaction(t.id)}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                              >
                                Reversal
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400">
                          Belum ada catatan transaksi barang masuk atau keluar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LAPORAN TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 text-center">
              <FileSpreadsheet className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-base md:text-lg font-bold text-slate-800">Export Laporan Gudang</h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Unduh rekapitulasi data persediaan barang secara komprehensif dalam format CSV untuk diolah lebih lanjut di Excel.
              </p>
              <button
                onClick={exportCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Laporan Inventory (.CSV)
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL TAMBAH VARIANT / SKU BARU */}
      {skuModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Tambah Variasi SKU Baru</h3>
            <form onSubmit={handleCreateSku} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Warna Jaket</label>
                <select
                  value={newSku.color}
                  onChange={e => setNewSku({ ...newSku, color: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                >
                  <optgroup label="Warna Polos (15 Varian)">
                    {SOLID_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Warna Kombinasi (14 Varian)">
                    {COMBO_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Warna Plif (8 Varian)">
                    {PLIF_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Series</label>
                  <select
                    value={newSku.series}
                    onChange={e => setNewSku({ ...newSku, series: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    {INITIAL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ukuran</label>
                  <input
                    type="text"
                    required
                    placeholder="4, 6, 8, 10, 12"
                    value={newSku.size}
                    onChange={e => setNewSku({ ...newSku, size: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stok Awal Fisik</label>
                  <input
                    type="number"
                    min="0"
                    value={newSku.initialStock}
                    onChange={e => setNewSku({ ...newSku, initialStock: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Alert Stok</label>
                  <input
                    type="number"
                    min="1"
                    value={newSku.minStock}
                    onChange={e => setNewSku({ ...newSku, minStock: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSkuModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Simpan SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT SKU */}
      {editSkuModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Edit Data SKU</h3>
            <form onSubmit={handleUpdateSku} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Warna Jaket</label>
                <select
                  value={editSkuModal.color}
                  onChange={e => setEditSkuModal({ ...editSkuModal, color: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                >
                  <optgroup label="Warna Polos (15 Varian)">
                    {SOLID_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Warna Kombinasi (14 Varian)">
                    {COMBO_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Warna Plif (8 Varian)">
                    {PLIF_COLORS.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Series</label>
                  <select
                    value={editSkuModal.series}
                    onChange={e => setEditSkuModal({ ...editSkuModal, series: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    {INITIAL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ukuran</label>
                  <input
                    type="text"
                    required
                    value={editSkuModal.size}
                    onChange={e => setEditSkuModal({ ...editSkuModal, size: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stok Awal Fisik</label>
                  <input
                    type="number"
                    min="0"
                    value={editSkuModal.initialStock}
                    onChange={e => setEditSkuModal({ ...editSkuModal, initialStock: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Alert Stok</label>
                  <input
                    type="number"
                    min="1"
                    value={editSkuModal.minStock}
                    onChange={e => setEditSkuModal({ ...editSkuModal, minStock: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditSkuModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT TRANSAKSI (IN / OUT) */}
      {txModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">
              Form {txModal === 'IN' ? 'Barang Masuk (Stock In)' : 'Barang Keluar (Stock Out)'}
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih SKU Produk</label>
                <select
                  required
                  value={txForm.skuId}
                  onChange={e => setTxForm({ ...txForm, skuId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono"
                >
                  <option value="">-- Pilih Variasi SKU --</option>
                  {inventoryData.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.skuCode} | {i.color} - {i.series} (Size {i.size}) [Stok: {i.actualStock}]
                    </option>
                  ))}
                </select>
              </div>

              {txModal === 'IN' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Masuk</label>
                  <select
                    value={txForm.category}
                    onChange={e => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Hasil produksi">Hasil Produksi</option>
                    <option value="Retur penjualan">Retur Penjualan</option>
                    <option value="Penambahan stok">Penambahan Stok</option>
                    <option value="Koreksi stok positif">Koreksi Stok Positif</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Saluran / Keperluan Keluar</label>
                  <select
                    value={txForm.channel}
                    onChange={e => setTxForm({ ...txForm, channel: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Penjualan Shopee">Penjualan Shopee</option>
                    <option value="Penjualan TikTok Shop">Penjualan TikTok Shop</option>
                    <option value="Penjualan Offline">Penjualan Offline</option>
                    <option value="Barang reject/rusak">Barang Reject / Rusak</option>
                    <option value="Sample produk">Sample Produk</option>
                    <option value="Keperluan konten">Keperluan Konten</option>
                    <option value="Koreksi stok negatif">Koreksi Stok Negatif (Owner)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah (Pcs)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={txForm.qty}
                  onChange={e => setTxForm({ ...txForm, qty: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">No. Referensi / No. Resi</label>
                <input
                  type="text"
                  placeholder="Contoh: INV-202611-01 atau Resi Shopee"
                  value={txForm.referenceNo}
                  onChange={e => setTxForm({ ...txForm, referenceNo: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setTxModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-semibold ${
                    txModal === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Konfirmasi {txModal === 'IN' ? 'Masuk' : 'Keluar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}