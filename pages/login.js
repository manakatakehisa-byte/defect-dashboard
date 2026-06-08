import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const json = await res.json();
    if (json.ok) { router.push("/"); }
    else { setErr(json.error || "エラーが発生しました"); setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #dce8f5 0%, #eef2f7 50%, #e8eef6 100%)" }}>
      <div style={{ background:"#fff", border:"1px solid #d0daea", borderRadius:20, padding:"48px 40px", width:370, boxShadow:"0 8px 32px rgba(74,122,181,0.12)" }}>
        {/* ロゴ */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg, #5b8fc9, #8ab4db)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:24 }}>📋</span>
          </div>
          <div style={{ fontSize:20, fontWeight:700, color:"#2d3d52" }}>検品不備</div>
          <div style={{ fontSize:10, color:"#5b8fc9", letterSpacing:"0.2em", marginTop:4, fontWeight:600 }}>DASHBOARD</div>
        </div>

        <p style={{ color:"#90a8c0", fontSize:12, marginBottom:24, textAlign:"center", lineHeight:1.8 }}>
          社内専用ダッシュボードです。<br/>パスワードを入力してください。
        </p>

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <input
            type="password" value={pw} onChange={e=>setPw(e.target.value)}
            placeholder="パスワード" required autoFocus
            style={{ background:"#f4f7fb", border:"1.5px solid #d0daea", color:"#2d3d52", borderRadius:10, padding:"11px 14px", fontSize:13, outline:"none", width:"100%", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor="#5b8fc9"}
            onBlur={e=>e.target.style.borderColor="#d0daea"}
          />
          {err && <div style={{ background:"#fdf0f0", border:"1px solid #e07070", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#c05050" }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ background:"linear-gradient(135deg, #5b8fc9, #4a7ab5)", color:"#fff", border:"none", borderRadius:10, padding:"12px 0", fontSize:13, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, marginTop:4, boxShadow:"0 4px 12px rgba(91,143,201,0.3)" }}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p style={{ color:"#b8c9de", fontSize:10, marginTop:20, textAlign:"center" }}>🔒 社外秘 — 許可されたユーザーのみ</p>
      </div>
    </div>
  );
}
