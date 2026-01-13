import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

// トップページ
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6" style="font-family: 'Zen Maru Gothic', sans-serif;">
      {/* デコレーション - 星 */}
      <div class="absolute top-10 left-8 text-4xl animate-pulse">⭐</div>
      <div class="absolute top-20 right-10 text-3xl animate-pulse" style="animation-delay: 0.5s;">✨</div>
      <div class="absolute top-40 left-16 text-2xl animate-pulse" style="animation-delay: 1s;">🌟</div>
      <div class="absolute bottom-32 right-8 text-3xl animate-pulse" style="animation-delay: 0.3s;">⭐</div>
      <div class="absolute bottom-48 left-6 text-2xl animate-pulse" style="animation-delay: 0.7s;">✨</div>

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
    </div>
  )
})

// 次のページ（プレースホルダー）
app.get('/select-age', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6" style="font-family: 'Zen Maru Gothic', sans-serif;">
      <div class="text-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">このアプリをどなたが使いますか？</p>
        <a href="/" class="mt-8 inline-block text-purple-500 underline">トップに戻る</a>
      </div>
    </div>
  )
})

export default app
