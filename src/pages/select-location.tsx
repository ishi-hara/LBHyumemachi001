// 地点情報選択画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 地点選択肢データ
const locationOptions = [
  { id: 'current', icon: '📍', label: '現在地' },
  { id: 'map', icon: '🗺️', label: '地図から選ぶ' },
  { id: 'address', icon: '🏠', label: '住所から選ぶ' },
  { id: 'facility', icon: '🏢', label: '施設名から選ぶ' },
  { id: 'all', icon: '🌍', label: '全域（場所を定めない）' },
]

export const SelectLocationPage: FC = () => {
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
        どこに「ゆめまち」を創りたいですか？
      </p>

      {/* 地点選択ボタン */}
      <div class="flex flex-col gap-3 flex-1" id="location-buttons">
        {locationOptions.map((option) => (
          <button
            type="button"
            data-location-id={option.id}
            class="location-btn w-full py-4 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent flex items-center gap-3"
          >
            <span class="text-xl">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}

        {/* 注釈 */}
        <div class="mt-4 p-4 bg-white/50 rounded-xl">
          <p class="text-sm text-gray-600 flex items-start gap-2">
            <span>ℹ️</span>
            <span>
              地点情報は提案の参考となります。<br />
              実際の提案内容は様々なカテゴリーに対応できます。
            </span>
          </p>
        </div>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-age" nextDisabled={true} />

      {/* JavaScript */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          let selectedLocation = null;

          const locationBtns = document.querySelectorAll('.location-btn');
          const nextBtn = document.getElementById('next-btn');

          // 選択状態の更新
          function updateSelection() {
            nextBtn.disabled = !selectedLocation;
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

          // 地点ボタンのクリック処理
          locationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
              const locationId = this.dataset.locationId;

              // 単一選択
              locationBtns.forEach(b => updateButtonStyle(b, false));
              selectedLocation = locationId;
              updateButtonStyle(this, true);

              updateSelection();
            });
          });

          // 次へボタンのクリック処理
          nextBtn.addEventListener('click', function() {
            if (this.disabled) return;

            // 選択データを保存
            sessionStorage.setItem('userLocation', selectedLocation);

            // 次のページへ遷移
            window.location.href = '/select-category';
          });
        })();
      `}} />
    </div>
  )
}
