"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { OPEN_PREVIEW_NOTICE, evaluateLearningAccess } from "./accessPolicy";
import { loadCourseLearning } from "./progress";

/* ─── Course SVG Thumbnails ─── */
function ThumbFundamentals() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#0D0D10"/>
      <defs>
        <radialGradient id="tg1" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#F0A500" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#F0A500" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#tg1)"/>
      {/* Grid */}
      {[0,1,2,3,4,5,6].map(i=><line key={"v"+i} x1={i*54} y1="0" x2={i*54} y2="180" stroke="#F0A500" strokeWidth="0.3" opacity="0.08"/>)}
      {[0,1,2,3,4].map(i=><line key={"h"+i} x1="0" y1={i*45} x2="320" y2={i*45} stroke="#F0A500" strokeWidth="0.3" opacity="0.08"/>)}
      {/* Battery */}
      <line x1="30" y1="90" x2="30" y2="50" stroke="#F0A500" strokeWidth="2" opacity="0.9"/>
      <line x1="20" y1="50" x2="40" y2="50" stroke="#F0A500" strokeWidth="3" opacity="0.9"/>
      <line x1="25" y1="42" x2="35" y2="42" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <line x1="30" y1="130" x2="30" y2="90" stroke="#F0A500" strokeWidth="2" opacity="0.9"/>
      <line x1="20" y1="130" x2="40" y2="130" stroke="#F0A500" strokeWidth="3" opacity="0.9"/>
      <line x1="25" y1="138" x2="35" y2="138" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <text x="10" y="90" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.6" textAnchor="middle">9V</text>
      {/* Wires top */}
      <line x1="30" y1="40" x2="160" y2="40" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8"/>
      {/* Resistor R1 */}
      <line x1="160" y1="40" x2="165" y2="40" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8"/>
      <rect x="165" y="34" width="40" height="12" rx="3" fill="none" stroke="#00D4FF" strokeWidth="1.4" opacity="0.85"/>
      <line x1="205" y1="40" x2="210" y2="40" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8"/>
      <text x="185" y="30" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.7">R1 220Ω</text>
      {/* Resistor R2 */}
      <line x1="210" y1="40" x2="240" y2="40" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8"/>
      <line x1="240" y1="40" x2="240" y2="140" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8"/>
      <line x1="210" y1="40" x2="210" y2="80" stroke="#34D399" strokeWidth="1.5" opacity="0.7" strokeDasharray="3 2"/>
      <line x1="210" y1="92" x2="210" y2="140" stroke="#34D399" strokeWidth="1.5" opacity="0.7" strokeDasharray="3 2"/>
      <rect x="203" y="80" width="14" height="12" rx="3" fill="none" stroke="#34D399" strokeWidth="1.4" opacity="0.85"/>
      <text x="230" y="95" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.6">R2 470Ω</text>
      {/* Bottom wire */}
      <line x1="240" y1="140" x2="30" y2="140" stroke="#F0A500" strokeWidth="1.5" opacity="0.8"/>
      {/* Voltmeter */}
      <circle cx="130" cy="90" r="16" fill="rgba(168,85,247,0.12)" stroke="#A855F7" strokeWidth="1.2" opacity="0.7"/>
      <text x="130" y="94" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#A855F7" opacity="0.8">V</text>
      <line x1="130" y1="74" x2="130" y2="40" stroke="#A855F7" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"/>
      <line x1="130" y1="106" x2="130" y2="140" stroke="#A855F7" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"/>
      {/* Labels */}
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.4" letterSpacing="1">OHM'S LAW · SERIES CIRCUITS</text>
      {/* Formula */}
      <rect x="256" y="50" width="58" height="42" rx="4" fill="rgba(240,165,0,0.08)" stroke="#F0A500" strokeWidth="0.6" opacity="0.5"/>
      <text x="285" y="67" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#F0A500" opacity="0.7">V = I×R</text>
      <text x="285" y="80" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.6">P = V×I</text>
      <text x="285" y="84" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.25">────────</text>
    </svg>
  );
}

function ThumbDomestic() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#080C10"/>
      {/* House outline */}
      <polygon points="160,18 280,80 280,165 40,165 40,80" fill="rgba(52,211,153,0.05)" stroke="#34D399" strokeWidth="1.2" opacity="0.55"/>
      {/* Roof */}
      <polygon points="160,18 280,80 40,80" fill="rgba(52,211,153,0.08)"/>
      <line x1="160" y1="18" x2="280" y2="80" stroke="#34D399" strokeWidth="1.5" opacity="0.6"/>
      <line x1="160" y1="18" x2="40" y2="80" stroke="#34D399" strokeWidth="1.5" opacity="0.6"/>
      {/* Consumer unit */}
      <rect x="52" y="90" width="44" height="60" rx="3" fill="#0F1A0F" stroke="#34D399" strokeWidth="1.2" opacity="0.7"/>
      <text x="74" y="103" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#34D399" opacity="0.6">CU</text>
      {[0,1,2,3,4,5].map(i=>(
        <g key={i}>
          <rect x="56" y={108+i*7} width="34" height="5" rx="1.5" fill={i===0?"#F0A500":i===5?"#FF4444":"rgba(255,255,255,0.15)"} opacity="0.7"/>
          <text x="60" y={112+i*7} fontFamily="monospace" fontSize="4.5" fill="#0A0A0C" opacity="0.9">{["MCB","MCB","MCB","RCBO","MCB","OFF"][i]}</text>
        </g>
      ))}
      {/* Wires from CU */}
      <line x1="96" y1="110" x2="160" y2="110" stroke="#F0A500" strokeWidth="1.5" opacity="0.65" strokeDasharray="4 2"/>
      <line x1="96" y1="120" x2="200" y2="120" stroke="#00D4FF" strokeWidth="1.5" opacity="0.65" strokeDasharray="4 2"/>
      <line x1="96" y1="130" x2="180" y2="130" stroke="#F0A500" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2"/>
      {/* Sockets */}
      {[[158,100],[198,110],[178,120]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x} y={y} width="20" height="16" rx="3" fill="#0F1810" stroke="#34D399" strokeWidth="1" opacity="0.65"/>
          <circle cx={x+7} cy={y+7} r="2.5" fill="none" stroke="#34D399" strokeWidth="0.8" opacity="0.55"/>
          <circle cx={x+13} cy={y+7} r="2.5" fill="none" stroke="#34D399" strokeWidth="0.8" opacity="0.55"/>
          <line x1={x+10} y1={y+3} x2={x+10} y2={y+6} stroke="#34D399" strokeWidth="0.8" opacity="0.45"/>
        </g>
      ))}
      {/* Light fixture */}
      <circle cx="195" cy="50" r="10" fill="rgba(240,165,0,0.22)" stroke="#F0A500" strokeWidth="1" opacity="0.7"/>
      <circle cx="195" cy="50" r="5" fill="#F0A500" opacity="0.6"/>
      {[0,1,2,3,4,5,6,7].map(i=>(
        <line key={i} x1={195+Math.cos(i*45*Math.PI/180)*12} y1={50+Math.sin(i*45*Math.PI/180)*12} x2={195+Math.cos(i*45*Math.PI/180)*17} y2={50+Math.sin(i*45*Math.PI/180)*17} stroke="#F0A500" strokeWidth="1" opacity="0.45"/>
      ))}
      <line x1="195" y1="30" x2="195" y2="40" stroke="#F0A500" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 2"/>
      {/* Earth stake */}
      <line x1="74" y1="150" x2="74" y2="168" stroke="#34D399" strokeWidth="1.5" opacity="0.55"/>
      <line x1="66" y1="162" x2="82" y2="162" stroke="#34D399" strokeWidth="1.5" opacity="0.5"/>
      <line x1="69" y1="165" x2="79" y2="165" stroke="#34D399" strokeWidth="1" opacity="0.4"/>
      <line x1="72" y1="168" x2="76" y2="168" stroke="#34D399" strokeWidth="0.8" opacity="0.3"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.4" letterSpacing="1">DOMESTIC WIRING · RING CIRCUITS</text>
    </svg>
  );
}

