export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body;
  const correct = process.env.DASHBOARD_PASSWORD;
  if (!correct) return res.status(500).json({ ok: false, error: "パスワード未設定" });
  if (password === correct) {
    // Cookieにセッショントークンをセット（HttpOnly）
    const token = Buffer.from(`auth:${Date.now()}`).toString("base64");
    res.setHeader("Set-Cookie", `dash_auth=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*30}; SameSite=Strict`);
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "パスワードが違います" });
}
