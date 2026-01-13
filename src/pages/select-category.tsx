// ゆめまち提案種類画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 種類選択肢データ
const categoryOptions = [
  { id: 'building', icon: '🏢', label: '建物・施設系', description: 'カフェ、学校、図書館など' },
  { id: 'space', icon: '🌳', label: '広場・空間系', description: '公園、広場、緑地など' },
  { id: 'road', icon: '🛣️', label: '道路・区間系', description: '商店街、歩行者道路、橋など' },
]

// インラインスクリプト
const inlineScript = `
(function() {
  var selectedCategory = null;

  // DOM要素
  var categoryBtns = document.querySelectorAll('.category-btn');
  var nextBtn = document.getElementById('next-btn');

  // 選択状態の更新
  function updateSelection() {
    nextBtn.disabled = !selectedCategory;
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

  // カテゴリボタンのクリック処理
  categoryBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var categoryId = this.dataset.categoryId;
      
      // 他のボタンの選択を解除
      categoryBtns.forEach(function(b) {
        updateButtonStyle(b, false);
      });

      // このボタンを選択状態に
      selectedCategory = categoryId;
      updateButtonStyle(this, true);
      updateSelection();
    });
  });

  // 次へボタンのクリック処理
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (this.disabled || !selectedCategory) return;
      
      sessionStorage.setItem('userCategory', JSON.stringify({
        category: selectedCategory
      }));
      window.location.href = '/select-mode';
    });
  }

  // 初期状態
  updateSelection();
})();
`

export const SelectCategoryPage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">ゆめまち提案種類画面</p>
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
        どんな種類の「ゆめまち」を創りたいですか？
      </p>

      {/* 種類選択ボタン */}
      <div class="flex flex-col gap-4" id="category-buttons">
        {categoryOptions.map((option) => (
          <button
            type="button"
            data-category-id={option.id}
            class="category-btn w-full py-5 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent"
          >
            <div class="flex items-center gap-4">
              <span class="text-3xl">{option.icon}</span>
              <div>
                <p class="font-bold text-lg">{option.label}</p>
                <p class="text-sm text-gray-500">（{option.description}）</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* スペーサー */}
      <div class="flex-1"></div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-location" nextDisabled={true} />

      {/* インラインJavaScript */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
