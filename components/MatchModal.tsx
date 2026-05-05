"use client";
import { NGO } from "@/lib/data";

interface Props {
  ngo: NGO & { priorityScore: number; breakdown: Record<string,number> };
  onConfirm: () => void;
  onClose: () => void;
}

export default function MatchModal({ ngo, onConfirm, onClose }: Props) {
  const pills = [
    { label:"Distance",     val: ngo.breakdown.distance,     icon:"📍" },
    { label:"Urgency",      val: ngo.breakdown.urgency,      icon:"⏰" },
    { label:"Availability", val: ngo.breakdown.availability, icon:"✅" },
    { label:"Fairness",     val: ngo.breakdown.fairness,     icon:"⚖️" },
    { label:"Reliability",  val: ngo.breakdown.reliability,  icon:"🤝" },
  ];

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.75)",
      zIndex:200, display:"flex", alignItems:"center", justifyContent:"center",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slide-up" style={{
        background:"var(--surface)", border:"1px solid var(--border2)",
        borderRadius:14, padding:28, width:460, maxWidth:"92vw",
      }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:19, fontWeight:700, marginBottom:5, display:"flex", alignItems:"center", gap:8 }}>
          🎯 Priority Match Found
        </div>
        <div style={{ fontSize:13, color:"var(--text3)", marginBottom:20 }}>
          Based on your listing, here's the best NGO — notified instantly
        </div>

        <div style={{ background:"var(--surface2)", borderRadius:10, padding:16, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background:"linear-gradient(135deg,var(--accent),var(--blue))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:15, color:"#fff",
            }}>{ngo.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:15 }}>{ngo.name}</div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>{ngo.distanceKm} km · {ngo.location} · Notified instantly</div>
            </div>
            <div style={{ fontSize:22, fontWeight:700, color:"var(--green)", fontFamily:"'Space Grotesk',sans-serif" }}>
              {ngo.priorityScore}
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {pills.map(p => (
              <div key={p.label} style={{
                padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600,
                background:"var(--surface3)", color:"var(--text2)",
                border:"1px solid var(--border)",
              }}>{p.icon} {p.label}: {p.val}</div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:18 }}>
          2 fallback NGOs queued — auto-notified if no response within 8 min
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{
            flex:1, padding:11, borderRadius:10, border:"1px solid var(--border)",
            background:"var(--surface2)", color:"var(--text2)",
            fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
          }}>Back</button>
          <button onClick={onConfirm} style={{
            flex:1, padding:11, borderRadius:10, border:"none",
            background:"var(--green)", color:"#fff",
            fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
            transition:"background .2s",
          }}>✓ Confirm & Notify</button>
        </div>
      </div>
    </div>
  );
}
