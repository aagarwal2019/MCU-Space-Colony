import React, { useState, useMemo } from 'react';
import { 
  Users, 
  X, 
  Cpu, 
  FlaskConical, 
  Wrench, 
  Shield, 
  Zap, 
  Cog, 
  Coins, 
  Swords, 
  Sparkles, 
  PlaneTakeoff,
  Clock,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Target,
  Disc,
  Award,
  Eye,
  Crosshair,
  Search
} from 'lucide-react';
import { MCUHero, ColonyBuilding } from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildings';

interface HeroDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  heroes: MCUHero[];
  buildings: ColonyBuilding[];
  onTriggerAbility: (heroId: string) => void;
  onUnassignHero: (heroId: string) => void;
  currentTime: number;
}

export const HeroDrawer: React.FC<HeroDrawerProps> = ({
  isOpen,
  onClose,
  heroes,
  buildings,
  onTriggerAbility,
  onUnassignHero,
  currentTime,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  if (!isOpen) return null;

  const getRoleIcon = (icon: string) => {
    switch (icon) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4" />;
      case 'Wrench': return <Wrench className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Cog': return <Cog className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'Swords': return <Swords className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'PlaneTakeoff': return <PlaneTakeoff className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Disc': return <Disc className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Eye': return <Eye className="w-4 h-4" />;
      case 'Crosshair': return <Crosshair className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getAssignedBuildingName = (buildingId: string | null) => {
    if (!buildingId) return null;
    const b = buildings.find(item => item.id === buildingId);
    if (!b) return null;
    return BUILDING_DEFINITIONS[b.type]?.name || 'Colony Sector';
  };

  const filteredHeroes = heroes.filter(hero => {
    const matchesSearch = 
      hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.heroName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.lore.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || hero.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl h-full bg-slate-900/95 border-l border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-wider text-slate-100 font-display">
                  MCU HEROES & ALLIES ROSTER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-mono-tech font-bold">
                  {heroes.length} HEROES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                Avengers, Thunderbolts*, TVA, and street-level defenders standing ready.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hero name, alias, role, or title (e.g. Spider-Man, Thunderbolts, Bucky)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-tech">
            {[
              { id: 'all', label: 'ALL HEROES' },
              { id: 'combat', label: 'COMBAT' },
              { id: 'command', label: 'COMMAND' },
              { id: 'engineering', label: 'ENGINEERING' },
              { id: 'logistics', label: 'LOGISTICS' },
              { id: 'science', label: 'SCIENCE' },
              { id: 'mystic', label: 'MYSTIC' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
                  selectedRole === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredHeroes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono-tech text-xs">
              No MCU heroes match your search or filter criteria.
            </div>
          ) : filteredHeroes.map((hero) => {
            const timeSinceUse = (currentTime - hero.ability.lastUsedAt) / 1000;
            const cooldownRemaining = Math.max(0, Math.ceil(hero.ability.cooldownSec - timeSinceUse));
            const isAbilityReady = cooldownRemaining === 0;
            const assignedBuildingName = getAssignedBuildingName(hero.assignedBuildingId);

            return (
              <div
                key={hero.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 transition-all shadow-md group relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: hero.accentColor }} 
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Avatar & Identifiers */}
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hero.avatarColor} p-0.5 shadow-md flex items-center justify-center text-white shrink-0`}
                    >
                      <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center font-bold font-display text-sm">
                        {getRoleIcon(hero.portraitIcon)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100 font-display">
                          {hero.heroName}
                        </h3>
                        <span className="text-xs text-slate-400">({hero.name})</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono-tech border border-cyan-500/20">
                          {hero.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{hero.title}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {hero.status === 'on_expedition' ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1 font-mono-tech">
                        <PlaneTakeoff className="w-3 h-3" /> ON AWAY MISSION
                      </span>
                    ) : hero.assignedBuildingId ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono-tech">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {assignedBuildingName}
                        </span>
                        <button
                          onClick={() => onUnassignHero(hero.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 underline"
                        >
                          Unassign
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1 font-mono-tech">
                        <AlertCircle className="w-3 h-3" /> IDLE / UNASSIGNED
                      </span>
                    )}
                  </div>
                </div>

                {/* Affinity & Passive */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-cyan-400 font-semibold font-mono-tech block">STATION AFFINITY:</span>
                    <span className="text-slate-300">{hero.affinityDescription}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-amber-400 font-semibold font-mono-tech block">PASSIVE PERK:</span>
                    <span className="text-slate-300">{hero.passiveBonus}</span>
                  </div>
                </div>

                {/* Lore quote */}
                <p className="mt-2 text-xs italic text-slate-400 border-l-2 border-slate-700 pl-2">
                  "{hero.quote}"
                </p>

                {/* Signature Ability Action Bar */}
                <div className="mt-3 bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-slate-100 font-display">
                        {hero.ability.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {hero.ability.description}
                    </p>
                  </div>
                  <button
                    disabled={!isAbilityReady || hero.status === 'on_expedition'}
                    onClick={() => onTriggerAbility(hero.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold font-mono-tech flex items-center justify-center gap-1.5 shrink-0 transition shadow-md ${
                      isAbilityReady && hero.status !== 'on_expedition'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {hero.status === 'on_expedition' ? (
                      'AWAY ON EXPEDITION'
                    ) : isAbilityReady ? (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" /> ACTIVATE PROTOCOL
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> READY IN {cooldownRemaining}s
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
