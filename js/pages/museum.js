/**
 * museum.js — 未完成博物馆
 * 依赖：Store, Utils (全局)
 */
(function () {
  'use strict';

  var CONTAINER_SEL = '#page-museum .museum-list';
  var REFRESH_BTN_SEL = '#page-museum .museum-refresh';
  var DISPLAY_COUNT = 6;

  var _initialized = false;

  window.Museum = {
    render: function () {
      bindOnce();
      renderItems();
    }
  };

  function bindOnce() {
    if (_initialized) return;
    _initialized = true;

    var refreshBtn = document.querySelector(REFRESH_BTN_SEL);
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        renderItems();
      });
    }
  }

  function renderItems() {
    var container = document.querySelector(CONTAINER_SEL);
    if (!container) return;

    var items = Utils.pickN(Store.museumData, DISPLAY_COUNT);
    container.innerHTML = '';

    items.forEach(function (item, index) {
      var el = document.createElement('div');
      el.className = 'museum-item';
      el.style.animation = 'fadeInUp 0.5s ease ' + (index * 0.1) + 's both';

      el.innerHTML =
        '<div class="museum-item-quote">「' + escapeHtml(item.quote) + '」</div>' +
        '<div class="museum-item-meta">' +
          '<span class="museum-item-tag">' + escapeHtml(item.tag) + '</span>' +
          '<span>放弃了，因为' + escapeHtml(item.reason) + '</span>' +
        '</div>';

      container.appendChild(el);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