function ThumbProtection() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#100808"/>
      <defs>
        <radialGradient id="tg3" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FF4444" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#FF4444" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#tg3)"/>
      {/* MCB panel */}
      <rect x="20" y="20" width="120" height="145" rx="6" fill="#0D0A0A" stroke="#FF4444" strokeWidth="1.2" opacity="0.55"/>
      <rect x="20" y="20" width="120" height="22" rx="6" fill="#FF4444" opacity="0.2"/>
      <text x="80" y="35" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#FF4444" opacity="0.7" letterSpacing="1">DISTRIBUTION BOARD</text>
      {/* Breakers */}
      {[
        {label:"MAIN", amp:"100A", type:"switch", y:50},
        {label:"RING 1", amp:"32A", type:"mcb", y:72},
        {label:"RING 2", amp:"32A", type:"mcb", y:94},
        {label:"LIGHTING", amp:"6A", type:"mcb", y:116},
        {label:"COOKER", amp:"45A", type:"mcb", y:138},
      ].map((b,i)=>(
        <g key={i}>
          <rect x="28" y={b.y} width="104" height="18" rx="3" fill={i===0?"rgba(255,68,68,0.15)":"rgba(255,255,255,0.04)"} stroke={i===0?"#FF4444":"rgba(255,255,255,0.1)"} strokeWidth="0.8"/>
          <rect x="30" y={b.y+3} width="16" height="12" rx="2" fill={i===0?"#FF4444":i===3?"#34D399":"#F0A500"} opacity="0.75"/>
          <text x="53" y={b.y+11} fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.7">{b.label}</text>
          <text x="118" y={b.y+11} textAnchor="end" fontFamily="monospace" fontSize="7" fill="#888899" opacity="0.7">{b.amp}</text>
        </g>
      ))}
      {/* RCD */}
      <rect x="170" y="20" width="140" height="75" rx="6" fill="#0A0D0A" stroke="#34D399" strokeWidth="1.2" opacity="0.6"/>
      <text x="240" y="35" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#34D399" opacity="0.6" letterSpacing="1">RCD / RCCB</text>
      <rect x="190" y="44" width="100" height="44" rx="4" fill="rgba(52,211,153,0.07)"/>
      <text x="240" y="62" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#34D399" opacity="0.8">30mA</text>
      <text x="240" y="76" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0F0F0" opacity="0.4">Type A</text>
      <circle cx="240" cy="86" r="6" fill="none" stroke="#34D399" strokeWidth="1.2" opacity="0.5"/>
      <text x="240" y="90" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.7">T</text>
      {/* Waveform fault */}
      <rect x="170" y="105" width="140" height="58" rx="6" fill="#0A0A0D" stroke="#F0A500" strokeWidth="0.8" opacity="0.4"/>
      <text x="178" y="118" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.5">FAULT CURRENT</text>
      <polyline points="175,138 190,138 200,120 210,155 220,125 230,150 240,132 250,138 260,138 270,138 300,138" fill="none" stroke="#FF4444" strokeWidth="1.5" opacity="0.8" strokeLinejoin="round"/>
      <line x1="175" y1="138" x2="310" y2="138" stroke="#333" strokeWidth="0.5" opacity="0.5"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#FF4444" opacity="0.4" letterSpacing="1">PROTECTION · FAULT ANALYSIS</text>
    </svg>
  );
}

