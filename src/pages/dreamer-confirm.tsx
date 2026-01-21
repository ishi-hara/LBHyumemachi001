// お任せドリーマー生成確認画面
import type { FC } from 'hono/jsx'

export const DreamerConfirmPage: FC = () => {
  const inlineScript = `
    document.addEventListener('DOMContentLoaded', function() {
      // 年齢層のラベルマッピング
      var ageLabels = {
        'child': 'こども（-12才）',
        'teen': 'ティーン（13-19才）',
        'young': '若年層（20-34才）',
        'middle': '壮年層（35-49才）',
        'mature': '中年層（50-64才）',
        'senior': '高年層（65-74才）',
        'elderly': '老年層（75才-）'
      };

      // カテゴリのラベルマッピング
      var categoryLabels = {
        'building': '建物・施設系',
        'space': '広場・空間系',
        'road': '道路・区間系'
      };

      // 建物タイプのラベルマッピング
      var buildingTypeLabels = {
        'commercial': '商業・ビジネス施設',
        'public': '公共・文化施設',
        'education': '教育施設',
        'medical': '医療・福祉施設',
        'accommodation': '宿泊施設',
        'sports': 'スポーツ・レジャー施設',
        'residential': '住宅',
        'transportation': '交通施設'
      };

      // 商業タイプのラベルマッピング
      var commercialTypeLabels = {
        'cafe': 'カフェ',
        'restaurant': 'レストラン',
        'bakery': 'ベーカリー',
        'bookstore': '書店',
        'zakka': '雑貨店',
        'apparel': 'アパレルショップ',
        'convenience': 'コンビニエンスストア',
        'supermarket': 'スーパーマーケット',
        'mall': 'ショッピングモール',
        'office': 'オフィスビル',
        'coworking': 'コワーキングスペース'
      };

      // 外観/内観のラベルマッピング
      var viewLabels = {
        'exterior': '外観',
        'interior': '内観',
        'both': '両方'
      };

      // DOM要素
      var userInfoEl = document.getElementById('user-info');
      var locationInfoEl = document.getElementById('location-info');
      var categoryInfoEl = document.getElementById('category-info');
      var dreamInfoEl = document.getElementById('dream-info');
      var generateBtn = document.getElementById('generate-btn');

      // ユーザー情報を取得して表示
      function displayUserInfo() {
        var userData = sessionStorage.getItem('userAge');
        if (userData) {
          var parsed = JSON.parse(userData);
          var ages = parsed.ages || [];
          var labels = ages.map(function(ageId) {
            return ageLabels[ageId] || ageId;
          });
          userInfoEl.textContent = labels.join('、') || '未選択';
        } else {
          userInfoEl.textContent = '未選択';
        }
      }

      // 地点情報を取得して表示
      function displayLocationInfo() {
        var locationData = sessionStorage.getItem('userLocation');
        if (locationData) {
          var parsed = JSON.parse(locationData);
          if (parsed.place && parsed.place.address) {
            locationInfoEl.textContent = parsed.place.address;
          } else if (parsed.place && parsed.place.name) {
            locationInfoEl.textContent = parsed.place.name;
          } else if (parsed.type === 'current') {
            locationInfoEl.textContent = '現在地';
          } else if (parsed.type === 'all') {
            locationInfoEl.textContent = '全域（場所を定めない）';
          } else {
            locationInfoEl.textContent = '未選択';
          }
        } else {
          locationInfoEl.textContent = '未選択';
        }
      }

      // 提案の種類を取得して表示
      function displayCategoryInfo() {
        var parts = [];

        // カテゴリ
        var categoryData = sessionStorage.getItem('userCategory');
        if (categoryData) {
          var parsed = JSON.parse(categoryData);
          parts.push(categoryLabels[parsed.category] || parsed.category);
        }

        // 建物タイプ
        var buildingData = sessionStorage.getItem('userBuildingType');
        if (buildingData) {
          var parsed = JSON.parse(buildingData);
          parts.push(buildingTypeLabels[parsed.buildingType] || parsed.buildingType);
        }

        // 商業タイプ
        var commercialData = sessionStorage.getItem('userCommercialType');
        if (commercialData) {
          var parsed = JSON.parse(commercialData);
          if (parsed.commercialType === 'other' && parsed.otherText) {
            parts.push(parsed.otherText);
          } else {
            parts.push(commercialTypeLabels[parsed.commercialType] || parsed.commercialType);
          }
        }

        // 外観/内観
        var viewData = sessionStorage.getItem('userCafeView');
        if (viewData) {
          var parsed = JSON.parse(viewData);
          var viewLabel = viewLabels[parsed.cafeView] || parsed.cafeView;
          // 最後の要素に括弧付きで追加
          if (parts.length > 0) {
            parts[parts.length - 1] = parts[parts.length - 1] + '（' + viewLabel + '）';
          } else {
            parts.push(viewLabel);
          }
        }

        categoryInfoEl.textContent = parts.join(' > ') || '未選択';
      }

      // 夢の内容を取得して表示
      function displayDreamInfo() {
        var dreamData = sessionStorage.getItem('userDream');
        if (dreamData) {
          var parsed = JSON.parse(dreamData);
          dreamInfoEl.textContent = parsed.dream || '未入力';
        } else {
          dreamInfoEl.textContent = '未入力';
        }
      }

      // 生成ボタンのクリック処理
      if (generateBtn) {
        generateBtn.addEventListener('click', function() {
          // 範囲指定画面へ遷移
          window.location.href = '/image-select';
        });
      }

      // 表示を更新
      displayUserInfo();
      displayLocationInfo();
      displayCategoryInfo();
      displayDreamInfo();
    });
  `;

  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
      {/* 画面名（右上） */}
      <div class="absolute top-2 right-2 text-xs text-gray-400">
        お任せドリーマー生成確認画面
      </div>

      <div class="p-4 pb-24">
        {/* ヘッダー */}
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <span>💬</span>
            <span>ゆめキャン</span>
          </h1>
        </div>

        {/* 説明文 */}
        <div class="text-center mb-6">
          <p class="text-lg text-gray-700">
            あなたの「ゆめまち」を生成します！
          </p>
        </div>

        {/* 入力内容の確認 */}
        <div class="bg-white rounded-xl shadow-md p-4">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">📋</span>
            <span class="text-gray-700 font-bold">入力内容の確認</span>
          </div>

          <div class="border-t border-gray-200 pt-4 space-y-4">
            {/* ユーザー想定 */}
            <div>
              <p class="text-sm text-purple-600 font-bold mb-1">▼ ユーザー想定</p>
              <p id="user-info" class="text-gray-700 pl-4">読み込み中...</p>
            </div>

            {/* 地点情報 */}
            <div>
              <p class="text-sm text-purple-600 font-bold mb-1">▼ 地点情報</p>
              <p id="location-info" class="text-gray-700 pl-4">読み込み中...</p>
            </div>

            {/* 提案の種類 */}
            <div>
              <p class="text-sm text-purple-600 font-bold mb-1">▼ 提案の種類</p>
              <p id="category-info" class="text-gray-700 pl-4">読み込み中...</p>
            </div>

            {/* あなたの夢 */}
            <div>
              <p class="text-sm text-purple-600 font-bold mb-1">▼ あなたの夢</p>
              <p id="dream-info" class="text-gray-700 pl-4 whitespace-pre-wrap">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div class="flex gap-4">
          <a 
            href="/dreamer-input" 
            class="flex-1 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-md hover:shadow-lg hover:bg-gray-300 transition-all duration-300 active:scale-95 text-center"
          >
            戻る
          </a>
          <button 
            type="button" 
            id="generate-btn"
            class="flex-1 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            🎨 生成する！
          </button>
        </div>
      </div>

      {/* インラインスクリプト */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
