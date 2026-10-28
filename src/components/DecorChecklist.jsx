import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Download,
  Copy,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportChecklistToCSV, copyPlanSummaryToClipboard } from '../utils/exportUtils';
import { CURRENCIES } from '../constants/index.js';
import { useToast } from '../context/ToastContext';

export const DecorChecklist = memo(function DecorChecklist({
  checklist = [],
  onUpdateChecklist,
  venueTitle = 'Venue Decor Plan',
  specifications = {},
  expandedPrompt = ''
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [showAddItem, setShowAddItem] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const toast = useToast();

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Florals & Greenery',
    quantity: 1,
    unitCost: 150,
    notes: ''
  });

  // Calculate totals
  const { totalEstimatedCost, completedCost, completedCount, totalCount, progressPercent } = useMemo(() => {
    let totalEst = 0;
    let completedEst = 0;
    let compCount = 0;

    checklist.forEach((item) => {
      const cost = (item.quantity || 1) * (item.unitCost || 0);
      totalEst += cost;
      if (item.completed) {
        completedEst += cost;
        compCount += 1;
      }
    });

    const totalCount = checklist.length;
    const progressPercent = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

    return {
      totalEstimatedCost: totalEst,
      completedCost: completedEst,
      completedCount: compCount,
      totalCount,
      progressPercent
    };
  }, [checklist]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(checklist.map((i) => i.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [checklist]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategoryFilter === 'All') return checklist;
    return checklist.filter((i) => i.category === activeCategoryFilter);
  }, [checklist, activeCategoryFilter]);

  // Toggle item completion
  const handleToggleItem = useCallback((itemId) => {
    const updated = checklist.map((item) => {
      if (item.id === itemId) {
        const nextCompleted = !item.completed;
        if (nextCompleted && completedCount + 1 === totalCount) {
          // Trigger confetti on 100% completion
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#FF1493', '#FFB800', '#FFFFFF']
            });
          } catch (_) {}
        }
        return { ...item, completed: nextCompleted };
      }
      return item;
    });
    onUpdateChecklist(updated);
  }, [checklist, completedCount, totalCount, onUpdateChecklist]);

  // Delete item
  const handleDeleteItem = useCallback((itemId) => {
    const updated = checklist.filter((item) => item.id !== itemId);
    onUpdateChecklist(updated);
  }, [checklist, onUpdateChecklist]);

  // Add custom item
  const handleSaveNewItem = useCallback((e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const created = {
      id: `custom-${Date.now()}`,
      category: newItem.category,
      name: newItem.name.trim(),
      quantity: Math.max(1, Math.round(Number(newItem.quantity)) || 1),
      unitCost: Math.max(0, Math.round(Number(newItem.unitCost) / selectedCurrency.rate) || 50),
      completed: false,
      notes: newItem.notes.trim()
    };

    onUpdateChecklist([...checklist, created]);
    setNewItem({
      name: '',
      category: 'Florals & Greenery',
      quantity: 1,
      unitCost: 150,
      notes: ''
    });
    setShowAddItem(false);
  }, [newItem, checklist, selectedCurrency.rate, onUpdateChecklist]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    exportChecklistToCSV(checklist, selectedCurrency.code);
    toast.success('Decor checklist CSV exported successfully!');
  }, [checklist, selectedCurrency.code, toast]);

  // Copy Summary
  const handleCopySummary = useCallback(async () => {
    const success = await copyPlanSummaryToClipboard({
      title: venueTitle,
      celebration: specifications.celebrationType,
      style: specifications.aestheticStyle,
      colorPalette: specifications.colorPalette,
      lighting: specifications.primaryLighting,
      prompt: expandedPrompt,
      checklist,
      currency: selectedCurrency.symbol
    });

    if (success) {
      setCopiedNotice(true);
      toast.success('Decor plan summary copied to clipboard!');
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  }, [venueTitle, specifications, expandedPrompt, checklist, selectedCurrency, toast]);

  // Format currency value
  const formatCost = useCallback((valInUsd) => {
    const converted = Math.round(valInUsd * selectedCurrency.rate);
    return `${selectedCurrency.symbol}${converted.toLocaleString()}`;
  }, [selectedCurrency]);

  return (
    <section aria-labelledby="checklist-heading" className="space-y-4">
      {/* Header with Title and Currency Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="checklist-heading" className="text-base font-bold text-white flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-hotpink-400" />
            <span>Itemized Vendor Decor Checklist</span>
          </h2>
          <p className="text-xs text-slate-400">
            Actionable items parsed from scene analysis with budget estimates
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center space-x-1.5 bg-charcoal-900 p-1 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-400 px-1 text-[11px]">Currency:</span>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelectedCurrency(c)}
              className={`px-2 py-0.5 rounded-lg transition-colors focus-ring font-medium ${
                selectedCurrency.code === c.code
                  ? 'bg-hotpink-500 text-white shadow-pink-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Summary Card */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="rounded-2xl glass-panel p-4 border border-pink-500/20 bg-charcoal-800/80 space-y-3"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
            <p className="text-[11px] text-slate-400">Total Est. Budget</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {formatCost(totalEstimatedCost)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
            <p className="text-[11px] text-slate-400">Secured / Completed</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              {formatCost(completedCost)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
            <p className="text-[11px] text-slate-400">Remaining Budget</p>
            <p className="text-lg font-bold text-hotpink-400 mt-0.5">
              {formatCost(Math.max(0, totalEstimatedCost - completedCost))}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
            <p className="text-[11px] text-slate-400">Vendor Progress</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {completedCount} / {totalCount} ({progressPercent}%)
            </p>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-charcoal-950 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-hotpink-600 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors focus-ring ${
                activeCategoryFilter === cat
                  ? 'bg-hotpink-500/20 text-hotpink-300 border border-hotpink-500/50'
                  : 'bg-charcoal-900/70 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddItem(!showAddItem)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-hotpink-400 hover:text-white hover:bg-hotpink-500/20 border border-pink-500/30 transition-colors focus-ring"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 transition-colors focus-ring"
            title="Copy plan and checklist to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-hotpink-400" />
            <span>{copiedNotice ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 transition-colors focus-ring"
            title="Export checklist to CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-hotpink-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Add Custom Item Inline Form */}
      {showAddItem && (
        <form
          onSubmit={handleSaveNewItem}
          className="p-4 rounded-xl glass-panel border border-pink-500/30 bg-charcoal-850/90 space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Add Custom Decor Item
            </h4>
            <button
              type="button"
              onClick={() => setShowAddItem(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="add-item-name" className="block text-[11px] text-slate-400 mb-1">Item Name</label>
              <input
                id="add-item-name"
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Vintage Champagne Coupe Tower"
                className="w-full px-3 py-1.5 rounded-lg bg-charcoal-900 border border-pink-500/20 text-white text-xs focus-ring"
              />
            </div>

            <div>
              <label htmlFor="add-item-category" className="block text-[11px] text-slate-400 mb-1">Category</label>
              <select
                id="add-item-category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-charcoal-900 border border-pink-500/20 text-white text-xs focus-ring"
              >
                <option value="Florals & Greenery">Florals & Greenery</option>
                <option value="Lighting & Ambiance">Lighting & Ambiance</option>
                <option value="Furniture & Seating">Furniture & Seating</option>
                <option value="Tableware & Linens">Tableware & Linens</option>
                <option value="Structural & Backdrops">Structural & Backdrops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="add-item-quantity" className="block text-[11px] text-slate-400 mb-1">Quantity</label>
              <input
                id="add-item-quantity"
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-charcoal-900 border border-pink-500/20 text-white text-xs focus-ring"
              />
            </div>

            <div>
              <label htmlFor="add-item-unitcost" className="block text-[11px] text-slate-400 mb-1">
                Unit Cost ({selectedCurrency.code})
              </label>
              <input
                id="add-item-unitcost"
                type="number"
                min="0"
                value={newItem.unitCost}
                onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-charcoal-900 border border-pink-500/20 text-white text-xs focus-ring"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-hotpink-600 hover:bg-hotpink-500 text-white font-semibold text-xs transition-colors shadow-pink-glow-sm"
              >
                Save Item
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Checklist Items List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-charcoal-900/40 border border-white/5 text-slate-400 text-xs">
            No items in this category. Click "+ Add Item" to create one.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCompleted = item.completed;
            const itemTotal = (item.quantity || 1) * (item.unitCost || 0);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all duration-150 flex items-start justify-between space-x-3 group ${
                  isCompleted
                    ? 'bg-charcoal-900/40 border-emerald-500/20 opacity-80'
                    : 'bg-charcoal-800/80 border-white/10 hover:border-pink-500/30'
                }`}
              >
                {/* Checkbox & Item Details */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className="mt-0.5 text-hotpink-400 hover:text-hotpink-300 focus-ring rounded"
                    aria-label={`Mark ${item.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-white" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCompleted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </p>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-charcoal-900 text-hotpink-400 border border-pink-500/20 font-medium">
                        {item.category}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity, Cost & Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">
                      {formatCost(itemTotal)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.quantity} × {formatCost(item.unitCost || 0)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
});