function ThumbThreePhase() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#08080F"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#A855F7" opacity="0.4" letterSpacing="1">THREE-PHASE · STAR / DELTA</text>
      {/* Sine waves */}
      {[
        {color:"#FF4444",label:"L1",phase:0},
        {color:"#F0A500",label:"L2",phase:120},
        {color:"#3B82F6",label:"L3",phase:240},
      ].map((w,wi)=>{
        const pts = [];
        for(let x=0;x<=280;x+=4){
          const angle = (x/280)*4*Math.PI + w.phase*Math.PI/180;
          const y = 70 - Math.sin(angle)*40;
          pts.push(`${x+20},${y}`);
        }
        return (
          <g key={wi}>
            <polyline points={pts.join(" ")} fill="none" stroke={w.color} strokeWidth="1.8" opacity="0.8"/>
            <text x="8" y={wi===0?35:wi===1?75:115} fontFamily="monospace" fontSize="9" fill={w.color} opacity="0.7">{w.label}</text>
          </g>
        );
      })}
      {/* Center baseline */}
      <line x1="20" y1="70" x2="300" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <text x="20" y="120" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.22">0°</text>
      <text x="90" y="120" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.22">120°</text>
      <text x="160" y="120" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.22">240°</text>
      <text x="230" y="120" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.22">360°</text>
      {/* Star connection */}
      <g transform="translate(200,148)">
        {[[0,-22],[-19,11],[19,11]].map(([x,y],i)=>(
          <g key={i}>
            <line x1="0" y1="0" x2={x} y2={y} stroke={["#FF4444","#F0A500","#3B82F6"][i]} strokeWidth="2" opacity="0.8"/>
            <circle cx={x} cy={y} r="4" fill={["#FF4444","#F0A500","#3B82F6"][i]} opacity="0.7"/>
          </g>
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#A855F7" opacity="0.8"/>
        <text x="0" y="28" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#A855F7" opacity="0.6">STAR N</text>
      </g>
      {/* Delta */}
      <g transform="translate(80,148)">
        <polygon points="0,-22 -19,11 19,11" fill="none" stroke="#A855F7" strokeWidth="1.5" opacity="0.65"/>
        <circle cx="0" cy="-22" r="3.5" fill="#FF4444" opacity="0.7"/>
        <circle cx="-19" cy="11" r="3.5" fill="#F0A500" opacity="0.7"/>
        <circle cx="19" cy="11" r="3.5" fill="#3B82F6" opacity="0.7"/>
        <text x="0" y="28" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#A855F7" opacity="0.6">DELTA</text>
      </g>
    </svg>
  );
}

function ThumbCableSizing() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#080C10"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#00D4FF" opacity="0.4" letterSpacing="1">CABLE SIZING · CURRENT CAPACITY</text>
      {/* Cable cross-section */}
      <circle cx="90" cy="100" r="58" fill="#0D1218" stroke="#00D4FF" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="90" cy="100" r="50" fill="rgba(0,212,255,0.04)"/>
      {/* Individual conductors */}
      {[[90,70,{fill:"#FF4444",label:"L"},{dx:0,dy:-8}],[90,130,{fill:"#333",label:"N"},{dx:0,dy:10}],[55,100,{fill:"#34D399",label:"E"},{dx:-16,dy:0}],[125,85,{fill:"#F0A500",label:"L2"},{dx:12,dy:-6}],[125,115,{fill:"#3B82F6",label:"L3"},{dx:12,dy:6}]].map(([cx,cy,col,off],i)=>(
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r="14" fill={(col as {fill:string}).fill} opacity="0.22"/>
          <circle cx={cx as number} cy={cy as number} r="10" fill={(col as {fill:string}).fill} opacity="0.35"/>
          <circle cx={cx as number} cy={cy as number} r="6" fill={(col as {fill:string}).fill} opacity="0.6"/>
          <text x={(cx as number)+(off as {dx:number}).dx} y={(cy as number)+(off as {dy:number}).dy} textAnchor="middle" fontFamily="monospace" fontSize="7" fill={(col as {fill:string}).fill} opacity="0.8">{(col as {label:string}).label}</text>
        </g>
      ))}
      {/* Armour layer */}
      <circle cx="90" cy="100" r="55" fill="none" stroke="#888899" strokeWidth="2" opacity="0.3" strokeDasharray="5 3"/>
      {/* Specs table */}
      <rect x="165" y="28" width="148" height="140" rx="6" fill="rgba(0,212,255,0.04)" stroke="#00D4FF" strokeWidth="0.8" opacity="0.4"/>
      <text x="172" y="42" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.6">CABLE SPECIFICATION</text>
      <line x1="165" y1="46" x2="313" y2="46" stroke="#00D4FF" strokeWidth="0.5" opacity="0.3"/>
      {[
        ["Cross-section", "2.5mm²"],
        ["Type", "SWA XLPE"],
        ["Voltage", "0.6/1kV"],
        ["Icc", "27A"],
        ["Vd/A/m", "18mV"],
        ["Phases", "3+E"],
        ["Rating", "IP68"],
      ].map(([label,val],i)=>(
        <g key={i}>
          <text x="172" y={60+i*15} fontFamily="monospace" fontSize="7.5" fill="#888899" opacity="0.65">{label}</text>
          <text x="305" y={60+i*15} textAnchor="end" fontFamily="monospace" fontSize="7.5" fill="#00D4FF" opacity="0.8">{val}</text>
          <line x1="165" y1={62+i*15} x2="313" y2={62+i*15} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
        </g>
      ))}
    </svg>
  );
}

function ThumbSolar() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#07100A"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.4" letterSpacing="1">SOLAR PV · GRID CONNECTION</text>
      {/* Sun */}
      <circle cx="50" cy="38" r="16" fill="#F0A500" opacity="0.75"/>
      {[0,45,90,135,180,225,270,315].map(a=>(
        <line key={a} x1={50+Math.cos(a*Math.PI/180)*20} y1={38+Math.sin(a*Math.PI/180)*20} x2={50+Math.cos(a*Math.PI/180)*26} y2={38+Math.sin(a*Math.PI/180)*26} stroke="#F0A500" strokeWidth="1.5" opacity="0.55"/>
      ))}
      {/* Solar panels */}
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x={96+i*58} y="16" width="52" height="36" rx="3" fill="#001A40" stroke="#00D4FF" strokeWidth="1" opacity="0.75"/>
          {[0,1,2].map(r=>[0,1,2].map(c=>(
            <rect key={`${r}${c}`} x={99+i*58+c*16} y={19+r*11} width="14" height="9" rx="1" fill="rgba(0,212,255,0.18)" stroke="#00D4FF" strokeWidth="0.4" opacity="0.6"/>
          )))}
        </g>
      ))}
      {/* Array lines */}
      <line x1="250" y1="34" x2="270" y2="34" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <line x1="270" y1="34" x2="270" y2="75" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      {/* Inverter */}
      <rect x="230" y="74" width="80" height="48" rx="6" fill="#0A1410" stroke="#34D399" strokeWidth="1.2" opacity="0.7"/>
      <text x="270" y="91" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#34D399" opacity="0.7">INVERTER</text>
      <text x="270" y="103" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.5">DC → AC</text>
      <text x="270" y="115" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0F0F0" opacity="0.4">5kW</text>
      {/* DC wire in */}
      <line x1="270" y1="74" x2="270" y2="34" stroke="#F0A500" strokeWidth="1.5" opacity="0.65"/>
      {/* AC wire out */}
      <line x1="230" y1="98" x2="180" y2="98" stroke="#34D399" strokeWidth="1.5" opacity="0.7"/>
      {/* Generation meter */}
      <rect x="130" y="85" width="50" height="28" rx="4" fill="#0A1410" stroke="#34D399" strokeWidth="0.8" opacity="0.55"/>
      <text x="155" y="97" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.6">GEN</text>
      <text x="155" y="107" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.7">kWh</text>
      <line x1="130" y1="98" x2="100" y2="98" stroke="#34D399" strokeWidth="1.5" opacity="0.7"/>
      {/* Grid */}
      <rect x="20" y="78" width="80" height="42" rx="6" fill="#0A0A14" stroke="#A855F7" strokeWidth="1.2" opacity="0.6"/>
      <text x="60" y="96" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#A855F7" opacity="0.65">GRID TIE</text>
      <text x="60" y="108" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.35">230V 50Hz</text>
      {/* Battery */}
      <rect x="60" y="138" width="200" height="30" rx="5" fill="#0A1010" stroke="#34D399" strokeWidth="0.8" opacity="0.5"/>
      <text x="108" y="150" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.5">BATTERY STORAGE</text>
      <rect x="70" y="142" width="60" height="8" rx="2" fill="#34D399" opacity="0.25"/>
      <rect x="70" y="142" width="42" height="8" rx="2" fill="#34D399" opacity="0.45"/>
      <text x="250" y="154" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.5">10kWh</text>
      <line x1="60" y1="154" x2="60" y2="118" stroke="#A855F7" strokeWidth="1" opacity="0.45" strokeDasharray="3 2"/>
    </svg>
  );
}

