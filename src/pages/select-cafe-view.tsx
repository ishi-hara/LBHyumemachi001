// 外観・内観選択画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// ビュー選択肢データ
const viewOptions = [
  { id: 'exterior', label: '外観' },
  { id: 'interior', label: '内観' },
  { id: 'both', label: '両方' },
]

// インラインスクリプト
const inlineScript = `
(function() {
  var selectedView = null;

  // DOM要素
  var viewBtns = document.querySelectorAll('.view-btn');
  var nextBtn = document.getElementById('next-btn');

  // 選択状態の更新
  function updateSelection() {
    nextBtn.disabled = !selectedView;
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

  // ビューボタンのクリック処理
  viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var viewId = this.dataset.viewId;
      
      // 他のボタンの選択を解除
      viewBtns.forEach(function(b) {
        updateButtonStyle(b, false);
      });

      // このボタンを選択状態に
      selectedView = viewId;
      updateButtonStyle(this, true);
      updateSelection();
    });
  });

  // 次へボタンのクリック処理
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (this.disabled || !selectedView) return;
      
      sessionStorage.setItem('userCafeView', JSON.stringify({
        cafeView: selectedView
      }));
      window.location.href = '/select-mode';
    });
  }

  // 初期状態
  updateSelection();
})();
`

export const SelectCafeViewPage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">外観・内観選択画面</p>
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
        外観と内観、両方どれを提案しますか？
      </p>

      {/* ビュー選択ボタン */}
      <div class="flex flex-col gap-4" id="view-buttons">
        {viewOptions.map((option) => (
          <button
            type="button"
            data-view-id={option.id}
            class="view-btn w-full py-5 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-center hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent text-lg"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* スペーサー */}
      <div class="flex-1"></div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-commercial-type" nextDisabled={true} />

      {/* インラインJavaScript */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
