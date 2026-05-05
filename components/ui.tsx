"use client";
import React from "react";

type BadgeColor = "green"|"orange"|"red"|"blue"|"teal"|"amber"|"accent";
const BADGE_COLORS: Record<BadgeColor, {bg:string;color:string}> = {
  green:  { bg:"var(--green-bg)",  color:"var(--green)"  },
  orange: { bg:"var(--orange-bg)", color:"var(--orange)" },
  red:    { bg:"var(--red-bg)",    color:"var(--red)"    },
  blue:   { bg:"var(--blue-bg)",   color:"var(--blue)"   },
  teal:   { bg:"var(--teal-bg)",   color:"var(--teal)"   },
  amber:  { bg:"var(--amber-bg)",  color:"var(--amber)"  },
  accent: { bg:"rgba(99,102,241,.15)", color:"var(--accent2)" },
};

export function Badge({ children, color="blue" }: { children:React.ReactNode; color?: BadgeColor }) {
  const { bg, color:c } = BADGE_COLORS[color];
  return (
    <span style={{
      padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
      background:bg, color:c, whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

export function StatCard({
  label, value, valueColor, sub,
}: { label:string; value:string; valueColor?:string; sub?:string }) {
  return (
    <div style={{
      background:"var(--surface)", border:"1px solid var(--border)",
      borderRadius:14, padding:"16px 20px",
    }}>
      <div style={{ fontSize:12, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".8px", marginBottom:8 }}>
        {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", color: valueColor ?? "var(--text)" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{sub}</div>}
    </div>
  );
}

export function SectionHeader({ title, right }: { title:string; right?:React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>{title}</div>
      {right}
    </div>
  );
}

export function Card({ children, style }: { children:React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background:"var(--surface)", border:"1px solid var(--border)",
      borderRadius:14, padding:"20px 22px", ...style,
    }}>{children}</div>
  );
}

export function MiniBar({ pct, color }: { pct:number; color:string }) {
  return (
    <div style={{ height:5, background:"var(--surface3)", borderRadius:3, overflow:"hidden", width:"100%" }}>
      <div style={{ height:"100%", width:`${Math.min(100,pct)}%`, background:color, borderRadius:3, transition:"width .5s" }} />
    </div>
  );
}

export function LiveDot() {
  return (
    <div className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", flexShrink:0 }} />
  );
}
