export default async function handler(req, res) {
  // 認証チェック
  const cookie = req.headers.cookie || "";
  if (!cookie.includes("dash_auth=")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") return res.status(405).end();

  const { factory, stats } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY未設定" });
  }

  const prompt = `
あなたはアパレル・繊維製品の品質管理の専門家です。
以下の工場の検品不備データを分析して、具体的な改善提案を日本語で作成してください。

【工場名】${factory}

【データサマリー】
- 総検品数: ${stats.insp}点
- 不備総数: ${stats.def}点
- 不備率: ${stats.rate}%
- 検品レコード数: ${stats.sessions}件

【不備内容ランキング（上位）】
${stats.topDefects.map((d, i) => `${i + 1}. ${d.name}: ${d.value}点 (${d.pct}%)`).join("\n")}

【月別不備率推移（直近）】
${stats.recentMonths.map(m => `${m.month}: ${m.rate}%`).join(", ")}

以下の形式で回答してください：

## 現状分析
（2〜3文で工場の品質状況を簡潔に説明）

## 主要問題点
1. （最も深刻な問題）
2. （2番目の問題）
3. （3番目の問題）

## 具体的改善提案
1. 【緊急】（すぐに取り組むべき改善策）
2. 【短期】（1〜3ヶ月で実施する改善策）
3. 【中期】（3〜6ヶ月で実施する改善策）

## 目標設定
（改善後に目指すべき不備率の目標と期間）
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "分析結果を取得できませんでした";

    return res.status(200).json({ analysis: text });
  } catch (e) {
    console.error("Gemini error:", e);
    return res.status(500).json({ error: e.message });
  }
}
