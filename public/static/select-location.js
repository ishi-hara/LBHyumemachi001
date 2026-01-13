// 地点情報選択画面のJavaScript
(function() {
  let selectedLocation = null;
  let currentPosition = null;
  let selectedPlace = null;
  let map = null;
  let markers = [];

  // 川西市のスポットデータ
  const kawanishiSpots = [
    {
      id: 'kawanishi-noseguchi',
      name: '川西能勢口前ロータリー',
      lat: 34.8267,
      lng: 135.4158
    },
    {
      id: 'tada-shrine',
      name: '多田神社前猪名川渓流',
      lat: 34.8589,
      lng: 135.3856
    }
  ];

  const locationBtns = document.querySelectorAll('.location-btn');
  const nextBtn = document.getElementById('next-btn');
  const mapContainer = document.getElementById('map-container');
  const gpsStatus = document.getElementById('gps-status');
  const gpsErrorMessage = document.getElementById('gps-error-message');
  const selectedPlaceInfo = document.getElementById('selected-place-info');
  const selectedPlaceName = document.getElementById('selected-place-name');

  // 選択状態の更新
  function updateSelection() {
    // 現在地の場合はcurrentPositionが必要
    if (selectedLocation === 'current') {
      nextBtn.disabled = !currentPosition;
    }
    // 地図から選ぶの場合はselectedPlaceが必要
    else if (selectedLocation === 'map') {
      nextBtn.disabled = !selectedPlace;
    }
    // その他は選択されていればOK
    else {
      nextBtn.disabled = !selectedLocation;
    }
  }

  // ボタンの見た目を更新
  function updateButtonStyle(btn, isSelected) {
    if (isSelected) {
      btn.classList.add('border-purple-500', 'bg-purple-50');
      btn.classList.remove('border-transparent', 'bg-white');
    } else {
      btn.classList.remove('border-purple-500', 'bg-purple-50');
      btn.classList.add('border-transparent', 'bg-white');
    }
  }

  // マーカーをクリア
  function clearMarkers() {
    markers.forEach(m => {
      if (map) map.removeLayer(m);
    });
    markers = [];
  }

  // 現在地の地図を表示
  function showCurrentLocationMap(lat, lng) {
    mapContainer.classList.remove('hidden');
    hideSelectedPlaceInfo();
    
    setTimeout(() => {
      if (map) {
        map.remove();
        map = null;
      }
      
      map = L.map('map').setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      
      const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup('📍 現在地')
        .openPopup();
      markers.push(marker);
    }, 100);
  }

  // 川西市の地図を表示（2箇所のマーカー付き）
  function showKawanishiMap() {
    mapContainer.classList.remove('hidden');
    selectedPlace = null;
    hideSelectedPlaceInfo();
    
    setTimeout(() => {
      if (map) {
        map.remove();
        map = null;
      }
      
      // 2箇所の中間地点を中心に
      const centerLat = (kawanishiSpots[0].lat + kawanishiSpots[1].lat) / 2;
      const centerLng = (kawanishiSpots[0].lng + kawanishiSpots[1].lng) / 2;
      
      map = L.map('map').setView([centerLat, centerLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      
      // 各スポットにマーカーを追加
      kawanishiSpots.forEach(spot => {
        const marker = L.marker([spot.lat, spot.lng]).addTo(map);
        marker.bindPopup(
          '<div style="text-align:center;min-width:120px;">' +
          '<b>' + spot.name + '</b><br>' +
          '<button onclick="window.selectSpot(\'' + spot.id + '\')" ' +
          'style="margin-top:8px;padding:6px 12px;background:linear-gradient(to right,#f472b6,#a855f7);color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;">' +
          'ここに決める</button>' +
          '</div>'
        );
        markers.push(marker);
      });
    }, 100);
  }

  // 選択された場所の情報を表示
  function showSelectedPlaceInfo(name) {
    if (selectedPlaceInfo && selectedPlaceName) {
      selectedPlaceName.textContent = name;
      selectedPlaceInfo.classList.remove('hidden');
    }
  }

  // 選択された場所の情報を非表示
  function hideSelectedPlaceInfo() {
    if (selectedPlaceInfo) {
      selectedPlaceInfo.classList.add('hidden');
    }
  }

  // スポット選択（グローバル関数として公開）
  window.selectSpot = function(spotId) {
    const spot = kawanishiSpots.find(s => s.id === spotId);
    if (spot) {
      selectedPlace = spot;
      currentPosition = { lat: spot.lat, lng: spot.lng };
      showSelectedPlaceInfo(spot.name);
      updateSelection();
      
      // ポップアップを閉じる
      map.closePopup();
    }
  };

  // 地図を非表示
  function hideMap() {
    mapContainer.classList.add('hidden');
    clearMarkers();
    hideSelectedPlaceInfo();
    if (map) {
      map.remove();
      map = null;
    }
  }

  // エラーメッセージを表示
  function showErrorMessage() {
    gpsErrorMessage.classList.remove('hidden');
  }

  // エラーメッセージを非表示
  function hideErrorMessage() {
    gpsErrorMessage.classList.add('hidden');
  }

  // GPS取得
  function getCurrentPosition() {
    gpsStatus.textContent = '取得中...';
    gpsStatus.classList.remove('text-green-500', 'text-red-500');
    gpsStatus.classList.add('text-gray-400');

    if (!navigator.geolocation) {
      gpsStatus.textContent = '非対応';
      gpsStatus.classList.add('text-red-500');
      showErrorMessage();
      selectedLocation = null;
      updateSelection();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // 成功
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        currentPosition = { lat, lng };
        
        gpsStatus.textContent = '✓ 取得完了';
        gpsStatus.classList.remove('text-gray-400');
        gpsStatus.classList.add('text-green-500');
        
        showCurrentLocationMap(lat, lng);
        updateSelection();
      },
      // エラー
      (error) => {
        let message = 'エラー';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = '許可されていません';
            break;
          case error.POSITION_UNAVAILABLE:
            message = '取得できません';
            break;
          case error.TIMEOUT:
            message = 'タイムアウト';
            break;
        }
        gpsStatus.textContent = message;
        gpsStatus.classList.remove('text-gray-400');
        gpsStatus.classList.add('text-red-500');
        showErrorMessage();
        selectedLocation = null;
        updateSelection();
      },
      // オプション
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // 地点ボタンのクリック処理
  locationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const locationId = this.dataset.locationId;

      // 全ボタンの選択状態をリセット
      locationBtns.forEach(b => updateButtonStyle(b, false));
      hideErrorMessage();
      gpsStatus.textContent = '';
      
      // 現在地が選択された場合
      if (locationId === 'current') {
        hideMap();
        selectedPlace = null;
        currentPosition = null;
        selectedLocation = locationId;
        updateButtonStyle(this, true);
        getCurrentPosition();
        return;
      }
      
      // 地図から選ぶが選択された場合
      if (locationId === 'map') {
        selectedPlace = null;
        currentPosition = null;
        selectedLocation = locationId;
        updateButtonStyle(this, true);
        showKawanishiMap();
        updateSelection();
        return;
      }
      
      // その他が選択された場合
      hideMap();
      selectedPlace = null;
      currentPosition = null;
      selectedLocation = locationId;
      updateButtonStyle(this, true);
      updateSelection();
    });
  });

  // 次へボタンのクリック処理
  nextBtn.addEventListener('click', function() {
    if (this.disabled) return;

    // 選択データを保存
    const data = {
      type: selectedLocation,
      position: currentPosition,
      place: selectedPlace
    };
    sessionStorage.setItem('userLocation', JSON.stringify(data));

    // 次のページへ遷移
    window.location.href = '/select-category';
  });
})();
