import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

export const DreamerInputPage: FC = () => {
  const inlineScript = `
    document.addEventListener('DOMContentLoaded', function() {
      var dreamInput = document.getElementById('dream-input');
      var charCount = document.getElementById('char-count');
      var nextBtn = document.getElementById('next-btn');
      var facilityNameEl = document.getElementById('facility-name');
      var viewTypeEl = document.getElementById('view-type');

      // 商業・ビジネス施設の選択情報を取得
      var commercialTypeLabels = {
        'cafe': 'カフェ',
        'restaurant': 'レストラン',
        'bakery': 'ベーカリー',
        'bookstore': '書店',
        'zakka': '雑貨店',
        'apparel': 'アパレルショップ',
        'convenience': 'コンビニエンスストア',
        'supermarket': 'スーパーマーケット',
        'mall': 'ショッピングモール',
        'office': 'オフィスビル',
        'coworking': 'コワーキングスペース'
      };

      // 外観/内観のラベル
      var viewTypeLabels = {
        'exterior': '外観',
        'interior': '内観',
        'both': '両方'
      };

      // sessionStorageから値を取得して表示を更新
      function updateDynamicText() {
        var facilityName = 'カフェ'; // デフォルト値
        var viewType = '外観'; // デフォルト値

        // 商業・ビジネス施設の選択を取得
        var commercialData = sessionStorage.getItem('userCommercialType');
        if (commercialData) {
          var parsed = JSON.parse(commercialData);
          if (parsed.commercialType === 'other' && parsed.otherText) {
            facilityName = parsed.otherText;
          } else if (commercialTypeLabels[parsed.commercialType]) {
            facilityName = commercialTypeLabels[parsed.commercialType];
          }
        }

        // 外観/内観の選択を取得
        var viewData = sessionStorage.getItem('userCafeView');
        if (viewData) {
          var parsedView = JSON.parse(viewData);
          if (viewTypeLabels[parsedView.cafeView]) {
            viewType = viewTypeLabels[parsedView.cafeView];
          }
        }

        // 表示を更新
        if (facilityNameEl) facilityNameEl.textContent = facilityName;
        if (viewTypeEl) viewTypeEl.textContent = viewType;
      }

      // 動的テキストを更新
      updateDynamicText();

      function updateCharCount() {
        var length = dreamInput.value.length;
        charCount.textContent = length;
        
        // 100文字を超えた場合は切り詰め
        if (length > 100) {
          dreamInput.value = dreamInput.value.substring(0, 100);
          charCount.textContent = 100;
          length = 100;
        }
        
        // 文字数に応じて色を変更
        if (length >= 90) {
          charCount.classList.add('text-red-500');
          charCount.classList.remove('text-gray-500');
        } else {
          charCount.classList.remove('text-red-500');
          charCount.classList.add('text-gray-500');
        }
        
        // 入力がある場合のみ「次へ」を有効化
        if (dreamInput.value.trim().length > 0) {
          nextBtn.disabled = false;
          nextBtn.classList.remove('bg-gray-300', 'text-gray-500', 'opacity-50');
          nextBtn.classList.add('bg-gradient-to-r', 'from-pink-400', 'to-purple-400', 'text-white');
        } else {
          nextBtn.disabled = true;
          nextBtn.classList.add('bg-gray-300', 'text-gray-500', 'opacity-50');
          nextBtn.classList.remove('bg-gradient-to-r', 'from-pink-400', 'to-purple-400', 'text-white');
        }
      }

      dreamInput.addEventListener('input', updateCharCount);

      nextBtn.addEventListener('click', function() {
        if (!nextBtn.disabled) {
          sessionStorage.setItem('userDream', JSON.stringify({ 
            dream: dreamInput.value.trim(),
            mode: 'dreamer'
          }));
          // 遷移先は別途指示（現時点は仮のパス）
          window.location.href = '/generate-result';
        }
      });

      // 初期状態を設定
      updateCharCount();
    });
  `;

  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
      {/* 画面名（右上） */}
      <div class="absolute top-2 right-2 text-xs text-gray-400">
        お任せドリーマー選択画面
      </div>

      <div class="p-4 pb-24">
        {/* ヘッダー */}
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <span>💬</span>
            <span>ゆめキャン</span>
          </h1>
        </div>

        {/* 説明文 */}
        <div class="bg-white rounded-xl shadow-md p-4 mb-6">
          <p class="text-lg text-gray-700 leading-relaxed">
            あなたの夢の<span id="facility-name" class="font-bold text-purple-600">カフェ</span>（<span id="view-type" class="font-bold text-purple-600">外観</span>）について、<br />
            自由に教えてください！<span class="text-xl">✨</span>
          </p>
          <p class="text-sm text-gray-500 mt-3">
            どんな雰囲気？どんな色？どんな形？<br />
            何でも大丈夫です！
          </p>
        </div>

        {/* 入力エリア */}
        <div class="bg-white rounded-xl shadow-md p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">👤</span>
            <span class="text-gray-700 font-bold">ユーザー入力欄</span>
            <span class="text-sm text-gray-500">（100文字以内）</span>
          </div>
          
          <textarea
            id="dream-input"
            class="w-full h-32 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none resize-none text-gray-700"
            placeholder="ここに自由に入力してください..."
            maxlength={100}
          ></textarea>
          
          <div class="flex justify-end mt-2">
            <span class="text-sm">
              <span id="char-count" class="text-gray-500">0</span>
              <span class="text-gray-400">/100</span>
            </span>
          </div>

          {/* 例文 */}
          <div class="mt-4 p-3 bg-purple-50 rounded-lg">
            <p class="text-sm text-purple-600">
              <span class="font-bold">例:</span> 「木に囲まれた、ナチュラルで温かい雰囲気のカフェがいいな」
            </p>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-mode" nextDisabled={true} />

      {/* インラインスクリプト */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
