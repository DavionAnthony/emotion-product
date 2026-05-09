/**
 * wish-galaxy.js — 愿望星河页面
 *
 * 依赖：Store, Utils, WishCanvas（全局）
 *
 * 设计原理：
 * - 去掉 HTML 文字列表，所有愿望由 WishCanvas 在 Canvas 上渲染为文字气泡
 * - 用户提交愿望 → 新气泡从底部升起进入星河
 * - 点击 Canvas 上的气泡 → 切换完成状态（金色/灰色）
 * - 顶部保留输入框 + 统计数据
 */
(function () {
  'use strict';

  var _initialized = false;
  var _statsEl = null;
  var _inputEl = null;

  window.WishGalaxy = {
    render: function () {
      if (!_initialized) {
        _initPage();
        _initialized = true;
      }

      // 每次进入页面：重载数据，刷新气泡
      Store.loadWishes();
      _updateStats();
      WishCanvas.loadWishes(Store.wishes);

      if (!WishCanvas.running) {
        WishCanvas.start();
      }
    }
  };

  function _initPage() {
    _statsEl = document.getElementById('wish-stats');
    _inputEl = document.querySelector('.wish-input');
    var submitBtn = document.querySelector('.wish-submit-btn');

    // 初始化 Canvas
    WishCanvas.init('wish-canvas');

    // 点击气泡 → 切换完成状态
    WishCanvas.onClick(function (wishId) {
      Store.toggleWish(wishId);
      _updateStats();
      WishCanvas.loadWishes(Store.wishes);
    });

    // 长按戳破 → 删除愿望
    WishCanvas.onPop(function (wishId) {
      // 从 Store 中删除该愿望
      Store.wishes = Store.wishes.filter(function (w) { return w.id !== wishId; });
      Store._saveWishes();
      _updateStats();
    });

    // 提交愿望
    function handleSubmit() {
      var text = _inputEl.value.trim();
      if (!text) {
        Utils.shakeElement(_inputEl);
        return;
      }

      var wish = Store.addWish(text);
      _inputEl.value = '';

      // 往星河里加入新气泡
      WishCanvas.addWish(wish);
      _updateStats();
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', handleSubmit);
    }
    if (_inputEl) {
      _inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSubmit();
      });
    }

    // 首次加载数据
    Store.loadWishes();
  }

  function _updateStats() {
    if (!_statsEl) return;
    var stats = Store.getWishStats();

    _statsEl.innerHTML =
      '<div class="wish-stat">' +
        '<div class="wish-stat-number">' + stats.total + '</div>' +
        '<div class="wish-stat-label">总愿望</div>' +
      '</div>' +
      '<div class="wish-stat">' +
        '<div class="wish-stat-number" style="color:var(--color-done)">' + stats.done + '</div>' +
        '<div class="wish-stat-label">已完成 ✦</div>' +
      '</div>' +
      '<div class="wish-stat">' +
        '<div class="wish-stat-number" style="color:var(--color-pending)">' + stats.pending + '</div>' +
        '<div class="wish-stat-label">漂浮中</div>' +
      '</div>';
  }
})();
