import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// 生成モードのオプションデータ
const modeOptions = [
  {
    id: 'dreamer',
    number: '①',
    icon: '🌈',
    label: 'お任せドリーマー',
    description: '自由に夢を語るだけ！（1項目）',
    target: '対象: 子ども・初めての方',
    disabled: false
  },
  {
    id: 'arranger',
    number: '②',
    icon: '✨',
    label: 'ちょい足しアレンジャー',
    description: '簡単な質問に答えるだけ！（6項目）',
    target: '対象: 気軽に楽しみたい方',
    disabled: false
  },
  {
    id: 'easy-designer',
    number: '③',
    icon: '🎨',
    label: '楽々デザイナー',
    description: 'しっかり自分好みに！（10項目）',
    target: '対象: こだわりたい初〜中級者',
    disabled: true
  },
  {
    id: 'detailed-designer',
    number: '④',
    icon: '🏆',
    label: 'こだわりデザイナー',
    description: '細部まで徹底的に！（10項目以上）',
    target: '対象: クリエイティブな中級者',
    disabled: true
  },
  {
    id: 'master-creator',
    number: '⑤',
    icon: '🥋',
    label: '黒帯クリエーター',
    description: '準備中です',
    target: '',
    disabled: true
  }
]

export const SelectModePage: FC = () => {
  const inlineScript = `
    document.addEventListener('DOMContentLoaded', function() {
      var selectedMode = null;
      var modeButtons = document.querySelectorAll('#mode-buttons button:not([disabled])');
      var nextBtn = document.getElementById('next-btn');

      function updateSelection() {
        if (selectedMode) {
          nextBtn.disabled = false;
          nextBtn.classList.remove('bg-gray-300', 'text-gray-500');
          nextBtn.classList.add('bg-gradient-to-r', 'from-pink-400', 'to-purple-400', 'text-white');
        } else {
          nextBtn.disabled = true;
          nextBtn.classList.add('bg-gray-300', 'text-gray-500');
          nextBtn.classList.remove('bg-gradient-to-r', 'from-pink-400', 'to-purple-400', 'text-white');
        }
      }

      modeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          selectedMode = btn.getAttribute('data-mode-id');
          
          // 全ボタンのスタイルをリセット
          modeButtons.forEach(function(b) {
            b.classList.remove('ring-2', 'ring-pink-400', 'bg-pink-50');
            b.classList.add('bg-white');
          });
          
          // 選択されたボタンのスタイルを変更
          btn.classList.add('ring-2', 'ring-pink-400', 'bg-pink-50');
          btn.classList.remove('bg-white');
          
          updateSelection();
        });
      });

      nextBtn.addEventListener('click', function() {
        if (!nextBtn.disabled && selectedMode) {
          sessionStorage.setItem('userMode', JSON.stringify({ mode: selectedMode }));
          // 遷移先は別途指示（現時点は仮のパス）
          window.location.href = '/generate';
        }
      });

      updateSelection();
    });
  `;

  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
      {/* 画面名（右上） */}
      <div class="absolute top-2 right-2 text-xs text-gray-400">
        生成モード選択画面
      </div>

      <div class="p-4 pb-24">
        {/* ヘッダー */}
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <span>💬</span>
            <span>ゆめキャン</span>
          </h1>
        </div>

        {/* 質問文 */}
        <div class="text-center mb-6">
          <p class="text-lg text-gray-700">
            どのモードで「ゆめまち」を創りますか？
          </p>
        </div>

        {/* モード選択ボタン群 */}
        <div id="mode-buttons" class="space-y-3">
          {modeOptions.map((option) => (
            <button
              key={option.id}
              data-mode-id={option.id}
              disabled={option.disabled}
              class={`w-full p-4 rounded-xl shadow-md text-left transition-all ${
                option.disabled 
                  ? 'bg-gray-200 opacity-60 cursor-not-allowed' 
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div class="flex items-start gap-3">
                <span class="text-2xl">{option.icon}</span>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">{option.number}</span>
                    <span class={`font-bold ${option.disabled ? 'text-gray-500' : 'text-purple-600'}`}>
                      {option.label}
                    </span>
                    {option.disabled && (
                      <span class="text-xs bg-gray-400 text-white px-2 py-0.5 rounded">
                        準備中
                      </span>
                    )}
                  </div>
                  <p class={`text-sm mt-1 ${option.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                  {option.target && (
                    <p class={`text-xs mt-1 ${option.disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                      {option.target}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-cafe-view" nextDisabled={true} />

      {/* インラインスクリプト */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
