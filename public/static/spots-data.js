// スポットデータ - 川西市の地点情報
window.KawanishiSpots = [
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

// スポットをIDで検索
window.findSpotById = function(spotId) {
  return window.KawanishiSpots.find(s => s.id === spotId);
};
