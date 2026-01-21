// 範囲指定画面
import type { FC } from 'hono/jsx'

export const ImageSelectPage: FC = () => {
  const inlineScript = `
    document.addEventListener('DOMContentLoaded', function() {
      var canvas = document.getElementById('draw-canvas');
      var ctx = canvas.getContext('2d');
      var baseImage = document.getElementById('base-image');
      var clearBtn = document.getElementById('clear-btn');
      var confirmBtn = document.getElementById('confirm-btn');
      var generateBtn = document.getElementById('generate-btn');
      var backToDrawBtn = document.getElementById('back-to-draw-btn');
      var drawingArea = document.getElementById('drawing-area');
      var confirmArea = document.getElementById('confirm-area');
      var maskPreview = document.getElementById('mask-preview');
      var loadingArea = document.getElementById('loading-area');
      var resultArea = document.getElementById('result-area');
      var resultImage = document.getElementById('result-image');
      var regenerateBtn = document.getElementById('regenerate-btn');
      var downloadBtn = document.getElementById('download-btn');
      var completeBtn = document.getElementById('complete-btn');
      var errorArea = document.getElementById('error-area');
      var retryBtn = document.getElementById('retry-btn');

      var isDrawing = false;
      var paths = [];
      var currentPath = [];
      var maskDataUrl = null;

      // 画像読み込み後にCanvasサイズを設定
      function initCanvas() {
        var rect = baseImage.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        redraw();
      }

      // 画像読み込み完了時
      if (baseImage.complete) {
        initCanvas();
      } else {
        baseImage.onload = initCanvas;
      }

      // ウィンドウリサイズ時
      window.addEventListener('resize', function() {
        setTimeout(initCanvas, 100);
      });

      // 座標取得（タッチ/マウス対応）
      function getCoords(e) {
        var rect = canvas.getBoundingClientRect();
        var x, y;
        if (e.touches && e.touches.length > 0) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        // スケール補正
        x = x * (canvas.width / rect.width);
        y = y * (canvas.height / rect.height);
        return { x: x, y: y };
      }

      // 描画開始
      function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        currentPath = [];
        var coords = getCoords(e);
        currentPath.push(coords);
      }

      // 描画中
      function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        var coords = getCoords(e);
        currentPath.push(coords);
        redraw();
      }

      // 描画終了
      function endDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        isDrawing = false;
        if (currentPath.length > 2) {
          paths.push(currentPath.slice());
        }
        currentPath = [];
        redraw();
        updateConfirmButton();
      }

      // 再描画
      function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 完了したパスを描画
        ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
        ctx.lineWidth = 2;
        
        paths.forEach(function(path) {
          if (path.length > 2) {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (var i = 1; i < path.length; i++) {
              ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        });

        // 現在描画中のパス
        if (currentPath.length > 0) {
          ctx.beginPath();
          ctx.moveTo(currentPath[0].x, currentPath[0].y);
          for (var i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].x, currentPath[i].y);
          }
          ctx.strokeStyle = 'rgba(255, 50, 50, 1)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // マスク画像を生成
      function generateMask() {
        var maskCanvas = document.createElement('canvas');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        var maskCtx = maskCanvas.getContext('2d');
        
        // 背景を黒で塗りつぶし
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        // 選択範囲を白で塗りつぶし
        maskCtx.fillStyle = 'white';
        paths.forEach(function(path) {
          if (path.length > 2) {
            maskCtx.beginPath();
            maskCtx.moveTo(path[0].x, path[0].y);
            for (var i = 1; i < path.length; i++) {
              maskCtx.lineTo(path[i].x, path[i].y);
            }
            maskCtx.closePath();
            maskCtx.fill();
          }
        });

        // 最小サイズチェック（50x50ピクセル以上）
        var imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        var whitePixels = 0;
        for (var i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i] > 200) whitePixels++;
        }
        
        if (whitePixels < 2500) { // 50x50 = 2500
          // 範囲が小さすぎる場合、自動で拡大
          maskCtx.lineWidth = 30;
          maskCtx.strokeStyle = 'white';
          paths.forEach(function(path) {
            if (path.length > 2) {
              maskCtx.beginPath();
              maskCtx.moveTo(path[0].x, path[0].y);
              for (var i = 1; i < path.length; i++) {
                maskCtx.lineTo(path[i].x, path[i].y);
              }
              maskCtx.closePath();
              maskCtx.stroke();
            }
          });
        }

        return maskCanvas.toDataURL('image/png');
      }

      // 確認ボタンの有効/無効
      function updateConfirmButton() {
        confirmBtn.disabled = paths.length === 0;
        if (paths.length > 0) {
          confirmBtn.classList.remove('opacity-50');
        } else {
          confirmBtn.classList.add('opacity-50');
        }
      }

      // イベントリスナー（マウス）
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);

      // イベントリスナー（タッチ）
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', endDraw, { passive: false });

      // クリアボタン
      clearBtn.addEventListener('click', function() {
        paths = [];
        currentPath = [];
        redraw();
        updateConfirmButton();
      });

      // 確認ボタン
      confirmBtn.addEventListener('click', function() {
        maskDataUrl = generateMask();
        maskPreview.src = maskDataUrl;
        drawingArea.classList.add('hidden');
        confirmArea.classList.remove('hidden');
      });

      // 描画に戻るボタン
      backToDrawBtn.addEventListener('click', function() {
        confirmArea.classList.add('hidden');
        drawingArea.classList.remove('hidden');
      });

      // 生成ボタン
      generateBtn.addEventListener('click', function() {
        confirmArea.classList.add('hidden');
        loadingArea.classList.remove('hidden');
        callGenerateAPI();
      });

      // 再生成ボタン
      regenerateBtn.addEventListener('click', function() {
        resultArea.classList.add('hidden');
        loadingArea.classList.remove('hidden');
        callGenerateAPI();
      });

      // リトライボタン
      retryBtn.addEventListener('click', function() {
        errorArea.classList.add('hidden');
        loadingArea.classList.remove('hidden');
        callGenerateAPI();
      });

      // ダウンロードボタン
      downloadBtn.addEventListener('click', function() {
        var link = document.createElement('a');
        link.download = 'yumemachi-generated.png';
        link.href = resultImage.src;
        link.click();
      });

      // 完了ボタン
      completeBtn.addEventListener('click', function() {
        window.location.href = '/';
      });

      // API呼び出し
      function callGenerateAPI() {
        // sessionStorageから夢の内容を取得
        var dreamData = sessionStorage.getItem('userDream');
        var dream = '';
        if (dreamData) {
          var parsed = JSON.parse(dreamData);
          dream = parsed.dream || '';
        }

        // 商業タイプを取得
        var commercialData = sessionStorage.getItem('userCommercialType');
        var facilityType = 'カフェ';
        if (commercialData) {
          var parsed = JSON.parse(commercialData);
          var labels = {
            'cafe': 'カフェ', 'restaurant': 'レストラン', 'bakery': 'ベーカリー',
            'bookstore': '書店', 'zakka': '雑貨店', 'apparel': 'アパレルショップ',
            'convenience': 'コンビニ', 'supermarket': 'スーパー', 'mall': 'ショッピングモール',
            'office': 'オフィスビル', 'coworking': 'コワーキングスペース'
          };
          if (parsed.commercialType === 'other' && parsed.otherText) {
            facilityType = parsed.otherText;
          } else {
            facilityType = labels[parsed.commercialType] || facilityType;
          }
        }

        // 外観/内観を取得
        var viewData = sessionStorage.getItem('userCafeView');
        var viewType = '外観';
        if (viewData) {
          var parsed = JSON.parse(viewData);
          var viewLabels = { 'exterior': '外観', 'interior': '内観', 'both': '外観と内観' };
          viewType = viewLabels[parsed.cafeView] || viewType;
        }

        // APIリクエスト
        fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dream: dream,
            facilityType: facilityType,
            viewType: viewType,
            maskImage: maskDataUrl,
            baseImagePath: '/images/01-001-EkimaeRotary.png'
          })
        })
        .then(function(response) {
          if (!response.ok) throw new Error('API Error');
          return response.json();
        })
        .then(function(data) {
          if (data.success && data.imageUrl) {
            resultImage.src = data.imageUrl;
            loadingArea.classList.add('hidden');
            resultArea.classList.remove('hidden');
          } else {
            throw new Error(data.error || 'Generation failed');
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
          loadingArea.classList.add('hidden');
          errorArea.classList.remove('hidden');
        });
      }

      updateConfirmButton();
    });
  `;

  return (
    <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
      {/* 画面名（右上） */}
      <div class="absolute top-2 right-2 text-xs text-gray-400 z-10">
        範囲指定画面
      </div>

      {/* 描画エリア */}
      <div id="drawing-area" class="p-4 pb-24">
        {/* ヘッダー */}
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <span>💬</span>
            <span>ゆめキャン</span>
          </h1>
        </div>

        {/* 説明文 */}
        <div class="bg-white rounded-xl shadow-md p-3 mb-4">
          <p class="text-sm text-gray-700">
            📍 生成したい場所を<span class="font-bold text-purple-600">指でなぞって</span>囲んでください
          </p>
        </div>

        {/* 画像とCanvas */}
        <div class="relative bg-white rounded-xl shadow-md overflow-hidden mb-4">
          <img 
            id="base-image" 
            src="/images/01-001-EkimaeRotary.png" 
            alt="川西能勢口駅前ロータリー"
            class="w-full h-auto"
          />
          <canvas 
            id="draw-canvas" 
            class="absolute top-0 left-0 w-full h-full cursor-crosshair"
          ></canvas>
        </div>

        {/* ボタン */}
        <div class="flex gap-3">
          <button 
            id="clear-btn"
            class="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow-md"
          >
            🗑️ やり直す
          </button>
          <button 
            id="confirm-btn"
            class="flex-1 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-full shadow-lg opacity-50"
            disabled
          >
            ✅ この範囲でOK
          </button>
        </div>

        {/* 戻るリンク */}
        <div class="mt-4 text-center">
          <a href="/dreamer-confirm" class="text-purple-600 underline text-sm">
            ← 入力内容の確認に戻る
          </a>
        </div>
      </div>

      {/* 確認エリア */}
      <div id="confirm-area" class="hidden p-4 pb-24">
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold text-purple-600">範囲の確認</h1>
        </div>

        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
          <p class="text-sm text-gray-700 mb-3">
            白い部分に画像が生成されます
          </p>
          <img 
            id="mask-preview" 
            alt="マスクプレビュー"
            class="w-full h-auto rounded-lg border-2 border-purple-200"
          />
        </div>

        <div class="flex gap-3">
          <button 
            id="back-to-draw-btn"
            class="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow-md"
          >
            ← 描き直す
          </button>
          <button 
            id="generate-btn"
            class="flex-1 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-full shadow-lg"
          >
            🎨 生成する！
          </button>
        </div>
      </div>

      {/* ローディングエリア */}
      <div id="loading-area" class="hidden p-4 pb-24">
        <div class="flex flex-col items-center justify-center min-h-[60vh]">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p class="text-lg text-purple-600 font-bold">生成中...</p>
          <p class="text-sm text-gray-500 mt-2">しばらくお待ちください</p>
        </div>
      </div>

      {/* 結果エリア */}
      <div id="result-area" class="hidden p-4 pb-24">
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold text-purple-600">✨ 生成完了！</h1>
        </div>

        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
          <img 
            id="result-image" 
            alt="生成結果"
            class="w-full h-auto rounded-lg"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <button 
              id="regenerate-btn"
              class="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow-md"
            >
              🔄 再生成
            </button>
            <button 
              id="download-btn"
              class="flex-1 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg"
            >
              📥 保存
            </button>
          </div>
          <button 
            id="complete-btn"
            class="w-full py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-full shadow-lg"
          >
            🏠 トップに戻る
          </button>
        </div>
      </div>

      {/* エラーエリア */}
      <div id="error-area" class="hidden p-4 pb-24">
        <div class="flex flex-col items-center justify-center min-h-[60vh]">
          <p class="text-4xl mb-4">😢</p>
          <p class="text-lg text-red-600 font-bold">生成に失敗しました</p>
          <p class="text-sm text-gray-500 mt-2">もう一度お試しください</p>
          <button 
            id="retry-btn"
            class="mt-6 px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-full shadow-lg"
          >
            🔄 再試行
          </button>
          <a href="/dreamer-confirm" class="mt-4 text-purple-600 underline text-sm">
            ← 入力内容の確認に戻る
          </a>
        </div>
      </div>

      {/* インラインスクリプト */}
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </div>
  )
}
