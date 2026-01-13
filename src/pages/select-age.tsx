// ユーザ情報画面 - 年齢層選択
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 年齢層データ
const ageGroups = [
  { id: 'child', label: 'こども（-12才）' },
  { id: 'teen', label: 'ティーン（13-19才）' },
  { id: 'young', label: '若年層（20-34才）' },
  { id: 'middle', label: '壮年層（35-49才）' },
  { id: 'mature', label: '中年層（50-64才）' },
  { id: 'senior', label: '高年層（65-74才）' },
  { id: 'elderly', label: '老年層（75才-）' },
]

export const SelectAgePage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru">
      {/* ヘッダー */}
      <div class="mb-6">
        <h1 class="text-xl font-bold text-purple-600 flex items-center gap-2">
          <span>💬</span>
          <span>ゆめキャン</span>
        </h1>
      </div>

      {/* 質問文 */}
      <p class="text-lg text-gray-700 mb-6 text-center">
        このアプリをどなたが使いますか？
      </p>

      {/* 年齢層選択ボタン */}
      <div class="flex flex-col gap-3 flex-1" id="age-buttons">
        {ageGroups.map((group) => (
          <button
            type="button"
            data-age-id={group.id}
            class="age-btn w-full py-4 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent"
          >
            {group.label}
          </button>
        ))}

        {/* 家族みんなで */}
        <button
          type="button"
          id="family-btn"
          class="w-full py-4 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-pink-50 active:bg-pink-100 transition-all duration-200 border-2 border-transparent mt-2"
        >
          🏠 家族みんなで
        </button>

        {/* 注釈 */}
        <p class="text-sm text-gray-500 text-center mt-2">
          ※「家族みんなで」を選択した場合は、複数の年齢を指定できます。
        </p>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/" nextDisabled={true} />

      {/* JavaScript */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          let isFamilyMode = false;
          let selectedAges = new Set();

          const ageBtns = document.querySelectorAll('.age-btn');
          const familyBtn = document.getElementById('family-btn');
          const nextBtn = document.getElementById('next-btn');

          // 選択状態の更新
          function updateSelection() {
            const hasSelection = selectedAges.size > 0 || isFamilyMode;
            nextBtn.disabled = !hasSelection;
          }

          // ボタンの見た目を更新
          function updateButtonStyle(btn, isSelected) {
            if (isSelected) {
              btn.classList.add('border-purple-500', 'bg-purple-50');
              btn.classList.remove('border-transparent', 'bg-white');
            } else {
              btn.classList.remove('border-purple-500', 'bg-purple-50');
              btn.classList.add('border-transparent', 'bg-white');
            }
          }

          // 年齢ボタンのクリック処理
          ageBtns.forEach(btn => {
            btn.addEventListener('click', function() {
              const ageId = this.dataset.ageId;

              if (isFamilyMode) {
                // 複数選択モード
                if (selectedAges.has(ageId)) {
                  selectedAges.delete(ageId);
                  updateButtonStyle(this, false);
                } else {
                  selectedAges.add(ageId);
                  updateButtonStyle(this, true);
                }
              } else {
                // 単一選択モード
                selectedAges.clear();
                ageBtns.forEach(b => updateButtonStyle(b, false));
                selectedAges.add(ageId);
                updateButtonStyle(this, true);
              }

              updateSelection();
            });
          });

          // 家族みんなでボタンのクリック処理
          familyBtn.addEventListener('click', function() {
            isFamilyMode = !isFamilyMode;

            if (isFamilyMode) {
              // 複数選択モードに切り替え
              this.classList.add('border-pink-500', 'bg-pink-50');
              this.classList.remove('border-transparent', 'bg-white');
            } else {
              // 単一選択モードに戻す
              this.classList.remove('border-pink-500', 'bg-pink-50');
              this.classList.add('border-transparent', 'bg-white');
              // 選択をリセット
              selectedAges.clear();
              ageBtns.forEach(b => updateButtonStyle(b, false));
            }

            updateSelection();
          });

          // 次へボタンのクリック処理
          nextBtn.addEventListener('click', function() {
            if (this.disabled) return;

            // 選択データを保存
            const data = {
              familyMode: isFamilyMode,
              ages: Array.from(selectedAges)
            };
            sessionStorage.setItem('userAge', JSON.stringify(data));

            // 次のページへ遷移
            window.location.href = '/select-location';
          });
        })();
      `}} />
    </div>
  )
}
