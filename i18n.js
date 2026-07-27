/* 夥計官網雙語切換（zh-Hant / en）。
   - 短字串：元素加 data-i18n="key"（或 data-i18n-html 允許行內標籤、
     data-i18n-attr="content" 改寫屬性而非內文）。
   - 長篇法律文字：整段包在 data-lang-only="zh|en"，只顯示目前語言那份。
   HTML 原始碼裡寫的是 zh-Hant（來源語言），字典同時提供 zh 以便切回來。 */

(function () {
  'use strict';

  var STORAGE_KEY = 'hooji-lang';

  var DICT = {
    zh: {
      brand: '夥計',
      brand_sub: 'Hooji', // 中文版的品牌旁註；英文版留空（否則會變成 Hooji Hooji）
      meta_title: '夥計 Hooji — 說一句話，帳就記好了',
      meta_desc: '夥計是 iPhone 與 Apple Watch 上的 AI 記帳 App：押住金幣說一句話就完成一筆支出。帳目只存在你的裝置與 iCloud，我們不留存。',
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

      hero_eyebrow: '一句話記帳 · Apple Watch · Siri',
      hero_h1: '說一句話，<br><span class="hl">帳就記好了</span>。',
      hero_tag: '押住金幣說「午餐 120」，夥計就把它整理成一筆支出，寫進你自己的裝置。沒有欄位要填、沒有分類要選、沒有帳號要註冊。',
      hero_cta1: 'App Store 準備中',
      hero_cta2: '看看怎麼運作',
      hero_note: '夥計正在開發中，上架後這裡會換成下載連結。',
      hero_b1: '帳目只存在你的裝置與 iCloud',
      hero_b2: '自動判斷語言，中英夾雜也聽得準',
      hero_b3: '7 天試用，不必先綁付款',

      ph_title: '夥計',
      ph_bubble: '今天午餐牛肉麵 180 元',
      ph_card_title: '已記下這筆支出',
      ph_amount: '金額', ph_desc: '內容', ph_desc_v: '牛肉麵',
      ph_time: '時間', ph_time_v: '今天 12:30',
      ph_hold: '押住說話 · 放開就送出',
      ph_caption: '介面示意圖',

      how_eyebrow: '怎麼運作',
      how_h2: '三個動作，一筆帳',
      how_sub: '記一筆帳不該是填表。夥計把「說出來」到「記好了」之間的每一步都拿掉。',
      s1_h: '押住金幣，說一句話',
      s1_p: '在 iPhone 或 Apple Watch 上押住金幣說話，放開就送出。辨識會自動判斷你講的是哪種語言，中英夾雜也聽得準；那段錄音只用於這一次辨識，轉成文字後就丟掉。',
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
      f2_p: '錶面上押住金幣說一句，放開就送出。手錶自己連網完成辨識，iPhone 不必在旁邊；沒有網路時先留在手錶上排隊，回到線上自動送出。',
      f3_h: 'Siri 不必打開 App',
      f3_p: '「Siri，用夥計記早餐 100 元」。正常情況下 Siri 直接回你一句「已記錄」，App 完全不用打開。',
      f4_h: '也能查、能改、能刪',
      f4_p: '「這個月吃飯花多少？」、「把剛剛那筆改成 250」。查詢在你的裝置上跑；修改與刪除一定先讓你確認才動手。',
      f5_h: '手動記帳永遠免費',
      f5_p: '不想開口、或不想訂閱，就自己新增一筆。清單、編輯、刪除完全免費，也完全離線可用。',
      f6_h: 'iCloud 同步，說刪就刪',
      f6_p: '用你自己的 iCloud 在裝置之間同步，不經過我們的伺服器。設定裡按兩下確認，就能永久刪光所有資料。',

      pri_eyebrow: '隱私',
      pri_h2: '我們看不到你的帳',
      pri_sub: '這不是承諾，是架構決定的：夥計沒有帳號系統，也沒有伺服器資料庫，想留存也無處可留。',
      pri1_h: '錄音用完就丟',
      pri1_p: '那段錄音只用於當次辨識，轉成文字後就丟掉，中繼服務不寫入任何儲存。iPhone 上可在「設定 → 語音辨識」改成只用裝置端辨識，錄音就完全不離開手機。',
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
      pr_f2: 'iCloud 跨裝置同步',
      pr_f3: '隨時永久刪除全部資料',
      pr_f4: 'AI 一句話記帳（試用期後關閉）',
      pr_plus: '夥計 Plus', pr_badge: '7 天試用',
      pr_permonth: '/ 月',
      pr_yearly: '或 NT$500 / 年（約 NT$42 / 月）',
      pr_p1: '免費方案的一切',
      pr_p2: 'AI 一句話記帳（語音與文字）',
      pr_p3: 'Apple Watch 記帳',
      pr_p4: 'Siri 記帳，不必打開 App',
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
      a4: 'iPhone（iOS 17 以上）與 Apple Watch（watchOS 10 以上）。手錶記帳只需要手錶能連上網路，iPhone 不必在旁邊。',
      q5: '支援哪些語言？',
      a5: '介面提供繁體中文與英文。語音辨識會自動判斷你講的是哪種語言，中英夾雜也聽得準；AI 解析看得懂中文與英文的日常說法，例如「午餐 120」或「lunch 120」。',
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
      meta_title: 'Hooji — Say it once. It is logged.',
      meta_desc: 'Hooji is an AI expense tracker for iPhone and Apple Watch: hold the coin, say one sentence, and the expense is logged. Your expenses stay on your device and in your own iCloud — we never keep a copy.',
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

      hero_eyebrow: 'One sentence · Apple Watch · Siri',
      hero_h1: 'Say it once.<br>It is <span class="hl">logged</span>.',
      hero_tag: 'Hold the coin and say “lunch 120”. Hooji turns it into an expense and writes it to your own device. No form to fill in, no category to pick, no account to create.',
      hero_cta1: 'Coming to the App Store',
      hero_cta2: 'See how it works',
      hero_note: 'Hooji is still in development. This button becomes a download link at launch.',
      hero_b1: 'Expenses stay on your device and iCloud',
      hero_b2: 'Detects your language on its own, mixed or not',
      hero_b3: '7-day trial, no payment details up front',

      ph_title: 'Assistant',
      ph_bubble: 'lunch beef noodles 180',
      ph_card_title: 'Expense logged',
      ph_amount: 'Amount', ph_desc: 'Description', ph_desc_v: 'Beef noodles',
      ph_time: 'Time', ph_time_v: 'Today 12:30',
      ph_hold: 'Hold to talk · release to send',
      ph_caption: 'Interface illustration',

      how_eyebrow: 'How it works',
      how_h2: 'Three moves, one expense',
      how_sub: 'Logging an expense should not be filling in a form. Hooji removes every step between saying it and having it logged.',
      s1_h: 'Hold the coin and speak',
      s1_p: 'Hold the coin on your iPhone or Apple Watch, say one sentence, release to send. Transcription works out which language you spoke on its own, so switching mid-sentence still comes out right. The recording is used for that one transcription and then thrown away.',
      s2_h: 'The AI only sees that sentence',
      s2_p: 'Only that sentence is sent to be understood as an amount, a description, a category and a time. The AI never sees your expenses, never touches your database, and cannot act on its own.',
      s3_h: 'Your device writes it down',
      s3_p: 'The parsed result is fully re-validated, then written by the app to this device and synced to your other devices through your own iCloud.',

      feat_eyebrow: 'Features',
      feat_h2: 'What it does today',
      feat_sub: 'Only what is already built and works the moment you install it — no “coming soon” list.',
      tier_free: 'Free',
      f1_h: 'One sentence, one expense',
      f1_p: 'Say or type “lunch beef noodles 180” and the amount, description and time fall into place. Missing category defaults to “Other” — you are never interrogated.',
      f2_h: 'Log from your wrist',
      f2_p: 'Hold the coin on your watch, say it, release. The watch goes online by itself — your iPhone does not have to be nearby. With no connection it queues on the watch and sends itself once you are back online.',
      f3_h: 'Siri, without opening the app',
      f3_p: '“Siri, log 100 for breakfast in Hooji.” When it works normally Siri just answers “logged” — the app never opens.',
      f4_h: 'Search, edit and delete too',
      f4_p: '“How much did I spend on food this month?” or “change that last one to 250”. Searches run on your device; edits and deletions always ask you to confirm first.',
      f5_h: 'Manual logging stays free',
      f5_p: 'Do not feel like talking, or do not want a subscription? Add it yourself. Listing, editing and deleting are free forever and work fully offline.',
      f6_h: 'iCloud sync, and a real delete',
      f6_p: 'Syncs between your devices through your own iCloud, never through our servers. Two confirmations in Settings permanently erases everything.',

      pri_eyebrow: 'Privacy',
      pri_h2: 'We cannot see your expenses',
      pri_sub: 'That is not a promise, it is the architecture: Hooji has no accounts and no server database, so there is nowhere for your data to be kept.',
      pri1_h: 'The recording is thrown away after use',
      pri1_p: 'The recording is used for that one transcription and then discarded; our relay writes it to no storage at all. On iPhone you can switch to on-device recognition only under Settings → Speech recognition, and then the audio never leaves your phone.',
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
      pr_free: 'Free', pr_free_price: 'NT$0', pr_free_note: 'Free forever, no account needed',
      pr_f1: 'Unlimited manual logging, works offline',
      pr_f2: 'iCloud sync across your devices',
      pr_f3: 'Permanently delete everything, any time',
      pr_f4: 'AI one-sentence logging (off after the trial)',
      pr_plus: 'Hooji Plus', pr_badge: '7-day trial',
      pr_permonth: '/ month',
      pr_yearly: 'or NT$500 / year (about NT$42 / month)',
      pr_p1: 'Everything in Free',
      pr_p2: 'AI one-sentence logging (voice and text)',
      pr_p3: 'Logging from Apple Watch',
      pr_p4: 'Siri logging without opening the app',
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
      a4: 'iPhone (iOS 17 or later) and Apple Watch (watchOS 10 or later). Logging from the watch only needs the watch to be online — your iPhone does not have to be nearby.',
      q5: 'Which languages are supported?',
      a5: 'The interface is available in English and Traditional Chinese. Transcription detects the language you spoke automatically and handles switching between languages mid-sentence; the AI understands everyday phrasing in both, such as “lunch 120” or 「午餐 120」.',
      q6: 'Will I lose my data when I change phone?',
      a6: 'As long as you sign in with the same iCloud account your data syncs to the new device. There is no account system, so there is no password to forget.',
      q7: 'How do I cancel the subscription?',
      a7: 'In the app under Settings → Manage subscription, or in iOS Settings → your name → Subscriptions. You keep access until the end of the current period.',

      foot_privacy: 'Privacy Policy', foot_terms: 'Terms of Use',
      foot_support: 'Support', foot_contact: 'Contact',
      foot_copy: '© 2026 Hooji · Made in Taiwan',
      back_home: '← Back to home'
    }
  };

  var HTML_LANG = { zh: 'zh-Hant', en: 'en' };

  function detect() {
    // ?lang=en 可直接指定語言（分享連結、App Store metadata 指向英文版時用），優先於記住的選擇。
    var param = /[?&]lang=(zh|en)\b/.exec(location.search);
    if (param) return param[1];
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch (e) { /* Safari 無痕模式會擋 localStorage，忽略即可 */ }
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      if (/^zh/i.test(list[i])) return 'zh';
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
