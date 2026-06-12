import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { COLORS, rate, fmt, rateColor, parseYM, byFactory, byMonth, byDate, byItem } from "../lib/utils";

function MultiSel({ label, values, onChange, options, placeholder = "すべて" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (v) => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  const display = values.length === 0 ? placeholder : values.length === 1 ? values[0] : `${values.length}件選択中`;
  return (
    <div ref={ref} style={{ display:"flex", flexDirection:"column", gap:3, position:"relative" }}>
      {label && <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>{label}</label>}
      <button onClick={() => setOpen(!open)} style={{ background:values.length>0?"var(--accent-dim)":"var(--surface2)", border:`1.5px solid ${values.length>0?"var(--accent)":"var(--border2)"}`, color:values.length>0?"var(--accent)":"var(--text2)", borderRadius:8, padding:"6px 10px", fontSize:12, cursor:"pointer", minWidth:130, textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", gap:6, fontWeight:values.length>0?600:400 }}>
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{display}</span>
        <span style={{ fontSize:10, flexShrink:0 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, zIndex:1000, background:"var(--surface)", border:"1.5px solid var(--border2)", borderRadius:10, marginTop:4, boxShadow:"0 8px 24px rgba(46,95,163,0.15)", minWidth:180, maxHeight:260, overflowY:"auto" }}>
          <div onClick={() => onChange([])} style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", fontWeight:600, background:values.length===0?"var(--accent-dim)":"transparent", color:values.length===0?"var(--accent)":"var(--text2)", borderBottom:"1px solid var(--border)" }}>✓ すべて</div>
          {options.map(o => (
            <div key={o} onClick={() => toggle(o)} style={{ padding:"7px 12px", fontSize:12, cursor:"pointer", background:values.includes(o)?"var(--accent-dim)":"transparent", color:values.includes(o)?"var(--accent)":"var(--text)", fontWeight:values.includes(o)?600:400, borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:14, height:14, border:`2px solid ${values.includes(o)?"var(--accent)":"var(--border2)"}`, borderRadius:3, background:values.includes(o)?"var(--accent)":"transparent", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {values.includes(o) && <span style={{ color:"#fff", fontSize:10, lineHeight:1 }}>✓</span>}
              </span>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FactoryMultiSel({ label, values, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (v) => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  const display = values.length === 0 ? "工場を選択..." : values.length === 1 ? values[0] : `${values.length}工場選択中`;
  return (
    <div ref={ref} style={{ display:"flex", flexDirection:"column", gap:3, position:"relative" }}>
      {label && <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>{label}</label>}
      <button onClick={() => setOpen(!open)} style={{ background:values.length>0?"var(--accent-dim)":"var(--surface2)", border:`1.5px solid ${values.length>0?"var(--accent)":"var(--border2)"}`, color:values.length>0?"var(--accent)":"var(--text2)", borderRadius:8, padding:"6px 10px", fontSize:12, cursor:"pointer", minWidth:200, textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", gap:6, fontWeight:values.length>0?600:400 }}>
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{display}</span>
        <span style={{ fontSize:10, flexShrink:0 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, zIndex:1000, background:"var(--surface)", border:"1.5px solid var(--border2)", borderRadius:10, marginTop:4, boxShadow:"0 8px 24px rgba(46,95,163,0.15)", minWidth:230, maxHeight:340, overflowY:"auto" }}>
          <div style={{ display:"flex", gap:6, padding:"8px 10px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--surface)" }}>
            <button onClick={() => onChange([...options])} style={{ flex:1, background:"var(--accent)", color:"#fff", border:"none", borderRadius:6, padding:"5px 0", fontSize:11, cursor:"pointer", fontWeight:700 }}>全て選択</button>
            <button onClick={() => onChange([])} style={{ flex:1, background:"var(--surface2)", color:"var(--text2)", border:"1px solid var(--border)", borderRadius:6, padding:"5px 0", fontSize:11, cursor:"pointer" }}>クリア</button>
          </div>
          {options.map(o => (
            <div key={o} onClick={() => toggle(o)} style={{ padding:"7px 12px", fontSize:12, cursor:"pointer", background:values.includes(o)?"var(--accent-dim)":"transparent", color:values.includes(o)?"var(--accent)":"var(--text)", fontWeight:values.includes(o)?600:400, borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:14, height:14, border:`2px solid ${values.includes(o)?"var(--accent)":"var(--border2)"}`, borderRadius:3, background:values.includes(o)?"var(--accent)":"transparent", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {values.includes(o) && <span style={{ color:"#fff", fontSize:10, lineHeight:1 }}>✓</span>}
              </span>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--surface)", border:"1.5px solid var(--border2)", borderRadius:8, padding:"10px 14px", fontSize:12, boxShadow:"0 4px 12px rgba(46,95,163,0.1)" }}>
      <div style={{ color:"var(--text2)", marginBottom:6, fontWeight:600 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color||"var(--text)", marginBottom:2 }}>{p.name}: <b style={{ fontFamily:"var(--mono)" }}>{typeof p.value==="number"?p.value.toLocaleString("ja-JP"):p.value}</b></div>)}
    </div>
  );
};

function Kpi({ label, value, sub, color, small }) {
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:small?"11px 14px":"15px 18px", borderLeft:`4px solid ${color||"var(--accent)"}`, boxShadow:"0 2px 8px rgba(46,95,163,0.06)" }}>
      <div style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3, fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:small?18:24, fontWeight:700, color:color||"var(--accent)", fontFamily:"var(--mono)", lineHeight:1.1 }}>{value}</div>
      {sub && <div style={{ color:"var(--text3)", fontSize:9, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function Panel({ children, style }) {
  return <div className="fade" style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--rl)", padding:20, boxShadow:"0 2px 8px rgba(46,95,163,0.06)", ...style }}>{children}</div>;
}

function ST({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, color:"var(--accent)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, paddingBottom:6, borderBottom:"2px solid var(--accent-dim)" }}>{children}</div>;
}

function Tag({ children }) {
  return <span style={{ background:"var(--surface3)", color:"var(--text2)", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:600 }}>{children}</span>;
}

function downloadCSV(sections, filename) {
  const escape = v => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes("\n") || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const fmtDate = d => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return `${dt.getFullYear()}/${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')}`;
  };
  let lines = [];
  sections.forEach(({ title, headers, rows }) => {
    lines.push(escape(title));
    lines.push(headers.map(escape).join(","));
    rows.forEach(r => lines.push(r.map(escape).join(",")));
    lines.push("");
  });
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function CsvBtn({ data, filename }) {
  const fmtDate = d => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return `${dt.getFullYear()}/${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')}`;
  };
  return (
    <button onClick={() => downloadCSV([{
      title: "■ 明細データ",
      headers: ["日付","工場名","取引種別","検品種別","品番","検品回数","検品数","不備数","不備率(%)","主な不備内容"],
      rows: (data||[]).map(d => [
        fmtDate(d.date), d.factory, d.type, d.inspectionType, d.itemNo, d.round,
        d.count, d.total,
        d.count > 0 ? ((d.total/d.count)*100).toFixed(2) : "0",
        (d.defectItems||[]).slice(0,5).map(x=>`${x.item}×${x.qty}`).join(" | ")
      ])
    }], filename)}
      style={{ background:"var(--green)", border:"none", color:"#fff", borderRadius:8, padding:"5px 14px", fontSize:11, cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
      ⬇ CSV
    </button>
  );
}

function FactoryCsvBtn({ drillData, mths, its, itemSummaryList, dFacs }) {
  const fmtDate = d => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return `${dt.getFullYear()}/${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')}`;
  };
  const handleClick = () => {
    const pieT = its.reduce((s,d)=>s+d.value,0);
    const sections = [
      {
        title: `■ 品番別サマリー（${dFacs.length>0?dFacs.join("・"):"全工場"}）`,
        headers: ["品番","検品数","不備数","累計不備率(%)","月次平均不備率(%)","最小(%)","最大(%)","月数","主な不備TOP3"],
        rows: itemSummaryList.map(d => {
          const rv = d.insp>0?((d.def/d.insp)*100).toFixed(2):0;
          const topDefs = Object.entries(d.defMap).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}(${v})`).join(" | ");
          return [d.itemNo, d.insp, d.def, rv, d.avgRate, d.minRate, d.maxRate, d.monthCount, topDefs];
        })
      },
      {
        title: "■ 不備内容内訳",
        headers: ["不備項目","件数","割合(%)"],
        rows: its.map(d => [d.name, d.value, pieT>0?((d.value/pieT)*100).toFixed(1):0])
      },
      {
        title: "■ 月次推移",
        headers: ["年月","検品数","不備数","不備率(%)"],
        rows: mths.map(m => [m.month, m.insp, m.def, m.rate])
      },
      {
        title: "■ 明細データ（不備あり）",
        headers: ["日付","工場名","取引種別","検品種別","品番","検品回数","検品数","不備数","不備率(%)","主な不備内容"],
        rows: [...drillData].filter(d=>d.hasDefect).sort((a,b)=>b.date.localeCompare(a.date)).map(d => [
          fmtDate(d.date), d.factory, d.type, d.inspectionType, d.itemNo, d.round,
          d.count, d.total,
          d.count>0?((d.total/d.count)*100).toFixed(2):0,
          (d.defectItems||[]).slice(0,5).map(x=>`${x.item}×${x.qty}`).join(" | ")
        ])
      }
    ];
    const fname = `工場詳細_${(dFacs[0]||"全工場").slice(0,10)}_${new Date().toISOString().slice(0,10)}.csv`;
    downloadCSV(sections, fname);
  };
  return (
    <button onClick={handleClick}
      style={{ background:"var(--green)", border:"none", color:"#fff", borderRadius:8, padding:"5px 14px", fontSize:11, cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
      ⬇ CSV（全データ）
    </button>
  );
}

function Rst({ onClick }) {
  return <button onClick={onClick} style={{ background:"transparent", border:"1.5px solid var(--border2)", color:"var(--text3)", borderRadius:8, padding:"5px 14px", fontSize:11, alignSelf:"flex-end", cursor:"pointer", fontWeight:600 }}>リセット</button>;
}

function Spinner() {
  return <div style={{ display:"flex", justifyContent:"center", padding:60 }}><div style={{ width:30, height:30, border:"3px solid var(--border2)", borderTopColor:"var(--accent)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} /></div>;
}

function FilterBar({ children }) {
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--rl)", padding:16, marginBottom:16, boxShadow:"0 2px 8px rgba(46,95,163,0.06)" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>{children}</div>
    </div>
  );
}

function applyMulti(data, field, values) {
  if (!values || values.length === 0) return data;
  return data.filter(d => values.includes(d[field]));
}

const TABS = [
  { key:"overview", label:"概要" },
  { key:"monthly",  label:"年月別" },
  { key:"factory",  label:"工場詳細" },
  { key:"compare",  label:"工場比較" },
  { key:"search",   label:"検索" },
];

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUp, setLastUp] = useState(null);
  const [tab, setTab] = useState("overview");
  const timerRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/data");
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData((json.rows||[]).map(d => ({ ...d, ym: parseYM(d.date) })));
      setLastUp(new Date());
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 60000);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);

  async function logout() {
    await fetch("/api/logout", { method:"POST" });
    router.push("/login");
  }

  const factories = useMemo(() => [...new Set(data.map(d=>d.factory))].filter(Boolean).sort(), [data]);
  const types     = useMemo(() => [...new Set(data.map(d=>d.type))].filter(Boolean).sort(), [data]);
  const inspTypes = useMemo(() => [...new Set(data.map(d=>d.inspectionType))].filter(Boolean).sort(), [data]);
  const itemNos   = useMemo(() => [...new Set(data.map(d=>d.itemNo))].filter(Boolean).sort(), [data]);
  const rounds    = useMemo(() => [...new Set(data.map(d=>d.round))].filter(Boolean).sort(), [data]);
  const yms       = useMemo(() => [...new Set(data.map(d=>d.ym))].filter(Boolean).sort(), [data]);

  // 概要
  const [gFacs,setGFacs]=useState([]); const [gTypes,setGTypes]=useState([]); const [gInsps,setGInsps]=useState([]);
  const [gItems,setGItems]=useState([]); const [gRounds,setGRounds]=useState([]); const [gYMs,setGYMs]=useState([]);
  const filtered = useMemo(() => {
    let d = applyMulti(data,"factory",gFacs); d = applyMulti(d,"type",gTypes); d = applyMulti(d,"inspectionType",gInsps);
    d = applyMulti(d,"itemNo",gItems); d = applyMulti(d,"round",gRounds);
    if (gYMs.length>0) d = d.filter(r=>gYMs.includes(r.ym));
    return d;
  }, [data,gFacs,gTypes,gInsps,gItems,gRounds,gYMs]);
  const facAgg=useMemo(()=>byFactory(filtered),[filtered]);
  const defItems=useMemo(()=>byItem(filtered),[filtered]);
  const totInsp=useMemo(()=>filtered.reduce((s,d)=>s+d.count,0),[filtered]);
  const totDef=useMemo(()=>filtered.reduce((s,d)=>s+d.total,0),[filtered]);
  const ovRate=rate(totDef,totInsp);

  // 年月別
  const [mFacs,setMFacs]=useState([]); const [mTypes,setMTypes]=useState([]); const [mInsps,setMInsps]=useState([]);
  const [mItems,setMItems]=useState([]); const [mRounds,setMRounds]=useState([]);
  const [mDateFrom,setMDateFrom]=useState(""); const [mDateTo,setMDateTo]=useState("");
  const [mViewMode,setMViewMode]=useState("month");
  const mBase = useMemo(() => {
    let d = applyMulti(data,"factory",mFacs); d = applyMulti(d,"type",mTypes); d = applyMulti(d,"inspectionType",mInsps);
    d = applyMulti(d,"itemNo",mItems); d = applyMulti(d,"round",mRounds);
    if (mDateFrom) d = d.filter(r=>r.date>=mDateFrom);
    if (mDateTo) d = d.filter(r=>r.date<=mDateTo);
    return d;
  }, [data,mFacs,mTypes,mInsps,mItems,mRounds,mDateFrom,mDateTo]);
  const mMonthly=useMemo(()=>byMonth(mBase),[mBase]);
  const mDaily=useMemo(()=>byDate(mBase),[mBase]);
  const mItemAgg=useMemo(()=>byItem(mBase),[mBase]);
  const mYearly=useMemo(()=>{
    const m={};
    mBase.forEach(d=>{ const y=(d.ym||"").slice(0,4); if(!y) return; if(!m[y]) m[y]={year:y,insp:0,def:0}; m[y].insp+=d.count; m[y].def+=d.total; });
    return Object.values(m).sort((a,b)=>a.year.localeCompare(b.year)).map(r=>({...r,rate:rate(r.def,r.insp)}));
  },[mBase]);

  // 工場詳細
  const [dFacs,setDFacs]=useState([]);
  const [clickedMonth,setClickedMonth]=useState(null);
  const [aiAnalysis,setAiAnalysis]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [aiError,setAiError]=useState("");
  const [selectedTrendItems,setSelectedTrendItems]=useState([]); // ★ 品番別推移
  const prevDFacs=useRef([]); const [dTypes,setDTypes]=useState([]); const [dInsps,setDInsps]=useState([]);
  const [dItems,setDItems]=useState([]); const [dRounds,setDRounds]=useState([]);

  useEffect(()=>{
    if(dFacs.length===0){ setAiAnalysis(""); return; }
    const fetchAI=async()=>{
      setAiLoading(true); setAiError(""); setAiAnalysis("");
      try {
        const rows=applyMulti(data,"factory",dFacs);
        const insp=rows.reduce((s,d)=>s+d.count,0);
        const def=rows.reduce((s,d)=>s+d.total,0);
        const sessions=rows.length;
        const defMap={};
        rows.forEach(d=>(d.defectItems||[]).forEach(({item,qty})=>{ defMap[item]=(defMap[item]||0)+qty; }));
        const total=Object.values(defMap).reduce((s,v)=>s+v,0);
        const topDefects=Object.entries(defMap).map(([name,value])=>({name,value,pct:total>0?+((value/total)*100).toFixed(1):0})).sort((a,b)=>b.value-a.value).slice(0,5);
        const monthMap={};
        rows.forEach(d=>{ if(!d.ym) return; if(!monthMap[d.ym]) monthMap[d.ym]={month:d.ym,insp:0,def:0}; monthMap[d.ym].insp+=d.count; monthMap[d.ym].def+=d.total; });
        const recentMonths=Object.values(monthMap).sort((a,b)=>a.month.localeCompare(b.month)).slice(-6).map(m=>({month:m.month,rate:rate(m.def,m.insp)}));
        const res=await fetch("/api/ai-analysis",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({factory:dFacs.join("・"),stats:{insp,def,rate:rate(def,insp),sessions,topDefects,recentMonths}})
        });
        const json=await res.json();
        if(json.error) throw new Error(json.error);
        setAiAnalysis(json.analysis);
      } catch(e){ setAiError(e.message); }
      finally { setAiLoading(false); }
    };
    fetchAI();
  },[dFacs,data]);

  const drillData=useMemo(()=>{
    let d=(dFacs.length===0?data:data.filter(d=>dFacs.includes(d.factory))); d=applyMulti(d,"type",dTypes); d=applyMulti(d,"inspectionType",dInsps);
    d=applyMulti(d,"itemNo",dItems); d=applyMulti(d,"round",dRounds); return d;
  },[data,dFacs,dTypes,dInsps,dItems,dRounds]);

  // 比較
  const [cmpFacs,setCmpFacs]=useState([]);
  const [cmpYMs,setCmpYMs]=useState([]);
  const [cmpDateFrom,setCmpDateFrom]=useState("");
  const [cmpDateTo,setCmpDateTo]=useState("");
  const cmpData=useMemo(()=>cmpFacs.map(fac=>{
    let rows=data.filter(d=>d.factory===fac);
    if(cmpYMs.length>0) rows=rows.filter(d=>cmpYMs.includes(d.ym));
    if(cmpDateFrom) rows=rows.filter(d=>d.date>=cmpDateFrom);
    if(cmpDateTo) rows=rows.filter(d=>d.date<=cmpDateTo);
    const insp=rows.reduce((s,d)=>s+d.count,0), def=rows.reduce((s,d)=>s+d.total,0);
    return {factory:fac,insp,def,rate:rate(def,insp),items:(byItem(rows)||[]).slice(0,6),months:byMonth(rows)||[]};
  }),[data,cmpFacs,cmpYMs,cmpDateFrom,cmpDateTo]);

  // 検索
  const [sq,setSq]=useState([]); const [sFacs,setSFacs]=useState([]);
  const [sqText,setSqText]=useState("");
  const searchRes=useMemo(()=>{
    const q=sqText.trim().toLowerCase();
    return data.filter(d=>{
      if(sFacs.length>0&&!sFacs.includes(d.factory)) return false;
      if(!q) return true;
      return [d.factory,d.itemNo,d.type,d.inspectionType,d.round,d.ym,...(d.defectItems||[]).map(x=>x.item)].some(v=>(v||"").toLowerCase().includes(q));
    });
  },[data,sqText,sFacs]);

  const tb = k => ({ padding:"5px 14px", borderRadius:8, fontSize:12, fontWeight:tab===k?700:400, cursor:"pointer", border:`1.5px solid ${tab===k?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.3)"}`, background:tab===k?"rgba(255,255,255,0.2)":"transparent", color:"#fff", transition:"all 0.15s" });

  return (
    <>
      <header style={{ background:"var(--accent)", padding:"0 20px", display:"flex", alignItems:"center", gap:12, height:52, position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 12px rgba(46,95,163,0.25)" }}>
        <span style={{ fontSize:15, fontWeight:700, color:"#fff" }}>検品不備</span>
        <span style={{ fontSize:9, color:"rgba(255,255,255,0.6)", fontFamily:"var(--mono)", letterSpacing:"0.2em" }}>DASHBOARD</span>
        <div style={{ display:"flex", gap:4, marginLeft:12 }}>
          {TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={tb(t.key)}>{t.label}</button>)}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
          {loading && <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />}
          {lastUp&&!loading&&<span style={{ fontSize:9, color:"rgba(255,255,255,0.6)", fontFamily:"var(--mono)" }}>更新: {lastUp.toLocaleTimeString("ja-JP")}</span>}
          <button onClick={fetchData} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>↺ 更新</button>
          <button onClick={logout} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.3)", color:"rgba(255,255,255,0.8)", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>ログアウト</button>
        </div>
      </header>

      {error && <div style={{ margin:"12px 20px", background:"var(--red-dim)", border:"1px solid var(--red)", borderRadius:8, padding:"10px 14px", fontSize:12, color:"var(--red)", display:"flex", justifyContent:"space-between" }}>
        <span>⚠ {error}</span><button onClick={fetchData} style={{ background:"var(--red)", color:"#fff", border:"none", borderRadius:4, padding:"3px 10px", fontSize:11, cursor:"pointer" }}>再試行</button>
      </div>}

      <main style={{ padding:"18px 20px", maxWidth:1480, margin:"0 auto" }}>

        {tab==="overview" && (<>
          <FilterBar>
            <MultiSel label="工場名"   values={gFacs}   onChange={setGFacs}   options={factories} />
            <MultiSel label="取引種別" values={gTypes}  onChange={setGTypes}  options={types} />
            <MultiSel label="検品種別" values={gInsps}  onChange={setGInsps}  options={inspTypes} />
            <MultiSel label="品番"     values={gItems}  onChange={setGItems}  options={itemNos} />
            <MultiSel label="検品回数" values={gRounds} onChange={setGRounds} options={rounds} />
            <MultiSel label="年月"     values={gYMs}    onChange={setGYMs}    options={yms} />
            <Rst onClick={()=>{setGFacs([]);setGTypes([]);setGInsps([]);setGItems([]);setGRounds([]);setGYMs([]);}} />
            <CsvBtn data={filtered} filename={`概要_${new Date().toISOString().slice(0,10)}.csv`} />
          </FilterBar>
          {loading&&data.length===0?<Spinner/>:<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:16 }}>
              <Kpi label="総検品数"   value={fmt(totInsp)}        sub="件"  color="var(--blue)" />
              <Kpi label="不備総数"   value={fmt(totDef)}         sub="件"  color="var(--red)" />
              <Kpi label="全体不備率" value={ovRate+"%"}          sub="平均" color="var(--accent)" />
              <Kpi label="対象工場数" value={facAgg.length+""}    sub="工場" color="var(--green)" />
              <Kpi label="レコード数" value={fmt(filtered.length)} sub="件" color="var(--purple)" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16, marginBottom:16 }}>
              <Panel>
                <ST>工場別 不備率（上位15）</ST>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={facAgg.slice(0,15)} layout="vertical" margin={{left:0,right:50,top:2,bottom:2}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                    <YAxis dataKey="factory" type="category" width={160} tick={{fill:"var(--text2)",fontSize:9}} axisLine={false} tickLine={false} />
                    <Tooltip content={<TT/>} />
                    <Bar dataKey="rate" name="不備率(%)" radius={[0,4,4,0]}>{facAgg.slice(0,15).map((d,i)=><Cell key={i} fill={rateColor(d.rate)}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <ST>不備傾向</ST>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:360, overflowY:"auto" }}>
                  {defItems.slice(0,15).map((d,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:16, textAlign:"right", color:"var(--text3)", fontFamily:"var(--mono)", fontSize:9 }}>{i+1}</div>
                      <div style={{ width:105, fontSize:11, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ flex:1, background:"var(--surface2)", borderRadius:3, height:5, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${d.pct/Math.max(...defItems.map(x=>x.pct))*100}%`, background:COLORS[i%COLORS.length], borderRadius:3 }} />
                      </div>
                      <div style={{ width:34, textAlign:"right", fontFamily:"var(--mono)", fontSize:10, color:COLORS[i%COLORS.length], fontWeight:600 }}>{d.pct}%</div>
                      <div style={{ width:40, textAlign:"right", fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>{fmt(d.value)}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <Panel>
              <ST>工場別サマリー（行をクリックで詳細へ）</ST>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                    {["#","工場名","検品数","不備数","不備率","件数"].map(h=><th key={h} style={{ padding:"7px 10px", textAlign:h==="工場名"?"left":"right", color:"var(--accent)", fontWeight:700, fontSize:10 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {facAgg.map((d,i)=>(
                      <tr key={d.factory} style={{ borderBottom:"1px solid var(--border)", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        onClick={()=>{setDFacs([d.factory]);setTab("factory");}}>
                        <td style={{ padding:"7px 10px", textAlign:"right", color:"var(--text3)", fontFamily:"var(--mono)", fontSize:9 }}>{i+1}</td>
                        <td style={{ padding:"7px 10px", color:"var(--blue)", fontWeight:600 }}>{d.factory}</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.insp)}</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(d.def)}</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(d.rate) }}>{d.rate}%</td>
                        <td style={{ padding:"7px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text3)" }}>{d.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </>}
        </>)}

        {tab==="monthly" && (<>
          <FilterBar>
            <MultiSel label="工場名"   values={mFacs}   onChange={setMFacs}   options={factories} />
            <MultiSel label="取引種別" values={mTypes}  onChange={setMTypes}  options={types} />
            <MultiSel label="検品種別" values={mInsps}  onChange={setMInsps}  options={inspTypes} />
            <MultiSel label="品番"     values={mItems}  onChange={setMItems}  options={itemNos} />
            <MultiSel label="検品回数" values={mRounds} onChange={setMRounds} options={rounds} />
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>期間（開始）</label>
              <input type="date" value={mDateFrom} onChange={e=>setMDateFrom(e.target.value)} style={{ background:"var(--surface2)", border:"1.5px solid var(--border2)", color:"var(--text)", borderRadius:8, padding:"6px 10px", fontSize:12, outline:"none" }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>期間（終了）</label>
              <input type="date" value={mDateTo} onChange={e=>setMDateTo(e.target.value)} style={{ background:"var(--surface2)", border:"1.5px solid var(--border2)", color:"var(--text)", borderRadius:8, padding:"6px 10px", fontSize:12, outline:"none" }} />
            </div>
            <Rst onClick={()=>{setMFacs([]);setMTypes([]);setMInsps([]);setMItems([]);setMRounds([]);setMDateFrom("");setMDateTo("");}} />
            <CsvBtn data={mBase} filename={`年月別_${new Date().toISOString().slice(0,10)}.csv`} />
          </FilterBar>
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {[{k:"month",l:"月次"},{k:"date",l:"納品日別"},{k:"item",l:"品番別"}].map(t=>(
              <button key={t.k} onClick={()=>setMViewMode(t.k)} style={{ padding:"5px 14px", borderRadius:8, fontSize:12, fontWeight:mViewMode===t.k?700:400, cursor:"pointer", border:`1.5px solid ${mViewMode===t.k?"var(--accent)":"var(--border)"}`, background:mViewMode===t.k?"var(--accent)":"transparent", color:mViewMode===t.k?"#fff":"var(--text2)" }}>{t.l}</button>
            ))}
          </div>
          {loading&&data.length===0?<Spinner/>:<>
            {mViewMode==="month" && (<>
              <div style={{ display:"flex", gap:10, marginBottom:16, overflowX:"auto", paddingBottom:2 }}>
                {mYearly.map((y,i)=>(
                  <div key={y.year} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"12px 16px", minWidth:120, borderTop:`4px solid ${COLORS[i%COLORS.length]}`, flexShrink:0, boxShadow:"0 2px 8px rgba(46,95,163,0.06)" }}>
                    <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4, fontWeight:600 }}>{y.year}年</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:20, fontWeight:700, color:COLORS[i%COLORS.length] }}>{y.rate}%</div>
                    <div style={{ fontSize:9, color:"var(--text3)", marginTop:4 }}>不備 {fmt(y.def)} / 検品 {fmt(y.insp)}</div>
                  </div>
                ))}
              </div>
              <Panel style={{ marginBottom:16 }}>
                <ST>月次 不備率推移</ST>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={mMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                    <Tooltip content={<TT/>} />
                    <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5} dot={{r:4,fill:"var(--accent)",strokeWidth:0}} name="不備率(%)" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel style={{ marginBottom:16 }}>
                <ST>月次 検品数 / 不備数</ST>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mMonthly} margin={{right:30}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="l" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="r" orientation="right" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                    <Tooltip content={<TT/>} /><Legend wrapperStyle={{fontSize:11,color:"var(--text2)"}} />
                    <Bar yAxisId="l" dataKey="insp" fill="var(--blue)" opacity={0.3} radius={[3,3,0,0]} name="検品数" />
                    <Bar yAxisId="l" dataKey="def"  fill="var(--red)"  radius={[3,3,0,0]} name="不備数" />
                    <Line yAxisId="r" type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2} dot={false} name="不備率(%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <ST>月次 詳細テーブル</ST>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                      {["年月","検品数","不備数","不備率","件数","前月比","上位品番","主な不備内容"].map(h=><th key={h} style={{ padding:"7px 12px", textAlign:h==="年月"||h==="主な不備内容"||h==="上位品番"?"left":"right", color:"var(--accent)", fontWeight:700, fontSize:10, whiteSpace:"nowrap" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {mMonthly.map((d,i)=>{
                        const prev=i>0?mMonthly[i-1]:null;
                        const diff=prev?+(d.rate-prev.rate).toFixed(2):null;
                        const monthRows=mBase.filter(r=>r.ym===d.month);
                        const topItems=byItem(monthRows).slice(0,3);
                        return (
                          <tr key={d.month} style={{ borderBottom:"1px solid var(--border)" }}
                            onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <td style={{ padding:"7px 12px", fontFamily:"var(--mono)", fontWeight:600 }}>{d.month}</td>
                            <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.insp)}</td>
                            <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(d.def)}</td>
                            <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(d.rate) }}>{d.rate}%</td>
                            <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text3)" }}>{d.n}</td>
                            <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:diff===null?"var(--text3)":diff>0?"var(--red)":diff<0?"var(--green)":"var(--text3)" }}>{diff===null?"—":`${diff>0?"+":""}${diff}%`}</td>
                            <td style={{ padding:"7px 12px", color:"var(--blue)", fontSize:10, fontFamily:"var(--mono)" }}>{[...new Set(monthRows.filter(r=>r.hasDefect).map(r=>r.itemNo))].filter(Boolean).slice(0,3).join(", ")}</td>
                            <td style={{ padding:"7px 12px", color:"var(--text3)", fontSize:10 }}>{topItems.map((t,j)=>`${t.name}(${t.pct}%)`).join("、")}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </>)}
            {mViewMode==="date" && (<>
              <Panel style={{ marginBottom:16 }}>
                <ST>納品日別 不備率推移</ST>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={mDaily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{fill:"var(--text3)",fontSize:9}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                    <Tooltip content={<TT/>} />
                    <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2} dot={{r:3,fill:"var(--accent)",strokeWidth:0}} name="不備率(%)" />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <ST>納品日別 詳細テーブル</ST>
                <div style={{ overflowX:"auto", maxHeight:400 }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                      {["納品日","検品数","不備数","不備率","件数"].map(h=><th key={h} style={{ padding:"7px 12px", textAlign:h==="納品日"?"left":"right", color:"var(--accent)", fontWeight:700, fontSize:10 }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {mDaily.map((d,i)=>(
                        <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"7px 12px", fontFamily:"var(--mono)", fontWeight:600 }}>{d.label||d.date}</td>
                          <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.insp)}</td>
                          <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(d.def)}</td>
                          <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(d.rate) }}>{d.rate}%</td>
                          <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text3)" }}>{d.n}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </>)}
            {mViewMode==="item" && (
              <Panel>
                <ST>品番別 不備傾向</ST>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:500, overflowY:"auto" }}>
                  {mItemAgg.slice(0,30).map((d,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:20, textAlign:"right", color:"var(--text3)", fontFamily:"var(--mono)", fontSize:9 }}>{i+1}</div>
                      <div style={{ width:140, fontSize:11, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ flex:1, background:"var(--surface2)", borderRadius:3, height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${mItemAgg.length>0?d.pct/Math.max(...mItemAgg.slice(0,30).map(x=>x.pct))*100:0}%`, background:COLORS[i%COLORS.length], borderRadius:3 }} />
                      </div>
                      <div style={{ width:38, textAlign:"right", fontFamily:"var(--mono)", fontSize:10, color:COLORS[i%COLORS.length], fontWeight:600 }}>{d.pct}%</div>
                      <div style={{ width:44, textAlign:"right", fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>{fmt(d.value)}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </>}
        </>)}

        {tab==="factory" && (<>
          <FilterBar>
            <MultiSel label="工場名 ★" values={dFacs}   onChange={setDFacs}   options={factories} placeholder="工場を選択..." />
            <MultiSel label="取引種別"  values={dTypes}  onChange={setDTypes}  options={types} />
            <MultiSel label="検品種別"  values={dInsps}  onChange={setDInsps}  options={inspTypes} />
            <MultiSel label="品番"      values={dItems}  onChange={setDItems}  options={[...new Set((dFacs.length>0?data.filter(d=>dFacs.includes(d.factory)):data).map(d=>d.itemNo))].filter(Boolean).sort()} />
            <MultiSel label="検品回数"  values={dRounds} onChange={setDRounds} options={rounds} />
            <Rst onClick={()=>{setDFacs([]);setDTypes([]);setDInsps([]);setDItems([]);setDRounds([]);setSelectedTrendItems([]);}} />
          </FilterBar>
          {(()=>{
            const insp=drillData.reduce((s,d)=>s+d.count,0), def=drillData.reduce((s,d)=>s+d.total,0), r=rate(def,insp);
            const its=byItem(drillData).slice(0,12), pieT=its.reduce((s,d)=>s+d.value,0);
            const mthMap={};
            drillData.forEach(d=>{
              if(!d.ym) return;
              if(!mthMap[d.ym]) mthMap[d.ym]={month:d.ym,insp:0,def:0,n:0,items:[]};
              mthMap[d.ym].insp+=(d.count||0); mthMap[d.ym].def+=(d.total||0); mthMap[d.ym].n+=1;
              if(d.hasDefect) mthMap[d.ym].items.push({itemNo:d.itemNo||"不明",date:d.date||"",count:d.count||0,total:d.total||0,defectItems:d.defectItems||[]});
            });
            const mths=Object.values(mthMap).sort((a,b)=>a.month.localeCompare(b.month)).map(r=>({...r,rate:rate(r.def,r.insp)}));
            const rows=[...drillData].filter(d=>d.hasDefect).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,60);

            // ★ 品番別推移データ
            const allItemNos=[...new Set(drillData.map(d=>d.itemNo))].filter(Boolean).sort();
            const itemMonthMap={};
            drillData.forEach(d=>{
              if(!d.ym||!d.itemNo) return;
              const key=`${d.itemNo}__${d.ym}`;
              if(!itemMonthMap[key]) itemMonthMap[key]={itemNo:d.itemNo,month:d.ym,insp:0,def:0};
              itemMonthMap[key].insp+=d.count; itemMonthMap[key].def+=d.total;
            });
            const allMonths=[...new Set(drillData.map(d=>d.ym))].filter(Boolean).sort();
            const trendData=allMonths.map(month=>{
              const entry={month};
              selectedTrendItems.forEach(itemNo=>{
                const key=`${itemNo}__${month}`;
                const r=itemMonthMap[key];
                entry[itemNo]=r&&r.insp>0?rate(r.def,r.insp):null;
              });
              return entry;
            });

            // ★ 品番別集計（月次平均不備率も計算）
            const itemSummary={};
            const itemMonthRates={};
            drillData.forEach(d=>{
              if(!d.itemNo) return;
              if(!itemSummary[d.itemNo]) itemSummary[d.itemNo]={itemNo:d.itemNo,insp:0,def:0,defMap:{}};
              itemSummary[d.itemNo].insp+=d.count; itemSummary[d.itemNo].def+=d.total;
              (d.defectItems||[]).forEach(x=>{ itemSummary[d.itemNo].defMap[x.item]=(itemSummary[d.itemNo].defMap[x.item]||0)+x.qty; });
              if(d.ym){
                if(!itemMonthRates[d.itemNo]) itemMonthRates[d.itemNo]={};
                if(!itemMonthRates[d.itemNo][d.ym]) itemMonthRates[d.itemNo][d.ym]={insp:0,def:0};
                itemMonthRates[d.itemNo][d.ym].insp+=d.count;
                itemMonthRates[d.itemNo][d.ym].def+=d.total;
              }
            });
            Object.keys(itemSummary).forEach(itemNo=>{
              const months=Object.values(itemMonthRates[itemNo]||{});
              const monthRates=months.filter(m=>m.insp>0).map(m=>+(m.def/m.insp*100).toFixed(2));
              itemSummary[itemNo].avgRate=monthRates.length>0?+(monthRates.reduce((s,v)=>s+v,0)/monthRates.length).toFixed(2):0;
              itemSummary[itemNo].monthCount=monthRates.length;
              itemSummary[itemNo].minRate=monthRates.length>0?Math.min(...monthRates):0;
              itemSummary[itemNo].maxRate=monthRates.length>0?Math.max(...monthRates):0;
            });
            const itemSummaryList=Object.values(itemSummary).sort((a,b)=>b.avgRate-a.avgRate);

            return (<>
              <div style={{ marginBottom:14, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <h1 style={{ fontSize:16, fontWeight:700, color:"var(--accent)" }}>{dFacs.length>0?dFacs.join("・"):"全工場"}</h1>
                {[...dTypes,...dInsps,...dItems,...dRounds].map((v,i)=><span key={i} style={{ background:"var(--accent-dim)", color:"var(--accent)", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:600 }}>{v}</span>)}
                </div>
                <FactoryCsvBtn drillData={drillData} mths={mths} its={its} itemSummaryList={itemSummaryList} dFacs={dFacs} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:16 }}>
                <Kpi label="検品数"   value={fmt(insp)}      color="var(--blue)"   small />
                <Kpi label="不備数"   value={fmt(def)}       color="var(--red)"    small />
                <Kpi label="不備率"   value={r+"%"}          color={rateColor(r)}  small />
                <Kpi label="レコード" value={drillData.length+""} color="var(--purple)" small />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <Panel>
                  <ST>不備内容内訳</ST>
                  {its.length===0?<div style={{ color:"var(--text3)", textAlign:"center", padding:40 }}>不備データなし</div>:(<>
                    <ResponsiveContainer width="100%" height={170}>
                      <PieChart><Pie data={its} cx="50%" cy="50%" innerRadius={48} outerRadius={76} dataKey="value" paddingAngle={2}>
                        {its.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Pie><Tooltip content={<TT/>}/></PieChart>
                    </ResponsiveContainer>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:8 }}>
                      {its.map((d,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ width:7, height:7, borderRadius:2, background:COLORS[i%COLORS.length], flexShrink:0 }} />
                          <div style={{ flex:1, fontSize:11, color:"var(--text2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:COLORS[i%COLORS.length], fontWeight:600 }}>{pieT>0?+((d.value/pieT)*100).toFixed(1):0}%</div>
                          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", minWidth:34, textAlign:"right" }}>{fmt(d.value)}</div>
                        </div>
                      ))}
                    </div>
                  </>)}
                </Panel>
                <Panel>
                  <ST>月次 不備率推移（●クリックで詳細表示）</ST>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={mths} onClick={(e)=>{
                      if(e&&e.activePayload&&e.activePayload[0]){
                        const m=e.activePayload[0].payload;
                        setClickedMonth(m===clickedMonth?null:m);
                      }
                    }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                      <Tooltip content={({active,payload,label})=>{
                        if(!active||!payload?.length) return null;
                        const m=payload[0].payload;
                        const topItems=[...m.items].sort((a,b)=>rate(b.total,b.count)-rate(a.total,a.count)).slice(0,5);
                        return (
                          <div style={{background:"var(--surface)",border:"1.5px solid var(--border2)",borderRadius:10,padding:"12px 14px",fontSize:11,boxShadow:"0 4px 16px rgba(46,95,163,0.15)",maxWidth:260}}>
                            <div style={{fontWeight:700,color:"var(--accent)",marginBottom:6}}>{label}</div>
                            <div style={{color:"var(--text2)",marginBottom:4}}>不備率: <b style={{color:rateColor(m.rate),fontFamily:"var(--mono)"}}>{m.rate}%</b></div>
                            <div style={{color:"var(--text2)",marginBottom:6}}>検品数: <b style={{fontFamily:"var(--mono)"}}>{fmt(m.insp)}</b> / 不備: <b style={{color:"var(--red)",fontFamily:"var(--mono)"}}>{fmt(m.def)}</b></div>
                            {topItems.length>0&&<><div style={{color:"var(--text3)",fontSize:10,marginBottom:4,borderTop:"1px solid var(--border)",paddingTop:4}}>主な品番（不備率順）</div>
                            {topItems.map((t,i)=><div key={i} style={{color:"var(--text)",fontSize:10,marginBottom:2}}>・{t.itemNo||"不明"} {t.total}/{t.count}点 ({rate(t.total,t.count)}%)</div>)}</>}
                            <div style={{color:"var(--text3)",fontSize:9,marginTop:6}}>クリックで詳細表示</div>
                          </div>
                        );
                      }} />
                      <Line type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5}
                        dot={<circle r={5} fill="var(--accent)" stroke="#fff" strokeWidth={2} style={{cursor:"pointer"}}/>}
                        activeDot={{r:7,fill:"var(--accent2)",stroke:"#fff",strokeWidth:2,style:{cursor:"pointer"}}}
                        name="不備率(%)" />
                    </LineChart>
                  </ResponsiveContainer>
                  {clickedMonth&&(
                    <div style={{marginTop:12,background:"var(--surface2)",border:"1.5px solid var(--accent)",borderRadius:10,padding:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{fontWeight:700,color:"var(--accent)",fontSize:13}}>{clickedMonth.month} の詳細</div>
                        <button onClick={()=>setClickedMonth(null)} style={{background:"transparent",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:16}}>✕</button>
                      </div>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
                            {["品番","検品数","不備数","不備率","主な不備"].map(h=><th key={h} style={{padding:"5px 8px",textAlign:"left",color:"var(--accent)",fontWeight:700,fontSize:10}}>{h}</th>)}
                          </tr></thead>
                          <tbody>
                            {(()=>{
                              const itemMap={};
                              (clickedMonth.items||[]).forEach(t=>{
                                const key=t.itemNo||"不明";
                                if(!itemMap[key]) itemMap[key]={itemNo:key,count:0,total:0,defMap:{}};
                                itemMap[key].count+=t.count; itemMap[key].total+=t.total;
                                t.defectItems.forEach(x=>{ itemMap[key].defMap[x.item]=(itemMap[key].defMap[x.item]||0)+x.qty; });
                              });
                              return Object.values(itemMap).sort((a,b)=>rate(b.total,b.count)-rate(a.total,a.count)).map((t,i)=>{
                                const topDefs=Object.entries(t.defMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
                                return (
                                  <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                                    <td style={{padding:"5px 8px",color:"var(--blue)",fontFamily:"var(--mono)",fontWeight:600}}>{t.itemNo}</td>
                                    <td style={{padding:"5px 8px",textAlign:"right",fontFamily:"var(--mono)",color:"var(--text2)"}}>{fmt(t.count)}</td>
                                    <td style={{padding:"5px 8px",textAlign:"right",fontFamily:"var(--mono)",color:"var(--red)"}}>{fmt(t.total)}</td>
                                    <td style={{padding:"5px 8px",textAlign:"right",fontFamily:"var(--mono)",fontWeight:700,color:rateColor(rate(t.total,t.count))}}>{rate(t.total,t.count)}%</td>
                                    <td style={{padding:"5px 8px",color:"var(--text3)",fontSize:10}}>{topDefs.map(([k,v])=>`${k}×${v}`).join(", ")}</td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Panel>
              </div>

              {/* ★ 品番別 不備率推移グラフ */}
              <Panel style={{ marginBottom:16 }}>
                <ST>品番別 不備率推移</ST>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:"var(--text3)", marginBottom:6 }}>品番を選択してグラフに追加（複数可）</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {allItemNos.map((itemNo,i)=>{
                      const sel=selectedTrendItems.includes(itemNo);
                      const colorIdx=selectedTrendItems.indexOf(itemNo);
                      return (
                        <button key={itemNo} onClick={()=>{
                          if(sel){ setSelectedTrendItems(selectedTrendItems.filter(x=>x!==itemNo)); }
                          else { setSelectedTrendItems([...selectedTrendItems,itemNo]); }
                        }} style={{
                          padding:"4px 10px", borderRadius:6, fontSize:11, cursor:"pointer", fontWeight:sel?700:400,
                          border:`1.5px solid ${sel?COLORS[colorIdx%COLORS.length]:"var(--border2)"}`,
                          background:sel?COLORS[colorIdx%COLORS.length]+"22":"var(--surface2)",
                          color:sel?COLORS[colorIdx%COLORS.length]:"var(--text2)",
                          opacity:1,
                          transition:"all 0.15s",
                        }}>
                          {sel&&<span style={{marginRight:4}}>✓</span>}{itemNo}
                        </button>
                      );
                    })}
                  </div>
                  {selectedTrendItems.length>0&&(
                    <button onClick={()=>setSelectedTrendItems([])} style={{ marginTop:8, background:"transparent", border:"1px solid var(--border2)", color:"var(--text3)", borderRadius:6, padding:"3px 10px", fontSize:10, cursor:"pointer" }}>
                      クリア
                    </button>
                  )}
                </div>
                {selectedTrendItems.length===0?(
                  <div style={{ textAlign:"center", color:"var(--text3)", padding:40, fontSize:12, background:"var(--surface2)", borderRadius:8 }}>
                    ↑ 上のボタンから品番を選択すると推移グラフが表示されます
                  </div>
                ):(
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                      <Tooltip content={({active,payload,label})=>{
                        if(!active||!payload?.length) return null;
                        return (
                          <div style={{background:"var(--surface)",border:"1.5px solid var(--border2)",borderRadius:8,padding:"10px 14px",fontSize:11,boxShadow:"0 4px 12px rgba(46,95,163,0.1)"}}>
                            <div style={{color:"var(--text2)",marginBottom:6,fontWeight:600}}>{label}</div>
                            {payload.filter(p=>p.value!==null).map((p,i)=>(
                              <div key={i} style={{color:p.color,marginBottom:2}}>
                                {p.name}: <b style={{fontFamily:"var(--mono)"}}>{p.value}%</b>
                              </div>
                            ))}
                          </div>
                        );
                      }}/>
                      <Legend wrapperStyle={{fontSize:11,color:"var(--text2)"}}/>
                      {selectedTrendItems.map((itemNo,i)=>(
                        <Line key={itemNo} type="monotone" dataKey={itemNo} stroke={COLORS[i%COLORS.length]} strokeWidth={2.5}
                          dot={{r:4,fill:COLORS[i%COLORS.length],strokeWidth:0}} connectNulls name={itemNo}/>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Panel>

              {/* ★ 品番別サマリーテーブル（月次平均不備率付き） */}
              <Panel style={{ marginBottom:16 }}>
                <ST>品番別 不備率サマリー（月次平均不備率順）</ST>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                    <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                      {["#","品番","検品数","不備数","累計不備率","月次平均不備率","最小","最大","月数","主な不備TOP3","推移に追加"].map(h=>(
                        <th key={h} style={{ padding:"6px 10px", textAlign:(h==="品番"||h==="主な不備TOP3")?"left":"right", color:"var(--accent)", fontWeight:700, fontSize:10, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {itemSummaryList.map((d,i)=>{
                        const rv=rate(d.def,d.insp);
                        const topDefs=Object.entries(d.defMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
                        const sel=selectedTrendItems.includes(d.itemNo);
                        const colorIdx=selectedTrendItems.indexOf(d.itemNo);
                        return (
                          <tr key={d.itemNo} style={{ borderBottom:"1px solid var(--border)" }}
                            onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <td style={{ padding:"6px 10px", textAlign:"right", color:"var(--text3)", fontFamily:"var(--mono)", fontSize:9 }}>{i+1}</td>
                            <td style={{ padding:"6px 10px", color:"var(--blue)", fontFamily:"var(--mono)", fontWeight:600 }}>{d.itemNo}</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.insp)}</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(d.def)}</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", color:rateColor(rv) }}>{rv}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(d.avgRate) }}>{d.avgRate}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", fontSize:10, color:"var(--green)" }}>{d.minRate}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", fontSize:10, color:"var(--red)" }}>{d.maxRate}%</td>
                            <td style={{ padding:"6px 10px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text3)", fontSize:10 }}>{d.monthCount}ヶ月</td>
                            <td style={{ padding:"6px 10px", color:"var(--text3)", fontSize:10 }}>{topDefs.map(([k,v])=>`${k}(${v})`).join("、")}</td>
                            <td style={{ padding:"6px 10px", textAlign:"center" }}>
                              <button onClick={()=>{
                                if(sel){ setSelectedTrendItems(selectedTrendItems.filter(x=>x!==d.itemNo)); }
                                else { setSelectedTrendItems([...selectedTrendItems,d.itemNo]); }
                              }} style={{
                                padding:"3px 10px", borderRadius:5, fontSize:10, cursor:"pointer", fontWeight:sel?700:400,
                                border:`1.5px solid ${sel?COLORS[colorIdx%COLORS.length]:"var(--border2)"}`,
                                background:sel?COLORS[colorIdx%COLORS.length]:"transparent",
                                color:sel?"#fff":"var(--text2)",
                                opacity:1,
                              }}>
                                {sel?"✓ 表示中":"＋ 追加"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel>
                <ST>明細（不備あり・不備率降順）</ST>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                    <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                      {["日付","工場名","取引種別","検品種別","品番","回数","検品数","不備数","不備率","主な不備"].map(h=>(
                        <th key={h} style={{ padding:"6px 9px", textAlign:"left", color:"var(--accent)", fontWeight:700, fontSize:10, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {rows.map((d,i)=>{const rv=rate(d.total,d.count);return(
                        <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"6px 9px", color:"var(--text3)", fontFamily:"var(--mono)", whiteSpace:"nowrap" }}>{d.date}</td>
                          <td style={{ padding:"6px 9px", color:"var(--blue)", fontWeight:600 }}>{d.factory}</td>
                          <td style={{ padding:"6px 9px", color:"var(--text2)" }}>{d.type}</td>
                          <td style={{ padding:"6px 9px", color:"var(--text2)" }}>{d.inspectionType}</td>
                          <td style={{ padding:"6px 9px", color:"var(--blue)", fontFamily:"var(--mono)" }}>{d.itemNo}</td>
                          <td style={{ padding:"6px 9px" }}><Tag>{d.round}</Tag></td>
                          <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.count)}</td>
                          <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(d.total)}</td>
                          <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(rv) }}>{rv}%</td>
                          <td style={{ padding:"6px 9px", color:"var(--text3)", fontSize:10 }}>{(d.defectItems||[]).slice(0,3).map(x=>`${x.item}×${x.qty}`).join(", ")}</td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </>);
          })()}
        </>)}

        {tab==="compare" && (<>
          <FilterBar>
            <FactoryMultiSel label="比較する工場（複数選択・全て可）" values={cmpFacs} onChange={setCmpFacs} options={factories} />
            <MultiSel label="年月" values={cmpYMs} onChange={setCmpYMs} options={yms} />
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>期間（開始）</label>
              <input type="date" value={cmpDateFrom} onChange={e=>setCmpDateFrom(e.target.value)} style={{ background:"var(--surface2)", border:"1.5px solid var(--border2)", color:"var(--text)", borderRadius:8, padding:"6px 10px", fontSize:12, outline:"none" }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>期間（終了）</label>
              <input type="date" value={cmpDateTo} onChange={e=>setCmpDateTo(e.target.value)} style={{ background:"var(--surface2)", border:"1.5px solid var(--border2)", color:"var(--text)", borderRadius:8, padding:"6px 10px", fontSize:12, outline:"none" }} />
            </div>
            <Rst onClick={()=>{setCmpFacs([]);setCmpYMs([]);setCmpDateFrom("");setCmpDateTo("");}} />
          </FilterBar>
          {cmpFacs.length<2?(
            <div style={{ textAlign:"center", color:"var(--text3)", padding:80, fontSize:13 }}>2工場以上選択してください（「全て選択」で全工場比較できます）</div>
          ):(<>
            <Panel style={{ marginBottom:16 }}>
              <ST>工場別 不備率ランキング（{cmpFacs.length}工場）</ST>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                    {["#","工場名","検品数","不備数","不備率"].map(h=><th key={h} style={{ padding:"7px 12px", textAlign:h==="工場名"?"left":"right", color:"var(--accent)", fontWeight:700, fontSize:10 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[...cmpData].sort((a,b)=>b.rate-a.rate).map((s,i)=>(
                      <tr key={s.factory} style={{ borderBottom:"1px solid var(--border)" }}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"7px 12px", textAlign:"right", color:"var(--text3)", fontFamily:"var(--mono)", fontSize:9 }}>{i+1}</td>
                        <td style={{ padding:"7px 12px", color:COLORS[cmpFacs.indexOf(s.factory)%COLORS.length], fontWeight:700 }}>{s.factory}</td>
                        <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(s.insp)}</td>
                        <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--red)" }}>{fmt(s.def)}</td>
                        <td style={{ padding:"7px 12px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(s.rate) }}>{s.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel style={{ marginBottom:16 }}>
              <ST>不備率比較（上位15工場）</ST>
              <ResponsiveContainer width="100%" height={Math.min([...cmpData].length*26+40,400)}>
                <BarChart data={[...cmpData].sort((a,b)=>b.rate-a.rate).slice(0,15)} layout="vertical" margin={{left:8,right:50}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                  <YAxis dataKey="factory" type="category" width={90} tick={{fill:"var(--text2)",fontSize:10}} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT/>} />
                  <Bar dataKey="rate" name="不備率(%)" radius={[0,4,4,0]}>{[...cmpData].sort((a,b)=>b.rate-a.rate).slice(0,15).map((d,i)=><Cell key={i} fill={rateColor(d.rate)}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel>
              <ST>月次 不備率推移 比較（上位10工場）</ST>
              {(()=>{
                const top10=[...cmpData].sort((a,b)=>b.rate-a.rate).slice(0,10);
                const allM=[...new Set(top10.flatMap(s=>s.months.map(m=>m.month)))].sort();
                const merged=allM.map(month=>({ month, ...Object.fromEntries(top10.map(s=>[s.factory.slice(0,8),s.months.find(m=>m.month===month)?.rate||null])) }));
                return (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={merged}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} />
                      <Tooltip content={<TT/>}/><Legend wrapperStyle={{fontSize:10,color:"var(--text2)"}} />
                      {top10.map((s,i)=><Line key={s.factory} type="monotone" dataKey={s.factory.slice(0,8)} stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={{r:2,fill:COLORS[i%COLORS.length],strokeWidth:0}} connectNulls name={s.factory}/>)}
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </Panel>
          </>)}
        </>)}

        {tab==="search" && (<>
          <FilterBar>
            <div style={{ display:"flex", flexDirection:"column", gap:3, flex:1, minWidth:220 }}>
              <label style={{ color:"var(--text3)", fontSize:9, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>キーワード検索</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>🔍</span>
                <input value={sqText} onChange={e=>setSqText(e.target.value)} placeholder="工場名・品番・不備内容・年月など..."
                  style={{ width:"100%", background:"var(--surface2)", border:"1.5px solid var(--border2)", color:"var(--text)", borderRadius:8, padding:"6px 11px 6px 30px", fontSize:12, outline:"none" }} />
              </div>
            </div>
            <MultiSel label="工場で絞込" values={sFacs} onChange={setSFacs} options={factories} />
            <Rst onClick={()=>{setSqText("");setSFacs([]);}} />
            <CsvBtn data={searchRes} filename={`検索結果_${new Date().toISOString().slice(0,10)}.csv`} />
          </FilterBar>
          <div style={{ marginBottom:10, fontSize:11, color:"var(--text3)" }}>
            {searchRes.length.toLocaleString("ja-JP")} 件ヒット
            {(sqText||sFacs.length>0)&&<span style={{ color:"var(--accent)", marginLeft:8, fontWeight:600 }}>— 「{[sqText,...sFacs].filter(Boolean).join(" / ")}」</span>}
          </div>
          <Panel>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead><tr style={{ borderBottom:"2px solid var(--border)" }}>
                  {["日付","工場名","取引種別","検品種別","品番","回数","検品数","不備数","不備率","主な不備内容"].map(h=>(
                    <th key={h} style={{ padding:"7px 9px", textAlign:"left", color:"var(--accent)", fontWeight:700, fontSize:10, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {searchRes.slice(0,100).map((d,i)=>{
                    const rv=rate(d.total,d.count), q=sqText.trim().toLowerCase();
                    const hl=text=>{if(!q||!text.toLowerCase().includes(q))return text;const idx=text.toLowerCase().indexOf(q);return <span>{text.slice(0,idx)}<mark style={{background:"var(--accent-dim)",color:"var(--accent)",borderRadius:2,fontWeight:600}}>{text.slice(idx,idx+q.length)}</mark>{text.slice(idx+q.length)}</span>;};
                    return (
                      <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"6px 9px", color:"var(--text3)", fontFamily:"var(--mono)", whiteSpace:"nowrap" }}>{d.date}</td>
                        <td style={{ padding:"6px 9px", fontWeight:600, color:"var(--blue)" }}>{hl(d.factory)}</td>
                        <td style={{ padding:"6px 9px", color:"var(--text2)" }}>{hl(d.type)}</td>
                        <td style={{ padding:"6px 9px", color:"var(--text2)" }}>{hl(d.inspectionType)}</td>
                        <td style={{ padding:"6px 9px", color:"var(--blue)", fontFamily:"var(--mono)" }}>{hl(d.itemNo)}</td>
                        <td style={{ padding:"6px 9px" }}><Tag>{d.round}</Tag></td>
                        <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", color:"var(--text2)" }}>{fmt(d.count)}</td>
                        <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", color:d.hasDefect?"var(--red)":"var(--text3)" }}>{fmt(d.total)}</td>
                        <td style={{ padding:"6px 9px", textAlign:"right", fontFamily:"var(--mono)", fontWeight:700, color:rateColor(rv) }}>{rv}%</td>
                        <td style={{ padding:"6px 9px", color:"var(--text3)", fontSize:10 }}>{(d.defectItems||[]).slice(0,4).map((x,j)=><span key={j}>{hl(x.item)}{j<Math.min((d.defectItems||[]).length,4)-1?", ":""}</span>)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {searchRes.length>100&&<div style={{ textAlign:"center", padding:12, color:"var(--text3)", fontSize:11 }}>上位100件表示 — キーワードを絞り込んでください</div>}
            </div>
          </Panel>
        </>)}
      </main>
    </>
  );
}
