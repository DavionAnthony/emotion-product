/**
 * crash-report.js — 人生撞车报告页面逻辑
 *
 * 依赖：Utils, Store, Poster（全局）
 * 导出：window.CrashReport = { render }
 */
;(function () {
  'use strict'

  var SEL = {
    page: '#page-crash',
    input: '.crash-input',
    result: '.crash-result',
    number: '.crash-result-number',
    label: '.crash-result-label',
    entries: '.crash-entries',
    tagline: '.crash-tagline',
    emptyHint: '.crash-empty-hint',
    shareBtn: '.crash-share-btn',
    shareModal: '.share-modal',
    shareClose: '.share-close-btn',
    sharePreview: '.share-preview'
  }

  var GUIDE_TEXTS = [
    '试试输入「辞职」「旅行」「写小说」…',
    '你现在的梦想是什么？',
    '想知道有多少人和你一样吗？',
    '搜索一个想法，看看它的「撞车指数」',
    '每个人都曾有过同样的念头'
  ]

  var _lastResults = []
  var _lastQuery = ''
  var _shareHooked = false

  function _renderResults(results) {
    var pageEl = document.querySelector(SEL.page)
    if (!pageEl) return

    _lastResults = results

    // 从输入框同步搜索词
    var inputEl = pageEl.querySelector(SEL.input)
    _lastQuery = inputEl ? inputEl.value : ''

    var resultEl = pageEl.querySelector(SEL.result)
    var numberEl = pageEl.querySelector(SEL.number)
    var labelEl = pageEl.querySelector(SEL.label)
    var entriesEl = pageEl.querySelector(SEL.entries)
    var emptyHintEl = pageEl.querySelector(SEL.emptyHint)
    var shareBtn = pageEl.querySelector(SEL.shareBtn)

    if (results.length === 0) {
      if (resultEl) resultEl.style.display = 'none'
      if (shareBtn) shareBtn.style.display = 'none'
      if (emptyHintEl) {
        emptyHintEl.textContent = Utils.pick(GUIDE_TEXTS)
        emptyHintEl.style.display = 'block'
      }
      return
    }

    if (resultEl) resultEl.style.display = 'block'
    if (shareBtn) shareBtn.style.display = 'flex'
    if (emptyHintEl) emptyHintEl.style.display = 'none'

    var topResult = results[0]
    if (numberEl) {
      numberEl.textContent = '0'
      Utils.animateNumber(numberEl, topResult.count, 1000)
    }
    if (labelEl) {
      labelEl.textContent = '和你有同样想法的人数'
    }

    if (entriesEl) {
      entriesEl.innerHTML = ''
      results.forEach(function (item) {
        var entry = document.createElement('div')
        entry.className = 'crash-entry'

        var textSpan = document.createElement('span')
        textSpan.className = 'crash-entry-text'
        textSpan.textContent = item.dream

        var countSpan = document.createElement('span')
        countSpan.className = 'crash-entry-count'
        countSpan.textContent = Utils.formatNumber(item.count)

        entry.appendChild(textSpan)
        entry.appendChild(countSpan)
        entriesEl.appendChild(entry)
      })
    }
  }

  var _doSearch = Utils.debounce(function (query) {
    _lastQuery = query
    var results = Store.searchCrash(query)
    _renderResults(results)
  }, 300)

  function _onInput(e) {
    var query = e.target.value
    _doSearch(query)
  }

  /** 生成并显示分享海报 */
  function _showSharePoster() {
    // 兜底：如果闭包变量为空，从 DOM 和 Store 直接取值
    var query = _lastQuery
    var results = _lastResults

    if (!query || results.length === 0) {
      var inputEl = document.querySelector(SEL.input)
      query = inputEl ? inputEl.value : ''
      if (query) {
        results = Store.searchCrash(query)
      }
    }

    if (!query || results.length === 0) return

    var data = {
      keyword: query,
      count: results[0].count
    }

    // 生成海报
    var canvas = Poster.generate(data)

    // 弹窗
    var modal = document.querySelector(SEL.shareModal)
    var preview = document.querySelector(SEL.sharePreview)
    if (modal && preview) {
      preview.innerHTML = ''
      preview.appendChild(canvas)
      modal.classList.add('open')
    }
  }

  function _bindShare() {
    if (_shareHooked) return
    _shareHooked = true

    var modal = document.querySelector(SEL.shareModal)
    var closeBtn = document.querySelector(SEL.shareClose)

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (modal) modal.classList.remove('open')
      })
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('open')
      })
    }
  }

  var CrashReport = {
    render: function () {
      var pageEl = document.querySelector(SEL.page)
      if (!pageEl) return

      var inputEl = pageEl.querySelector(SEL.input)
      var shareBtn = pageEl.querySelector(SEL.shareBtn)

      // 绑定输入事件
      if (inputEl && !inputEl._crashBound) {
        inputEl._crashBound = true
        inputEl.addEventListener('input', _onInput)
        inputEl.value = ''
      }

      // 绑定分享按钮
      if (shareBtn && !shareBtn._shareBound) {
        shareBtn._shareBound = true
        shareBtn.addEventListener('click', _showSharePoster)
      }

      _bindShare()

      // 重置状态
      var resultEl = pageEl.querySelector(SEL.result)
      if (resultEl) resultEl.style.display = 'none'

      if (shareBtn) shareBtn.style.display = 'none'

      var emptyHintEl = pageEl.querySelector(SEL.emptyHint)
      if (emptyHintEl) {
        emptyHintEl.textContent = Utils.pick(GUIDE_TEXTS)
        emptyHintEl.style.display = 'block'
      }

      var numberEl = pageEl.querySelector(SEL.number)
      if (numberEl) numberEl.textContent = '0'

      var entriesEl = pageEl.querySelector(SEL.entries)
      if (entriesEl) entriesEl.innerHTML = ''

      _lastResults = []
      _lastQuery = ''
    }
  }

  window.CrashReport = CrashReport
})()
