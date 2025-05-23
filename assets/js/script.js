var mode = "ja";

$(window).on("load", function () {
  // 言語
  $("#language-en").on("click", function () {
    mode = "en";
    updateLanguage();
  });

  $("#language-ja").on("click", function () {
    mode = "ja";
    updateLanguage();
  });

  if (browserLanguage() == "ja") {
    mode = "ja";
  } else {
    mode = "en";
  }

  updateLanguage();

  // 見た目
  $("div#title-text").fitText();

  // 背景アニメ
  initAnim();
});

function updateLanguage() {
  if (mode == "ja") {
    $(".en").hide();
    $(".ja").show();
  } else {
    $(".ja").hide();
    $(".en").show();
  }
}

var unit = 100,
  canvasList, // キャンバスの配列
  info = {}, // 全キャンバス共通の描画情報
  colorList; // 各キャンバスの色情報

/**
 * Init function.
 *
 * Initialize variables and begin the animation.
 */
function initAnim() {
  info.seconds = 0;
  info.t = 0;
  canvasList = [];
  colorList = [];
  // canvas1個めの色指定
  canvasList.push(document.getElementById("canvas"));
  const color = rgbtohex($(".main-article").css("background-color"));
  colorList.push([color]);
  // 各キャンバスの初期化
  for (var canvasIndex in canvasList) {
    var canvas = canvasList[canvasIndex];
    canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
    canvas.height = 1000; //波の高さ
    canvas.contextCache = canvas.getContext("2d");
  }
  // 共通の更新処理呼び出し
  update();
}

function update() {
  for (var canvasIndex in canvasList) {
    var canvas = canvasList[canvasIndex];
    // 各キャンバスの描画
    draw(canvas, colorList[canvasIndex]);
  }
  // 共通の描画情報の更新
  info.seconds = info.seconds + 0.014;
  info.t = info.seconds * Math.PI;
  // 自身の再起呼び出し
  setTimeout(update, 35);
}

/**
 * Draw animation function.
 *
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
  // 対象のcanvasのコンテキストを取得
  var context = canvas.contextCache;
  // キャンバスの描画をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);

  //波を描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
  drawWave(canvas, color[0], 1, 2, 0); //drawWave(canvas, color[0],0.5, 3, 0);とすると透過50%の波が出来る
}

/**
 * 波を描画
 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawWave(canvas, color, alpha, zoom, delay) {
  var context = canvas.contextCache;
  context.fillStyle = color; //塗りの色
  context.globalAlpha = alpha;
  context.beginPath(); //パスの開始
  drawSine(canvas, info.t / 0.5, zoom, delay);
  context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
  context.lineTo(0, canvas.height); //パスをCanvasの左下へ
  context.closePath(); //パスを閉じる
  context.fill(); //波を塗りつぶす
}

/**
 * Function to draw sine
 *
 * The sine curve is drawn in 10px segments starting at the origin.
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
  var xAxis = Math.floor(canvas.height / 2);
  var yAxis = 0;
  var yOffset = -0.25 * canvas.height;
  var context = canvas.contextCache;
  // Set the initial x and y, starting at 0,0 and translating to the origin on
  // the canvas.
  var x = t; //時間を横の位置とする
  var y = Math.sin(x) / zoom;
  context.moveTo(yAxis, unit * y + xAxis + yOffset); //スタート位置にパスを置く

  // Loop to draw segments (横幅の分、波を描画)
  for (i = yAxis; i <= canvas.width + 10; i += 10) {
    x = t + (-yAxis + i) / unit / zoom;
    y = Math.sin(x - delay) / 3;
    context.lineTo(i, unit * y + xAxis + yOffset);
  }
}

var browserLanguage = function () {
  var ua = window.navigator.userAgent.toLowerCase();
  try {
    // chrome
    if (ua.indexOf("chrome") != -1) {
      return (
        navigator.languages[0] ||
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).substr(0, 2);
    }
    // それ以外
    else {
      return (
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).substr(0, 2);
    }
  } catch (e) {
    return undefined;
  }
};

function rgbtohex(orig) {
  var rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
  return rgb && rgb.length === 4
    ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
    : orig;
}
