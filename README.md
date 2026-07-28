# 夥計（Hooji）官網

[hooji-site](https://chshlingit.github.io/hooji-site/) — 夥計 App 的官方網站。純靜態、無框架、無 build step；
push 到 `main` 就由 GitHub Actions 檢查並部署到 GitHub Pages。

App 本體在 [chshlingit/huoji](https://github.com/chshlingit/huoji)。

## 現在的狀態：上架前，行銷首頁未公開

App 尚未上架，因此**正式站上的首頁是「即將推出」**，不透露功能、定價與截圖。
完整的行銷首頁原封不動保留在 `home-full.html`，但**刻意不在 `deploy.yml` 的發佈清單裡**，
所以不會出現在正式站上。全站另加 `noindex` 與 `robots.txt: Disallow: /`。

**法律頁（隱私、條款、支援）維持可存取**——這是刻意的：
App Store Connect 的 Privacy Policy URL 指向 `privacy.html`，Apple 送審時會實際去點，
整站關掉會直接被退件（App Review 5.1.1）。

### 上架後恢復官網

1. `git mv home-full.html index.html`（覆蓋掉「即將推出」那版）
2. 移除各頁 `<meta name="robots" content="noindex, nofollow">`
3. `robots.txt` 改回 `Allow: /` 並還原 `Sitemap:` 那一行
4. `deploy.yml` 的發佈清單加回 `sitemap.xml`
5. `scripts/smoke.sh` 的首頁斷言改回「說一句話／Say it once」，並移除 `home-full.html` 那兩條
6. 把首頁的 App Store 按鈕換成正式連結（見下方「上線前替換」）

## 這個 repo 有什麼

```text
index.html      首頁（上架前＝「即將推出」）
home-full.html  完整行銷首頁（怎麼運作／功能／隱私／方案／FAQ）——上架前不發佈
privacy.html    隱私權政策 ← App Store Connect 的 Privacy Policy URL 填這頁
terms.html      使用條款（App 授權以 Apple 標準 EULA 為準，本頁補充訂閱與責任）
support.html    支援 ← App Store Connect 的 Support URL 填這頁
404.html        找不到頁面
style.css       全站樣式（淺色／深色由系統偏好決定）
i18n.js         繁中／英文切換 ＋ 字典
assets/         hooji-coin.svg／hooji-coin-small.svg（品牌金幣，頁面上的 inline SVG 由它們而來）、
                favicon、apple-touch-icon、OG 分享圖
scripts/        make-og.py（產生 OG 圖）、check-site.mjs（靜態檢查）、smoke.sh（瀏覽器煙霧測試）
```

## 雙語怎麼運作

網站同時服務台灣與海外市場，**繁中與英文同等重要，不可只留一種**。

- **短字串**：元素加 `data-i18n="鍵"`。行內有標籤時用 `data-i18n-html`；要改屬性（例如 `<meta content>`）時用 `data-i18n-attr="content"`。
- **長篇法律文字**：整段包在 `<div data-lang-only="zh">` / `<div data-lang-only="en">`，只顯示目前語言那一份。
- HTML 原始碼寫的是繁中（來源語言），`i18n.js` 的 `DICT` 同時提供 zh 與 en。
- 首次進站依瀏覽器語言判斷（`zh*` → 繁中，其餘 → 英文），選過之後記在 `localStorage`。
- 網址加 `?lang=en` / `?lang=zh` 可直接指定語言（優先於記住的選擇），方便從 App Store metadata
  或社群貼文直接連到指定語言版本。

**新增字串時 zh 與 en 兩邊都要加**——`scripts/check-site.mjs` 會擋下只加一邊的情況。

## 本機預覽

```bash
python3 -m http.server 8000
```

然後開 <http://localhost:8000>。直接用 `file://` 開也行，只是相對連結行為略有差異。

## 部署前檢查

```bash
node scripts/check-site.mjs   # 靜態檢查
bash scripts/smoke.sh         # headless Chrome 煙霧測試
```

- `check-site.mjs`：內部連結／資源是否存在、每個 `data-i18n` 鍵在 zh 與 en 字典都有、
  `data-lang-only` 值合法、每頁都有 i18n.js 與語言切換、`<title>` 與 viewport 齊全。
- `smoke.sh`：實際用瀏覽器載入每一頁，確認**跑完 JS 之後**語言區塊真的顯示出來、
  且沒有殘留另一種語言。靜態檢查看不到執行結果——曾經兩種語言區塊同時被隱藏、整頁空白，
  就是這支抓到的。找不到 Chrome 時會自動跳過。

CI 兩支都會先跑，沒過就不部署。

## 部署

`.github/workflows/deploy.yml`：push `main` → 靜態檢查 → 發佈到 GitHub Pages。
GitHub 上需設定 **Settings → Pages → Source: GitHub Actions**（只需設定一次）。

只有網站檔案會被發佈，`scripts/` 與 `.github/` 不會出現在正式站上。

## 品牌金幣（兩個光學尺寸）

金幣中央是**金錢符號 `$`**。標誌有兩個版本，不是兩個標誌：

| 版本 | 用在哪 | 差別 |
|---|---|---|
| `hooji-coin.svg`（大） | 手機示意圖裡的金幣按鈕（62px）、任何 ≥40px 的場合 | 外圈 ＋ 內圈刻線 ＋ `$`（s 2.30、線寬 7） |
| `hooji-coin-small.svg`（小） | 頁首（26px）、頁尾（22px）、favicon | **省略內圈**、`$` 放大加粗（s 2.55、線寬 7.6） |

小尺寸要省略內圈，是因為內圈刻線和 `$` 的筆畫在 16–26px 下會糊成一團。
唯一來源是 App 的 `Brand/HoojiCoinIcon.swift`（HuoJi repo），改幾何時三邊要一起改：
Swift、`docs/brand/*.svg`、本站的 inline SVG ＋ `assets/favicon.svg` ＋ `scripts/make-og.py`。

## 重新產生 OG 分享圖

```bash
python3 scripts/make-og.py     # 需要 Pillow
```

## 內容規則（別踩雷）

1. **只描述已經實作的功能。** 寫出還沒做好的東西會踩 App Review 2.3.1（不實描述），
   也會讓付費使用者拿不到承諾的東西。目前 Plus 賣的是：AI 一句話記帳（語音／文字）、
   Apple Watch（含 Smart Stack 卡片）、自然語言查／改／刪；免費層是手動記帳、iCloud 同步、
   刪除全部資料。**Siri 語音喚起在 1.0 全站不宣傳**（中文喚起實機失敗、App 端修不了），
   之後版本做好再加回——不要照舊文案把它補回來。
2. **隱私敘述必須與這三處一致**：App 內「設定 → 隱私說明」、
   `HuoJi/Resources/PrivacyInfo.xcprivacy`、App Store Connect 的隱私問卷。改一處就三處一起檢查。
3. **訂閱揭露**（自動續訂、期間、取消方式、試用不綁付款）不可刪減，那是 App Review 3.1.1／3.1.2 的必備項目。
4. 價格一律加註「以你的 App Store 地區顯示為準」——網站寫死 NT$ 但實際幣別由 StoreKit 決定。

## 上線前替換

- [ ] `index.html` 的 App Store 按鈕：目前是停用狀態的「App Store 準備中」，上架後換成
      `https://apps.apple.com/app/idXXXXXXXXXX` 的連結（搜尋 `TODO（上線前替換）`）。
- [ ] App 端 `HuoJi/AppConfig.swift` 的 `privacyPolicyURL` 目前指向 GitHub repo，
      要改成 `https://chshlingit.github.io/hooji-site/privacy.html`。
- [ ] App Store Connect：Privacy Policy URL 填 `privacy.html`、Support URL 填 `support.html`、
      Marketing URL 填首頁。
- [ ] 確認 `hooji.app@gmail.com` 這個信箱確實可以收信（隱私政策、支援頁、頁尾都公開了這個地址）。
- [ ] 若改用自訂網域：加 `CNAME` 檔、更新 `robots.txt` 與 `sitemap.xml` 的網址。
