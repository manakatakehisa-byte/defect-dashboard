export const COLORS = ["#2e5fa3","#e05a2b","#1a7a5e","#8b3fa8","#b8860b","#c0392b","#1a6080","#7a5a20","#3a8060","#6040a0","#a05030","#205080","#806030","#504090","#308060"];

export function rate(def, insp) {
  if (!insp) return 0;
  return +((def / insp) * 100).toFixed(2);
}
export function fmt(n) {
  return typeof n === "number" ? n.toLocaleString("ja-JP") : String(n ?? "");
}
export function rateColor(r) {
  if (r >= 15) return "#c0392b";
  if (r >= 10) return "#e05a2b";
  if (r >= 5)  return "#b8860b";
  if (r >= 2)  return "#2e5fa3";
  return "#1a7a5e";
}
export function parseYM(s) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d) ? "" : `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}`;
}
export function byFactory(data) {
  const m = {};
  data.forEach(d => {
    if (!m[d.factory]) m[d.factory] = { factory: d.factory, insp: 0, def: 0, n: 0, items: {} };
    m[d.factory].insp += d.count;
    m[d.factory].def  += d.total;
    m[d.factory].n    += 1;
    (d.defectItems||[]).forEach(({item,qty}) => { m[d.factory].items[item] = (m[d.factory].items[item]||0)+qty; });
  });
  return Object.values(m).map(r => ({
    ...r, rate: rate(r.def, r.insp),
    breakdown: Object.entries(r.items).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value),
  })).sort((a,b)=>b.rate-a.rate);
}
export function byMonth(data) {
  const m = {};
  data.forEach(d => {
    if (!d.ym) return;
    if (!m[d.ym]) m[d.ym] = { month: d.ym, insp: 0, def: 0, n: 0 };
    m[d.ym].insp += d.count; m[d.ym].def += d.total; m[d.ym].n += 1;
  });
  return Object.values(m).sort((a,b)=>a.month.localeCompare(b.month)).map(r=>({...r, rate: rate(r.def, r.insp)}));
}
export function byDate(data) {
  const m = {};
  data.forEach(d => {
    if (!d.date) return;
    const key = d.date;
    if (!m[key]) {
      // 日本語表示用に変換
      const dt = new Date(d.date);
      const label = isNaN(dt) ? d.date : `${dt.getFullYear()}年${dt.getMonth()+1}月${dt.getDate()}日`;
      m[key] = { date: key, label, insp: 0, def: 0, n: 0 };
    }
    m[key].insp += d.count; m[key].def += d.total; m[key].n += 1;
  });
  return Object.values(m).sort((a,b)=>a.date.localeCompare(b.date)).map(r=>({...r, rate: rate(r.def, r.insp)}));
}
export function byItem(data) {
  const m = {};
  data.forEach(d => (d.defectItems||[]).forEach(({item,qty}) => { m[item]=(m[item]||0)+qty; }));
  const total = Object.values(m).reduce((s,v)=>s+v,0);
  return Object.entries(m).map(([name,value])=>({ name, value, pct: total>0?+((value/total)*100).toFixed(1):0 })).sort((a,b)=>b.value-a.value);
}
