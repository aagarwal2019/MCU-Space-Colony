export type HeroRole = 'engineering' | 'science' | 'combat' | 'logistics' | 'mystic' | 'command';

export interface MCUHero {
  id: string;
  name: string;
  heroName: string;
  role: HeroRole;
  title: string;
  avatarColor: string;
  accentColor: string;
  portraitIcon: string;
  assignedBuildingId: string | null;
  status: 'idle' | 'assigned' | 'on_expedition' | 'exhausted';
  stats: {
    engineering: number;
    science: number;
    combat: number;
    leadership: number;
  };
  buildingAffinity: string; // building type it boosts best
  affinityDescription: string;
  passiveBonus: string;
  ability: {
    name: string;
    description: string;
    cooldownSec: number;
    lastUsedAt: number;
    actionType: 
      | 'power_surge' 
      | 'bio_heal' 
      | 'scrap_blast' 
      | 'shield_overcharge' 
      | 'lightning_strike' 
      | 'overclock' 
      | 'trade_windfall' 
      | 'defense_ambush' 
      | 'mirror_dimension' 
      | 'orbital_recon'
      | 'tva_chrono_reset'
      | 'oxe_buyout'
      | 'dodc_lockdown'
      | 'spider_web_strike'
      | 'ten_rings_strike'
      | 'ionic_overdrive'
      | 'widow_tactical_strike'
      | 'vibranium_arm_smash'
      | 'usagent_shield_slam'
      | 'red_guardian_brawl'
      | 'captain_america_rally'
      | 'radar_sense_alert'
      | 'trick_arrow_salvo';
  };
  quote: string;
  lore: string;
}

export type BuildingType = 
  | 'command_center'
  | 'arc_reactor'
  | 'hydroponic_dome'
  | 'scrap_foundry'
  | 'atmospheric_scrubber'
  | 'defense_turret'
  | 'living_quarters'
  | 'trading_depot'
  | 'stark_lab'
  | 'expedition_pad'
  | 'cantina_lounge'
  | 'tva_station'
  | 'oxe_spire'
  | 'damage_control_depot';

export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  description: string;
  category: 'energy' | 'resources' | 'life_support' | 'defense' | 'special';
  icon: string;
  baseCost: {
    scrap: number;
    power: number;
    vibraniumCredits: number;
  };
  basePowerGen: number;
  basePowerCost: number;
  baseScrapGen: number;
  baseFoodGen: number;
  baseOxygenGen: number;
  baseMoraleGen: number;
  baseDefense: number;
  baseHousing: number;
  maxWorkers: number;
  unlockedByDefault: boolean;
  requiredTech?: string;
}

export interface ColonyBuilding {
  id: string;
  type: BuildingType;
  customName?: string;
  gridX: number;
  gridY: number;
  level: number;
  maxLevel: number;
  health: number;
  maxHealth: number;
  isOperating: boolean;
  assignedHeroId: string | null;
  assignedWorkers: number;
  upgradingUntil: number | null;
}

export type TerrainType = 'open_scrap' | 'toxic_fissure' | 'geothermal_vent' | 'shipwreck_hulk' | 'ruined_arena' | 'crystal_vein';

export interface GridTile {
  x: number;
  y: number;
  terrain: TerrainType;
  terrainName: string;
  scrapYieldBonus: number;
  powerYieldBonus: number;
  hazardLevel: number;
  cleared: boolean;
  buildingId: string | null;
}

export interface ColonyResources {
  power: number;
  maxPower: number;
  scrap: number;
  maxScrap: number;
  food: number;
  maxFood: number;
  oxygen: number; // 0 to 100%
  vibraniumCredits: number;
  population: number;
  maxPopulation: number;
  assignedWorkers: number;
  morale: number; // 0 to 100%
  defenseRating: number;
}

export interface ResourceRates {
  powerNet: number;
  powerGen: number;
  powerCost: number;
  scrapNet: number;
  foodNet: number;
  foodGen: number;
  foodCost: number;
  oxygenChange: number;
  moraleChange: number;
}

export interface TechNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  developer: 
    | 'Stark Industries' 
    | 'Wakandan Design Group' 
    | 'Knowhere Black Market' 
    | 'Kamar-Taj Archive'
    | 'Time Variance Authority'
    | 'OXE Group'
    | 'Damage Control';
  cost: {
    scrap: number;
    vibraniumCredits: number;
  };
  researched: boolean;
  description: string;
  effectDescription: string;
  icon: string;
  prerequisiteId?: string;
}

export interface ColonyCrisis {
  id: string;
  title: string;
  description: string;
  severity: 'moderate' | 'severe' | 'critical';
  timeLeftSec: number;
  maxTimeSec: number;
  threatType: 'raiders' | 'storm' | 'toxic_surge' | 'blackout' | 'temporal_rift' | 'grandmaster_demand' | 'quake';
  recommendedHeroIds: string[];
  options: {
    label: string;
    description: string;
    requiredHeroId?: string;
    cost?: { scrap?: number; power?: number; vibraniumCredits?: number };
    successChance: number; // 0 to 1
    onSuccessReward: string;
    onFailureConsequence: string;
    actionKey: string;
  }[];
}

export interface PlanetaryExpedition {
  id: string;
  name: string;
  location: string;
  description: string;
  hazardRating: 'Low' | 'Medium' | 'Extreme';
  durationSec: number;
  assignedHeroIds: string[];
  status: 'available' | 'in_progress' | 'completed';
  startTime?: number;
  endTime?: number;
  potentialLoot: {
    minScrap: number;
    maxScrap: number;
    minVibranium: number;
    maxVibranium: number;
    rareArtifactChance: number;
  };
  recommendedRoles: HeroRole[];
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  cycle: number;
  type: 'info' | 'success' | 'warning' | 'danger' | 'crisis';
  message: string;
}