function ThumbIndustrial() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#08080F"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#A855F7" opacity="0.4" letterSpacing="1">INDUSTRIAL CONTROL · LADDER LOGIC</text>
      {/* Ladder rails */}
      <line x1="30" y1="28" x2="30" y2="165" stroke="#F0F0F0" strokeWidth="2" opacity="0.35"/>
      <line x1="290" y1="28" x2="290" y2="165" stroke="#F0F0F0" strokeWidth="2" opacity="0.35"/>
      <text x="16" y="25" fontFamily="monospace" fontSize="8" fill="#F0F0F0" opacity="0.3">L1</text>
      <text x="284" y="25" fontFamily="monospace" fontSize="8" fill="#F0F0F0" opacity="0.3">L2</text>
      {/* Rung 1 — Start/Stop */}
      <line x1="30" y1="52" x2="80" y2="52" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <rect x="80" y="44" width="20" height="16" rx="2" fill="none" stroke="#34D399" strokeWidth="1.4" opacity="0.8"/>
      <text x="90" y="55" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.7">NO</text>
      <text x="87" y="67" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.35">START</text>
      <line x1="100" y1="52" x2="150" y2="52" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <line x1="150" y1="44" x2="150" y2="60" stroke="#FF4444" strokeWidth="1.4" opacity="0.75"/>
      <line x1="162" y1="44" x2="162" y2="60" stroke="#FF4444" strokeWidth="1.4" opacity="0.75"/>
      <line x1="150" y1="52" x2="162" y2="44" stroke="#FF4444" strokeWidth="1" opacity="0.6"/>
      <text x="156" y="67" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.35">STOP</text>
      <line x1="162" y1="52" x2="210" y2="52" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="225" cy="52" r="10" fill="rgba(240,165,0,0.15)" stroke="#F0A500" strokeWidth="1.5" opacity="0.75"/>
      <text x="225" y="56" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#F0A500" opacity="0.8">M</text>
      <text x="225" y="67" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.35">CONTACTOR</text>
      <line x1="235" y1="52" x2="290" y2="52" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      {/* Rung 2 — Aux contact */}
      <line x1="30" y1="95" x2="80" y2="95" stroke="#F0A500" strokeWidth="1.5" opacity="0.55"/>
      <rect x="80" y="87" width="20" height="16" rx="2" fill="rgba(240,165,0,0.1)" stroke="#F0A500" strokeWidth="1.2" opacity="0.65"/>
      <text x="90" y="98" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.6">AUX</text>
      <text x="87" y="110" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.35">M-AUX</text>
      <line x1="100" y1="95" x2="210" y2="95" stroke="#F0A500" strokeWidth="1.5" opacity="0.55"/>
      <circle cx="225" cy="95" r="10" fill="rgba(0,212,255,0.12)" stroke="#00D4FF" strokeWidth="1.4" opacity="0.7"/>
      <text x="225" y="99" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#00D4FF" opacity="0.75">OL</text>
      <text x="225" y="110" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.35">OVERLOAD</text>
      <line x1="235" y1="95" x2="290" y2="95" stroke="#F0A500" strokeWidth="1.5" opacity="0.55"/>
      {/* Motor output */}
      <rect x="90" y="135" width="140" height="28" rx="5" fill="rgba(168,85,247,0.08)" stroke="#A855F7" strokeWidth="1.2" opacity="0.6"/>
      <text x="160" y="147" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#A855F7" opacity="0.7">3-PHASE MOTOR</text>
      <text x="160" y="158" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.5">415V · 50Hz · DOL Start</text>
      {[0,1,2].map(i=>(
        <g key={i}>
          <line x1={110+i*36} y1="135" x2={110+i*36} y2="95" stroke={["#FF4444","#F0A500","#3B82F6"][i]} strokeWidth="1" opacity="0.45" strokeDasharray="3 2"/>
        </g>
      ))}
    </svg>
  );
}

function ThumbInspection() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#080A10"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#00D4FF" opacity="0.4" letterSpacing="1">INSPECTION & TESTING · EV THEORY</text>
      {/* Insulation resistance meter */}
      <rect x="20" y="28" width="110" height="130" rx="10" fill="#0D1018" stroke="#00D4FF" strokeWidth="1.4" opacity="0.65"/>
      <rect x="26" y="34" width="98" height="60" rx="6" fill="#060810"/>
      {/* Meter arc */}
      <path d="M 35 90 A 40 40 0 0 1 115 90" fill="none" stroke="#333" strokeWidth="8" opacity="0.5"/>
      <path d="M 35 90 A 40 40 0 0 1 115 90" fill="none" stroke="#34D399" strokeWidth="4" opacity="0.7" strokeDasharray="100 62"/>
      <circle cx="75" cy="90" r="4" fill="#F0A500" opacity="0.9"/>
      <line x1="75" y1="90" x2="105" y2="65" stroke="#F0A500" strokeWidth="2" opacity="0.9"/>
      <text x="75" y="85" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#34D399" opacity="0.9">∞MΩ</text>
      <text x="75" y="72" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.3">INSULATION R</text>
      <text x="42" y="102" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.25">0</text>
      <text x="98" y="102" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.25">∞</text>
      {/* Test leads */}
      <rect x="30" y="108" width="90" height="44" rx="4" fill="rgba(255,255,255,0.02)"/>
      <text x="75" y="122" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.6">500V TEST</text>
      <rect x="36" y="128" width="38" height="8" rx="2" fill="#FF4444" opacity="0.35"/>
      <rect x="56" y="128" width="16" height="8" rx="2" fill="#FF4444" opacity="0.6"/>
      <rect x="76" y="128" width="38" height="8" rx="2" fill="#333" opacity="0.55"/>
      <rect x="86" y="128" width="16" height="8" rx="2" fill="#333" opacity="0.8"/>
      <text x="45" y="136" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#FF4444" opacity="0.7">L+</text>
      <text x="95" y="136" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#F0F0F0" opacity="0.5">COM</text>
      {/* Test schedule table */}
      <rect x="148" y="28" width="160" height="140" rx="6" fill="rgba(0,212,255,0.04)" stroke="#00D4FF" strokeWidth="0.8" opacity="0.4"/>
      <text x="156" y="42" fontFamily="monospace" fontSize="7.5" fill="#00D4FF" opacity="0.6">TEST SCHEDULE</text>
      <line x1="148" y1="46" x2="308" y2="46" stroke="#00D4FF" strokeWidth="0.5" opacity="0.3"/>
      {[
        {test:"Continuity",val:"< 0.1Ω",ok:true},
        {test:"Insulation R",val:"> 1MΩ",ok:true},
        {test:"Polarity",val:"Correct",ok:true},
        {test:"Earth loop Zs",val:"< 0.8Ω",ok:true},
        {test:"RCD 30mA",val:"< 40ms",ok:true},
        {test:"PFC",val:"3.2kA",ok:true},
        {test:"VD %",val:"2.8%",ok:true},
      ].map(({test,val,ok},i)=>(
        <g key={i}>
          <text x="155" y={60+i*15} fontFamily="monospace" fontSize="7" fill="#888899" opacity="0.7">{test}</text>
          <text x="290" y={60+i*15} textAnchor="end" fontFamily="monospace" fontSize="7" fill={ok?"#34D399":"#FF4444"} opacity="0.8">{val}</text>
          <circle cx="300" cy={56+i*15} r="4" fill={ok?"rgba(52,211,153,0.2)":"rgba(255,68,68,0.2)"} stroke={ok?"#34D399":"#FF4444"} strokeWidth="0.8" opacity="0.7"/>
          <text x="300" y={59+i*15} textAnchor="middle" fontFamily="monospace" fontSize="7" fill={ok?"#34D399":"#FF4444"} opacity="0.8">{ok?"✓":"✗"}</text>
          <line x1="148" y1={63+i*15} x2="308" y2={63+i*15} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
        </g>
      ))}
    </svg>
  );
}

