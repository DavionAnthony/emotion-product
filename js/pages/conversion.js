/**
 * conversion.js — 转化率统计页面
 * 功能：展示各种人生目标的『想做→做完』转化率
 * 依赖：Store.conversionData, Utils
 * 导出：window.Conversion = { render }
 */
(function () {
  'use strict';

  /**
   * 渲染转化率统计列表
   * @param {string|Element} container - 目标容器（选择器或 DOM 元素），默认 '#page-conversion .page-content'
   */
  function render(container) {
    var root = (typeof container === 'string')
      ? document.querySelector(container)
      : container;

    if (!root) {
      root = document.querySelector('#page-conversion .page-content');
    }

    if (!root) {
      console.warn('[Conversion] Container not found');
      return;
    }

    // 从 Store 获取数据，按转化率降序排列
    var items = Store.conversionData
      .map(function (item) {
        return {
          name: item.name,
          attempted: item.attempted,
          done: item.done,
          rate: item.done / item.attempted
        };
      })
      .sort(function (a, b) {
        return b.rate - a.rate;
      });

    // 构建列表 HTML
    var html = '<div class="conversion-list">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var ratePercent = (item.rate * 100).toFixed(1);
      var barWidth = ratePercent + '%';

      html += '<div class="conversion-item" data-index="' + i + '">';
      html += '  <div class="conversion-header">';
      html += '    <span class="conversion-name">' + escapeHtml(item.name) + '</span>';
      html += '    <span class="conversion-rate" data-target="' + ratePercent + '">0%</span>';
      html += '  </div>';
      html += '  <div class="stat-bar">';
      html += '    <div class="stat-bar-fill" style="width:0" data-target="' + barWidth + '"></div>';
      html += '  </div>';
      html += '  <div class="conversion-detail">';
      html += '    <span><span class="stat-attempted" data-target="' + item.attempted + '">0</span> 人想做</span>';
      html += '    <span><span class="stat-done" data-target="' + item.done + '">0</span> 人做到</span>';
      html += '  </div>';
      html += '</div>';
    }
    html += '</div>';

    root.innerHTML = html;

    // 触发动画：先强制回流，再设置目标宽度触发 CSS transition
    var fills = root.querySelectorAll('.stat-bar-fill');
    for (var j = 0; j < fills.length; j++) {
      var targetWidth = fills[j].getAttribute('data-target');
      // 强制回流
      fills[j].offsetWidth;
      fills[j].style.width = targetWidth;
    }

    // 数字动画：百分比数字
    var rateEls = root.querySelectorAll('.conversion-rate');
    for (var k = 0; k < rateEls.length; k++) {
      var targetVal = parseFloat(rateEls[k].getAttribute('data-target'));
      animatePercent(rateEls[k], targetVal);
    }

    // 数字动画：attempted 数字
    var attemptedEls = root.querySelectorAll('.stat-attempted');
    for (var m = 0; m < attemptedEls.length; m++) {
      Utils.animateNumber(attemptedEls[m], parseInt(attemptedEls[m].getAttribute('data-target'), 10));
    }

    // 数字动画：done 数字
    var doneEls = root.querySelectorAll('.stat-done');
    for (var n = 0; n < doneEls.length; n++) {
      Utils.animateNumber(doneEls[n], parseInt(doneEls[n].getAttribute('data-target'), 10));
    }
  }

  /**
   * 百分比数字动画（0 → 目标值，显示 x.x%）
   */
  function animatePercent(el, target) {
    var start = performance.now();
    var duration = 1000;
    var initial = 0;

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var current = initial + (target - initial) * eased;
      el.textContent = current.toFixed(1) + '%';
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /**
   * 简单的 HTML 转义
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // 导出
  window.Conversion = {
    render: render
  };
})();
