// 共通ナビゲーションボタン
import type { FC } from 'hono/jsx'

type NavigationProps = {
  backHref?: string      // 戻るボタンのリンク先（なければ非表示）
  nextHref?: string      // 次へボタンのリンク先（なければボタンタイプ）
  nextId?: string        // 次へボタンのID（JSで制御する場合）
  nextDisabled?: boolean // 次へボタンの無効状態
  nextLabel?: string     // 次へボタンのラベル（デフォルト: 次へ）
  backLabel?: string     // 戻るボタンのラベル（デフォルト: 戻る）
}

export const Navigation: FC<NavigationProps> = ({
  backHref,
  nextHref,
  nextId = 'next-btn',
  nextDisabled = false,
  nextLabel = '次へ',
  backLabel = '戻る',
}) => {
  return (
    <div class="mt-6 pb-4 flex gap-4">
      {/* 戻るボタン */}
      {backHref ? (
        <a
          href={backHref}
          class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md hover:shadow-lg hover:bg-gray-300 transition-all duration-300 active:scale-95 text-center"
        >
          {backLabel}
        </a>
      ) : (
        <div class="flex-1" />
      )}

      {/* 次へボタン */}
      {nextHref ? (
        <a
          href={nextHref}
          class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 text-center"
        >
          {nextLabel}
        </a>
      ) : (
        <button
          type="button"
          id={nextId}
          class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
          disabled={nextDisabled}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}
