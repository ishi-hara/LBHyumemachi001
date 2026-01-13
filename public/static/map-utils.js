// 地図ユーティリティ - OpenStreetMap/Leaflet操作
window.MapUtils = (function() {
  let map = null;
  let markers = [];

  // マーカーをクリア
  function clearMarkers() {
    markers.forEach(m => {
      if (map) map.removeLayer(m);
    });
    markers = [];
  }

  // 地図を破棄
  function destroyMap() {
    clearMarkers();
    if (map) {
      map.remove();
      map = null;
    }
  }

  // 地図を初期化
  function initMap(elementId, lat, lng, zoom) {
    destroyMap();
    map = L.map(elementId).setView([lat, lng], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    return map;
  }

  // 単一マーカーを追加
  function addMarker(lat, lng, popupText, openPopup) {
    if (!map) return null;
    const marker = L.marker([lat, lng]).addTo(map);
    if (popupText) {
      marker.bindPopup(popupText);
      if (openPopup) marker.openPopup();
    }
    markers.push(marker);
    return marker;
  }

  // 選択可能なマーカーを追加
  function addSelectableMarker(spot, onSelectCallback) {
    if (!map) return null;
    const marker = L.marker([spot.lat, spot.lng]).addTo(map);
    marker.bindPopup(
      '<div style="text-align:center;min-width:120px;">' +
      '<b>' + spot.name + '</b><br>' +
      '<button onclick="' + onSelectCallback + '(\'' + spot.id + '\')" ' +
      'style="margin-top:8px;padding:6px 12px;background:linear-gradient(to right,#f472b6,#a855f7);color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;">' +
      'ここに決める</button>' +
      '</div>'
    );
    markers.push(marker);
    return marker;
  }

  // ポップアップを閉じる
  function closePopup() {
    if (map) map.closePopup();
  }

  // 公開API
  return {
    init: initMap,
    destroy: destroyMap,
    addMarker: addMarker,
    addSelectableMarker: addSelectableMarker,
    closePopup: closePopup
  };
})();
