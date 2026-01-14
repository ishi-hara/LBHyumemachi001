// 建物・施設系画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 建物・施設種類データ
const buildingTypes = [
  { id: 'commercial', label: '商業・ビジネス施設' },
  { id: 'public', label: '公共・文化施設' },
  { id: 'education', label: '教育施設' },
  { id: 'medical', label: '医療・福祉施設' },
  { id: 'accommodation', label: '宿泊施設' },
  { id: 'sports', label: 'スポーツ・レジャー施設' },
  { id: 'residential', label: '住宅' },
  { id: 'transportation', label: '交通施設' },
]

// インラインスクリプト
const inlineScript = `
(function() {
  var selectedType = null;

  // DOM要素
  var typeBtns = document.querySelectorAll('.type-btn');
  var nextBtn = document.getElementById('next-btn');

  // 選択状態の更新
  function updateSelection() {
    nextBtn.disabled = !selectedType;
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
      updateSelection();
    });
  });

  // 次へボタンのクリック処理
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (this.disabled || !selectedType) return;
      
      sessionStorage.setItem('userBuildingType', JSON.stringify({
        buildingType: selectedType
      }));
      
      // タイプに応じて遷移先を分岐
      switch(selectedType) {
        case 'commercial':
          window.location.href = '/select-commercial-type';
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

export const SelectBuildingTypePage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">建物・施設系画面</p>
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
        どんな建物・施設にしたいですか？
      </p>

      {/* 種類選択ボタン */}
      <div class="flex flex-col gap-3" id="type-buttons">
        {buildingTypes.map((type) => (
          <button
            type="button"
            data-type-id={type.id}
            class="type-btn w-full py-4 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent"
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* スペーサー */}
      <div class="flex-1"></div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-category" nextDisabled={true} />

      {/* インラインJavaScript */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
