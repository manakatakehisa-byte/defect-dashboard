export default function handler(req, res) {
  res.setHeader("Set-Cookie", "dash_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");
  res.status(200).json({ ok: true });
}
