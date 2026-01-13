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

// インラインスクリプト（全ての機能を含む）
const inlineScript = `
(function() {
  // スポットデータ - 川西市の地点情報
  var KawanishiSpots = [
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

  function findSpotById(spotId) {
    for (var i = 0; i < KawanishiSpots.length; i++) {
      if (KawanishiSpots[i].id === spotId) return KawanishiSpots[i];
    }
    return null;
  }

  // 地図ユーティリティ
  var MapUtils = (function() {
    var map = null;
    var markers = [];

    function clearMarkers() {
      markers.forEach(function(m) {
        if (map) map.removeLayer(m);
      });
      markers = [];
    }

    function destroyMap() {
      clearMarkers();
      if (map) {
        map.remove();
        map = null;
      }
    }

    function initMap(elementId, lat, lng, zoom) {
      destroyMap();
      map = L.map(elementId).setView([lat, lng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      return map;
    }

    function addMarker(lat, lng, popupText, openPopup) {
      if (!map) return null;
      var marker = L.marker([lat, lng]).addTo(map);
      if (popupText) {
        marker.bindPopup(popupText);
        if (openPopup) marker.openPopup();
      }
      markers.push(marker);
      return marker;
    }

    function addSelectableMarker(spot, callbackName) {
      if (!map) return null;
      var marker = L.marker([spot.lat, spot.lng]).addTo(map);
      marker.bindPopup(
        '<div style="text-align:center;min-width:120px;">' +
        '<b>' + spot.name + '</b><br>' +
        '<button onclick="' + callbackName + '(\\'' + spot.id + '\\')" ' +
        'style="margin-top:8px;padding:6px 12px;background:linear-gradient(to right,#f472b6,#a855f7);color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;">' +
        'ここに決める</button>' +
        '</div>'
      );
      markers.push(marker);
      return marker;
    }

    function closePopup() {
      if (map) map.closePopup();
    }

    return {
      init: initMap,
      destroy: destroyMap,
      addMarker: addMarker,
      addSelectableMarker: addSelectableMarker,
      closePopup: closePopup
    };
  })();

  // メインロジック
  var selectedLocation = null;
  var currentPosition = null;
  var selectedPlace = null;

  // DOM要素取得
  var locationBtns = document.querySelectorAll('.location-btn');
  var addressBtns = document.querySelectorAll('.address-btn');
  var nextBtn = document.getElementById('next-btn');
  var mapContainer = document.getElementById('map-container');
  var addressContainer = document.getElementById('address-container');
  var gpsStatus = document.getElementById('gps-status');
  var gpsErrorMessage = document.getElementById('gps-error-message');
  var selectedPlaceInfo = document.getElementById('selected-place-info');
  var selectedPlaceName = document.getElementById('selected-place-name');

  // 選択状態の更新
  function updateSelection() {
    if (selectedLocation === 'current') {
      nextBtn.disabled = !currentPosition;
    } else if (selectedLocation === 'map' || selectedLocation === 'address') {
      nextBtn.disabled = !selectedPlace;
    } else {
      nextBtn.disabled = !selectedLocation;
    }
  }

  // ボタンスタイル更新
  function updateButtonStyle(btn, isSelected) {
    if (isSelected) {
      btn.classList.add('border-purple-500', 'bg-purple-50');
      btn.classList.remove('border-transparent', 'bg-white');
    } else {
      btn.classList.remove('border-purple-500', 'bg-purple-50');
      btn.classList.add('border-transparent', 'bg-white');
    }
  }

  // 選択場所情報の表示/非表示
  function showSelectedPlaceInfo(name) {
    if (selectedPlaceInfo && selectedPlaceName) {
      selectedPlaceName.textContent = name;
      selectedPlaceInfo.classList.remove('hidden');
    }
  }

  function hideSelectedPlaceInfo() {
    if (selectedPlaceInfo) selectedPlaceInfo.classList.add('hidden');
  }

  // 地図コンテナの表示/非表示
  function showMapContainer() {
    if (mapContainer) mapContainer.classList.remove('hidden');
  }

  function hideMapContainer() {
    if (mapContainer) mapContainer.classList.add('hidden');
    MapUtils.destroy();
    hideSelectedPlaceInfo();
  }

  // 住所コンテナの表示/非表示
  function showAddressContainer() {
    if (addressContainer) {
      addressContainer.classList.remove('hidden');
      addressBtns.forEach(function(b) { updateButtonStyle(b, false); });
    }
  }

  function hideAddressContainer() {
    if (addressContainer) addressContainer.classList.add('hidden');
  }

  // エラーメッセージの表示/非表示
  function showErrorMessage() {
    if (gpsErrorMessage) gpsErrorMessage.classList.remove('hidden');
  }

  function hideErrorMessage() {
    if (gpsErrorMessage) gpsErrorMessage.classList.add('hidden');
  }

  // 現在地の地図表示
  function showCurrentLocationMap(lat, lng) {
    showMapContainer();
    hideSelectedPlaceInfo();
    setTimeout(function() {
      MapUtils.init('map', lat, lng, 15);
      MapUtils.addMarker(lat, lng, '📍 現在地', true);
    }, 100);
  }

  // 川西市の地図表示
  function showKawanishiMap() {
    showMapContainer();
    selectedPlace = null;
    hideSelectedPlaceInfo();
    
    setTimeout(function() {
      var spots = KawanishiSpots;
      var centerLat = (spots[0].lat + spots[1].lat) / 2;
      var centerLng = (spots[0].lng + spots[1].lng) / 2;
      
      MapUtils.init('map', centerLat, centerLng, 13);
      spots.forEach(function(spot) {
        MapUtils.addSelectableMarker(spot, 'window.selectSpot');
      });
    }, 100);
  }

  // スポット選択（グローバル関数）
  window.selectSpot = function(spotId) {
    var spot = findSpotById(spotId);
    if (spot) {
      selectedPlace = spot;
      currentPosition = { lat: spot.lat, lng: spot.lng };
      showSelectedPlaceInfo(spot.name);
      updateSelection();
      MapUtils.closePopup();
    }
  };

  // GPS取得
  function getCurrentPosition() {
    if (gpsStatus) {
      gpsStatus.textContent = '取得中...';
      gpsStatus.classList.remove('text-green-500', 'text-red-500');
      gpsStatus.classList.add('text-gray-400');
    }

    if (!navigator.geolocation) {
      if (gpsStatus) {
        gpsStatus.textContent = '非対応';
        gpsStatus.classList.add('text-red-500');
      }
      showErrorMessage();
      selectedLocation = null;
      updateSelection();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        currentPosition = { lat: lat, lng: lng };
        if (gpsStatus) {
          gpsStatus.textContent = '✓ 取得完了';
          gpsStatus.classList.remove('text-gray-400');
          gpsStatus.classList.add('text-green-500');
        }
        showCurrentLocationMap(lat, lng);
        updateSelection();
      },
      function(error) {
        var messages = {
          1: '許可されていません',
          2: '取得できません',
          3: 'タイムアウト'
        };
        if (gpsStatus) {
          gpsStatus.textContent = messages[error.code] || 'エラー';
          gpsStatus.classList.remove('text-gray-400');
          gpsStatus.classList.add('text-red-500');
        }
        showErrorMessage();
        selectedLocation = null;
        updateSelection();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  // 全てをリセット
  function resetAll() {
    hideMapContainer();
    hideAddressContainer();
    hideErrorMessage();
    hideSelectedPlaceInfo();
    if (gpsStatus) gpsStatus.textContent = '';
    selectedPlace = null;
    currentPosition = null;
  }

  // 地点ボタンのクリック処理
  locationBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var locationId = this.dataset.locationId;
      locationBtns.forEach(function(b) { updateButtonStyle(b, false); });
      resetAll();
      selectedLocation = locationId;
      updateButtonStyle(this, true);

      switch(locationId) {
        case 'current':
          getCurrentPosition();
          break;
        case 'map':
          showKawanishiMap();
          updateSelection();
          break;
        case 'address':
          showAddressContainer();
          updateSelection();
          break;
        default:
          updateSelection();
      }
    });
  });

  // 住所ボタンのクリック処理
  addressBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var spot = findSpotById(this.dataset.addressId);
      if (spot) {
        addressBtns.forEach(function(b) { updateButtonStyle(b, false); });
        updateButtonStyle(this, true);
        selectedPlace = spot;
        currentPosition = { lat: spot.lat, lng: spot.lng };
        showSelectedPlaceInfo(spot.name);
        updateSelection();
      }
    });
  });

  // 次へボタンのクリック処理
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (this.disabled) return;
      sessionStorage.setItem('userLocation', JSON.stringify({
        type: selectedLocation,
        position: currentPosition,
        place: selectedPlace
      }));
      window.location.href = '/select-category';
    });
  }
})();
`

export const SelectLocationPage: FC = () => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col p-6 font-maru">
      {/* Leaflet CSS/JS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

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

      {/* インラインJavaScript（全機能を含む） */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
