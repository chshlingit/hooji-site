/* 夥計官網語言切換（zh-Hant / en / ja）。
   - 短字串：元素加 data-i18n="key"（或 data-i18n-html 允許行內標籤、
     data-i18n-attr="content" 改寫屬性而非內文）。
   - 長篇法律文字：整段包在 data-lang-only="zh|en|ja"，只顯示目前語言那份。
   HTML 原始碼裡寫的是 zh-Hant（來源語言），字典同時提供 zh 以便切回來。 */

(function () {
  'use strict';

  var STORAGE_KEY = 'hooji-lang';

  var DICT = {
    zh: {
      brand: '夥計',
      brand_sub: 'Hooji', // 中文版的品牌旁註；英文版留空（否則會變成 Hooji Hooji）
      meta_title: '夥計 Hooji — AI 語音記帳，說一句話帳就記好了',
      meta_desc: '夥計是 iPhone 與 Apple Watch 上的 AI 語音記帳 App：押住金幣說一句話就完成一筆支出。帳目只存在你的裝置與 iCloud，我們不留存。',
      soon_title: '夥計 Hooji — 即將推出',
      soon_desc: '夥計（Hooji）正在準備上架，敬請期待。',
      soon_h1: '夥計 Hooji',
      soon_tag: '正在準備上架 App Store。',
      soon_note: '上架後，這裡會放上完整介紹與下載連結。',
      soon_contact: '有問題想先聊聊？寫信給我 →',
      meta_title_privacy: '隱私權政策 — 夥計 Hooji',
      meta_title_terms: '使用條款 — 夥計 Hooji',
      meta_title_support: '支援 — 夥計 Hooji',

      nav_how: '怎麼運作', nav_features: '功能', nav_privacy: '隱私',
      nav_pricing: '方案', nav_support: '支援', nav_home: '回首頁',

      hero_eyebrow: '一句話記帳 · Apple Watch',
      hero_h1: '說一句話，<br><span class="hl">帳就記好了</span>。',
      hero_tag: '押住金幣說「午餐 120」，夥計就把它整理成一筆支出，寫進你自己的裝置。沒有欄位要填、沒有分類要選、沒有帳號要註冊。',
      hero_cta1: '在 App Store 下載',
      hero_cta2: '看看怎麼運作',
      hero_note: 'iPhone 與 Apple Watch，iOS 17 以上。免費下載，7 天完整試用不必先綁付款。',
      hero_b1: '帳目只存在你的裝置與 iCloud',
      hero_b2: '自動判斷語言，夾雜著講也聽得準',
      hero_b3: '7 天試用，不必先綁付款',

      ph_title: '夥計',
      ph_bubble: '今天午餐牛肉麵 180 元',
      ph_card_title: '已記下這筆支出',
      ph_amount: '金額', ph_amount_v: 'NT$180', ph_desc: '內容', ph_desc_v: '牛肉麵',
      ph_time: '時間', ph_time_v: '今天 12:30',
      ph_hold: '押住說話 · 放開就送出',
      ph_caption: '介面示意圖',

      how_eyebrow: '怎麼運作',
      how_h2: '三個動作，一筆帳',
      how_sub: '記一筆帳不該是填表。夥計把「說出來」到「記好了」之間的每一步都拿掉。',
      s1_h: '押住金幣，說一句話',
      // 「先顯示聽到的內容，正式結果到了再換上」＝ iPhone 的兩段式顯示（VoiceInputModel
      // 的 endHoldForUpload ＋ AssistantModel 的臨時泡泡）。手錶沒有裝置端辨識，
      // 所以這句話**只能講 iPhone**。不寫任何「快幾秒」的量化宣稱（沒有實測數據）。
      s1_p: '在 iPhone 或 Apple Watch 上押住金幣說話，放開就送出——iPhone 上會先把聽到的內容顯示出來，整理好的結果到了再原地換上，不必盯著轉圈。辨識會自動判斷你講的是哪種語言，一句話裡夾雜著講也聽得準；那段錄音只用於這一次辨識，轉成文字後就丟掉。',
      s2_h: 'AI 只看到那一句話',
      s2_p: '只有那句話會送去理解成金額、內容、分類與時間。AI 看不到你的帳目、碰不到你的資料庫，也不能自己動手。',
      s3_h: '你的裝置寫下這筆帳',
      s3_p: '解析結果經過完整驗證後，由 App 寫進這台裝置，並透過你自己的 iCloud 同步到你的其他裝置。',

      feat_eyebrow: '功能',
      feat_h2: '目前做得到的事',
      feat_sub: '這裡只列已經做好、你裝上就能用的功能——沒有「即將推出」的清單。',
      tier_free: '免費',
      f1_h: '一句話記帳',
      f1_p: '說或打一句「午餐牛肉麵 180」，金額、內容、時間自動就位。缺分類就用「其他」，不會回頭問你一堆問題。',
      f2_h: 'Apple Watch 抬手就記',
      // 「從 Smart Stack 卡片點進來直接開始聽」是 Plus 的行為（錄音要 AI 權益），
      // 所以寫在這張 Plus 卡，不寫在講「看數字」的 f3（那張是免費）。
      f2_p: '錶面上押住金幣說一句，放開就送出；從 Smart Stack 卡片點進來時，App 會直接開始聽。手錶自己連網完成辨識，iPhone 不必在旁邊；沒有網路時先留在手錶上排隊，回到線上自動送出。',
      f3_h: '今天花多少，抬腕就看到',
      // **這張卡是免費層**：Smart Stack 卡片（HoojiWatchWidget）與手錶主畫面的
      // 本月／今日數字都不經過任何權益判斷（AccessLevel.isAIEnabled 只擋 AI 一句話記帳）。
      // 1.0 不宣傳 Siri 語音喚起（中文喚起實機失敗），等之後版本修好再加回。
      f3_p: '夥計的 Smart Stack 卡片把今天花了多少放在錶面上，抬腕轉一下數位錶冠就看到。打開手錶上的夥計，本月與今日的金額也在最上面——看自己的數字不必訂閱。',
      f4_h: '也能查、能改、能刪',
      // 手錶只做得到「修改／刪除」：查詢在錶上仍回 watch.searchUnsupported，
      // 所以括號那句不可以刪掉。錶上的兩段式＝iPhone 背景查候選 → 錶上確認 → 才執行。
      f4_p: '「這個月吃飯花多少？」、「把剛剛那筆改成 250」。查詢在你的裝置上跑；修改與刪除一定先讓你確認才動手。修改與刪除在 Apple Watch 上說也可以：錶上會先秀出比對到的那一筆，按下確認才執行（查詢結果仍要在 iPhone 上看）。',
      f7_h: '打開就看到現在花多少',
      // iPhone 首頁摘要卡（HomeSummaryCard）：放在 AI 權益判斷之外＝免費。
      // 「有收入才另列」對應程式的 `if income > 0`；統計分頁本身也沒有權益閘門。
      f7_p: '夥計分頁最上面常駐本月與今日的支出，打開 App 一眼就知道現在的狀況；有收入才會另外列一行。點一下就跳到統計，看分類佔比與趨勢。',
      f8_h: '手錶上核對剛剛那筆',
      // 最近記錄頁（WatchRecentListView）：資料是 iPhone 推來的最近**寫入** 10 筆，
      // 左滑刪除會先跳確認，執行交由 iPhone（sendMessage 喚背景，不必開 App，
      // 但**需要兩台裝置連得上**——這條不可省略，否則變成不實描述）。
      f8_p: '在手錶上轉一下數位錶冠，就從錄音畫面切到「最近記錄」，最近 10 筆一目了然。記錯了就左滑刪除，確認之後由 iPhone 完成——手錶和 iPhone 連得上就行，不必打開 App。',
      f5_h: '手動記帳永遠免費',
      f5_p: '不想開口、或不想訂閱，就自己新增一筆。清單、編輯、刪除完全免費，也完全離線可用。',
      f6_h: 'iCloud 同步，說刪就刪',
      f6_p: '用你自己的 iCloud 在裝置之間同步，不經過我們的伺服器。設定裡按兩下確認，就能永久刪光所有資料。',

      pri_eyebrow: '隱私',
      pri_h2: '我們看不到你的帳',
      pri_sub: '這不是承諾，是架構決定的：夥計沒有帳號系統，也沒有伺服器資料庫，想留存也無處可留。',
      pri1_h: '錄音用完就丟',
      // 「只用裝置端辨識」不是無條件的選項：Apple 的離線辨識只涵蓋部分語言
      // （App 內 settings.voice.footer 講得很清楚），網站不可以講成人人可用。
      pri1_p: '那段錄音只用於當次辨識，轉成文字後就丟掉，中繼服務不寫入任何儲存。iPhone 上可在「設定 → 語音辨識」改成只用裝置端辨識，錄音就完全不離開手機（限 Apple 離線辨識支援的語言）。',
      pri2_h: '帳目不離開你的裝置',
      pri2_p: '支出存在裝置本機，並透過你自己的 iCloud 帳號在你的裝置之間同步。我們沒有你的帳目副本。',
      pri3_h: 'AI 只拿到那一句話',
      pri3_p: '送去解析的只有你說（或打）的那一句話，不含你的任何歷史帳目。中繼服務不保存內容，解析端也關閉了對話保存。',
      fl1: '你的那一句話（語音或文字）', fl2: '中繼（無狀態、不保存）',
      fl3: 'AI 解析（關閉對話保存）', fl4: '結構化結果寫回你的裝置',
      pri_link: '閱讀完整隱私權政策 →',

      pr_eyebrow: '方案',
      pr_h2: '先用 7 天，再決定',
      pr_sub: '試用不必先綁付款方式，也不會自動扣款。到期只是降級成免費層，資料一筆都不會少。',
      pr_free: '免費', pr_free_price: 'NT$0', pr_free_note: '永久免費，不需要帳號',
      pr_f1: '手動記帳無限，離線可用',
      // 免費也看得到自己的數字：iPhone 首頁摘要卡、統計分頁、手錶主畫面與
      // Smart Stack 卡片、手錶最近記錄頁，全都不經權益判斷。
      pr_f5: '本月／今日與最近記錄隨時看得到',
      pr_f2: 'iCloud 跨裝置同步',
      pr_f3: '隨時永久刪除全部資料',
      pr_f4: 'AI 一句話記帳（試用期後關閉）',
      pr_plus: '夥計 Plus', pr_badge: '7 天試用',
      // 價格依語言不同：中文版面對台灣 App Store（台幣），英文版面對美國 App Store（美元）。
      // 幣別在頁面上是硬寫的字，不是自動換算——改價格時 pr_free_price／pr_monthly_price／pr_yearly 三個鍵要一起改。
      pr_monthly_price: 'NT$60',
      pr_permonth: '/ 月',
      pr_yearly: '或 NT$490 / 年（約 NT$41 / 月）',
      pr_p1: '免費方案的一切',
      pr_p2: 'AI 一句話記帳（語音與文字）',
      pr_p3: 'Apple Watch 記帳，並用一句話修改、刪除',
      pr_p5: '用一句話查詢、修改、刪除',
      pr_trial: '<strong>試用怎麼算：</strong>第一次安裝後 7 天內是完整的 Plus，不必先綁付款方式、不會自動扣款、也不用取消。到期後 AI 記帳關閉，其餘功能與全部資料留著，想要再訂閱。',
      pr_price_note: '實際價格與幣別以你的 App Store 地區顯示為準。訂閱為自動續訂，於每期結束前 24 小時內扣款，可隨時在 App Store 帳號設定取消。',

      faq_eyebrow: '常見問題',
      faq_h2: '你可能想先問的',
      q1: '沒有網路可以用嗎？',
      a1: '手動記帳、瀏覽與編輯完全離線可用。AI 一句話記帳需要連線——那句話必須送出去才能被理解。',
      q2: '試用到期會自動扣款嗎？',
      a2: '不會。試用完全不需要付款方式，到期直接降級成免費層，不必記得取消。',
      q3: '我的帳目會被上傳嗎？',
      a3: '不會。離開裝置的只有你當次說的那一句話——語音記帳時是那段短錄音，辨識完就丟。金額、商家、分類這些紀錄只存在你的裝置與你自己的 iCloud。',
      q4: '支援哪些裝置？',
      // 記帳與「修改／刪除」的條件不同，不可混為一談：記帳只要手錶連得上網路
      //（iPhone 不在範圍內時結果會排進背景佇列補上），但修改／刪除是互動流程、
      // 不排隊，需要 sendMessage 當下就到得了 iPhone。
      a4: 'iPhone（iOS 17 以上）與 Apple Watch（watchOS 10 以上）。手錶記帳只需要手錶能連上網路，iPhone 不必在旁邊；用語音修改、刪除，或在手錶上刪掉某一筆，則需要手錶和 iPhone 連得上（iPhone 不必打開 App）。',
      q5: '支援哪些語言？',
      a5: '介面提供繁體中文、英文與日文。語音辨識會自動判斷你講的是哪種語言，夾雜多種語言也聽得準；AI 解析看得懂日常說法，例如「午餐 120」「lunch 120」或「ランチ 980円」。',
      q6: '換手機資料會不見嗎？',
      a6: '只要登入同一個 iCloud 帳號，資料會自動同步到新裝置。因為沒有帳號系統，也就沒有密碼可以忘記。',
      q7: '要怎麼取消訂閱？',
      a7: '在 App 內「設定 → 管理訂閱」，或 iPhone 的「設定 → 你的名字 → 訂閱項目」。取消後仍可使用到當期結束。',

      foot_privacy: '隱私權政策', foot_terms: '使用條款',
      foot_support: '支援', foot_contact: '聯絡我們',
      foot_copy: '© 2026 夥計 Hooji · 台灣製造',
      back_home: '← 回首頁'
    },

    en: {
      brand: 'Hooji',
      brand_sub: '',
      meta_title: 'Hooji — AI Voice Expense Tracker. Say it once. It is logged.',
      meta_desc: 'Hooji is an AI voice expense tracker for iPhone and Apple Watch: hold the coin, say one sentence, and the expense is logged. Your expenses stay on your device and in your own iCloud — we never keep a copy.',
      soon_title: 'Hooji — Coming soon',
      soon_desc: 'Hooji is getting ready for the App Store.',
      soon_h1: 'Hooji',
      soon_tag: 'Getting ready for the App Store.',
      soon_note: 'Once it launches, the full story and a download link land here.',
      soon_contact: 'Questions in the meantime? Email me →',
      meta_title_privacy: 'Privacy Policy — Hooji',
      meta_title_terms: 'Terms of Use — Hooji',
      meta_title_support: 'Support — Hooji',

      nav_how: 'How it works', nav_features: 'Features', nav_privacy: 'Privacy',
      nav_pricing: 'Pricing', nav_support: 'Support', nav_home: 'Home',

      hero_eyebrow: 'One sentence · Apple Watch',
      hero_h1: 'Say it once.<br>It is <span class="hl">logged</span>.',
      hero_tag: 'Hold the coin and say “lunch $12”. Hooji turns it into an expense and writes it to your own device. No form to fill in, no category to pick, no account to create.',
      hero_cta1: 'Download on the App Store',
      hero_cta2: 'See how it works',
      hero_note: 'For iPhone and Apple Watch, iOS 17 or later. Free to download, with a full 7-day trial and no payment details up front.',
      hero_b1: 'Expenses stay on your device and iCloud',
      hero_b2: 'Detects your language on its own, mixed or not',
      hero_b3: '7-day trial, no payment details up front',

      ph_title: 'Assistant',
      ph_bubble: 'lunch beef noodles $12',
      ph_card_title: 'Expense logged',
      // 示意圖的金額也要換幣別：英文站的讀者不該在畫面裡看到 NT$。
      ph_amount: 'Amount', ph_amount_v: '$12', ph_desc: 'Description', ph_desc_v: 'Beef noodles',
      ph_time: 'Time', ph_time_v: 'Today 12:30',
      ph_hold: 'Hold to talk · release to send',
      ph_caption: 'Interface illustration',

      how_eyebrow: 'How it works',
      how_h2: 'Three moves, one expense',
      how_sub: 'Logging an expense should not be filling in a form. Hooji removes every step between saying it and having it logged.',
      s1_h: 'Hold the coin and speak',
      s1_p: 'Hold the coin on your iPhone or Apple Watch, say one sentence, release to send — on iPhone what it heard shows up straight away and is swapped in place once the tidied-up result lands, so you are never left watching a spinner. Transcription works out which language you spoke on its own, so switching mid-sentence still comes out right. The recording is used for that one transcription and then thrown away.',
      s2_h: 'The AI only sees that sentence',
      s2_p: 'Only that sentence is sent to be understood as an amount, a description, a category and a time. The AI never sees your expenses, never touches your database, and cannot act on its own.',
      s3_h: 'Your device writes it down',
      s3_p: 'The parsed result is fully re-validated, then written by the app to this device and synced to your other devices through your own iCloud.',

      feat_eyebrow: 'Features',
      feat_h2: 'What it does today',
      feat_sub: 'Only what is already built and works the moment you install it — no “coming soon” list.',
      tier_free: 'Free',
      f1_h: 'One sentence, one expense',
      f1_p: 'Say or type “lunch beef noodles $12” and the amount, description and time fall into place. Missing category defaults to “Other” — you are never interrogated.',
      f2_h: 'Log from your wrist',
      f2_p: 'Hold the coin on your watch, say it, release. Open it from the Smart Stack card and the app is already listening. The watch goes online by itself — your iPhone does not have to be nearby. With no connection it queues on the watch and sends itself once you are back online.',
      f3_h: 'Today at a glance, on your wrist',
      f3_p: 'The Hooji card in the Smart Stack shows what you have spent today — raise your wrist, turn the Digital Crown, and it is right there. Open Hooji on the watch and this month and today sit at the top of the screen. Looking at your own numbers never needs a subscription.',
      f4_h: 'Search, edit and delete too',
      f4_p: '“How much did I spend on food this month?” or “change that last one to 250”. Searches run on your device; edits and deletions always ask you to confirm first. Editing and deleting work from your Apple Watch too: it shows you the entry it matched, and nothing happens until you tap confirm. (Search results are still read on the iPhone.)',
      f7_h: 'Open it, see where you are',
      f7_p: 'This month and today sit at the top of the Assistant tab, so you know where you stand the moment you open Hooji; income only gets a line of its own when there is some. Tap it to jump to the statistics.',
      f8_h: 'Check the last few from your wrist',
      f8_p: 'Turn the Digital Crown on your watch and the recording screen gives way to Recent — the last 10 entries at a glance. Got one wrong? Swipe to delete, confirm, and your iPhone does the rest. It only has to be within reach, not open.',
      f5_h: 'Manual logging stays free',
      f5_p: 'Do not feel like talking, or do not want a subscription? Add it yourself. Listing, editing and deleting are free forever and work fully offline.',
      f6_h: 'iCloud sync, and a real delete',
      f6_p: 'Syncs between your devices through your own iCloud, never through our servers. Two confirmations in Settings permanently erases everything.',

      pri_eyebrow: 'Privacy',
      pri_h2: 'We cannot see your expenses',
      pri_sub: 'That is not a promise, it is the architecture: Hooji has no accounts and no server database, so there is nowhere for your data to be kept.',
      pri1_h: 'The recording is thrown away after use',
      pri1_p: 'The recording is used for that one transcription and then discarded; our relay writes it to no storage at all. On iPhone you can switch to on-device recognition only under Settings → Speech recognition, and then the audio never leaves your phone — for the languages Apple covers offline.',
      pri2_h: 'Your expenses stay on your device',
      pri2_p: 'Expenses live in local storage and sync between your devices through your own iCloud account. We hold no copy of them.',
      pri3_h: 'The AI only gets that one sentence',
      pri3_p: 'Only the sentence you said or typed is sent for parsing — never your expense history. Our relay stores nothing, and conversation storage is disabled on the parsing side.',
      fl1: 'Your one sentence (voice or text)', fl2: 'Relay (stateless, stores nothing)',
      fl3: 'AI parsing (storage disabled)', fl4: 'Structured result back to your device',
      pri_link: 'Read the full privacy policy →',

      pr_eyebrow: 'Pricing',
      pr_h2: 'Try it for 7 days first',
      pr_sub: 'The trial needs no payment details and never charges you. When it ends you simply drop to the free tier — not a single expense is lost.',
      pr_free: 'Free', pr_free_price: '$0', pr_free_note: 'Free forever, no account needed',
      pr_f1: 'Unlimited manual logging, works offline',
      pr_f5: 'See this month, today and your recent entries any time',
      pr_f2: 'iCloud sync across your devices',
      pr_f3: 'Permanently delete everything, any time',
      pr_f4: 'AI one-sentence logging (off after the trial)',
      pr_plus: 'Hooji Plus', pr_badge: '7-day trial',
      // 英文版標示美國 App Store 價格（US$1.99／US$14.99）；台幣價格只出現在中文版。
      // 其他市場（例如日本 ¥500／¥4,000）靠 pr_price_note 的「以你的 App Store 地區顯示為準」涵蓋。
      pr_monthly_price: '$1.99',
      pr_permonth: '/ month',
      pr_yearly: 'or $14.99 / year (about $1.25 / month)',
      pr_p1: 'Everything in Free',
      pr_p2: 'AI one-sentence logging (voice and text)',
      pr_p3: 'Logging from Apple Watch, plus voice edits and deletes',
      pr_p5: 'Search, edit and delete by sentence',
      pr_trial: '<strong>How the trial works:</strong> the first 7 days after you install are full Plus — no payment details, no automatic charge, nothing to cancel. When it ends, AI logging switches off; everything else and all of your data stays. Subscribe when you want it back.',
      pr_price_note: 'Actual price and currency are whatever your App Store region shows. Subscriptions renew automatically and are billed within 24 hours before each period ends; cancel any time in your App Store account settings.',

      faq_eyebrow: 'FAQ',
      faq_h2: 'Things you probably want to ask',
      q1: 'Does it work without an internet connection?',
      a1: 'Manual logging, browsing and editing work fully offline. AI one-sentence logging needs a connection — the sentence has to be sent somewhere to be understood.',
      q2: 'Will the trial charge me when it ends?',
      a2: 'No. The trial needs no payment method at all; when it ends you simply drop to the free tier. There is nothing to remember to cancel.',
      q3: 'Are my expenses uploaded anywhere?',
      a3: 'No. The only thing that leaves your device is the one sentence you said or typed — for voice logging that is the short recording of it, discarded once transcribed. Amounts, merchants and categories exist only on your device and in your own iCloud.',
      q4: 'Which devices are supported?',
      a4: 'iPhone (iOS 17 or later) and Apple Watch (watchOS 10 or later). Logging from the watch only needs the watch to be online — your iPhone does not have to be nearby. Editing or deleting from the watch does need the two to be in reach of each other, though your iPhone does not have to be open.',
      q5: 'Which languages are supported?',
      a5: 'The interface is available in English, Traditional Chinese and Japanese. Transcription detects the language you spoke automatically and handles switching between languages mid-sentence; the AI understands everyday phrasing in each, such as “lunch 120”, 「午餐 120」 or 「ランチ 980円」.',
      q6: 'Will I lose my data when I change phone?',
      a6: 'As long as you sign in with the same iCloud account your data syncs to the new device. There is no account system, so there is no password to forget.',
      q7: 'How do I cancel the subscription?',
      a7: 'In the app under Settings → Manage subscription, or in iOS Settings → your name → Subscriptions. You keep access until the end of the current period.',

      foot_privacy: 'Privacy Policy', foot_terms: 'Terms of Use',
      foot_support: 'Support', foot_contact: 'Contact',
      foot_copy: '© 2026 Hooji · Made in Taiwan',
      back_home: '← Back to home'
    },

    /* 日文（ja）。用詞基準是 App 內已定稿的 280 條日文字串
       （apps/Hooji.iOS/Hooji/Resources/Localizable.xcstrings 的 ja 值），
       不是從中文直譯——App 與網站對同一個概念用不同詞，會在 App Review
       交叉比對時被抓。已固定的幾個：
         記録（❌記帳——那是中文詞，日文指存摺記帳）／支出／収入／カテゴリ／
         デバイス（App 全篇用這個，不用「端末」）／音声認識／
         デバイス上の認識のみ／サブスクリプション／プラン／ひと言／長押し／
         App 名稱維持拉丁字母 Hooji（不音譯成片假名）。
       類別詞用「家計簿」——那是日本市場真的會被搜尋的詞，也是 App Store 名稱用的字。 */
    ja: {
      brand: 'Hooji',
      brand_sub: '', // 品牌名本身就是 Hooji，旁註留空（同英文版）
      meta_title: 'Hooji — AI音声で家計簿。ひと言で、記録完了。',
      meta_desc: 'Hooji は iPhone と Apple Watch のための AI 音声家計簿アプリ。コインを長押ししてひと言話すだけで、支出を 1 件記録します。支出データはお使いのデバイスとご自身の iCloud にのみ保存され、私たちは一切保存しません。',
      soon_title: 'Hooji — 近日公開',
      soon_desc: 'Hooji は App Store での公開を準備しています。',
      soon_h1: 'Hooji',
      soon_tag: 'App Store での公開を準備しています。',
      soon_note: '公開後、ここに詳しい紹介とダウンロードリンクを掲載します。',
      soon_contact: '公開前に聞いてみたいことがあれば、メールをどうぞ →',
      meta_title_privacy: 'プライバシーポリシー — Hooji',
      meta_title_terms: '利用規約 — Hooji',
      meta_title_support: 'サポート — Hooji',

      nav_how: '使い方', nav_features: '機能', nav_privacy: 'プライバシー',
      nav_pricing: 'プラン', nav_support: 'サポート', nav_home: 'ホーム',

      hero_eyebrow: 'ひと言で記録 · Apple Watch',
      hero_h1: 'ひと言で、<br><span class="hl">記録完了</span>。',
      hero_tag: 'コインを長押しして「ランチ 980円」と話すだけ。Hooji が 1 件の支出にまとめて、お使いのデバイスに書き込みます。フォームを埋める必要も、カテゴリを選ぶ必要も、アカウントを作る必要もありません。',
      hero_cta1: 'App Store でダウンロード',
      hero_cta2: '使い方を見る',
      hero_note: 'iPhone と Apple Watch、iOS 17 以降に対応。ダウンロードは無料、7 日間の無料トライアルにお支払い情報の登録は不要です。',
      hero_b1: '支出はデバイスと iCloud にのみ保存',
      hero_b2: '言語を自動で判別、混ざっても聞き取れます',
      hero_b3: '7 日間の無料お試し、支払い情報は不要',

      ph_title: 'Hooji',
      ph_bubble: '今日のランチ ラーメン 980円',
      ph_card_title: '支出を記録しました',
      ph_amount: '金額', ph_amount_v: '¥980', ph_desc: '内容', ph_desc_v: 'ラーメン',
      ph_time: '日時', ph_time_v: '今日 12:30',
      ph_hold: '長押しで話す · 離すと送信',
      ph_caption: '画面はイメージです',

      how_eyebrow: '使い方',
      how_h2: '3 つの動作で、1 件の記録',
      how_sub: '家計簿をつけるのに、フォームを埋める必要はありません。Hooji は「話す」から「記録できた」までの手順をすべて取り除きました。',
      s1_h: 'コインを長押しして、ひと言',
      s1_p: 'iPhone か Apple Watch でコインを長押しして話し、離すと送信されます。iPhone では聞き取った内容がすぐに表示され、整理された結果が届くとその場で置き換わるので、くるくる回る表示を眺めて待つことはありません。話した言語は自動で判別するので、1 つの文に複数の言語が混ざっても正しく聞き取れます。その音声はこの一回の認識にだけ使い、文字にしたあとは破棄します。',
      s2_h: 'AI が受け取るのは、そのひと言だけ',
      s2_p: '送られるのは、金額・内容・カテゴリ・日時として読み取るための、そのひと言だけです。AI があなたの支出を見ることも、データベースに触れることも、自分で操作することもできません。',
      s3_h: '書き込むのは、あなたのデバイス',
      s3_p: '読み取った結果をすべて検証し直したうえで、アプリがこのデバイスに書き込み、ご自身の iCloud を通じて他のデバイスに同期します。',

      feat_eyebrow: '機能',
      feat_h2: '今できること',
      feat_sub: 'すでに動いていて、インストールした時点で使えるものだけを並べています。「近日公開」のリストはありません。',
      tier_free: '無料',
      f1_h: 'ひと言で、1 件の記録',
      f1_p: '「今日のランチ ラーメン 980円」と話すか入力するだけで、金額・内容・日時が収まります。カテゴリがわからないときは「その他」になり、あれこれ聞き返すことはありません。',
      f2_h: 'Apple Watch なら、腕を上げるだけ',
      f2_p: '手首の上でコインを長押しして、ひと言。離すと送信されます。Smart Stack のカードから開いたときは、アプリがそのまま聞き取りを始めます。Apple Watch が自分で通信して聞き取るので、iPhone が近くにある必要はありません。接続がないときは Apple Watch に保存され、オンラインに戻ると自動で送信します。',
      f3_h: 'Smart Stack に、今日の支出',
      // **このカードは無料プラン**：Smart Stack カード（HoojiWatchWidget）も
      // Apple Watch のホームの今月／今日も、権限の判定を通りません
      //（AccessLevel.isAIEnabled が止めるのは AI のひと言記録だけ）。
      f3_p: 'Smart Stack の Hooji カードに、今日いくら使ったかが表示されます。腕を上げて Digital Crown を回すだけ。Apple Watch で Hooji を開けば、今月と今日の金額も画面の一番上にあります。自分の数字を見るのに、サブスクリプションは必要ありません。',
      f4_h: '調べる・変更する・削除する',
      f4_p: '「今月の食費はいくら？」「さっきのを 250 に変更」。検索はあなたのデバイス上で実行され、変更と削除は必ず先に確認します。変更と削除は Apple Watch から話しても行えます。一致した記録が Apple Watch に表示され、確定を押すまで実行されません（検索結果の確認は iPhone で行います）。',
      f7_h: '開いた瞬間に、いまの状況',
      f7_p: 'Hooji のタブの一番上に今月と今日の支出が常に表示され、アプリを開いた瞬間にいまの状況がわかります。収入は、あるときだけ別の行に表示されます。タップすると統計に移動します。',
      f8_h: 'Apple Watch で直前の記録を確認',
      f8_p: 'Apple Watch で Digital Crown を回すと、録音の画面から「最近の記録」に切り替わり、直近 10 件をひと目で確認できます。間違えたときは左にスワイプして削除し、確定すると iPhone 側で実行されます。iPhone は通信できる範囲にあれば十分で、開いておく必要はありません。',
      f5_h: '手動での記録はずっと無料',
      f5_p: '話したくないとき、サブスクリプションを使いたくないときは、自分で 1 件追加できます。一覧・編集・削除はずっと無料で、オフラインでも使えます。',
      f6_h: 'iCloud 同期と、確実な削除',
      f6_p: 'ご自身の iCloud を通じてデバイス間で同期し、私たちのサーバーは経由しません。設定で 2 回確認すると、すべてのデータを完全に削除できます。',

      pri_eyebrow: 'プライバシー',
      pri_h2: 'あなたの支出は、私たちには見えません',
      pri_sub: 'これは約束ではなく、つくりの問題です。Hooji にはアカウント機能もサーバーデータベースもないので、保存したくても保存する場所がありません。',
      pri1_h: '音声は使い終わったら破棄',
      pri1_p: '音声はその一回の認識にだけ使い、文字にしたあとは破棄します。中継サーバーはどこにも保存しません。iPhone では「設定 → 音声認識」で「デバイス上の認識のみ」に切り替えられ、音声は一切 iPhone の外に出ません（Apple がオフライン認識に対応している言語に限ります）。',
      pri2_h: '支出はデバイスから出ません',
      pri2_p: '支出はデバイス内に保存され、ご自身の iCloud アカウントを通じてあなたのデバイス間だけで同期します。私たちに複製はありません。',
      pri3_h: 'AI に届くのは、そのひと言だけ',
      pri3_p: '解析のために送られるのは、話した（または入力した）そのひと言だけで、これまでの支出は含まれません。中継サーバーは内容を保存せず、解析側でも会話の保存を無効にしています。',
      fl1: 'あなたのひと言（音声または文字）', fl2: '中継（ステートレス・保存なし）',
      fl3: 'AI 解析（会話の保存は無効）', fl4: '構造化された結果をデバイスへ',
      pri_link: 'プライバシーポリシー全文を読む →',

      pr_eyebrow: 'プラン',
      pr_h2: 'まず 7 日間、試してから',
      pr_sub: 'お試しに支払い情報の登録は不要で、課金されることもありません。期間が終わっても無料プランに切り替わるだけで、記録は 1 件も失われません。',
      pr_free: '無料', pr_free_price: '¥0', pr_free_note: 'ずっと無料、アカウント不要',
      pr_f1: '手動での記録は無制限、オフラインでも',
      pr_f5: '今月・今日・最近の記録をいつでも確認',
      pr_f2: 'デバイス間の iCloud 同期',
      pr_f3: 'すべてのデータをいつでも完全に削除',
      pr_f4: 'AI のひと言記録（お試し期間の終了後はオフ）',
      pr_plus: 'Hooji Plus', pr_badge: '7 日間お試し',
      // 日本の App Store 価格。為替換算ではなく Apple の価格帯から選んだ確定値なので、
      // 米ドル・台湾ドルから計算し直さないこと。
      pr_monthly_price: '¥500',
      pr_permonth: '/ 月',
      pr_yearly: 'または年額 ¥4,000（月あたり約 ¥333）',
      pr_p1: '無料プランのすべて',
      pr_p2: 'AI のひと言記録（音声でも文字でも）',
      pr_p3: 'Apple Watch からの記録と、音声での変更・削除',
      pr_p5: 'ひと言で検索・変更・削除',
      pr_trial: '<strong>お試しの仕組み：</strong>インストールから 7 日間は Plus のすべてが使えます。支払い情報の登録は不要、自動的な課金もなく、解約の手続きもいりません。期間が終わると AI 記録はオフになりますが、それ以外の機能とすべてのデータはそのまま残ります。必要になったときに登録してください。',
      pr_price_note: '実際の価格と通貨は、お使いの App Store の地域の表示に従います。サブスクリプションは自動更新で、各期間の終了 24 時間前までに課金されます。App Store のアカウント設定からいつでも解約できます。',

      faq_eyebrow: 'よくある質問',
      faq_h2: '先に知っておきたいこと',
      q1: 'インターネットに接続していなくても使えますか？',
      a1: '手動での記録・閲覧・編集はオフラインでもすべて使えます。AI のひと言記録には接続が必要です——そのひと言を送らなければ読み取れないためです。',
      q2: 'お試し期間が終わると課金されますか？',
      a2: 'いいえ。お試しに支払い方法はまったく必要ありません。期間が終わると無料プランに切り替わるだけなので、解約を覚えておく必要もありません。',
      q3: '支出はどこかにアップロードされますか？',
      a3: 'いいえ。デバイスから出るのは、そのとき話した（または入力した）ひと言だけです。音声で記録する場合はその短い録音で、文字にしたあとは破棄します。金額・店舗・カテゴリといった記録は、お使いのデバイスとご自身の iCloud にのみ存在します。',
      q4: '対応している機種は？',
      a4: 'iPhone（iOS 17 以降）と Apple Watch（watchOS 10 以降）です。Apple Watch での記録は Apple Watch がインターネットに接続できれば十分で、iPhone が近くにある必要はありません。ただし Apple Watch から変更・削除を行うときは、2 つのデバイスが通信できる範囲にある必要があります（iPhone を開いておく必要はありません）。',
      q5: '対応している言語は？',
      a5: 'アプリの表示は日本語・繁体字中国語・英語に対応しています。音声認識は話した言語を自動で判別し、1 つの文の途中で切り替わっても聞き取れます。AI は日常的な言い方を読み取ります。たとえば「ランチ 980円」「午餐 120」「lunch 120」などです。',
      q6: '機種変更するとデータは消えますか？',
      a6: '同じ iCloud アカウントでサインインしていれば、データは新しいデバイスに自動で同期されます。アカウント機能がないので、忘れて困るパスワードもありません。',
      q7: '解約するには？',
      a7: 'アプリ内の「設定 → サブスクリプションを管理」、または iPhone の「設定 → 自分の名前 → サブスクリプション」から解約できます。解約後も、現在の期間が終わるまでは引き続き使えます。',

      foot_privacy: 'プライバシーポリシー', foot_terms: '利用規約',
      foot_support: 'サポート', foot_contact: 'お問い合わせ',
      foot_copy: '© 2026 Hooji · 台湾製',
      back_home: '← ホームに戻る'
    }
  };

  var HTML_LANG = { zh: 'zh-Hant', en: 'en', ja: 'ja' };

  function detect() {
    // ?lang=ja 可直接指定語言（分享連結、App Store metadata 指向某語言版本時用），優先於記住的選擇。
    var param = /[?&]lang=(zh|en|ja)\b/.exec(location.search);
    if (param) return param[1];
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch (e) { /* Safari 無痕模式會擋 localStorage，忽略即可 */ }
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      if (/^zh/i.test(list[i])) return 'zh';
      if (/^ja/i.test(list[i])) return 'ja';
      if (/^en/i.test(list[i])) return 'en';
    }
    return 'en';
  }

  function apply(lang) {
    var dict = DICT[lang] || DICT.en;
    document.documentElement.lang = HTML_LANG[lang] || 'en';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = dict[el.getAttribute('data-i18n')];
      if (value == null) return;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var value = dict[el.getAttribute('data-i18n-html')];
      if (value != null) el.innerHTML = value;
    });

    document.querySelectorAll('[data-lang-only]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-lang-only') === lang);
    });

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    // <title data-i18n> 在部分瀏覽器改 textContent 不一定更新分頁標題，補一刀。
    var title = document.querySelector('title[data-i18n]');
    if (title) {
      var key = title.getAttribute('data-i18n');
      if (dict[key]) document.title = dict[key];
    }
  }

  function set(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* 同上 */ }
    apply(lang);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.lang-switch button') : null;
    if (btn) set(btn.getAttribute('data-lang'));
  });

  apply(detect());
})();
