// メインエントリ - ルーティング
import { Hono } from 'hono'
import { renderer } from './renderer'
import { TopPage } from './pages/top'
import { SelectAgePage } from './pages/select-age'
import { SelectLocationPage } from './pages/select-location'

const app = new Hono()

app.use(renderer)

// トップページ
app.get('/', (c) => {
  return c.render(<TopPage />)
})

// ユーザ情報画面（年齢選択）
app.get('/select-age', (c) => {
  return c.render(<SelectAgePage />)
})

// 地点情報選択画面
app.get('/select-location', (c) => {
  return c.render(<SelectLocationPage />)
})

// ゆめまち提案の種類選択画面（プレースホルダー）
app.get('/select-category', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru">
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">ゆめまち提案の種類選択</p>
      </div>
      <div class="mt-6 pb-4 flex gap-4">
        <a href="/select-location" class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md text-center">戻る</a>
        <button class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg opacity-50" disabled>次へ</button>
      </div>
    </div>
  )
})

export default app