function ThumbLighting() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ display: "block" }}>
      <rect width="320" height="180" fill="#07080A"/>
      <text x="8" y="12" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.4" letterSpacing="1">LED & LIGHTING DESIGN</text>
      {/* LED array */}
      {[0,1,2,3].map(col=>[0,1,2].map(row=>{
        const x = 36 + col*64, y = 30 + row*38;
        const on = (col+row)%2===0;
        return (
          <g key={`${col}${row}`}>
            <rect x={x-14} y={y-14} width="28" height="28" rx="6" fill={on?"rgba(240,165,0,0.18)":"rgba(255,255,255,0.04)"} stroke={on?"#F0A500":"rgba(255,255,255,0.08)"} strokeWidth={on?1.2:0.6} opacity={on?0.9:0.4}/>
            <circle cx={x} cy={y} r="7" fill={on?"#F0A500":"rgba(255,255,255,0.1)"} opacity={on?0.8:0.3}/>
            {on && [0,45,90,135,180,225,270,315].map(a=>(
              <line key={a} x1={x+Math.cos(a*Math.PI/180)*9} y1={y+Math.sin(a*Math.PI/180)*9} x2={x+Math.cos(a*Math.PI/180)*14} y2={y+Math.sin(a*Math.PI/180)*14} stroke="#F0A500" strokeWidth="0.8" opacity="0.35"/>
            ))}
          </g>
        );
      }))}
      {/* Driver circuit */}
      <rect x="22" y="145" width="276" height="26" rx="5" fill="#0A0D0A" stroke="#34D399" strokeWidth="0.8" opacity="0.5"/>
      <text x="36" y="156" fontFamily="monospace" fontSize="7" fill="#34D399" opacity="0.55">DRIVER</text>
      <text x="90" y="156" fontFamily="monospace" fontSize="7" fill="#F0F0F0" opacity="0.3">230V AC → 24V DC · Constant Current · PFC</text>
      <rect x="28" y="163" width="260" height="4" rx="2" fill="#34D399" opacity="0.1"/>
      <rect x="28" y="163" width="156" height="4" rx="2" fill="#34D399" opacity="0.35"/>
      {/* Lux level annotation */}
      <rect x="240" y="28" width="68" height="48" rx="5" fill="rgba(240,165,0,0.06)" stroke="#F0A500" strokeWidth="0.6" opacity="0.45"/>
      <text x="274" y="46" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#F0A500" opacity="0.8">500</text>
      <text x="274" y="58" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#F0A500" opacity="0.5">lux</text>
      <text x="274" y="70" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#888899" opacity="0.5">Ra &gt; 80</text>
    </svg>
  );
}

