// メインエントリ - ルーティング
import { Hono } from 'hono'
import { renderer } from './renderer'
import { TopPage } from './pages/top'
import { SelectAgePage } from './pages/select-age'
import { SelectLocationPage } from './pages/select-location'
import { SearchFacilityPage } from './pages/search-facility'
import { SelectCategoryPage } from './pages/select-category'
import { SelectBuildingTypePage } from './pages/select-building-type'
import { SelectCommercialTypePage } from './pages/select-commercial-type'
import { SelectCafeViewPage } from './pages/select-cafe-view'

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

// 施設名検索画面
app.get('/search-facility', (c) => {
  return c.render(<SearchFacilityPage />)
})

// ゆめまち提案種類画面
app.get('/select-category', (c) => {
  return c.render(<SelectCategoryPage />)
})

// 建物・施設系画面
app.get('/select-building-type', (c) => {
  return c.render(<SelectBuildingTypePage />)
})

// 商業・ビジネス施設画面
app.get('/select-commercial-type', (c) => {
  return c.render(<SelectCommercialTypePage />)
})

// カフェ選択画面
app.get('/select-cafe-view', (c) => {
  return c.render(<SelectCafeViewPage />)
})

// 生成モード画面（プレースホルダー）
app.get('/select-mode', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">生成モード画面</p>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">生成モード選択</p>
      </div>
      <div class="mt-6 pb-4 flex gap-4">
        <a href="/select-category" class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md text-center">戻る</a>
        <button class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg opacity-50" disabled>次へ</button>
      </div>
    </div>
  )
})

export default app
