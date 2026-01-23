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
import { SelectModePage } from './pages/select-mode'
import { DreamerInputPage } from './pages/dreamer-input'
import { DreamerConfirmPage } from './pages/dreamer-confirm'
import { ImageSelectPage } from './pages/image-select'

// 環境変数の型定義
type Bindings = {
  FAL_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

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

// 生成モード選択画面
app.get('/select-mode', (c) => {
  return c.render(<SelectModePage />)
})

// お任せドリーマー選択画面
app.get('/dreamer-input', (c) => {
  return c.render(<DreamerInputPage />)
})

// お任せドリーマー生成確認画面
app.get('/dreamer-confirm', (c) => {
  return c.render(<DreamerConfirmPage />)
})

// 範囲指定画面
app.get('/image-select', (c) => {
  return c.render(<ImageSelectPage />)
})

// 画像生成API
app.post('/api/generate-image', async (c) => {
  try {
    const body = await c.req.json()
    const { dream, facilityType, viewType, maskImage, baseImage } = body

    // fal.ai APIキーを取得
    const falApiKey = c.env?.FAL_API_KEY || ''
    
    if (!falApiKey) {
      console.error('FAL_API_KEY not configured')
      return c.json({ success: false, error: 'API key not configured' }, 500)
    }

    // プロンプトを生成
    const prompt = generatePrompt(dream, facilityType, viewType)
    console.log('Generated prompt:', prompt)

    // fal.ai Inpainting APIを呼び出し
    // base64データURLをそのまま送信
    const requestBody = {
      model_name: 'stabilityai/stable-diffusion-xl-base-1.0',  // 必須パラメータ
      image_url: baseImage,  // base64 data URL
      mask_url: maskImage,   // base64 data URL
      prompt: prompt,
      negative_prompt: 'low quality, blurry, distorted, ugly, bad anatomy, deformed',
      num_inference_steps: 25,
      guidance_scale: 7.5,
      strength: 0.85
    }

    console.log('Calling fal.ai API...')
    const falResponse = await fetch('https://fal.run/fal-ai/inpaint', {
      method: 'POST',
      headers: {
        'Authorization': 'Key ' + falApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!falResponse.ok) {
      const errorText = await falResponse.text()
      console.error('fal.ai API error:', falResponse.status, errorText)
      return c.json({ success: false, error: 'Image generation failed: ' + errorText }, 500)
    }

    const falResult = await falResponse.json() as { images?: { url: string }[] }
    console.log('fal.ai response:', JSON.stringify(falResult))

    if (falResult.images && falResult.images.length > 0) {
      return c.json({ 
        success: true, 
        imageUrl: falResult.images[0].url 
      })
    } else {
      return c.json({ success: false, error: 'No image generated' }, 500)
    }

  } catch (error) {
    console.error('Generate image error:', error)
    return c.json({ success: false, error: 'Internal server error: ' + String(error) }, 500)
  }
})

// プロンプト生成関数
function generatePrompt(dream: string, facilityType: string, viewType: string): string {
  // ユーザーの夢の内容を元にプロンプトを生成
  const basePrompt = 'A beautiful ' + viewType + ' of a ' + facilityType + ' in Japan, '
  const dreamPrompt = dream ? dream + ', ' : ''
  const stylePrompt = 'high quality, detailed architecture, photorealistic, professional photography, natural lighting, urban environment'
  
  return basePrompt + dreamPrompt + stylePrompt
}

// ちょい足しアレンジャー画面（プレースホルダー）
app.get('/arranger-input', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">ちょい足しアレンジャー画面</p>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">ちょい足しアレンジャー</p>
      </div>
      <div class="mt-6 pb-4 flex gap-4">
        <a href="/select-mode" class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md text-center">戻る</a>
        <button class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg opacity-50" disabled>次へ</button>
      </div>
    </div>
  )
})

// 生成結果画面（プレースホルダー）
app.get('/generate-result', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">生成結果画面</p>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">ゆめまち生成結果</p>
      </div>
      <div class="mt-6 pb-4 flex gap-4">
        <a href="/dreamer-input" class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md text-center">戻る</a>
        <button class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg opacity-50" disabled>次へ</button>
      </div>
    </div>
  )
})

// 生成画面（プレースホルダー）
app.get('/generate', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru relative">
      {/* 画面名（右上） */}
      <div class="absolute right-2 top-2">
        <p class="text-xs text-gray-400">生成画面</p>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="text-xl text-gray-600">次のページ（準備中）</p>
        <p class="text-gray-500 mt-4">ゆめまち生成</p>
      </div>
      <div class="mt-6 pb-4 flex gap-4">
        <a href="/select-mode" class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md text-center">戻る</a>
        <button class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg opacity-50" disabled>次へ</button>
      </div>
    </div>
  )
})

export default app
