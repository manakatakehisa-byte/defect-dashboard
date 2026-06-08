# 検品不備ダッシュボード — セットアップ手順

やることは **3ステップだけ** です。

---

## ✅ STEP 1｜スプレッドシートにスクリプトを貼る

1. Googleスプレッドシートを開く
2. 上のメニュー **「拡張機能」→「Apps Script」** をクリック
3. 画面が開いたら、**すでに書いてあるコードを全部消して**、下のコードをコピペして貼り付ける

```javascript
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('シート1'); // ← シート名が違う場合は変更
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });

    const defectItems = [];
    ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'].forEach(n => {
      const item = String(obj['不備項目'+n] || '').trim();
      const qty  = parseFloat(String(obj['数量'+n] || '').replace(/,/g,'')) || 0;
      if (item && qty > 0) defectItems.push({ item, qty });
    });

    return {
      date:           String(obj['報告月'] || '').trim(),
      type:           String(obj['取引会社種別'] || '').trim(),
      factory:        String(obj['工場名'] || '').trim(),
      inspectionType: String(obj['検品種別'] || '').trim(),
      itemNo:         String(obj['品番'] || '').trim(),
      round:          String(obj['検品回数'] || '').trim(),
      count:          parseFloat(String(obj['検品数']  || '0').replace(/,/g,'')) || 0,
      hasDefect:      String(obj['不備の有無'] || '').trim() === 'あり',
      total:          parseFloat(String(obj['不備合計'] || '0').replace(/,/g,'')) || 0,
      defectItems,
    };
  }).filter(r => r.factory);

  return ContentService
    .createTextOutput(JSON.stringify({ rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. **「保存」**（フロッピーアイコン or Ctrl+S）をクリック
5. 右上の **「デプロイ」→「新しいデプロイ」** をクリック
6. 歯車アイコン → **「ウェブアプリ」** を選択
7. 「アクセスできるユーザー」を **「全員」** に変更
8. **「デプロイ」** をクリック → Googleアカウントで許可する
9. 表示された **URL（https://script.google.com/macros/s/〜/exec）をコピーしておく**

---

## ✅ STEP 2｜GitHubにアップロードする

1. [github.com](https://github.com) を開いてログイン（アカウントがなければ無料で作成）
2. 右上の **「+」→「New repository」** をクリック
3. Repository name: `defect-dashboard` と入力 → **「Create repository」**
4. 「uploading an existing file」のリンクをクリック
5. **このZIPを展開したフォルダの中身を全部ドラッグ&ドロップ**（`defect-app`フォルダの中の全ファイル）
6. 下の **「Commit changes」** をクリック

---

## ✅ STEP 3｜Vercelで公開する

1. [vercel.com](https://vercel.com) を開いてGitHubアカウントでログイン
2. **「Add New Project」** をクリック
3. `defect-dashboard` リポジトリを選んで **「Import」**
4. Framework: **Next.js**（自動で選ばれるはず）
5. 「Environment Variables」のところに **2つだけ** 入力する：

| 名前（Name） | 値（Value） |
|---|---|
| `DASHBOARD_PASSWORD` | 自分で決めたパスワード（例: `kenpin2024`） |
| `GAS_API_URL` | STEP1でコピーしたURL |

6. **「Deploy」** をクリック → 2〜3分で完了！
7. 表示されたURL（`https://defect-dashboard-xxx.vercel.app`）をチームに共有

---

## データの更新について

- スプレッドシートに行を追加するだけで **自動的に反映**されます
- ダッシュボードは **1分ごと** に自動更新
- 右上の「↺ 更新」ボタンで即時反映も可能

## パスワードを変えたい場合

Vercel の設定画面 → Environment Variables → `DASHBOARD_PASSWORD` を変更 → Redeploy

## よくある質問

**Q. シート名が「シート1」じゃない**
→ STEP1のコードの `'シート1'` の部分を実際のシート名に変更してください

**Q. データが表示されない**
→ GAS のデプロイをやり直して（「新しいデプロイ」）URLを更新してください

**Q. ログインできない**
→ Vercel の `DASHBOARD_PASSWORD` の値を確認してください