/* ─── Data ─── */
const COURSES = [
  {
    slug: "electrical-fundamentals",
    title: "Electrical Fundamentals",
    thumb: <ThumbFundamentals />,
    color: "#F0A500",
    level: "Beginner" as const,
    category: "Theory",
    modules: 8,
    hours: 6,
    desc: "Voltage, current, resistance, Ohm's Law, power, energy, and circuit theory from first principles. The foundation everything else is built on.",
    topics: ["Atoms & electrons", "Ohm's Law", "Series & parallel", "Kirchhoff's laws", "AC vs DC", "Power & energy", "Capacitors & inductors", "Measurements"],
  },
  {
    slug: "domestic-wiring",
    title: "Domestic Wiring",
    thumb: <ThumbDomestic />,
    color: "#34D399",
    level: "Beginner" as const,
    category: "Installation",
    modules: 10,
    hours: 8,
    desc: "Fixed wiring for houses and apartments. Ring circuits, radials, lighting, earthing, and consumer unit design — with real installation diagrams.",
    topics: ["Consumer units", "Ring circuits", "Radial circuits", "Lighting circuits", "Earthing", "Bonding", "Switch & socket wiring", "Fault finding"],
  },
  {
    slug: "protection-fault-analysis",
    title: "Protection & Fault Analysis",
    thumb: <ThumbProtection />,
    color: "#FF6B35",
    level: "Intermediate" as const,
    category: "Protection",
    modules: 7,
    hours: 5,
    desc: "Overcurrent protection, RCDs, fault loop impedance, and discrimination between devices. Understand why a circuit trips — before it does.",
    topics: ["Fuses vs MCBs vs RCBOs", "Fault loop impedance", "Prospective fault current", "RCD tripping times", "Selectivity", "AFDD", "Testing methods"],
  },
  {
    slug: "three-phase-systems",
    title: "Three-Phase Systems",
    thumb: <ThumbThreePhase />,
    color: "#A855F7",
    level: "Intermediate" as const,
    category: "Power Systems",
    modules: 9,
    hours: 7,
    desc: "Star and delta connections, balanced and unbalanced loads, motors, power factor, and three-phase distribution from substation to load.",
    topics: ["Star & delta", "Line vs phase V/I", "Balanced loads", "Three-phase motors", "Star-delta starters", "Power factor", "Metering"],
  },
  {
    slug: "cable-sizing",
    title: "Cable Sizing & Installation",
    thumb: <ThumbCableSizing />,
    color: "#00D4FF",
    level: "Advanced" as const,
    category: "Design",
    modules: 6,
    hours: 5,
    desc: "Current-carrying capacity, derating factors, voltage drop calculations, and installation methods for every cable type from twin-and-earth to SWA.",
    topics: ["CCC tables", "Thermal derating", "Grouping factors", "Voltage drop", "Installation methods", "Armoured cables", "Busbar sizing"],
  },
  {
    slug: "solar-pv",
    title: "Solar PV & Renewables",
    thumb: <ThumbSolar />,
    color: "#34D399",
    level: "Intermediate" as const,
    category: "Renewables",
    modules: 8,
    hours: 6,
    desc: "PV system design, inverter selection, grid connection, battery storage, and export tariffs. The complete picture for solar installation work.",
    topics: ["PV cell theory", "Panel orientation", "Inverter types", "String sizing", "Battery storage", "Grid connection", "Export & metering", "G98/G99"],
  },
  {
    slug: "industrial-control",
    title: "Industrial Control & PLCs",
    thumb: <ThumbIndustrial />,
    color: "#A855F7",
    level: "Advanced" as const,
    category: "Industrial",
    modules: 10,
    hours: 9,
    desc: "Motor starters, contactors, overloads, PLC ladder logic, and industrial panel design. For electricians moving into commercial and industrial work.",
    topics: ["DOL & star-delta", "Contactors & overloads", "Control circuits", "PLC basics", "Ladder logic", "SCADA intro", "Panel layout", "Safe isolation"],
  },
  {
    slug: "inspection-testing",
    title: "Inspection & Testing",
    thumb: <ThumbInspection />,
    color: "#00D4FF",
    level: "Advanced" as const,
    category: "Testing",
    modules: 8,
    hours: 7,
    desc: "Initial verification and periodic inspection procedures. Every test, every limit, every form — from insulation resistance to RCD tripping time.",
    topics: ["Continuity", "Insulation resistance", "Polarity", "Earth fault loop Zs", "RCD testing", "PFC testing", "EICRs", "Schedule of items"],
  },
  {
    slug: "led-lighting",
    title: "LED & Lighting Design",
    thumb: <ThumbLighting />,
    color: "#F0A500",
    level: "Beginner" as const,
    category: "Technology",
    modules: 5,
    hours: 3,
    desc: "LED technology, driver circuits, emergency lighting, lux calculations, and controls from simple switching to DALI and smart systems.",
    topics: ["LED physics", "Driver types", "Emergency lighting", "Lux calculations", "Dimming controls", "DALI basics", "Smart systems", "Colour rendering"],
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type LevelFilter = typeof LEVELS[number];
type CompletionFilter = "All" | "Not started" | "In progress" | "Completed";
type DurationFilter = "All" | "Under 4 hours" | "4–6 hours" | "Over 6 hours";

const COURSE_DETAILS: Record<string, {
  lessons: number;
  minutes: number;
  pathway: string;
  purpose: string;
  prerequisites: string;
  skills: string[];
  hasExercise: boolean;
  hasCalculator: boolean;
  hasDiagram: boolean;
}> = {
  "electrical-fundamentals": { lessons: 37, minutes: 342, pathway: "Electrical foundations", purpose: "Build the quantities, laws, units, and measurement habits required for every later course.", prerequisites: "No prior electrical study required", skills: ["Ohm’s law", "Circuit quantities", "AC and DC", "Measurement"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "domestic-wiring": { lessons: 39, minutes: 345, pathway: "Wiring and installation concepts", purpose: "Understand domestic circuit arrangements, protective paths, earthing, and documented installation limits.", prerequisites: "Electrical Fundamentals recommended", skills: ["Final circuits", "Earthing", "Consumer units", "Fault finding"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "protection-fault-analysis": { lessons: 29, minutes: 246, pathway: "Measurement and troubleshooting", purpose: "Relate fault current, loop impedance, protective-device behavior, and test evidence.", prerequisites: "Fundamentals and basic wiring concepts", skills: ["Fault loops", "RCDs", "Selectivity", "Test interpretation"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "three-phase-systems": { lessons: 28, minutes: 252, pathway: "Advanced electrical topics", purpose: "Analyze three-phase quantities, star and delta networks, power, motors, and transformers.", prerequisites: "Confident algebra and AC fundamentals", skills: ["Star and delta", "Three-phase power", "Machines", "Power factor"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "cable-sizing": { lessons: 28, minutes: 247, pathway: "Design and calculations", purpose: "Work through preliminary cable capacity, derating, voltage-drop, and installation checks.", prerequisites: "Electrical Fundamentals and circuit protection", skills: ["Design current", "Derating", "Voltage drop", "Cable coordination"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "solar-pv": { lessons: 29, minutes: 240, pathway: "Renewable and stored energy", purpose: "Understand PV arrays, inverter windows, batteries, grid interfaces, and commissioning evidence.", prerequisites: "DC fundamentals and safe-isolation awareness", skills: ["PV strings", "Inverters", "Battery storage", "Commissioning"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "industrial-control": { lessons: 30, minutes: 267, pathway: "Machines and control", purpose: "Read, reason about, and document motor starters, control circuits, PLC logic, and panels.", prerequisites: "Three-phase principles recommended", skills: ["Motor starters", "Control logic", "PLCs", "Panel documentation"], hasExercise: true, hasCalculator: false, hasDiagram: true },
  "inspection-testing": { lessons: 36, minutes: 283, pathway: "Measurement and troubleshooting", purpose: "Follow a defensible inspection and test sequence and interpret results without overclaiming.", prerequisites: "Wiring, protection, and safe-isolation knowledge", skills: ["Dead testing", "Live testing", "Result interpretation", "Certification"], hasExercise: true, hasCalculator: true, hasDiagram: true },
  "led-lighting": { lessons: 24, minutes: 170, pathway: "Design and calculations", purpose: "Connect LED behavior, drivers, emergency operation, controls, and maintained lighting calculations.", prerequisites: "Basic electrical quantities", skills: ["LED drivers", "Emergency lighting", "Lux calculations", "Controls"], hasExercise: true, hasCalculator: true, hasDiagram: true },
};

const PATHWAYS = ["All", ...new Set(Object.values(COURSE_DETAILS).map((course) => course.pathway))];
const COMPLETION_FILTERS: CompletionFilter[] = ["All", "Not started", "In progress", "Completed"];
const DURATION_FILTERS: DurationFilter[] = ["All", "Under 4 hours", "4–6 hours", "Over 6 hours"];

export default function LearnPage() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("All");
  const [pathwayFilter, setPathwayFilter] = useState("All");
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("All");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("All");
  const [requireExercise, setRequireExercise] = useState(false);
  const [requireCalculator, setRequireCalculator] = useState(false);
  const [requireDiagram, setRequireDiagram] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState<Record<string, { percent: number; lastLessonId?: string }>>({});

  useEffect(() => {
    const next: Record<string, { percent: number; lastLessonId?: string }> = {};
    try {
      for (const course of COURSES) {
        const stored = loadCourseLearning(localStorage, course.slug);
        next[course.slug] = {
          percent: Math.round((stored.completedLessons.length / COURSE_DETAILS[course.slug].lessons) * 100),
          lastLessonId: stored.lastLessonId,
        };
      }
    } catch {
      // Storage unavailable: the catalogue remains usable with empty progress.
    }
    setProgress(next);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setLevelFilter("All");
    setPathwayFilter("All");
    setCompletionFilter("All");
    setDurationFilter("All");
    setRequireExercise(false);
    setRequireCalculator(false);
    setRequireDiagram(false);
  };

  const filtered = COURSES.filter((course) => {
    const detail = COURSE_DETAILS[course.slug];
    const percent = progress[course.slug]?.percent ?? 0;
    const normalized = search.trim().toLowerCase();
    const searchable = [course.title, course.desc, course.category, detail.pathway, detail.purpose, detail.prerequisites, ...course.topics, ...detail.skills].join(" ").toLowerCase();
    const completionMatches = completionFilter === "All"
      || (completionFilter === "Not started" && percent === 0)
      || (completionFilter === "In progress" && percent > 0 && percent < 100)
      || (completionFilter === "Completed" && percent === 100);
    const durationMatches = durationFilter === "All"
      || (durationFilter === "Under 4 hours" && detail.minutes < 240)
      || (durationFilter === "4–6 hours" && detail.minutes >= 240 && detail.minutes <= 360)
      || (durationFilter === "Over 6 hours" && detail.minutes > 360);
    return (levelFilter === "All" || course.level === levelFilter)
      && (pathwayFilter === "All" || detail.pathway === pathwayFilter)
      && completionMatches
      && durationMatches
      && (!requireExercise || detail.hasExercise)
      && (!requireCalculator || detail.hasCalculator)
      && (!requireDiagram || detail.hasDiagram)
      && (!normalized || searchable.includes(normalized));
  });

  const access = evaluateLearningAccess({ resource: "course" });

  return (
    <main className="catalogue-page">
      <header className="catalogue-intro">
        <p className="catalogue-eyebrow">Structured electrical learning</p>
        <h1>Choose a course with a clear purpose.</h1>
        <p>Follow a pathway from first principles to installation concepts, measurement, machines, design, and renewable systems. Every course is available in open preview.</p>
        <dl className="catalogue-summary">
          <div><dt>9</dt><dd>Courses</dd></div>
          <div><dt>280</dt><dd>Lessons</dd></div>
          <div><dt>71</dt><dd>Modules</dd></div>
          <div><dt>Open</dt><dd>No account required</dd></div>
        </dl>
        <p className="catalogue-notice" role="status">{OPEN_PREVIEW_NOTICE}</p>
      </header>

      <section className="catalogue-tools" aria-labelledby="catalogue-filter-title">
        <div className="catalogue-search">
          <label htmlFor="course-search">Search courses and lesson topics</label>
          <div><Search size={18} aria-hidden="true" /><input id="course-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try voltage drop, RCD, motor starter, or Ohm’s law" /></div>
        </div>
        <div className="catalogue-filter-grid">
          <label>Difficulty<select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}>{LEVELS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Learning pathway<select value={pathwayFilter} onChange={(event) => setPathwayFilter(event.target.value)}>{PATHWAYS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Completion<select value={completionFilter} onChange={(event) => setCompletionFilter(event.target.value as CompletionFilter)}>{COMPLETION_FILTERS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Estimated duration<select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value as DurationFilter)}>{DURATION_FILTERS.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <fieldset className="catalogue-capabilities"><legend>Include resources</legend>
          <label><input type="checkbox" checked={requireExercise} onChange={(event) => setRequireExercise(event.target.checked)} />Practical exercise</label>
          <label><input type="checkbox" checked={requireCalculator} onChange={(event) => setRequireCalculator(event.target.checked)} />Related calculator</label>
          <label><input type="checkbox" checked={requireDiagram} onChange={(event) => setRequireDiagram(event.target.checked)} />Technical diagram</label>
        </fieldset>
        <div className="catalogue-result-row"><p id="catalogue-filter-title" role="status">{filtered.length} course{filtered.length === 1 ? "" : "s"} shown</p><button type="button" onClick={resetFilters}><RotateCcw size={15} aria-hidden="true" />Reset filters</button></div>
      </section>

      <section className="catalogue-results" aria-label="Course catalogue">
        {filtered.length === 0 ? <div className="catalogue-empty"><BookOpen size={28} aria-hidden="true" /><h2>No courses match these filters</h2><p>Broaden the pathway or duration, or search for a related electrical term.</p><button type="button" onClick={resetFilters}>Reset all filters</button></div> :
          filtered.map((course, index) => {
            const detail = COURSE_DETAILS[course.slug];
            const courseProgress = progress[course.slug]?.percent ?? 0;
            const action = courseProgress > 0 ? "Continue course" : "Start course";
            return <article key={course.slug} className="catalogue-course" style={{ "--course-accent": course.color } as React.CSSProperties}>
              <div className="catalogue-course-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="catalogue-course-visual" aria-hidden="true">{course.thumb}</div>
              <div className="catalogue-course-copy">
                <p className="catalogue-pathway">{detail.pathway}</p>
                <h2><Link href={"/learn/" + course.slug}>{course.title}</Link></h2>
                <p className="catalogue-purpose">{detail.purpose}</p>
                <dl className="catalogue-metadata">
                  <div><dt>Difficulty</dt><dd>{course.level}</dd></div>
                  <div><dt>Lessons</dt><dd>{detail.lessons} in {course.modules} modules</dd></div>
                  <div><dt>Estimated time</dt><dd>{Math.floor(detail.minutes / 60)}h {detail.minutes % 60}min</dd></div>
                  <div><dt>Prerequisite</dt><dd>{detail.prerequisites}</dd></div>
                </dl>
                <ul className="catalogue-skills" aria-label="Main skills">{detail.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                <div className="catalogue-review"><ShieldCheck size={16} aria-hidden="true" /><span>Curriculum reviewed; professional electrical review remains pending where identified.</span></div>
                <div className="catalogue-progress"><div><span>{courseProgress === 0 ? "Not started" : courseProgress === 100 ? "Completed" : "In progress"}</span><strong>{courseProgress}%</strong></div><div className="catalogue-progress-track"><span style={{ width: courseProgress + "%" }} /></div></div>
              </div>
              <div className="catalogue-course-action">
                <span>{access.allowed ? "Open preview" : "Access required"}</span>
                <Link href={"/learn/" + course.slug}>{action}<ArrowRight size={16} aria-hidden="true" /></Link>
                <small>Progress stays on this device.</small>
              </div>
            </article>;
          })}
      </section>

      <style>{`
        .catalogue-page{padding:64px 1.5rem 5rem;max-width:1220px;margin:auto}.catalogue-intro{padding:4.5rem 0 3rem;border-bottom:1px solid var(--border)}.catalogue-eyebrow,.catalogue-pathway{color:var(--core);font:700 .72rem 'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.12em}.catalogue-intro h1{max-width:820px;font-size:clamp(2.5rem,6vw,5.2rem);line-height:1;letter-spacing:-.055em;margin:.8rem 0 1.25rem}.catalogue-intro>p:not(.catalogue-eyebrow):not(.catalogue-notice){max-width:720px;color:#C5CDD1;font-size:1.05rem}.catalogue-summary{display:flex;flex-wrap:wrap;gap:2rem;margin-top:2rem}.catalogue-summary div{min-width:105px}.catalogue-summary dt{font-size:1.65rem;font-weight:850}.catalogue-summary dd{color:var(--text-dim);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}.catalogue-notice{margin-top:1.5rem;color:var(--text-dim);font-size:.78rem}.catalogue-tools{padding:1.5rem 0;border-bottom:1px solid var(--border)}.catalogue-search>label,.catalogue-filter-grid label{display:grid;gap:.4rem;color:var(--text-dim);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.catalogue-search>div{max-width:760px;display:flex;align-items:center;gap:.7rem;padding:.75rem 1rem;background:var(--bg2);border:1px solid var(--border);margin-top:.4rem}.catalogue-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--text);font:inherit}.catalogue-filter-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.8rem;margin-top:1rem}.catalogue-filter-grid select{min-height:44px;padding:0 .7rem;background:var(--bg2);border:1px solid var(--border);color:var(--text);font:inherit}.catalogue-capabilities{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem;border:0}.catalogue-capabilities legend{width:100%;color:var(--text-dim);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.catalogue-capabilities label{display:flex;align-items:center;gap:.45rem;font-size:.82rem}.catalogue-capabilities input{width:18px;height:18px;accent-color:var(--core)}.catalogue-result-row{display:flex;align-items:center;justify-content:space-between;margin-top:1rem;color:var(--text-dim);font-size:.82rem}.catalogue-result-row button,.catalogue-empty button{display:flex;align-items:center;gap:.4rem;border:0;background:transparent;color:var(--core);font:inherit;cursor:pointer}.catalogue-results{display:grid}.catalogue-course{display:grid;grid-template-columns:46px 210px minmax(0,1fr) 170px;gap:1.5rem;padding:2rem 0;border-bottom:1px solid var(--border);align-items:start}.catalogue-course-number{font:700 .8rem 'JetBrains Mono',monospace;color:var(--text-mute)}.catalogue-course-visual{aspect-ratio:16/9;overflow:hidden;border:1px solid var(--border);background:#080A0C}.catalogue-course-copy h2{font-size:1.55rem;line-height:1.15;margin:.3rem 0 .55rem}.catalogue-course-copy h2 a{color:var(--text);text-decoration:none}.catalogue-purpose{color:#C5CDD1;line-height:1.65}.catalogue-metadata{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;margin:1rem 0}.catalogue-metadata div{border-left:2px solid color-mix(in srgb,var(--course-accent) 55%,transparent);padding-left:.65rem}.catalogue-metadata dt{color:var(--text-mute);font-size:.65rem;text-transform:uppercase;letter-spacing:.06em}.catalogue-metadata dd{color:var(--text-dim);font-size:.78rem;line-height:1.4}.catalogue-skills{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none}.catalogue-skills li{padding:.25rem .55rem;border:1px solid var(--border);color:var(--text-dim);font-size:.7rem}.catalogue-review{display:flex;gap:.45rem;align-items:flex-start;margin-top:.85rem;color:var(--text-dim);font-size:.72rem}.catalogue-review svg{color:var(--ground);flex:none}.catalogue-progress{margin-top:1rem}.catalogue-progress>div:first-child{display:flex;justify-content:space-between;font-size:.72rem;color:var(--text-dim)}.catalogue-progress-track{height:3px;background:var(--border);margin-top:.35rem}.catalogue-progress-track span{display:block;height:100%;background:var(--course-accent)}.catalogue-course-action{display:grid;gap:.6rem;justify-items:start}.catalogue-course-action>span{color:var(--ground);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.catalogue-course-action a{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%;padding:.65rem .75rem;background:var(--core);color:#080A0C;text-decoration:none;font-size:.8rem;font-weight:800}.catalogue-course-action small{color:var(--text-mute);line-height:1.4}.catalogue-empty{display:grid;justify-items:center;text-align:center;gap:.7rem;padding:5rem 1rem;color:var(--text-dim)}.catalogue-empty h2{color:var(--text)}
        @media(max-width:980px){.catalogue-filter-grid{grid-template-columns:1fr 1fr}.catalogue-course{grid-template-columns:36px 150px minmax(0,1fr)}.catalogue-course-action{grid-column:3}.catalogue-metadata{grid-template-columns:1fr 1fr}}
        @media(max-width:680px){.catalogue-page{padding-inline:1rem}.catalogue-intro{padding-top:3rem}.catalogue-filter-grid{grid-template-columns:1fr}.catalogue-course{grid-template-columns:30px minmax(0,1fr);gap:1rem}.catalogue-course-visual{grid-column:2;max-width:320px}.catalogue-course-copy,.catalogue-course-action{grid-column:2}.catalogue-metadata{grid-template-columns:1fr}.catalogue-course-action a{width:auto}.catalogue-summary{gap:1.25rem}.catalogue-results{min-width:0}}
      `}</style>
    </main>
  );
}
