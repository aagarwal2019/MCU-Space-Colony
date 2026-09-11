import React, { useState, useEffect } from 'react';
import { Search, Globe, Film, Sparkles, ExternalLink, X, AlertCircle, Shield, Award, Terminal } from 'lucide-react';
import { MCUSearchIntelResponse } from '../types';

interface MCUIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const POPULAR_QUERIES = [
  'Spider-Man Brand New Day',
  'Thanos Infinity War',
  'Thunderbolts* Yelena & Bucky',
  'Hela Goddess of Death Ragnarok',
  'Ultron Age of Ultron',
  'Wenwu Ten Rings',
  'Green Goblin No Way Home',
  'Grandmaster Sakaar',
  'Kang Quantumania'
];

export const MCUIntelModal: React.FC<MCUIntelModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intelData, setIntelData] = useState<MCUSearchIntelResponse | null>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (searchTarget?: string) => {
    const q = (searchTarget || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mcu-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: MCUSearchIntelResponse = await res.json();
      setIntelData(data);
    } catch (err: any) {
      console.error('Error fetching MCU movie intel:', err);
      setError(err?.message || 'Failed to connect to Heimdall Intel relay.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="mcu-intel-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div id="mcu-intel-dialog" className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide text-white uppercase font-mono">
                  MCU Movie Canon & Live Search Intel
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verified cinematic film appearances, movie lore, and colony combat roles via Gemini & Google Search
              </p>
            </div>
          </div>
          <button
            id="close-mcu-intel-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Chips */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="mcu-intel-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any MCU character, villain, movie (e.g. Spider-Man Brand New Day, Thanos, Hela)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-sans"
              />
            </div>
            <button
              id="mcu-intel-submit-btn"
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 transition shadow-md"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Query Canon</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Selection Chips */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] text-slate-500 uppercase font-semibold whitespace-nowrap mr-1">
              Hot Intel:
            </span>
            {POPULAR_QUERIES.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition border ${
                  query === item
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-200">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Globe className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Accessing MCU Multiverse & Search Grounding...</p>
                <p className="text-xs text-slate-400 mt-0.5">Fetching verified filmography, canon lore, and tactical abilities</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-lg flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Tactical Intel Error</p>
                <p className="text-xs text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && intelData && (
            <div className="space-y-4">
              {/* Query Badge */}
              <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Query Subject:</span>
                  <span className="text-sm font-bold text-amber-300">{intelData.query}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(intelData.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Analysis Render */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 leading-relaxed text-sm text-slate-300 whitespace-pre-wrap font-sans">
                {intelData.analysis}
              </div>

              {/* Grounded Web Sources */}
              {intelData.sources && intelData.sources.length > 0 && (
                <div className="p-3 bg-slate-950/70 border border-cyan-500/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Verified Web Sources & Citations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {intelData.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 text-xs text-slate-300 hover:text-cyan-200 transition group"
                      >
                        <span className="truncate pr-2">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !intelData && (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 border border-slate-700">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Search Any MCU Movie Hero or Villain</p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Type any character, upcoming MCU movie (like Spider-Man: Brand New Day, Thunderbolts*, Avengers: Secret Wars), or click any quick chip above.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>MCU Canonical Database • Sakaar Space Outpost Relay</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
