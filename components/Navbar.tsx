"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const path = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px", height:"60px",
      background:"var(--surface)", borderBottom:"1px solid var(--border)",
      position:"sticky", top:0, zIndex:100,
    }}>
      {/* Brand */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:32, height:32, borderRadius:8, fontSize:16,
          background:"linear-gradient(135deg,#22c55e,#14b8a6)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>🌱</div>
        <span style={{
          fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18,
        }}>
          Re<span style={{ color:"var(--green)" }}>plate</span>
        </span>
      </div>

      {/* Tab switcher */}
      <div style={{
        display:"flex", background:"var(--surface2)",
        border:"1px solid var(--border)", borderRadius:8, padding:3, gap:2,
      }}>
        {[
          { href:"/mess", label:"🍽 Mess Dashboard" },
          { href:"/ngo",  label:"🤝 NGO Dashboard" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding:"6px 18px", borderRadius:6, fontSize:13, fontWeight:500,
            textDecoration:"none", transition:"all .2s",
            background: path === href ? "var(--accent)" : "transparent",
            color: path === href ? "#fff" : "var(--text2)",
          }}>{label}</Link>
        ))}
      </div>

      {/* Live indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text3)" }}>
        <div className="pulse" style={{
          width:7, height:7, borderRadius:"50%", background:"var(--green)",
        }} />
        {time}
      </div>
    </nav>
  );
}
