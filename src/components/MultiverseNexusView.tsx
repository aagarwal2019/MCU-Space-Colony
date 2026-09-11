import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Flame, 
  Layers, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Award,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { 
  MultiverseTimeline, 
  MultiverseDirective, 
  IncursionRiftAnomaly, 
  ColonyResources, 
  MCUHero 
} from '../types';
import { soundFx } from '../utils/audio';

interface MultiverseNexusViewProps {
  resources: ColonyResources;
  timelines: MultiverseTimeline[];
  directives: MultiverseDirective[];
  incursionRifts: IncursionRiftAnomaly[];
  heroes: MCUHero[];
  currentTime: number;
  onStabilizeTimeline: (timelineId: string) => void;
  onSiphonTimeline: (timelineId: string) => void;
  onEnactDirective: (directiveId: string) => void;
  onStabilizeRift: (riftId: string) => void;
  onUpgradeHero: (heroId: string) => void;
  onOpenMCUIntel: (query: string) => void;
}

export const MultiverseNexusView: React.FC<MultiverseNexusViewProps> = ({
  resources,
  timelines,
  directives,
  incursionRifts,
  heroes,
  currentTime,
  onStabilizeTimeline,
  onSiphonTimeline,
  onEnactDirective,
  onStabilizeRift,
  onUpgradeHero,
  onOpenMCUIntel,
}) => {
  const [selectedReality, setSelectedReality] = useState<string>('earth_616');
  const [activeSubTab, setActiveSubTab] = useState<'timelines' | 'directives' | 'rifts' | 'upgrades'>('timelines');
  const [upgradeFilter, setUpgradeFilter] = useState<'all' | 'ready' | 'ascended'>('all');

  const activeTimeline = timelines.find(t => t.id === selectedReality) || timelines[0];

  const getInfluenceRank = (inf: number) => {
    if (inf >= 800) return { title: 'Multiverse Sovereign', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'from-amber-950/40 to-yellow-900/20' };
    if (inf >= 500) return { title: 'Yggdrasil Loom Weaver', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'from-emerald-950/40 to-teal-900/20' };
    if (inf >= 300) return { title: 'Illuminati Nexus Custodian', color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'from-cyan-950/40 to-blue-900/20' };
    if (inf >= 100) return { title: 'TVA Chrono-Anchor', color: 'text-purple-400', border: 'border-purple-500/40', bg: 'from-purple-950/40 to-indigo-900/20' };
    return { title: 'Dimensional Scavenger Outpost', color: 'text-slate-400', border: 'border-slate-700', bg: 'from-slate-900 to-slate-950' };
  };

  const rank = getInfluenceRank(resources.multiverseInfluence);

  const getIncursionStatusColor = (risk: number) => {
    if (risk >= 65) return 'text-rose-500 font-bold animate-pulse';
    if (risk >= 35) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const ascendedCount = heroes.filter(h => h.tier === 2).length;

  const filteredHeroes = heroes.filter(h => {
    if (upgradeFilter === 'ascended') return h.tier === 2;
    if (upgradeFilter === 'ready') {
      if (h.tier === 2 || !h.upgradeCost) return false;
      return (
        resources.scrap >= h.upgradeCost.scrap &&
        resources.vibraniumCredits >= h.upgradeCost.vibraniumCredits &&
        resources.chronoCores >= h.upgradeCost.chronoCores
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Multiverse Nexus Command Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${rank.bg} border ${rank.border} p-5 sm:p-7 shadow-2xl backdrop-blur-md`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Globe className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-xs font-mono-tech uppercase tracking-widest text-amber-400">
                Multiversal Incursion & Timeline Nexus
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-slate-100 flex items-center gap-3">
              <span>Sakaar Dimensional Crossroads</span>
              <span className={`text-xs font-mono-tech px-2.5 py-1 rounded-full border ${rank.border} ${rank.color} bg-slate-950/60`}>
                {rank.title}
              </span>
            </h2>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sakaar is encircled by interdimensional wormholes where discarded realities collide. By stabilizing branch timelines, repelling Incursions, and evolving heroes into Multiverse Apex forms, you safeguard existence and bend cosmic fate.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Influence Rating */}
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono-tech">
                <span>INFLUENCE</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-mono-tech font-bold text-amber-300">
                  {Math.round(resources.multiverseInfluence)}
                </span>
                <span className="text-xs text-slate-400 font-mono-tech">pts</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                Threshold: {rank.title}
              </div>
            </div>

            {/* Incursion Threat Level */}
            <div className="bg-slate-950/70 border border-rose-500/30 rounded-xl p-3 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono-tech">
                <span>INCURSION RISK</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-mono-tech font-bold ${getIncursionStatusColor(resources.incursionThreat)}`}>
                  {Math.round(resources.incursionThreat)}%
                </span>
                <span className="text-xs text-slate-400 font-mono-tech">
                  {resources.incursionThreat >= 60 ? 'CRITICAL' : resources.incursionThreat >= 35 ? 'ELEVATED' : 'STABLE'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {incursionRifts.length} Active Rifts
              </div>
            </div>

            {/* Chrono-Cores */}
            <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-md flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono-tech">
                <span>CHRONO-CORES</span>
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-mono-tech font-bold text-cyan-300">
                  {resources.chronoCores}
                </span>
                <span className="text-xs text-slate-400 font-mono-tech">cores</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                Ascended Heroes: {ascendedCount}/{heroes.length}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            id="subtab-multiverse-timelines"
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('timelines');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
              activeSubTab === 'timelines'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>BRANCH REALITIES ({timelines.length})</span>
          </button>

          <button
            id="subtab-multiverse-directives"
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('directives');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
              activeSubTab === 'directives'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>COSMIC DIRECTIVES ({directives.length})</span>
          </button>

          <button
            id="subtab-multiverse-rifts"
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('rifts');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
              activeSubTab === 'rifts'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>INCURSION RIFTS ({incursionRifts.length})</span>
          </button>

          <button
            id="subtab-multiverse-upgrades"
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('upgrades');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono-tech transition ${
              activeSubTab === 'upgrades'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>HERO APEX ASCENSION ({ascendedCount}/{heroes.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TIMELINES & BRANCH REALITIES */}
      {activeSubTab === 'timelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Realities */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-slate-400 px-1">
              Select Alternate Reality:
            </h3>

            <div className="space-y-2">
              {timelines.map((timeline) => {
                const isSelected = timeline.id === activeTimeline.id;
                return (
                  <button
                    key={timeline.id}
                    id={`select-reality-${timeline.id}`}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedReality(timeline.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        timeline.incursionRisk >= 50 ? 'bg-rose-500 animate-ping' : timeline.incursionRisk >= 30 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <div>
                        <div className="text-sm font-bold font-display tracking-wide flex items-center gap-2">
                          <span>{timeline.realityCode}</span>
                          <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            {timeline.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">
                          {timeline.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono-tech text-xs">
                      <div className="text-slate-400">Risk: <span className={getIncursionStatusColor(timeline.incursionRisk)}>{timeline.incursionRisk}%</span></div>
                      <div className="text-[10px] text-emerald-400">{timeline.stabilityPercent}% Stb</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Reality Deep Dossier & Operations */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech text-amber-400 uppercase tracking-wider font-bold">
                    [REALITY NODE: {activeTimeline.realityCode}]
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    Status: {activeTimeline.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-display uppercase tracking-wide text-white mt-1">
                  {activeTimeline.name}
                </h3>
              </div>

              <button
                onClick={() => onOpenMCUIntel(activeTimeline.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono-tech text-amber-300 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>CANON SEARCH INTEL</span>
              </button>
            </div>

            {/* Stability & Incursion Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                  <span className="text-slate-400">TIMELINE STABILITY</span>
                  <span className="text-emerald-400 font-bold">{activeTimeline.stabilityPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${activeTimeline.stabilityPercent}%` }} 
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                  <span className="text-slate-400">INCURSION RISK</span>
                  <span className={`font-bold ${getIncursionStatusColor(activeTimeline.incursionRisk)}`}>
                    {activeTimeline.incursionRisk}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      activeTimeline.incursionRisk >= 50 ? 'bg-rose-500' : 'bg-amber-400'
                    }`} 
                    style={{ width: `${activeTimeline.incursionRisk}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Lore & Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                Dimensional Profile:
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                {activeTimeline.lore}
              </p>
            </div>

            {/* Active Colony Perk */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono-tech uppercase tracking-wider text-amber-300 font-bold">
                  ACTIVE OUTPOST HARMONIZATION PERK:
                </div>
                <div className="text-sm text-slate-200 mt-0.5">
                  {activeTimeline.activePerk}
                </div>
              </div>
            </div>

            {/* Actions: Stabilize vs Siphon Energy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Stabilize Reality */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-mono-tech text-cyan-400 font-bold uppercase">
                    STABILIZE REALITY WEAVE
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Reinforces wormhole dampeners, increasing stability by +15% and lowering Incursion risk by 20%.
                  </p>
                </div>

                <div className="text-[11px] font-mono-tech text-slate-400 space-x-2">
                  <span>Cost:</span>
                  <span className="text-cyan-300">{activeTimeline.stabilizeCost.power} Pwr</span>
                  <span className="text-amber-300">{activeTimeline.stabilizeCost.scrap} Scp</span>
                  <span className="text-purple-300">{activeTimeline.stabilizeCost.vibraniumCredits} Cr</span>
                </div>

                <button
                  id={`stabilize-timeline-btn-${activeTimeline.id}`}
                  onClick={() => onStabilizeTimeline(activeTimeline.id)}
                  disabled={
                    resources.power < activeTimeline.stabilizeCost.power ||
                    resources.scrap < activeTimeline.stabilizeCost.scrap ||
                    resources.vibraniumCredits < activeTimeline.stabilizeCost.vibraniumCredits
                  }
                  className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold font-mono-tech text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>STABILIZE ANCHOR</span>
                </button>
              </div>

              {/* Siphon Multiversal Energy */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-mono-tech text-amber-400 font-bold uppercase">
                    SIPHON COSMIC ENERGY
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Channels raw trans-dimensional leakage into outpost vaults, harvesting valuable resources.
                  </p>
                </div>

                <div className="text-[11px] font-mono-tech text-emerald-400 space-x-2">
                  <span>Yield:</span>
                  <span className="text-cyan-300">+{activeTimeline.siphonReward.chronoCores} Cores</span>
                  <span className="text-purple-300">+{activeTimeline.siphonReward.vibraniumCredits} Cr</span>
                  <span className="text-amber-300">+{activeTimeline.siphonReward.scrap} Scp</span>
                </div>

                <button
                  id={`siphon-timeline-btn-${activeTimeline.id}`}
                  onClick={() => onSiphonTimeline(activeTimeline.id)}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono-tech text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>EXTRACT COSMIC SIPHON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COSMIC DIRECTIVES */}
      {activeSubTab === 'directives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
              Authorized Multiversal Protocols & Cosmic Mandates:
            </h3>
            <span className="text-xs font-mono-tech text-amber-400">
              Current Multiverse Influence: {Math.round(resources.multiverseInfluence)} pts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directives.map((directive) => {
              const isUnlocked = resources.multiverseInfluence >= directive.influenceRequired;
              const isCoolingDown = currentTime - directive.lastUsedAt < directive.cooldownSec;
              const remainingCooldown = Math.max(0, Math.ceil(directive.cooldownSec - (currentTime - directive.lastUsedAt)));

              const canAfford = 
                resources.chronoCores >= directive.cost.chronoCores &&
                resources.vibraniumCredits >= directive.cost.vibraniumCredits &&
                resources.power >= directive.cost.power;

              return (
                <div 
                  key={directive.id}
                  className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 shadow-xl'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono-tech">
                      <span className="text-amber-400 font-bold tracking-wider">
                        {directive.codename}
                      </span>
                      {isUnlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>AUTHORIZED</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          Requires {directive.influenceRequired} Influence
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-display uppercase tracking-wide text-white mt-1">
                      {directive.name}
                    </h4>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {directive.description}
                    </p>

                    <blockquote className="text-[11px] italic text-amber-200/80 mt-2.5 pl-3 border-l-2 border-amber-500/40">
                      {directive.gravitasQuote}
                    </blockquote>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                      <span>COST:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-300">{directive.cost.chronoCores} Cores</span>
                        <span className="text-purple-300">{directive.cost.vibraniumCredits} Cr</span>
                        <span className="text-amber-300">{directive.cost.power} Pwr</span>
                      </div>
                    </div>

                    <button
                      id={`enact-directive-btn-${directive.id}`}
                      onClick={() => onEnactDirective(directive.id)}
                      disabled={!isUnlocked || isCoolingDown || !canAfford}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold font-mono-tech text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                    >
                      {isCoolingDown ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>RECALIBRATING ({remainingCooldown}s)</span>
                        </>
                      ) : !isUnlocked ? (
                        <span>REQUIRES {directive.influenceRequired} INFLUENCE</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>ENACT DIRECTIVE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: INCURSION RIFTS */}
      {activeSubTab === 'rifts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
              Active Interdimensional Anomalies & Tears:
            </h3>
            <span className="text-xs font-mono-tech text-rose-400 animate-pulse">
              Dimensional Stability Critical
            </span>
          </div>

          {incursionRifts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-slate-200">No Active Incursion Rifts Detected</div>
              <div className="text-xs">Sakaar\'s wormhole perimeter is currently stable. Maintain timeline harmonic fields.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incursionRifts.map((rift) => {
                const canAfford = 
                  resources.power >= rift.requiredChronoStabilizerCost.power &&
                  resources.scrap >= rift.requiredChronoStabilizerCost.scrap &&
                  resources.chronoCores >= (rift.requiredChronoStabilizerCost.chronoCores || 0);

                return (
                  <div 
                    key={rift.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono-tech">
                        <span className="text-rose-400 font-bold uppercase flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span>{rift.severity.toUpperCase()}</span>
                        </span>
                        <span className="text-slate-400">{rift.realityCode}</span>
                      </div>

                      <h4 className="text-base font-display uppercase tracking-wide text-white mt-2">
                        {rift.title}
                      </h4>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {rift.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs font-mono-tech text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span>Rec. Hero Class:</span>
                        <span className="uppercase font-bold text-white">{rift.recommendedHeroRole}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs font-mono-tech text-slate-400">
                        <span>Stabilize Cost:</span>
                        <div className="space-x-1.5">
                          <span className="text-cyan-300">{rift.requiredChronoStabilizerCost.power} Pwr</span>
                          <span className="text-amber-300">{rift.requiredChronoStabilizerCost.scrap} Scp</span>
                          {rift.requiredChronoStabilizerCost.chronoCores ? (
                            <span className="text-purple-300">{rift.requiredChronoStabilizerCost.chronoCores} Core</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex justify-between text-xs font-mono-tech text-emerald-400">
                        <span>Rewards:</span>
                        <span>+{rift.rewards.chronoCores} Cores, +{rift.rewards.multiverseInfluence} Inf</span>
                      </div>

                      <button
                        id={`stabilize-rift-btn-${rift.id}`}
                        onClick={() => onStabilizeRift(rift.id)}
                        disabled={!canAfford}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold font-mono-tech text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>SEAL INCURSION RIFT</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: HERO MULTIVERSE APEX ASCENSION */}
      {activeSubTab === 'upgrades' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                Multiverse Apex Evolutions (Tier 1 Base &rarr; Tier 2 Multiverse Apex):
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ascending heroes and villains elevates their stats by +25, drastically improves their signature abilities, and empowers colony passive perks.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUpgradeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition ${
                  upgradeFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ALL ({heroes.length})
              </button>
              <button
                onClick={() => setUpgradeFilter('ready')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition ${
                  upgradeFilter === 'ready'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                READY TO ASCEND
              </button>
              <button
                onClick={() => setUpgradeFilter('ascended')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition ${
                  upgradeFilter === 'ascended'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ASCENDED ({ascendedCount})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHeroes.map((hero) => {
              const isTier2 = hero.tier === 2;
              const cost = hero.upgradeCost || { scrap: 300, vibraniumCredits: 50, chronoCores: 2 };
              const canAfford = 
                resources.scrap >= cost.scrap &&
                resources.vibraniumCredits >= cost.vibraniumCredits &&
                resources.chronoCores >= cost.chronoCores;

              return (
                <div 
                  key={hero.id}
                  className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                    isTier2
                      ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-amber-950/30 border-amber-500/50 shadow-2xl shadow-purple-500/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg'
                  }`}
                >
                  <div>
                    {/* Header: Name, Badge, Tier */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full font-bold uppercase ${
                            isTier2 
                              ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {isTier2 ? 'TIER 2 APEX' : 'TIER 1 CINEMATIC'}
                          </span>
                          <span className="text-[10px] font-mono-tech text-slate-400 uppercase">
                            {hero.characterType}
                          </span>
                        </div>

                        <h4 className="text-base font-display uppercase tracking-wide text-white mt-1.5 font-bold">
                          {hero.heroName}
                        </h4>

                        <div className="text-xs text-slate-400 line-clamp-1">
                          {hero.title}
                        </div>
                      </div>

                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hero.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}>
                        {hero.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* Passive & Ability Preview */}
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <div className="text-[10px] font-mono-tech text-amber-400 uppercase font-bold">
                          Signature Ability:
                        </div>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {hero.ability.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {hero.ability.description}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 italic pl-2 border-l border-amber-500/40 line-clamp-2">
                        "{hero.quote}"
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-3 border-t border-slate-800 space-y-2.5">
                    {isTier2 ? (
                      <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-center text-xs font-mono-tech text-amber-300 flex items-center justify-center gap-1.5 font-bold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>MULTIVERSE APEX ASCENDED</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
                          <span>ASCENSION COST:</span>
                          <div className="space-x-1.5">
                            <span className={resources.scrap >= cost.scrap ? 'text-amber-300' : 'text-rose-400'}>
                              {cost.scrap} Scp
                            </span>
                            <span className={resources.vibraniumCredits >= cost.vibraniumCredits ? 'text-purple-300' : 'text-rose-400'}>
                              {cost.vibraniumCredits} Cr
                            </span>
                            <span className={resources.chronoCores >= cost.chronoCores ? 'text-cyan-300' : 'text-rose-400'}>
                              {cost.chronoCores} Cores
                            </span>
                          </div>
                        </div>

                        <button
                          id={`ascend-hero-btn-${hero.id}`}
                          onClick={() => onUpgradeHero(hero.id)}
                          disabled={!canAfford}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold font-mono-tech text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ASCEND TO TIER 2</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
