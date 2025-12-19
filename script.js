// 可以替換成你的 csv
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_RX7bodysq202ReHeYKNsrJPSu3LSyCEW88-AOUp0NNDEEieZPNrGymI16Ew2P27UIKuWzJwMuDu_/pub?output=csv';

// 1. 叫外送 (發送請求)
fetch(csvUrl)
    .then(function(response) {
        // 2. 打開包裝，把內容當成純文字讀出來
        return response.text();
    })
    .then(function(csvRawText) {
        // 3. 顯示結果
        console.log("成功抓到資料了！");
        console.log(csvRawText); // 這時候還是看起來像亂亂的純文字
    })
    .catch(function(error) {
        console.error('讀取失敗:', error);
    });
