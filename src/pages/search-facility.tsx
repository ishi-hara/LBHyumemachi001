// 施設名検索画面
import type { FC } from 'hono/jsx'
import { Navigation } from '../components/Navigation'

// インラインスクリプト（施設検索機能）
const inlineScript = `
(function() {
  // スポットデータ - 検索対象の施設
  var facilities = [
    {
      id: 'kawanishi-noseguchi',
      name: '川西能勢口前ロータリー',
      address: '〒666-0033 兵庫県川西市栄町20-1',
      lat: 34.8267,
      lng: 135.4158
    },
    {
      id: 'tada-shrine',
      name: '多田神社前猪名川渓流',
      address: '〒666-0251 兵庫県川辺郡猪名川町多田',
      lat: 34.8589,
      lng: 135.3856
    }
  ];

  var selectedFacility = null;

  // DOM要素
  var searchInput = document.getElementById('search-input');
  var searchBtn = document.getElementById('search-btn');
  var resultsContainer = document.getElementById('results-container');
  var resultsList = document.getElementById('results-list');
  var noResults = document.getElementById('no-results');
  var nextBtn = document.getElementById('next-btn');

  // 選択状態の更新
  function updateSelection() {
    nextBtn.disabled = !selectedFacility;
  }

  // 検索結果を表示
  function displayResults(results) {
    resultsList.innerHTML = '';
    
    if (results.length === 0) {
      resultsContainer.classList.remove('hidden');
      resultsList.classList.add('hidden');
      noResults.classList.remove('hidden');
      return;
    }

    noResults.classList.add('hidden');
    resultsList.classList.remove('hidden');
    resultsContainer.classList.remove('hidden');

    results.forEach(function(facility) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'facility-btn w-full py-3 px-4 bg-white rounded-xl shadow-md text-gray-700 text-left hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 border-transparent flex items-start gap-3';
      btn.dataset.facilityId = facility.id;
      
      btn.innerHTML = 
        '<span class="text-purple-400 mt-1">◯</span>' +
        '<div>' +
          '<p class="font-medium">' + facility.name + '</p>' +
          '<p class="text-sm text-gray-500">' + facility.address + '</p>' +
        '</div>';

      btn.addEventListener('click', function() {
        // 他のボタンの選択を解除
        var allBtns = document.querySelectorAll('.facility-btn');
        allBtns.forEach(function(b) {
          b.classList.remove('border-purple-500', 'bg-purple-50');
          b.classList.add('border-transparent', 'bg-white');
          b.querySelector('span').textContent = '◯';
          b.querySelector('span').classList.remove('text-purple-600');
          b.querySelector('span').classList.add('text-purple-400');
        });

        // このボタンを選択状態に
        this.classList.add('border-purple-500', 'bg-purple-50');
        this.classList.remove('border-transparent', 'bg-white');
        this.querySelector('span').textContent = '●';
        this.querySelector('span').classList.add('text-purple-600');
        this.querySelector('span').classList.remove('text-purple-400');

        // 選択されたfacilityを保存
        selectedFacility = facility;
        updateSelection();
      });

      resultsList.appendChild(btn);
    });
  }

  // 部分一致検索
  function searchFacilities(query) {
    if (!query || query.trim() === '') {
      return facilities; // 空の場合は全て表示
    }
    
    var lowerQuery = query.toLowerCase();
    return facilities.filter(function(f) {
      return f.name.toLowerCase().indexOf(lowerQuery) !== -1 ||
             f.address.toLowerCase().indexOf(lowerQuery) !== -1;
    });
  }

  // 検索ボタンのクリック処理
  searchBtn.addEventListener('click', function() {
    var query = searchInput.value;
    var results = searchFacilities(query);
    selectedFacility = null;
    updateSelection();
    displayResults(results);
  });

  // Enterキーで検索
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // 次へボタンのクリック処理
  nextBtn.addEventListener('click', function() {
    if (this.disabled || !selectedFacility) return;
    
    sessionStorage.setItem('userLocation', JSON.stringify({
      type: 'facility',
      position: { lat: selectedFacility.lat, lng: selectedFacility.lng },
      place: selectedFacility
    }));
    window.location.href = '/select-category';
  });

  // 初期状態
  updateSelection();
})();
`

export const SearchFacilityPage: FC = () => {
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
        施設名を入力してください
      </p>

      {/* 検索入力エリア */}
      <div class="flex gap-2 mb-6">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            id="search-input"
            placeholder="施設名を入力..."
            class="w-full py-3 pl-10 pr-4 bg-white rounded-xl shadow-md text-gray-700 border-2 border-transparent focus:border-purple-300 focus:outline-none"
          />
        </div>
        <button
          type="button"
          id="search-btn"
          class="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-pink-500 hover:to-purple-600 active:scale-95 transition-all duration-200"
        >
          検索
        </button>
      </div>

      {/* 検索結果エリア（初期は非表示） */}
      <div id="results-container" class="hidden flex-1 flex flex-col">
        <p class="text-sm text-gray-600 mb-3 font-medium">検索結果:</p>
        
        {/* 検索結果リスト */}
        <div id="results-list" class="flex flex-col gap-3">
          {/* JavaScriptで動的に生成 */}
        </div>

        {/* 検索結果なし */}
        <div id="no-results" class="hidden p-4 bg-white/50 rounded-xl text-center">
          <p class="text-gray-500">該当する施設が見つかりませんでした。</p>
          <p class="text-sm text-gray-400 mt-1">別のキーワードで検索してください。</p>
        </div>
      </div>

      {/* 検索前の案内 */}
      <div id="search-hint" class="flex-1 flex items-center justify-center">
        <div class="text-center text-gray-400">
          <p class="text-4xl mb-2">🏢</p>
          <p class="text-sm">施設名を入力して検索してください</p>
        </div>
      </div>

      {/* ナビゲーション */}
      <Navigation backHref="/select-location" nextDisabled={true} />

      {/* インラインJavaScript */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
