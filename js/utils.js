/**
 * utils.js — 工具函数集合
 */

const Utils = {
  /** DOM 快捷选择 */
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  },

  /** 防抖 */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /** 随机整数 [min, max] */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** 随机浮点 [min, max) */
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  /** 从数组中随机取一项 */
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /** 从数组中随机取 n 项（不重复） */
  pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
  },

  /** 格式化数字：1200 → "1,200" */
  formatNumber(num) {
    return num.toLocaleString('zh-CN');
  },

  /** 格式化百分比 */
  formatPercent(num) {
    return (num * 100).toFixed(1) + '%';
  },

  /** 获得当前时间描述 */
  getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 9) return '早上好';
    if (h < 12) return '上午好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    if (h < 22) return '晚上好';
    return '夜深了';
  },

  /** 检测是否移动端 */
  isMobile() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  },

  /** 检测是否 iOS */
  isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  /** 延迟 */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /** 抖动元素（用于情绪反馈） */
  shakeElement(el) {
    el.classList.add('animate-shake');
    setTimeout(() => el.classList.remove('animate-shake'), 500);
  },

  /** 让数字从0跳到目标值 */
  animateNumber(el, target, duration = 1000) {
    const start = performance.now();
    const initial = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(initial + (target - initial) * eased);
      el.textContent = Utils.formatNumber(current);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  },

  /** 剪贴板写入 */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  },

  /** 生成唯一ID */
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  /** 简单的 localstorage 封装 */
  storage: {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch { /* quota exceeded, silently fail */ }
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  }
};
