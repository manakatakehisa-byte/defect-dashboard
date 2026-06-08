export default async function handler(req, res) {
  // Cookie確認
  const cookie = req.headers.cookie || "";
  if (!cookie.includes("dash_auth=")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const GAS_URL = process.env.GAS_API_URL;
  if (!GAS_URL) return res.status(500).json({ error: "GAS_API_URL未設定" });

  try {
    const r = await fetch(GAS_URL + "?t=" + Date.now(), { redirect: "follow" });
    if (!r.ok) throw new Error(`GAS: ${r.status}`);
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
