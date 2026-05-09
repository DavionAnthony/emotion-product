/**
 * router.js — 极简 hash 路由器
 */
const Router = {
  /** 当前页面 */
  current: null,

  /** 页面注册表 */
  _routes: {},

  /** 页面切换生命周期钩子 */
  _hooks: {},

  /** 初始化，routes 格式：{ home: { render, enter, leave }, ... } */
  init(routes) {
    this._routes = routes;

    window.addEventListener('hashchange', () => this._handleRoute());
    window.addEventListener('load', () => this._handleRoute());
  },

  /** 导航到指定页面 */
  go(page, params = null) {
    // 如果提供了 params，存到 sessionStorage 供目标页面取
    if (params) {
      sessionStorage.setItem('route_params_' + page, JSON.stringify(params));
    }
    window.location.hash = '#' + page;
  },

  /** 获取当前路由参数（由上一个页面通过 go() 传递） */
  getParams(page) {
    const key = 'route_params_' + page;
    const val = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    try { return val ? JSON.parse(val) : null; } catch { return null; }
  },

  /** 获取当前 hash 对应的页面名 */
  getCurrentPage() {
    const hash = window.location.hash.slice(1) || 'home';
    return this._routes[hash] ? hash : 'home';
  },

  /** 处理路由变化 */
  _handleRoute() {
    const page = this.getCurrentPage();
    const prev = this.current;

    if (prev && this._routes[prev] && this._routes[prev].leave) {
      this._routes[prev].leave();
    }

    this.current = page;

    // 隐藏所有页面，显示目标页
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    // 更新底部导航高亮
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // 渲染并进入
    if (this._routes[page]) {
      if (this._routes[page].render) {
        this._routes[page].render();
      }
      if (this._routes[page].enter) {
        this._routes[page].enter();
      }
    }
  }
};
