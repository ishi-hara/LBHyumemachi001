// 商業・ビジネス施設画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 商業・ビジネス施設種類データ
const commercialTypes = [
  { id: 'cafe', icon: '☕', label: 'カフェ' },
  { id: 'restaurant', icon: '🍽️', label: 'レストラン' },
  { id: 'bakery', icon: '🥖', label: 'ベーカリー' },
  { id: 'bookstore', icon: '📚', label: '書店' },
  { id: 'zakka', icon: '🎁', label: '雑貨店' },
  { id: 'apparel', icon: '👗', label: 'アパレルショップ' },
  { id: 'convenience', icon: '🏪', label: 'コンビニエンスストア' },
  { id: 'supermarket', icon: '🛒', label: 'スーパーマーケット' },
  { id: 'mall', icon: '🏬', label: 'ショッピングモール' },
  { id: 'office', icon: '🏢', label: 'オフィスビル' },
  { id: 'coworking', icon: '💻', label: 'コワーキングスペース' },
  { id: 'other', icon: '✏️', label: 'その他（自由記入、100文字以内）' },
]

// インラインスクリプト
const inlineScript = `
(function() {
  var selectedType = null;
  var otherText = '';

  // DOM要素
  var typeBtns = document.querySelectorAll('.type-btn');
  var nextBtn = document.getElementById('next-btn');
  var otherInput = document.getElementById('other-input');
  var otherContainer = document.getElementById('other-container');
  var charCount = document.getElementById('char-count');

  // 選択状態の更新
  function updateSelection() {
    if (selectedType === 'other') {
      nextBtn.disabled = otherText.trim().length === 0;
    } else {
      nextBtn.disabled = !selectedType;
    }
  }

  // ボタンスタイル更新
  function updateButtonStyle(btn, isSelected) {
    if (isSelected) {
      btn.classList.add('border-purple-500', 'bg-purple-50');
      btn.classList.remove('border-transparent', 'bg-white');
    } else {
      btn.classList.remove('border-purple-500', 'bg-purple-50');
      btn.classList.add('border-transparent', 'bg-white');
    }
  }

  // その他入力欄の表示/非表示
  function toggleOtherInput(show) {
    if (show) {
      otherContainer.classList.remove('hidden');
      otherInput.focus();
    } else {
      otherContainer.classList.add('hidden');
      otherInput.value = '';
      otherText = '';
      if (charCount) charCount.textContent = '0';
    }
  }

  // タイプボタンのクリック処理
  typeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var typeId = this.dataset.typeId;
      
      // 他のボタンの選択を解除
      typeBtns.forEach(function(b) {
        updateButtonStyle(b, false);
      });

      // このボタンを選択状態に
      selectedType = typeId;
      updateButtonStyle(this, true);

      // その他の場合は入力欄を表示
      toggleOtherInput(typeId === 'other');
      
      updateSelection();
    });
  });

  // その他入力欄の入力処理
  if (otherInput) {
    otherInput.addEventListener('input', function() {
      var value = this.value;
      if (value.length > 100) {
        value = value.substring(0, 100);
        this.value = value;
      }
      otherText = value;
      if (charCount) charCount.textContent = value.length;
      updateSelection();
    });
  }

  // 次へボタンのクリック処理
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (this.disabled) return;
      
      var data = {
        commercialType: selectedType
      };
      
      if (selectedType === 'other') {
        data.otherText = otherText;
      }
      
      sessionStorage.setItem('userCommercialType', JSON.stringify(data));
      
      // タイプに応じて遷移先を分岐
      switch(selectedType) {
        case 'cafe':
          window.location.href = '/select-cafe-view';
          break;
        default:
          // その他の詳細画面は準備中
          window.location.href = '/select-mode';
      }
    });
  }

  // 初期状態
  updateSelection();
})();
`

export const SelectCommercialTypePage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">商業・ビジネス施設画面</p>
      </div>

      {/* ヘッダー */}
      <div class="mb-6">
        <h1 class="text-xl font-bold text-purple-600 flex items-center gap-2">
          <span>💬</span>
          <span>ゆめキャン</span>
        </h1>
      </div>

      {/* 質問文 */}
      <p class="text-lg text-gray-700 mb-6 text-center">
        具体的にはどんな施設ですか？
      </p>

      {/* 種類選択ボタン */}
      <div class="flex flex-col gap-2 overflow-y-auto flex-1" id="type-buttons">
        {commercialTypes.map((type) => (
          <button
            type="button"
            data-type-id={type.id}
            class="type-btn w-full py-3 px-4 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent flex items-center gap-3"
          >
            <span class="text-xl">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* その他入力欄（初期は非表示） */}
      <div id="other-container" class="hidden mt-4">
        <div class="relative">
          <textarea
            id="other-input"
            placeholder="具体的な施設名を入力してください..."
            maxLength={100}
            class="w-full p-4 bg-white rounded-xl shadow-md text-gray-700 border-2 border-purple-300 focus:border-purple-500 focus:outline-none resize-none h-24"
          ></textarea>
          <p class="text-xs text-gray-400 text-right mt-1">
            <span id="char-count">0</span>/100文字
          </p>
        </div>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-building-type" nextDisabled={true} />

      {/* インラインJavaScript */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
