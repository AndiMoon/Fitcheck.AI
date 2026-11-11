import React, { useState, useRef } from 'react';
import { ClosetItem } from '../types';
import { Shirt, Plus, Sparkles, Trash2, Camera, Upload, Filter, Tag, ArrowUpRight, X } from 'lucide-react';

interface ClosetViewProps {
  closetItems: ClosetItem[];
  onAddItem: (item: ClosetItem) => void;
  onDeleteItem: (id: string) => void;
  onStylePiece: (item: ClosetItem) => void;
}

const CATEGORIES: Array<'All' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories'> = [
  'All',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Accessories',
];

export const ClosetView: React.FC<ClosetViewProps> = ({
  closetItems,
  onAddItem,
  onDeleteItem,
  onStylePiece,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [flatLayImage, setFlatLayImage] = useState<string | null>(null);
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);

  // Form fields for adding item
  const [scannedName, setScannedName] = useState<string>('');
  const [scannedCategory, setScannedCategory] = useState<'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories'>('Tops');
  const [scannedTags, setScannedTags] = useState<string>('');
  const [scannedColorName, setScannedColorName] = useState<string>('');
  const [scannedColorHex, setScannedColorHex] = useState<string>('#4B5563');
  const [scannedStylingNote, setScannedStylingNote] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = activeCategory === 'All'
    ? closetItems
    : closetItems.filter((item) => item.category === activeCategory);

  const handleImageSelected = async (dataUrl: string) => {
    setFlatLayImage(dataUrl);
    setIsAiScanning(true);
    try {
      const res = await fetch('/api/analyze-closet-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (data) {
        setScannedName(data.name || 'Custom Wardrobe Item');
        setScannedCategory(data.category || 'Tops');
        setScannedTags(Array.isArray(data.aestheticTags) ? data.aestheticTags.join(', ') : 'Streetwear, Casual');
        setScannedColorName(data.primaryColor?.name || 'Neutral');
        setScannedColorHex(data.primaryColor?.hex || '#6B7280');
        setScannedStylingNote(data.stylingNote || 'Elevates balanced streetwear silhouettes.');
      }
    } catch (err) {
      console.error('Error analyzing closet item:', err);
      // Fallback
      setScannedName('Curated Clothing Item');
      setScannedCategory('Tops');
      setScannedTags('Streetwear, Minimalist');
      setScannedColorName('Charcoal');
      setScannedColorHex('#374151');
      setScannedStylingNote('Clean staple piece for everyday rotation.');
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleImageSelected(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveScannedItem = () => {
    if (!scannedName.trim()) return;
    const newItem: ClosetItem = {
      id: `closet-${Date.now()}`,
      name: scannedName.trim(),
      category: scannedCategory,
      aestheticTags: scannedTags.split(',').map((t) => t.trim()).filter(Boolean),
      primaryColor: {
        name: scannedColorName || 'Neutral',
        hex: scannedColorHex || '#6B7280',
      },
      stylingNote: scannedStylingNote || 'Versatile wardrobe staple.',
      imageUrl: flatLayImage || '',
      dateAdded: 'Today',
    };
    onAddItem(newItem);
    setIsScanModalOpen(false);
    setFlatLayImage(null);
    setScannedName('');
    setScannedTags('');
    setScannedStylingNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <Shirt className="w-3.5 h-3.5" />
            <span>Digital Wardrobe Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight">
            Digital Closet Sync
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Scan your flat-lays. FitCheck AI cross-references your owned pieces to recommend exact 1-Swap upgrades.
          </p>
        </div>

        <button
          onClick={() => setIsScanModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Scan Wardrobe Flat-Lay</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-white text-neutral-950 shadow-md'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({cat === 'All' ? closetItems.length : closetItems.filter((i) => i.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/30">
          <Shirt className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No items in {activeCategory}</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
            Upload flat-lay photos of your favorite tees, cargo pants, hoodies, or sneakers to sync them.
          </p>
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="aspect-square w-full bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                      <div
                        className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center shadow-lg border border-white/10"
                        style={{ backgroundColor: item.primaryColor.hex }}
                      >
                        <Shirt className="w-7 h-7 text-white/90" />
                      </div>
                      <span className="text-xs font-mono text-neutral-400">{item.primaryColor.name}</span>
                    </div>
                  )}

                  {/* Category Pill Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-[10px] font-mono font-bold uppercase text-white tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-red-500/90 text-neutral-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: item.primaryColor.hex }}
                      title={item.primaryColor.name}
                    />
                    <h3 className="text-xs font-bold text-white truncate font-display">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {item.stylingNote}
                  </p>

                  {/* Aesthetic Tags */}
                  <div className="flex flex-wrap items-center gap-1">
                    {item.aestheticTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-medium text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action: Style This Piece */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onStylePiece(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 hover:text-rose-300 border border-neutral-700/80 text-xs font-bold text-neutral-300 transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Style In Next Fit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scan Modal / AI Wardrobe Ingestion */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <h3 className="text-base font-bold text-white font-display">
                  Scan Wardrobe Flat-Lay
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsScanModalOpen(false);
                  setFlatLayImage(null);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flat-Lay Image Picker / Dropzone */}
            {!flatLayImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-rose-500/60 rounded-2xl p-8 text-center bg-neutral-950/60 cursor-pointer transition-all mb-4"
              >
                <Camera className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white mb-1">
                  Upload Flat-Lay or Floor Shot
                </p>
                <p className="text-[11px] text-neutral-400">
                  Lay item flat on bed/floor. Visual AI automatically detects category, palette & aesthetic tags.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4">
                <img
                  src={flatLayImage}
                  alt="Flat lay preview"
                  className="w-full h-full object-cover"
                />
                {isAiScanning && (
                  <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                    <Sparkles className="w-8 h-8 text-rose-400 animate-spin mb-2" />
                    <span className="text-xs font-bold text-white font-display">
                      AI Auto-Tagging Item...
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Identifying category, subculture tags, and color story
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setFlatLayImage(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Editable Fields Identified by AI */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={scannedName}
                  onChange={(e) => setScannedName(e.target.value)}
                  placeholder="e.g. Vintage MA-1 Olive Bomber"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={scannedCategory}
                    onChange={(e: any) => setScannedCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={scannedColorHex}
                      onChange={(e) => setScannedColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={scannedColorName}
                      onChange={(e) => setScannedColorName(e.target.value)}
                      placeholder="Color Name"
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Aesthetic Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={scannedTags}
                  onChange={(e) => setScannedTags(e.target.value)}
                  placeholder="Streetwear, Y2K, Gorpcore"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Styling Notes
                </label>
                <input
                  type="text"
                  value={scannedStylingNote}
                  onChange={(e) => setScannedStylingNote(e.target.value)}
                  placeholder="Pairs best with wide trousers..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setFlatLayImage(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveScannedItem}
                disabled={!scannedName.trim() || isAiScanning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                Save to Closet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
