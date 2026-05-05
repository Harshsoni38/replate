"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Badge, SectionHeader, MiniBar, LiveDot } from "@/components/ui";
import { NGO_REQUESTS, DEMO_NGOS, NOTIFICATION_LOG, rankNGOs, DEFAULT_WEIGHTS } from "@/lib/data";

const RANKED = rankNGOs(DEMO_NGOS, 65);

export default function NGOPage() {
  const [requests, setRequests] = useState(NGO_REQUESTS.map(r => ({ ...r })));

  function claim(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status:"claimed" } : r));
  }
  function pass(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status:"passed" } : r));
  }

  const newCount = requests.filter(r => r.status === "new").length;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:44, height:44, borderRadius:12, flexShrink:0,
              background:"linear-gradient(135deg,var(--accent),var(--blue))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:16, color:"#fff",
            }}>HF</div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700 }}>Hope Foundation</div>
              <div style={{ fontSize:12, color:"var(--text3)", display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:10, background:"var(--green-bg)", color:"var(--green)", fontWeight:600 }}>
                  <LiveDot /> Active
                </span>
                Adyar, Chennai — 3.2 km radius
              </div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <Badge color="teal">Priority Score: 91</Badge>
            <span style={{ fontSize:11, color:"var(--text3)" }}>Reliability: 94% · Response rate: 87%</span>
          </div>
        </div>

        {/* Main two-column layout */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20, alignItems:"start" }}>

          {/* Request Feed */}
          <div>
            <SectionHeader
              title="Incoming Requests"
              right={<Badge color={newCount > 0 ? "orange" : "green"}>{newCount} new</Badge>}
            />
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {requests.map(r => {
                const u = r.timeLeftMin / r.safeWindowMin * 100;
                const timeColor = r.timeLeftMin < 20 ? "var(--red)" : r.timeLeftMin < 45 ? "var(--orange)" : "var(--green)";
                const isClaimed = r.status === "claimed";
                const isPassed  = r.status === "passed";

                if (isClaimed) return (
                  <div key={r.id} className="fade-in" style={{
                    background:"var(--surface)", border:"1px solid rgba(20,184,166,.3)",
                    borderRadius:14, padding:18, position:"relative", overflow:"hidden", opacity:1,
                  }}>
                    <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:"var(--teal)", borderRadius:"2px 0 0 2px" }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{r.messName}</div>
                        <div style={{ fontSize:11, color:"var(--text3)" }}>{r.agoMin} min ago</div>
                      </div>
                      <Badge color="teal">Claimed</Badge>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                      {r.foods.map(f => (
                        <span key={f} style={{ padding:"4px 10px", borderRadius:6, fontSize:12, fontWeight:500, background:"var(--surface2)", color:"var(--text2)", border:"1px solid var(--border)" }}>{f}</span>
                      ))}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--teal)", fontWeight:600, fontSize:14 }}>
                      ✅ You claimed this request — pickup confirmed
                    </div>
                  </div>
                );

                if (isPassed) return (
                  <div key={r.id} style={{
                    background:"var(--surface)", border:"1px solid var(--border)",
                    borderRadius:14, padding:18, opacity:0.4, pointerEvents:"none",
                  }}>
                    <div style={{ fontSize:13, color:"var(--text3)" }}>Passed — {r.messName}</div>
                  </div>
                );

                return (
                  <div key={r.id} style={{
                    background:"var(--surface)", border:"1px solid var(--border)",
                    borderRadius:14, padding:18, position:"relative", overflow:"hidden",
                    transition:"border .2s",
                  }}>
                    <div style={{
                      position:"absolute", top:0, left:0, width:4, height:"100%",
                      background: r.urgent ? "var(--red)" : "var(--orange)",
                      borderRadius:"2px 0 0 2px",
                    }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{r.messName}</div>
                        <div style={{ fontSize:11, color:"var(--text3)" }}>{r.agoMin} min ago</div>
                      </div>
                      {r.urgent
                        ? <Badge color="red">⚡ Urgent</Badge>
                        : <Badge color="blue">New</Badge>
                      }
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                      {r.foods.map(f => (
                        <span key={f} style={{ padding:"4px 10px", borderRadius:6, fontSize:12, fontWeight:500, background:"var(--surface2)", color:"var(--text2)", border:"1px solid var(--border)" }}>{f}</span>
                      ))}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--surface2)", borderRadius:8, padding:"10px 12px", marginBottom:14 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:"var(--text2)", marginBottom:6 }}>Time remaining in safe window</div>
                        <MiniBar pct={u} color={timeColor} />
                      </div>
                      <div style={{ marginLeft:16, fontSize:13, fontWeight:600, color:timeColor, whiteSpace:"nowrap" }}>
                        {r.timeLeftMin} min left
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => pass(r.id)} style={{
                        flex:1, padding:10, borderRadius:10, border:"1px solid var(--border)",
                        background:"var(--surface2)", color:"var(--text2)",
                        fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                      }}>✕ Pass</button>
                      <button onClick={() => claim(r.id)} style={{
                        flex:1, padding:10, borderRadius:10, border:"none",
                        background:"var(--green)", color:"#fff",
                        fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                        transition:"background .2s",
                      }}>✓ Claim Pickup</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Priority Rankings */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:18 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:".6px", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                🎯 Priority Rankings
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {RANKED.map((ngo, i) => (
                  <div key={ngo.id} style={{
                    display:"flex", alignItems:"center", gap:10, padding:"10px 0",
                    borderBottom: i < RANKED.length-1 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{
                      width:22, height:22, borderRadius:"50%", flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:600,
                      background: i === 0 ? "var(--amber-bg)" : "var(--surface2)",
                      color: i === 0 ? "var(--amber)" : "var(--text2)",
                    }}>{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color: !ngo.isActive ? "var(--text3)" : "var(--text)" }}>
                        {ngo.name}{!ngo.isActive && <span style={{ fontSize:10, color:"var(--red)", marginLeft:5 }}>offline</span>}
                      </div>
                      <div style={{ fontSize:11, color:"var(--text3)" }}>{ngo.distanceKm} km</div>
                    </div>
                    <div style={{ minWidth:52, textAlign:"right" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--accent2)" }}>{ngo.priorityScore}</div>
                      <div style={{ height:4, background:"var(--surface3)", borderRadius:2, overflow:"hidden", marginTop:3 }}>
                        <div style={{ height:"100%", width:`${ngo.priorityScore}%`, background:"var(--accent)", borderRadius:2 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Factor Weights */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:18 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:".6px", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                ⚖️ Score Factors
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:12 }}>Weights applied to active listing</div>
              {[
                { label:"Distance",     pct:DEFAULT_WEIGHTS.distance*100,     color:"var(--blue)"   },
                { label:"Urgency",      pct:DEFAULT_WEIGHTS.urgency*100,      color:"var(--red)"    },
                { label:"Availability", pct:DEFAULT_WEIGHTS.availability*100, color:"var(--green)"  },
                { label:"Fairness",     pct:DEFAULT_WEIGHTS.fairness*100,     color:"var(--amber)"  },
                { label:"Reliability",  pct:DEFAULT_WEIGHTS.reliability*100,  color:"var(--teal)"   },
              ].map(f => (
                <div key={f.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ fontSize:12, color:"var(--text2)", width:80, flexShrink:0 }}>{f.label}</div>
                  <div style={{ flex:1, height:5, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${f.pct*3}%`, background:f.color, borderRadius:3 }} />
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", width:32, textAlign:"right" }}>{f.pct}%</div>
                </div>
              ))}
            </div>

            {/* Notification Log */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:18 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:".6px", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                📡 Notification Log
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {NOTIFICATION_LOG.map((n, i) => {
                  const dotColor = n.type==="accepted" ? "var(--green)" : n.type==="declined" ? "var(--red)" : "var(--blue)";
                  return (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:8,
                      padding:"7px 0", borderBottom: i < NOTIFICATION_LOG.length-1 ? "1px solid var(--border)" : "none",
                    }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:dotColor, flexShrink:0 }} />
                      <div style={{ fontSize:12, color:"var(--text2)", flex:1, lineHeight:1.4 }}>{n.text}</div>
                      <div style={{ fontSize:11, color:"var(--text3)", whiteSpace:"nowrap" }}>{n.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
