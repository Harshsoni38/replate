"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MatchModal from "@/components/MatchModal";
import { Badge, StatCard, SectionHeader, MiniBar, LiveDot } from "@/components/ui";
import {
  DEMO_LISTINGS, DEMO_NGOS, Listing, FoodCategory,
  rankNGOs, computePriorityScore,
} from "@/lib/data";

const FOOD_ICONS: Record<string, string> = {
  "Roti / Chapati":"🫓","Steamed Rice":"🍚","Dal / Lentils":"🍛",
  "Vegetable Curry":"🥘","Paneer Dish":"🧀","Sambar / Rasam":"🍲",
  "Curd / Raita":"🥣","Sweet / Dessert":"🍮",
};

// ✅ Updated mess name (single source inside this file only)
const CURRENT_MESS = "R Gouras Caterer Vindhya Ground Floor";

export default function MessPage() {
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [category, setCategory] = useState<FoodCategory | "">("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("servings");
  const [prepTime, setPrepTime] = useState("13:00");
  const [pickupFrom, setPickupFrom] = useState("13:30");
  const [pickupTo, setPickupTo] = useState("14:30");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successNGO, setSuccessNGO] = useState("");

  const ranked = rankNGOs(DEMO_NGOS, 65);
  const topNGO = ranked[0];
  const breakdown = computePriorityScore(topNGO, 65).breakdown;
  const modalNGO = { ...topNGO, priorityScore: topNGO.priorityScore ?? 0, breakdown };

  function handleSubmit() {
    if (!category || !qty) { alert("Please select a food category and enter quantity."); return; }
    setShowModal(true);
  }

  function handleConfirm() {
    const newListing: Listing = {
      id: `l${Date.now()}`,
      messId: "mess1",
      messName: CURRENT_MESS, // ✅ fixed
      category: category as FoodCategory,
      quantity: qty,
      unit,
      icon: FOOD_ICONS[category] ?? "🍽",
      prepTime,
      pickupFrom,
      pickupTo,
      notes,
      postedAt: new Date(),
      status: "matched",
      claimedBy: undefined,
      urgency: "medium",
      urgencyPct: 60,
    };
    setListings(prev => [newListing, ...prev]);
    setSuccessNGO(topNGO.name);
    setShowModal(false);
    setShowSuccess(true);
    setCategory(""); setQty(""); setNotes("");
    setTimeout(() => setShowSuccess(false), 5000);
  }

  const urgColor = (pct: number) =>
    pct > 70 ? "var(--red)" : pct > 40 ? "var(--orange)" : "var(--green)";

  const activeCount = listings.filter(l => l.status !== "expired").length;
  const claimedCount = listings.filter(l => l.status === "claimed").length;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, margin:0 }}>
              {CURRENT_MESS}
            </h1>
            <p style={{ fontSize:13, color:"var(--text2)", margin:"4px 0 0" }}>
              Staff Portal — report surplus food in seconds
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 12px", borderRadius:20, background:"var(--green-bg)", color:"var(--green)", fontSize:12, fontWeight:600 }}>
            <LiveDot /> Online
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
          <StatCard label="Meals Saved Today" value="247"     valueColor="var(--green)"  sub="↑ 18% vs yesterday" />
          <StatCard label="Active Listings"   value={String(activeCount)} sub={`${claimedCount} claimed, ${activeCount-claimedCount} pending`} />
          <StatCard label="Avg Pickup Time"   value="22 min"  valueColor="var(--orange)" sub="within safety window" />
          <StatCard label="NGO Partners"      value="8"       sub="5 currently active" />
        </div>

        {/* Form */}
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:24, marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"var(--green-bg)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>+</div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600 }}>Report Surplus Food</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Food Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as FoodCategory)}>
                <option value="">Select category…</option>
                {Object.keys(FOOD_ICONS).map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Quantity</label>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" placeholder="e.g. 50" value={qty} min={1}
                  onChange={e => setQty(e.target.value)} style={{ flex:1 }} />
                <select value={unit} onChange={e => setUnit(e.target.value)} style={{ width:100 }}>
                  <option>servings</option><option>kg</option><option>litres</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Prepared At</label>
              <input type="time" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Pickup Window — From</label>
              <input type="time" value={pickupFrom} onChange={e => setPickupFrom(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Pickup Window — To</label>
              <input type="time" value={pickupTo} onChange={e => setPickupTo(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"var(--text2)", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>Notes (optional)</label>
              <input type="text" placeholder="e.g. Contains peanuts, packed in trays"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <button onClick={handleSubmit} style={{
            marginTop:18, width:"100%", padding:13,
            background:"var(--green)", border:"none", borderRadius:10,
            color:"#fff", fontSize:15, fontWeight:600, fontFamily:"inherit",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            transition:"background .2s",
          }}>
            🚀 Submit &amp; Match NGOs
          </button>

          {showSuccess && (
            <div className="fade-in" style={{
              marginTop:14, padding:"13px 16px", borderRadius:10,
              background:"var(--green-bg)", border:"1px solid rgba(34,197,94,.3)",
              display:"flex", alignItems:"center", gap:10, fontSize:14, color:"var(--green)",
            }}>
              <span style={{ fontSize:18 }}>✅</span>
              <div>
                <strong>Listing submitted!</strong> Priority matching complete —{" "}
                <strong>{successNGO}</strong> has been notified first.
              </div>
            </div>
          )}
        </div>

        {/* Active Listings */}
        <SectionHeader
          title="Active Listings"
          right={<Badge color="green">{activeCount} active</Badge>}
        />

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {listings.map(l => (
            <div key={l.id} style={{
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:14, padding:"16px 18px",
              display:"grid", gridTemplateColumns:"auto 1fr auto auto",
              alignItems:"center", gap:16, transition:"border .2s",
            }}>
              <div style={{
                width:40, height:40, borderRadius:10, flexShrink:0,
                background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
              }}>{l.icon}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{l.category}</div>
                <div style={{ fontSize:12, color:"var(--text3)", display:"flex", gap:8 }}>
                  <span>{l.quantity} {l.unit}</span>
                  <span>·</span>
                  <span>Pickup {l.pickupFrom}–{l.pickupTo}</span>
                  <span>·</span>
                  <span>{Math.round((Date.now() - l.postedAt.getTime()) / 60000)} min ago</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"center", minWidth:80 }}>
                <span style={{ fontSize:11, color:"var(--text3)" }}>Urgency</span>
                <MiniBar pct={l.urgencyPct} color={urgColor(l.urgencyPct)} />
                <span style={{ fontSize:11, color:"var(--text3)" }}>{l.urgencyPct}%</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                {l.status === "claimed" ? (
                  <Badge color="teal">✓ Claimed</Badge>
                ) : l.status === "matched" ? (
                  <Badge color="blue">🎯 Matched</Badge>
                ) : (
                  <Badge color="orange">⏳ Pending</Badge>
                )}
                {l.claimedBy
                  ? <span style={{ fontSize:12, fontWeight:600, color:"var(--accent2)" }}>{l.claimedBy}</span>
                  : <span style={{ fontSize:11, color:"var(--text3)" }}>Awaiting NGO…</span>
                }
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <MatchModal ngo={modalNGO} onConfirm={handleConfirm} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}