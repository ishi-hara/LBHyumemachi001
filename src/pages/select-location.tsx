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
        <div id="map" class="w-full h-48 rounded-xl shadow-md z-0"></div>
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

      {/* JavaScript */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          let selectedLocation = null;
          let currentPosition = null;
          let map = null;
          let marker = null;

          const locationBtns = document.querySelectorAll('.location-btn');
          const nextBtn = document.getElementById('next-btn');
          const mapContainer = document.getElementById('map-container');
          const gpsStatus = document.getElementById('gps-status');

          // 選択状態の更新
          function updateSelection() {
            nextBtn.disabled = !selectedLocation;
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

          // 地図を表示
          function showMap(lat, lng) {
            mapContainer.classList.remove('hidden');
            
            // 少し待ってから地図を初期化（DOMが表示されてから）
            setTimeout(() => {
              if (map) {
                map.setView([lat, lng], 15);
                if (marker) {
                  marker.setLatLng([lat, lng]);
                } else {
                  marker = L.marker([lat, lng]).addTo(map);
                }
              } else {
                map = L.map('map').setView([lat, lng], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenStreetMap'
                }).addTo(map);
                marker = L.marker([lat, lng]).addTo(map)
                  .bindPopup('📍 現在地')
                  .openPopup();
              }
            }, 100);
          }

          // 地図を非表示
          function hideMap() {
            mapContainer.classList.add('hidden');
          }

          // GPS取得
          function getCurrentPosition() {
            gpsStatus.textContent = '取得中...';
            gpsStatus.classList.remove('text-green-500', 'text-red-500');
            gpsStatus.classList.add('text-gray-400');

            if (!navigator.geolocation) {
              gpsStatus.textContent = '非対応';
              gpsStatus.classList.add('text-red-500');
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
                
                showMap(lat, lng);
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
              
              // 現在地以外が選択された場合
              if (locationId !== 'current') {
                hideMap();
                gpsStatus.textContent = '';
                currentPosition = null;
                selectedLocation = locationId;
                updateButtonStyle(this, true);
                updateSelection();
                return;
              }

              // 現在地が選択された場合
              selectedLocation = locationId;
              updateButtonStyle(this, true);
              getCurrentPosition();
            });
          });

          // 次へボタンのクリック処理
          nextBtn.addEventListener('click', function() {
            if (this.disabled) return;

            // 選択データを保存
            const data = {
              type: selectedLocation,
              position: currentPosition
            };
            sessionStorage.setItem('userLocation', JSON.stringify(data));

            // 次のページへ遷移
            window.location.href = '/select-category';
          });
        })();
      `}} />
    </div>
  )
}
