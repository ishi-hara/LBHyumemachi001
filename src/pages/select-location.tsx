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
      <div class="flex flex-col gap-3" id="location-buttons">
        {locationOptions.map((option) => (
          <button
            type="button"
            data-location-id={option.id}
            class="location-btn w-full py-4 px-6 bg-white rounded-xl shadow-md text-gray-700 font-medium text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent flex items-center gap-3"
          >
            <span class="text-xl">{option.icon}</span>
            <span>{option.label}</span>
            {/* 現在地用のステータス表示 */}
            {option.id === 'current' && (
              <span id="gps-status" class="ml-auto text-sm text-gray-400"></span>
            )}
          </button>
        ))}
      </div>

      {/* 地図表示エリア（初期は非表示） */}
      <div id="map-container" class="hidden mt-4">
        <div id="map" class="w-full h-56 rounded-xl shadow-md z-0"></div>
      </div>

      {/* 住所選択エリア（初期は非表示） */}
      <div id="address-container" class="hidden mt-4 flex flex-col gap-3">
        <button
          type="button"
          data-address-id="kawanishi-noseguchi"
          class="address-btn w-full py-3 px-4 bg-white rounded-xl shadow-md text-gray-700 text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent"
        >
          <p class="text-sm text-purple-600 font-medium">〒666-0033</p>
          <p class="text-sm">兵庫県川西市栄町20-1</p>
          <p class="text-xs text-gray-500 mt-1">（川西能勢口前ロータリー）</p>
        </button>
        <button
          type="button"
          data-address-id="tada-shrine"
          class="address-btn w-full py-3 px-4 bg-white rounded-xl shadow-md text-gray-700 text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent"
        >
          <p class="text-sm text-purple-600 font-medium">〒666-0251</p>
          <p class="text-sm">兵庫県川辺郡猪名川町多田</p>
          <p class="text-xs text-gray-500 mt-1">（多田神社前猪名川渓流）</p>
        </button>
      </div>

      {/* 選択された場所の表示（初期は非表示） */}
      <div id="selected-place-info" class="hidden mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
        <p class="text-sm text-green-700 flex items-center gap-2">
          <span>✅</span>
          <span>選択中: <strong id="selected-place-name"></strong></span>
        </p>
      </div>

      {/* GPSエラー時のメッセージ（初期は非表示） */}
      <div id="gps-error-message" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p class="text-sm text-red-600 flex items-start gap-2">
          <span>⚠️</span>
          <span>
            スマホの位置情報を許可してください。<br />
            もしくは、現在地以外を選択してください。
          </span>
        </p>
      </div>

      {/* 注釈 */}
      <div class="mt-4 p-4 bg-white/50 rounded-xl flex-1">
        <p class="text-sm text-gray-600 flex items-start gap-2">
          <span>ℹ️</span>
          <span>
            地点情報は提案の参考となります。<br />
            実際の提案内容は様々なカテゴリーに対応できます。
          </span>
        </p>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-age" nextDisabled={true} />

      {/* JavaScript（外部ファイル） */}
      <script src="/static/select-location.js"></script>
    </div>
  )
}
