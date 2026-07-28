#!/usr/bin/env bash
# 瀏覽器煙霧測試：用 headless Chrome 把每一頁「跑過 JS 之後」的 DOM 抓下來檢查。
#
# 為什麼需要：check-site.mjs 只看得到原始碼，看不到 i18n.js 執行後的結果。
# 曾經發生過語言區塊兩種語言都被隱藏、整頁空白，靜態檢查完全抓不到——這支就是為了擋那個。
#
#   bash scripts/smoke.sh
#
# 找不到 Chrome 時直接跳過（回傳 0），不讓環境問題把 CI 弄紅。

set -uo pipefail
cd "$(dirname "$0")/.."

CHROME=""
for candidate in \
  google-chrome google-chrome-stable chromium-browser chromium \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  if command -v "$candidate" >/dev/null 2>&1; then CHROME="$candidate"; break; fi
  if [ -x "$candidate" ]; then CHROME="$candidate"; break; fi
done

if [ -z "$CHROME" ]; then
  echo "⚠ 找不到 Chrome，跳過煙霧測試"
  exit 0
fi

PORT=8099
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1

fails=0
check() { # check <說明> <eq|min|none> <次數> <字串> <網址>
  local label="$1" op="$2" want="$3" needle="$4" url="$5"
  local dom count ok
  dom=$("$CHROME" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=3000 \
        --dump-dom "$url" 2>/dev/null)
  count=$(printf '%s' "$dom" | grep -c -- "$needle")
  case "$op" in
    eq)   [ "$count" -eq "$want" ] && ok=1 || ok=0 ;;
    min)  [ "$count" -ge "$want" ] && ok=1 || ok=0 ;;
    none) [ "$count" -eq 0 ] && ok=1 || ok=0 ;;
    *)    ok=0 ;;
  esac
  if [ "$ok" -eq 1 ]; then
    echo "  ✓ $label"
  else
    echo "  ✗ $label（$op $want，實際 $count 次：$needle）"
    fails=$((fails + 1))
  fi
}

echo "煙霧測試（headless Chrome）"

# 每一頁在每種語言下，都必須剛好有一個語言區塊被啟用（避免整頁空白或多種語言同時出現）。
for page in privacy terms support 404; do
  for lang in zh en ja; do
    check "$page.html?lang=$lang 顯示 $lang 區塊" eq 1 \
      "data-lang-only=\"$lang\" class=\"is-active\"" \
      "http://localhost:$PORT/$page.html?lang=$lang"
  done
done

# 首頁沒有語言區塊，改驗字典確實有套用到內文——正反面都驗，才擋得住「只換一半」。
# 上架前首頁是「即將推出」；完整行銷首頁在 home-full.html（不發佈）。
check "index.html?lang=en 套用英文字串" min 1 "Getting ready for the App Store" "http://localhost:$PORT/index.html?lang=en"
check "index.html?lang=en 沒有殘留中文" none 0 "正在準備上架" "http://localhost:$PORT/index.html?lang=en"
check "index.html?lang=zh 套用中文字串" min 1 "正在準備上架" "http://localhost:$PORT/index.html?lang=zh"
check "index.html?lang=zh 沒有殘留英文" none 0 "Getting ready for the App Store" "http://localhost:$PORT/index.html?lang=zh"
check "index.html?lang=ja 套用日文字串" min 1 "公開を準備しています" "http://localhost:$PORT/index.html?lang=ja"
check "index.html?lang=ja 沒有殘留中文" none 0 "正在準備上架" "http://localhost:$PORT/index.html?lang=ja"

# 上架前的守門員：首頁絕不能洩漏定價或功能清單（那些只在 home-full.html）
check "index.html 沒有洩漏定價" none 0 "NT\$60" "http://localhost:$PORT/index.html"
check "home-full.html 仍然可用（上架後要換回去）" min 1 "說一句話" "http://localhost:$PORT/home-full.html?lang=zh"

# 三語都要真的切得動：日文版必須出現日文價格、且不殘留台幣。
check "home-full.html?lang=ja 套用日文定價" min 1 "¥500" "http://localhost:$PORT/home-full.html?lang=ja"
check "home-full.html?lang=ja 沒有殘留台幣" none 0 "NT\$" "http://localhost:$PORT/home-full.html?lang=ja"

if [ "$fails" -gt 0 ]; then
  echo "✗ 煙霧測試失敗：$fails 項"
  exit 1
fi
echo "✓ 煙霧測試通過"
