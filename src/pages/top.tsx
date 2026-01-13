// トップページ - ゆめまち☆キャンバス
import type { FC } from 'hono/jsx'

export const TopPage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6 font-maru relative">
      {/* 画面名（右端に縦書き） */}
      <div class="absolute right-1 top-1/2 transform -translate-y-1/2">
        <p class="text-xs text-gray-400 writing-mode-vertical">トップ画面</p>
      </div>

      {/* デコレーション - 星 */}
      <div class="absolute top-10 left-8 text-4xl animate-pulse">⭐</div>
      <div class="absolute top-20 right-10 text-3xl animate-pulse delay-500">✨</div>
      <div class="absolute top-40 left-16 text-2xl animate-pulse delay-1000">🌟</div>
      <div class="absolute bottom-32 right-8 text-3xl animate-pulse delay-300">⭐</div>
      <div class="absolute bottom-48 left-6 text-2xl animate-pulse delay-700">✨</div>

      {/* メインコンテンツ */}
      <div class="text-center z-10">
        {/* ロゴ・タイトル */}
        <div class="mb-8">
          <div class="text-6xl mb-4">🏘️</div>
          <h1 class="text-3xl font-bold text-purple-600 mb-2 tracking-wide">
            ゆめまち<span class="text-pink-500">☆</span>キャンバス
          </h1>
        </div>

        {/* 説明文 */}
        <p class="text-lg text-gray-600 mb-12 leading-relaxed">
          あなたの「<span class="text-purple-500 font-medium">ゆめまち</span>」を<br />
          生成します！
        </p>

        {/* スタートボタン */}
        <a 
          href="/select-age" 
          class="inline-block bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
        >
          スタート
        </a>
      </div>

      {/* 下部のデコレーション */}
      <div class="absolute bottom-8 flex gap-4 text-2xl">
        <span>🏠</span>
        <span>🌸</span>
        <span>🌈</span>
        <span>🎀</span>
        <span>🏡</span>
      </div>

      {/* 縦書き用スタイル */}
      <style dangerouslySetInnerHTML={{ __html: `
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}} />
    </div>
  )
}
