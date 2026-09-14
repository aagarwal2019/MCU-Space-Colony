import React from 'react';
import { X, Sparkles, Shield, Zap, Wrench, FlaskConical, Award, Globe, Film, Swords, Compass } from 'lucide-react';
import { MCUHero, ColonyBuilding } from '../types';
import { HeroStyleBackground } from './HeroStyleBackground';
import { HeroInsignia, HERO_INSIGNIA_METADATA } from './HeroInsignia';

interface HeroProfileModalProps {
  hero: MCUHero | null;
  isOpen: boolean;
  onClose: () => void;
  onTriggerAbility?: (heroId: string) => void;
  onOpenMCUIntel?: (query: string) => void;
  buildings?: ColonyBuilding[];
}

export const HeroProfileModal: React.FC<HeroProfileModalProps> = ({
  hero,
  isOpen,
  onClose,
  onTriggerAbility,
  onOpenMCUIntel,
  buildings = [],
}) => {
  if (!isOpen || !hero) return null;

  const isVillain = hero.characterType === 'villain';
  const isAntihero = hero.characterType === 'antihero';

  // Specific HUD Title & Theme details
  const getProfileThemeDetails = (heroId: string) => {
    switch (heroId) {
      case 'iron_man':
        return {
          subtitle: 'STARK INDUSTRIES • TACTICAL SUIT DIAGNOSTICS & ARC REACTOR TELEMETRY',
          badge: 'MARK LXXXV BLEEDING EDGE',
          systemQuote: 'F.R.I.D.A.Y.: "Power output at 100%, Boss. Repulsors armed and ready."',
          statusLine: 'ARC REACTOR CORE: 3.2 GJ/s • PALLADIUM INTAKE STABILIZED • NANOTECH MATRIX ACTIVE',
        };
      case 'spider_man_raimi':
        return {
          subtitle: 'EARTH-96283 • THE ORIGINAL SPIDER-MAN TRILOGY • QUEENS HERO DOSSIER',
          badge: 'RAIMI UNIVERSE • PETER-TWO',
          systemQuote: '"Whatever life holds in store for me, I will never forget these words: With great power comes great responsibility."',
          statusLine: 'ORGANIC SPIDER-DNA • HIGH-TENSILE WEB GLANDS OPERATIONAL • VETERAN HEROIC COMPASS',
        };
      case 'spider_man':
        return {
          subtitle: 'EARTH-616 • FRIENDLY NEIGHBORHOOD WEB-WEAVER • BRAND NEW DAY DOSSIER',
          badge: 'BRAND NEW DAY',
          systemQuote: '"No matter how many times I get knocked down, I always get back up."',
          statusLine: 'HANDCRAFTED WEB-SHOOTERS • ACROBATIC EVASION 99.8% • SPIDER-SENSE HEIGHTENED',
        };
      case 'doctor_strange':
        return {
          subtitle: 'KAMAR-TAJ ARCHIVES • SANCTUM SANCTORUM MYSTIC ENERGETICS',
          badge: 'MASTER OF THE MYSTIC ARTS',
          systemQuote: '"We never lose our demons, we only learn to live above them."',
          statusLine: 'EYE OF AGAMOTTO SYNCHRONIZED • TAO-MANDALA DISCS ENGAGED • MIRROR DIMENSION READY',
        };
      case 'thor':
        return {
          subtitle: 'NEW ASGARD & OMNIPOTENCE CITY RELAY • ODINFORCE RESONANCE',
          badge: 'GOD OF THUNDER',
          systemQuote: '"I choose to run towards my problems, and not away from them."',
          statusLine: 'BIFROST CHANNEL: READY • STORMBREAKER CHATTER: CLEAN • LIGHTNING VOLTAGE: ∞',
        };
      case 'hulk':
        return {
          subtitle: 'GAMMA CONTINUUM APEX // TRUE POWER UNLEASHED (BRAND NEW DAY)',
          badge: 'TRUE POWER UNLEASHED',
          systemQuote: '"Jean Grey broke the mental locks holding me back. Hulk is the strongest there is!"',
          statusLine: 'GAMMA RADS: LIMITLESS PEAK • JEAN GREY TELEPATHIC LOCK BROKEN • TECTONIC FURY ONLINE',
        };
      case 'captain_america':
        return {
          subtitle: 'STRATEGIC SCIENTIFIC RESERVE // SENTINEL OF LIBERTY COMMAND HUD',
          badge: 'FIRST AVENGER',
          systemQuote: '"I can do this all day."',
          statusLine: 'VIBRANIUM ABSORPTION: 100% • TACTICAL BATTLEFIELD INTEL: SYNCED • MORALE ANCHOR',
        };
      case 'thanos':
        return {
          subtitle: 'SANCTUARY II WARSHIP COMMAND • INFINITY STONE RESONANCE HARMONIC',
          badge: 'TITAN SOVEREIGN',
          systemQuote: '"I am inevitable."',
          statusLine: '6 INFINITY STONES SECURED • POWER / SPACE / REALITY / SOUL / TIME / MIND MATRIX ACTIVE',
        };
      case 'doctor_doom':
        return {
          subtitle: 'CASTLE DOOM TACTICAL MAINFRAME • LATVERIAN CITADEL OVERVIEW',
          badge: 'SUPREME MONARCH OF LATVERIA',
          systemQuote: '"Doom does not negotiate with inferior intellects."',
          statusLine: 'DOOMBOT HIVE LINKED • SORCERY-TECH FUSION: 100% • BATTLEWORLD PROTOCOL READY',
        };
      default:
        return {
          subtitle: 'AVENGERS SAKAAR COLONY PROFILE & HERO DEPLOYMENT TELEMETRY',
          badge: 'MCU OPERATIVE',
          systemQuote: `"${hero.quote}"`,
          statusLine: 'SYSTEMS NORMAL • VIBRANIUM FREQUENCY TUNED • READY FOR DEPLOYMENT',
        };
    }
  };

  const theme = getProfileThemeDetails(hero.id);

  return (
    <div id="hero-profile-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        id="hero-profile-modal-container"
        className="relative w-full max-w-4xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        style={{ borderColor: `${hero.accentColor}60` }}
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: hero.accentColor }} />

        {/* Ambient Hero Graphic Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
          <HeroStyleBackground heroId={hero.id} accentColor={hero.accentColor} tier={hero.tier} />
        </div>

        {/* Header Bar */}
        <div className="relative z-10 flex items-start justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${hero.avatarColor} p-0.5 shadow-xl flex items-center justify-center text-white shrink-0`}
            >
              <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center p-2 overflow-hidden">
                <HeroInsignia heroId={hero.id} size={36} color={hero.accentColor} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
                  {hero.heroName}
                </h2>
                <span className="text-xs font-medium text-slate-400">({hero.name})</span>
                <span 
                  className="text-[10px] uppercase font-mono-tech font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${hero.accentColor}20`,
                    color: hero.accentColor,
                    borderColor: `${hero.accentColor}50`
                  }}
                >
                  {theme.badge}
                </span>
                <span className="text-[10px] uppercase font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {hero.tier === 2 ? 'TIER 2 APEX' : 'TIER 1 BASE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono-tech mt-1 tracking-wider">
                {theme.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
            title="Close Profile UI"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Body */}
        <div className="relative z-10 p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Character Style UI Banner */}
          <div 
            className="rounded-xl p-4 border bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 shadow-inner relative overflow-hidden"
            style={{ borderColor: `${hero.accentColor}40` }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono-tech font-bold tracking-widest uppercase flex items-center gap-1.5" style={{ color: hero.accentColor }}>
                <Sparkles className="w-4 h-4" />
                SIGNATURE PROFILE UI // {hero.heroName.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                ACTIVE COLONY SYSTEM INTEGRATION
              </span>
            </div>
            
            <p className="mt-2 text-xs font-mono-tech text-slate-300 leading-relaxed">
              {theme.statusLine}
            </p>

            <blockquote className="mt-3 text-xs italic text-amber-200/90 border-l-2 pl-3 py-1 font-sans" style={{ borderColor: hero.accentColor }}>
              {theme.systemQuote}
            </blockquote>
          </div>

          {/* Core Stats Breakdown & Role */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tech">
                <span>COMBAT</span>
                <Swords className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono-tech text-rose-400 mt-2">
                {hero.stats.combat}
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, hero.stats.combat)}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tech">
                <span>ENGINEERING</span>
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono-tech text-cyan-400 mt-2">
                {hero.stats.engineering}
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, hero.stats.engineering)}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tech">
                <span>SCIENCE</span>
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono-tech text-emerald-400 mt-2">
                {hero.stats.science}
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, hero.stats.science)}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tech">
                <span>LEADERSHIP</span>
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono-tech text-amber-400 mt-2">
                {hero.stats.leadership}
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, hero.stats.leadership)}%` }} />
              </div>
            </div>
          </div>

          {/* Authentic Researched Hero Insignia & Symbol Anatomy */}
          {(() => {
            const insigniaInfo = HERO_INSIGNIA_METADATA[hero.id];
            return (
              <div 
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden"
                style={{ borderColor: `${hero.accentColor}40` }}
              >
                {/* Background Ambient Glow */}
                <div 
                  className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: hero.accentColor }}
                />

                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>AUTHENTIC HERO INSIGNIA & SYMBOL ANATOMY</span>
                  </div>
                  <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500/30">
                    CANON EMBLEM ARCHIVE
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Illuminated Emblem Pedestal */}
                  <div className="flex flex-col items-center shrink-0">
                    <div 
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border p-3 flex items-center justify-center shadow-2xl relative group"
                      style={{ borderColor: `${hero.accentColor}60` }}
                    >
                      {/* Radial Accent Glow */}
                      <div 
                        className="absolute inset-2 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"
                        style={{ backgroundColor: hero.accentColor }}
                      />
                      <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                        <HeroInsignia heroId={hero.id} size={84} color={hero.accentColor} />
                      </div>
                    </div>
                    {hero.id === 'spider_man_raimi' && (
                      <span className="mt-2 text-[9px] font-mono-tech text-center font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 max-w-[140px]">
                        ★ TOBEY RAIMI EMBLEM
                      </span>
                    )}
                  </div>

                  {/* Insignia Research Breakdown */}
                  <div className="flex-1 space-y-3 text-left">
                    <div>
                      <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                        {insigniaInfo?.name || `${hero.heroName} Insignia`}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                        <span className="text-slate-500">Design Lore:</span> {insigniaInfo?.designerOrOrigin || 'Classified Hero Uniform Division'}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                      {insigniaInfo?.description || `${hero.heroName}'s official insignia represents their operational identity and combat allegiance across the Marvel Cinematic Universe.`}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
                      <div className="text-slate-400 font-mono-tech text-[11px]">
                        <span className="text-slate-500">Canon Uniform:</span>{' '}
                        <span className="text-amber-300">{insigniaInfo?.canonSource || hero.movieOrigin}</span>
                      </div>

                      {onOpenMCUIntel && (
                        <button
                          onClick={() => onOpenMCUIntel(`${hero.heroName} insignia logo symbol design history`)}
                          className="text-[11px] px-2.5 py-1 bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 rounded-lg flex items-center gap-1.5 transition font-mono-tech"
                        >
                          <Globe className="w-3 h-3 text-cyan-400" />
                          <span>Search Insignia Lore</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* MCU Cinematic Lore & Film Canon */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                <Film className="w-4 h-4 text-amber-400" />
                <span>CINEMATIC CANON & FILM RECORD</span>
              </div>
              {onOpenMCUIntel && (
                <button
                  onClick={() => onOpenMCUIntel(`${hero.heroName} ${hero.name} Marvel movie`)}
                  className="text-xs px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 rounded-lg flex items-center gap-1.5 transition font-mono-tech"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Search Live Marvel Lore</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {hero.lore}
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-mono-tech">Origin:</span>
              <span className="text-amber-300 font-semibold">{hero.movieOrigin}</span>
              {hero.movieAppearances && hero.movieAppearances.length > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono-tech">Appearances:</span>
                  <span className="text-slate-300">{hero.movieAppearances.join(' • ')}</span>
                </>
              )}
            </div>
          </div>

          {/* Signature Action Protocol */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: hero.accentColor }} />
                <span className="text-sm font-bold font-display text-white">
                  {hero.ability.name}
                </span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  COOLDOWN: {hero.ability.cooldownSec}s
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {hero.ability.description}
              </p>
            </div>

            {onTriggerAbility && (
              <button
                onClick={() => {
                  onTriggerAbility(hero.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold font-mono-tech text-slate-950 flex items-center justify-center gap-2 shadow-lg transition shrink-0"
                style={{ backgroundColor: hero.accentColor }}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>ENGAGE PROTOCOL</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between text-xs font-mono-tech text-slate-400">
          <span>CHARACTER ID: {hero.id.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            DISMISS HUD
          </button>
        </div>
      </div>
    </div>
  );
};
