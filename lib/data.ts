// lib/data.ts  — all demo data + types + priority engine

export type FoodCategory =
  | "Roti / Chapati"
  | "Steamed Rice"
  | "Dal / Lentils"
  | "Vegetable Curry"
  | "Paneer Dish"
  | "Sambar / Rasam"
  | "Curd / Raita"
  | "Sweet / Dessert";

export type UrgencyLevel = "low" | "medium" | "high";
export type ListingStatus = "pending" | "matched" | "claimed" | "expired";

export interface Listing {
  id: string;
  messId: string;
  messName: string;
  category: FoodCategory;
  quantity: string;
  unit: string;
  prepTime: string;
  pickupFrom: string;
  pickupTo: string;
  notes?: string;
  postedAt: Date;
  status: ListingStatus;
  claimedBy?: string;
  urgency: UrgencyLevel;
  urgencyPct: number;
  icon: string;
}

export interface NGO {
  id: string;
  name: string;
  initials: string;
  location: string;
  distanceKm: number;
  isActive: boolean;
  reliabilityScore: number;   // 0-100: past accept rate
  responseRate: number;        // 0-100
  lastAssigned: number;        // minutes ago (fairness)
  capacityFree: number;        // 0-100
  priorityScore?: number;
}

export interface PriorityWeights {
  distance: number;
  urgency: number;
  availability: number;
  fairness: number;
  reliability: number;
}

export const DEFAULT_WEIGHTS: PriorityWeights = {
  distance: 0.30,
  urgency: 0.25,
  availability: 0.20,
  fairness: 0.15,
  reliability: 0.10,
};

// ─── Demo NGOs ───────────────────────────────────────────────────────────────
export const DEMO_NGOS: NGO[] = [
  { id:"ngo1", name:"Hope Foundation",  initials:"HF", location:"Adyar",       distanceKm:3.2, isActive:true,  reliabilityScore:94, responseRate:87, lastAssigned:180, capacityFree:90 },
  { id:"ngo2", name:"Akshaya NGO",      initials:"AK", location:"Velachery",   distanceKm:4.1, isActive:true,  reliabilityScore:88, responseRate:82, lastAssigned:45,  capacityFree:70 },
  { id:"ngo3", name:"Seva Trust",       initials:"ST", location:"T.Nagar",     distanceKm:5.6, isActive:false, reliabilityScore:76, responseRate:71, lastAssigned:20,  capacityFree:40 },
  { id:"ngo4", name:"Annadaata",        initials:"AD", location:"Guindy",      distanceKm:6.2, isActive:true,  reliabilityScore:82, responseRate:78, lastAssigned:360, capacityFree:85 },
  { id:"ngo5", name:"Bread of Life",    initials:"BL", location:"Tambaram",    distanceKm:7.8, isActive:true,  reliabilityScore:70, responseRate:65, lastAssigned:90,  capacityFree:60 },
  { id:"ngo6", name:"Jai Seva",         initials:"JS", location:"Perambur",    distanceKm:9.1, isActive:false, reliabilityScore:60, responseRate:55, lastAssigned:15,  capacityFree:30 },
];

// ─── Demo Listings ────────────────────────────────────────────────────────────
export const DEMO_LISTINGS: Listing[] = [
  {
    id:"l1", messId:"mess1", messName:"R Gouras Caterer Vindhya Ground Floor",
    category:"Roti / Chapati", quantity:"80", unit:"servings", icon:"🫓",
    prepTime:"12:30", pickupFrom:"13:00", pickupTo:"14:00",
    postedAt: new Date(Date.now() - 12*60*1000),
    status:"claimed", claimedBy:"Hope Foundation",
    urgency:"high", urgencyPct:85,
  },
  {
    id:"l2", messId:"mess2", messName:"R Gouras Caterer Himalaya",
    category:"Steamed Rice", quantity:"5", unit:"kg", icon:"🍚",
    prepTime:"12:45", pickupFrom:"13:15", pickupTo:"14:30",
    postedAt: new Date(Date.now() - 8*60*1000),
    status:"claimed", claimedBy:"Akshaya NGO",
    urgency:"medium", urgencyPct:55,
  },
  {
    id:"l3", messId:"mess3", messName:"SGR Caterer (South Indian)",
    category:"Vegetable Curry", quantity:"40", unit:"servings", icon:"🥘",
    prepTime:"13:00", pickupFrom:"13:30", pickupTo:"15:00",
    postedAt: new Date(Date.now() - 2*60*1000),
    status:"pending",
    urgency:"low", urgencyPct:30,
  },
];

export const NGO_REQUESTS = [
  {
    id:"r1", messName:"Neelkesh Caterer (North Indian)", agoMin:2,
    foods:["🫓 Roti ×80","🥘 Curry ×40","🍚 Rice 5 kg"],
    timeLeftMin:52, safeWindowMin:90, urgent:false, status:"new",
  },
  {
    id:"r2", messName:"Shree Raja Rajeshwari (South Indian)", agoMin:11,
    foods:["🍛 Dal ×60","🥗 Salad ×30"],
    timeLeftMin:19, safeWindowMin:60, urgent:true, status:"new",
  },
  {
    id:"r3", messName:"R Gouras Caterer Vindhya Ground Floor", agoMin:28,
    foods:["🫓 Chapati ×120","🥣 Curd ×50"],
    timeLeftMin:42, safeWindowMin:90, urgent:false, status:"new",
  },
];

export const NOTIFICATION_LOG = [
  { type:"accepted", text:"Hope Foundation accepted IIT Mess request",      time:"2m ago" },
  { type:"sent",     text:"Notification sent to Akshaya NGO",               time:"8m ago" },
  { type:"declined", text:"Seva Trust declined — capacity full",            time:"15m ago" },
  { type:"sent",     text:"Fallback: Annadaata notified",                   time:"15m ago" },
  { type:"accepted", text:"Annadaata accepted Anna Univ request",           time:"18m ago" },
];

// ─── Priority Scoring Engine ──────────────────────────────────────────────────
export function computePriorityScore(
  ngo: NGO,
  urgencyPct: number,
  weights: PriorityWeights = DEFAULT_WEIGHTS
): { total: number; breakdown: Record<string, number> } {
  const MAX_DIST = 15;
  const distScore      = Math.max(0, 100 - (ngo.distanceKm / MAX_DIST) * 100);
  const urgScore       = urgencyPct;
  const availScore     = ngo.isActive ? (ngo.capacityFree) : 0;
  const fairScore      = Math.min(100, (ngo.lastAssigned / 360) * 100);  // longer gap = fairer
  const relyScore      = ngo.reliabilityScore;

  const total = Math.round(
    distScore  * weights.distance   +
    urgScore   * weights.urgency    +
    availScore * weights.availability +
    fairScore  * weights.fairness   +
    relyScore  * weights.reliability
  );

  return {
    total,
    breakdown: {
      distance:     Math.round(distScore),
      urgency:      Math.round(urgScore),
      availability: Math.round(availScore),
      fairness:     Math.round(fairScore),
      reliability:  Math.round(relyScore),
    },
  };
}

export function rankNGOs(ngos: NGO[], urgencyPct: number, weights?: PriorityWeights): NGO[] {
  return ngos
    .map(ngo => ({ ...ngo, priorityScore: computePriorityScore(ngo, urgencyPct, weights).total }))
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));
}
