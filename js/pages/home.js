/**
 * home.js — 首页
 * 依赖：Router, Store, Utils (全局)
 *
 * Logo 效果：🫧 emoji 缓慢上浮 → 到顶破碎 → 碎片粒子散开
 * → 同时 🫧 在原位置重新出现（opacity=1, translateY=0）→ 继续下一轮上浮
 */
(function () {
  'use strict';

  var _initialized = false;
  var _animId = null;
  var _shards = [];

  var _bubbleState = {
    el: null,
    phase: 'rising',  // rising | popping
    progress: 0,
    riseDuration: 2500,
    offsetPx: 28,
  };

  window.Home = {
    render: function () {
      bindOnce();
      updateMood();
      renderCards();
      startLogoAnim();
    }
  };

  function bindOnce() {
    if (_initialized) return;
    _initialized = true;

    var cards = document.querySelectorAll('.home-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var page = card.dataset.page;
        if (page) Router.go(page);
      });
    });

    var moodBanner = document.querySelector('.home-mood');
    if (moodBanner) {
      moodBanner.addEventListener('click', function () {
        updateMood();
      });
    }
  }

  function updateMood() {
    var moodEl = document.querySelector('.home-mood-text');
    if (moodEl) {
      var banner = document.querySelector('.home-mood');
      if (banner) {
        banner.style.transition = 'opacity 0.2s';
        banner.style.opacity = '0.5';
        setTimeout(function () { banner.style.opacity = '1'; }, 100);
      }
      moodEl.textContent = '「' + Store.getRandomMood() + '」';
    }
  }

  function renderCards() {
    var wishStats = Store.getWishStats();
    var wishBadge = document.querySelector('.home-card[data-page=\"wish-galaxy\"] .home-card-desc');
    if (wishBadge && wishStats.total > 0) {
      wishBadge.textContent = '已有 ' + wishStats.total + ' 个愿望';
    }
  }

  /** ===== 🫧 上浮 → 破碎 → 原位重生 → 再上浮（循环） ===== */

  function startLogoAnim() {
    _bubbleState.el = document.querySelector('.home-logo');
    if (!_bubbleState.el) return;

    _bubbleState.el.style.position = 'relative';

    if (_animId) cancelAnimationFrame(_animId);
    _shards = [];
    _bubbleState.phase = 'rising';
    _bubbleState.progress = 0;

    if (!document.getElementById('logo-shard-canvas')) {
      var c = document.createElement('canvas');
      c.id = 'logo-shard-canvas';
      c.width = 100;
      c.height = 80;
      c.style.cssText =
        'position:absolute;top:-10px;left:50%;transform:translateX(-50%);' +
        'width:100px;height:80px;pointer-events:none;z-index:3;';
      _bubbleState.el.appendChild(c);
    }

    _loop();
  }

  function _loop() {
    _update();
    _draw();
    _animId = requestAnimationFrame(_loop);
  }

  function _update() {
    var bs = _bubbleState;
    var now = Date.now();

    if (bs.phase === 'rising') {
      bs.progress += 16 / bs.riseDuration;
      if (bs.progress >= 1) {
        bs.progress = 1;
        bs.phase = 'popping';
        _burstShards();
        // 🫧 立即在原位重生（opacity=1, translateY=0），再开始上浮
        bs.el.style.transform = 'translateY(0px)';
        bs.el.style.opacity = 1;
        bs.phase = 'rising';
        bs.progress = 0;
      }
    }

    // 更新 🫧 位置
    if (bs.el && bs.phase === 'rising') {
      var t = bs.progress;
      var eased = Math.sin(t * Math.PI / 2);
      var translateY = -bs.offsetPx * eased;
      bs.el.style.transform = 'translateY(' + translateY + 'px)';
      bs.el.style.opacity = 1 - eased * 0.15;
    }

    // 更新碎片
    for (var i = _shards.length - 1; i >= 0; i--) {
      var s = _shards[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += s.gravity;
      s.alpha -= 0.015;
      s.r *= 0.97;
      if (s.alpha <= 0 || s.r < 0.3) _shards.splice(i, 1);
    }
  }

  /** 产生碎片粒子 */
  function _burstShards() {
    // 🫧 emoji 的天蓝色调
    var colors = ['#7EC8E3', '#B0DCE8', '#5AB0D0', '#D4EEF5'];
    var cx = 50, cy = 40;
    for (var i = 0; i < 14; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1.5 + Math.random() * 3;
      _shards.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        r: 2 + Math.random() * 5,
        alpha: 0.8 + Math.random() * 0.2,
        color: colors[i % colors.length],
        gravity: 0.04,
      });
    }
  }

  function _draw() {
    var canvas = document.getElementById('logo-shard-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < _shards.length; i++) {
      var s = _shards[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.5, s.r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('hashchange', function () {
    var canvas = document.getElementById('logo-shard-canvas');
    if (canvas) {
      canvas.style.display = (window.location.hash.slice(1) === '' || window.location.hash === '#home') ? 'block' : 'none';
    }
    if (_bubbleState.el) {
      _bubbleState.el.style.transform = '';
      _bubbleState.el.style.opacity = '';
      if (window.location.hash.slice(1) !== '' && window.location.hash !== '#home') {
        _bubbleState.phase = 'paused';
      } else {
        if (_bubbleState.phase === 'paused') {
          _bubbleState.phase = 'rising';
          _bubbleState.progress = 0;
          _bubbleState.el.style.opacity = 1;
        }
      }
    }
  });
})();
