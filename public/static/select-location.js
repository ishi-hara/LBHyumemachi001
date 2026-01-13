// 地点情報選択画面のメインロジック
document.addEventListener('DOMContentLoaded', function() {
  let selectedLocation = null;
  let currentPosition = null;
  let selectedPlace = null;

  // DOM要素
  const locationBtns = document.querySelectorAll('.location-btn');
  const addressBtns = document.querySelectorAll('.address-btn');
  const nextBtn = document.getElementById('next-btn');
  const mapContainer = document.getElementById('map-container');
  const addressContainer = document.getElementById('address-container');
  const gpsStatus = document.getElementById('gps-status');
  const gpsErrorMessage = document.getElementById('gps-error-message');
  const selectedPlaceInfo = document.getElementById('selected-place-info');
  const selectedPlaceName = document.getElementById('selected-place-name');

  // 要素の存在チェック
  if (!addressContainer) {
    console.error('address-container not found');
    return;
  }

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
    if (window.MapUtils) window.MapUtils.destroy();
    hideSelectedPlaceInfo();
  }

  // 住所コンテナの表示/非表示
  function showAddressContainer() {
    if (addressContainer) {
      addressContainer.classList.remove('hidden');
      addressBtns.forEach(b => updateButtonStyle(b, false));
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
    setTimeout(() => {
      if (window.MapUtils) {
        window.MapUtils.init('map', lat, lng, 15);
        window.MapUtils.addMarker(lat, lng, '📍 現在地', true);
      }
    }, 100);
  }

  // 川西市の地図表示
  function showKawanishiMap() {
    showMapContainer();
    selectedPlace = null;
    hideSelectedPlaceInfo();
    
    setTimeout(() => {
      const spots = window.KawanishiSpots;
      if (spots && window.MapUtils) {
        const centerLat = (spots[0].lat + spots[1].lat) / 2;
        const centerLng = (spots[0].lng + spots[1].lng) / 2;
        
        window.MapUtils.init('map', centerLat, centerLng, 13);
        spots.forEach(spot => {
          window.MapUtils.addSelectableMarker(spot, 'window.selectSpot');
        });
      }
    }, 100);
  }

  // スポット選択（グローバル関数）
  window.selectSpot = function(spotId) {
    const spot = window.findSpotById ? window.findSpotById(spotId) : null;
    if (spot) {
      selectedPlace = spot;
      currentPosition = { lat: spot.lat, lng: spot.lng };
      showSelectedPlaceInfo(spot.name);
      updateSelection();
      if (window.MapUtils) window.MapUtils.closePopup();
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
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        currentPosition = { lat, lng };
        if (gpsStatus) {
          gpsStatus.textContent = '✓ 取得完了';
          gpsStatus.classList.remove('text-gray-400');
          gpsStatus.classList.add('text-green-500');
        }
        showCurrentLocationMap(lat, lng);
        updateSelection();
      },
      (error) => {
        const messages = {
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
  locationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const locationId = this.dataset.locationId;
      locationBtns.forEach(b => updateButtonStyle(b, false));
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
  addressBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const spot = window.findSpotById ? window.findSpotById(this.dataset.addressId) : null;
      if (spot) {
        addressBtns.forEach(b => updateButtonStyle(b, false));
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
});
