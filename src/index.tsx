// メインエントリ - ルーティング
import { Hono } from 'hono'
import { renderer } from './renderer'
import { TopPage } from './pages/top'
import { SelectAgePage } from './pages/select-age'

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

// 場所選択画面（プレースホルダー）
app.get('/select-location', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6 font-maru">
      <div class="text-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">どこに「ゆめまち」を創りたいですか？</p>
        <a href="/select-age" class="mt-8 inline-block text-purple-500 underline">戻る</a>
      </div>
    </div>
  )
})

export default app
