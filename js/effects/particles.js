/**
 * particles.js — 愿望星河 文字气泡粒子引擎 v2
 *
 * 功能：
 *   1. 愿望文字气泡，根据文字宽度自适应半径和字号
 *   2. 超长文字截断显示，hover 显示完整文字
 *   3. 短按（<600ms）切换完成状态
 *   4. 长按（>=600ms）戳破气泡 → 碎片炸开 + 声效
 *   5. 背景柔和光晕氛围粒子
 */
const WishCanvas = {
  canvas: null,
  ctx: null,
  bubbles: [],
  ambiance: [],
  shards: [],         // 戳破碎片
  animationId: null,
  running: false,
  onClickCallback: null,
  onPopCallback: null,

  // 长按检测状态
  _pointerTimer: null,
  _pointerTarget: null,
  _pointerStart: 0,
  _longPressTriggered: false,

  // 配色
  DONE_COLOR_FILL: 'rgba(212, 168, 87, 0.25)',
  DONE_COLOR_STROKE: 'rgba(212, 168, 87, 0.6)',
  DONE_TEXT_COLOR: '#8B6E3A',
  DONE_GLOW: 'rgba(212, 168, 87, 0.15)',
  PENDING_COLOR_FILL: 'rgba(196, 184, 170, 0.15)',
  PENDING_COLOR_STROKE: 'rgba(196, 184, 170, 0.35)',
  PENDING_TEXT_COLOR: '#9C8F80',
  PENDING_GLOW: 'rgba(196, 184, 170, 0.08)',

  // 字号范围
  MIN_FONT_SIZE: 10,
  MAX_FONT_SIZE: 14,

  /** 初始化 */
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._resize();

    // 指针事件 — 长按检测
    this.canvas.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    this.canvas.addEventListener('pointerup', (e) => this._onPointerUp(e));
    this.canvas.addEventListener('pointermove', (e) => this._onPointerMove(e));

    window.addEventListener('resize', () => {
      this._resize();
      this.bubbles.forEach(b => {
        b.x = Math.min(b.x, this.canvas.width - b.r);
        b.y = Math.min(b.y, this.canvas.height - b.r);
      });
    });
  },

  _resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || window.innerWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight || window.innerHeight;
  },

  /** 设置回调 */
  onClick(callback) { this.onClickCallback = callback; },
  onPop(callback) { this.onPopCallback = callback; },

  /** 长按检测 — pointer down */
  _onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 检测命中的气泡
    const hit = this._hitTest(x, y);
    if (!hit) {
      this._pointerTarget = null;
      return;
    }

    this._pointerTarget = hit;
    this._pointerStart = Date.now();
    this._longPressTriggered = false;

    // 启动长按计时器
    this._pointerTimer = setTimeout(() => {
      if (this._pointerTarget && !this._pointerTarget.leaving && !this._pointerTarget._popping) {
        this._longPressTriggered = true;
        // 开始颤抖
        this._pointerTarget._trembling = true;
        this._pointerTarget._trembleStart = Date.now();
      }
    }, 600);
  },

  /** 长按检测 — pointer up */
  _onPointerUp(e) {
    clearTimeout(this._pointerTimer);
    this._pointerTimer = null;

    if (!this._pointerTarget) return;
    const target = this._pointerTarget;

    if (this._longPressTriggered && !target.leaving && !target._popping) {
      // 长按 → 戳破！
      target._trembling = false;
      this._popBubble(target);
    } else if (!target.leaving && !target._popping) {
      // 短按 → 切换状态
      if (this.onClickCallback) {
        this.onClickCallback(target.wishId);
      }
    }

    this._pointerTarget = null;
    this._longPressTriggered = false;
  },

  /** pointer move — 如果移动太多则取消长按 */
  _onPointerMove(e) {
    if (!this._pointerTarget || this._longPressTriggered) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - this._pointerTarget.x;
    const dy = y - this._pointerTarget.y;
    if (dx * dx + dy * dy > 400) { // 移动超过 20px 取消
      clearTimeout(this._pointerTimer);
      this._pointerTimer = null;
      this._pointerTarget = null;
    }
  },

  /** 碰撞检测 */
  _hitTest(x, y) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      if (b.leaving || b._popping) continue;
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx * dx + dy * dy <= (b.r + 10) * (b.r + 10)) return b;
    }
    return null;
  },

  /** ===== 气泡尺寸自适应 ===== */
  _calcBubbleSize(text) {
    const ctx = this.ctx;
    // 先按最大字号测宽度
    ctx.font = this.MAX_FONT_SIZE + 'px "Noto Sans SC", "PingFang SC", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 16; // 文字两侧留白
    const minR = 24;
    const maxR = 60;

    // 半径 = 文字半宽 + 留白
    let r = Math.ceil(textWidth / 2 + padding);
    // 限制范围
    r = Math.max(minR, Math.min(maxR, r));

    // 字号：根据半径反算，长文字用小字
    let fontSize = Math.min(r * 0.55, this.MAX_FONT_SIZE);
    fontSize = Math.max(this.MIN_FONT_SIZE, fontSize);

    return { r, fontSize };
  },

  /** 获取显示文本（超长截断） */
  _getDisplayText(text, maxLen = 10) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen - 1) + '…';
  },

  /** 启动动画 */
  start() {
    if (this.running) return;
    this.running = true;
    this._createAmbiance(20);
    this._loop();
  },

  /** 停止 */
  stop() {
    this.running = false;
    clearTimeout(this._pointerTimer);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  /** 加载愿望列表 */
  loadWishes(wishes) {
    const existingMap = {};
    this.bubbles.forEach(b => { existingMap[b.wishId] = b; });

    const newBubbles = [];

    wishes.forEach(w => {
      if (existingMap[w.id]) {
        const b = existingMap[w.id];
        b.done = w.done;
        b.text = w.text;
        newBubbles.push(b);
        delete existingMap[w.id];
      } else {
        const sized = this._calcBubbleSize(w.text);
        newBubbles.push({
          wishId: w.id,
          text: w.text,
          done: w.done,
          x: Utils.randomFloat(60, this.canvas.width - 60),
          y: this.canvas.height + sized.r + 20,
          targetY: Utils.randomFloat(100, this.canvas.height * 0.75),
          r: sized.r,
          fontSize: sized.fontSize,
          vx: Utils.randomFloat(-0.3, 0.3),
          vy: Utils.randomFloat(-0.08, -0.02),
          alpha: 0,
          targetAlpha: 0.85,
          phase: Math.random() * Math.PI * 2,
          entering: true,
          enterProgress: 0,
          _trembling: false,
          _popping: false,
        });
      }
    });

    Object.values(existingMap).forEach(b => {
      b.leaving = true;
      b.leaveAlpha = 1;
      newBubbles.push(b);
    });

    this.bubbles = newBubbles;
  },

  /** ===== 戳破气泡 ===== */
  _popBubble(b) {
    b._popping = true;
    b._popStart = Date.now();

    // 声效
    this._playPopSound();

    // 生成碎片
    const numShards = 10 + Math.floor(Math.random() * 6);
    const color = b.done ? '#D4A857' : '#C4B8AA';
    for (let i = 0; i < numShards; i++) {
      const angle = (Math.PI * 2 / numShards) * i + Math.random() * 0.3;
      const speed = Utils.randomFloat(1.5, 4);
      this.shards.push({
        x: b.x,
        y: b.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: Utils.randomFloat(2, 6),
        alpha: 1,
        color: color,
        gravity: 0.03,
        born: Date.now(),
      });
    }

    // 回调删除数据
    if (this.onPopCallback) {
      this.onPopCallback(b.wishId);
    }
  },

  /** Web Audio 气泡破裂声 */
  _playPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this._audioCtx) this._audioCtx = new AudioCtx();
      const ctx = this._audioCtx;

      // 主音 — 短促的"啵"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);

      // 叠加白噪声质感
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } catch (e) {
      // 静默失败，不影响功能
    }
  },

  /** 创建氛围粒子 */
  _createAmbiance(count) {
    this.ambiance = [];
    const palette = [
      { fill: 'rgba(212, 168, 87, 0.06)', stroke: 'rgba(212, 168, 87, 0.15)' },
      { fill: 'rgba(200, 180, 160, 0.05)', stroke: 'rgba(200, 180, 160, 0.12)' },
      { fill: 'rgba(180, 140, 100, 0.04)', stroke: 'rgba(180, 140, 100, 0.1)' },
    ];
    const w = this.canvas.width;
    const h = this.canvas.height;
    for (let i = 0; i < count; i++) {
      const p = Utils.pick(palette);
      this.ambiance.push({
        x: Utils.randomFloat(0, w),
        y: Utils.randomFloat(0, h),
        r: Utils.randomFloat(15, 60),
        vx: Utils.randomFloat(-0.15, 0.15),
        vy: Utils.randomFloat(-0.1, -0.02),
        fill: p.fill,
        stroke: p.stroke,
        alpha: Utils.randomFloat(0.3, 0.6),
        alphaSpeed: Utils.randomFloat(0.002, 0.006),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  },

  /** ===== 主循环 ===== */
  _loop() {
    if (!this.running) return;
    this._update();
    this._draw();
    this.animationId = requestAnimationFrame(() => this._loop());
  },

  _update() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const now = Date.now();

    // 氛围粒子
    for (const a of this.ambiance) {
      a.x += a.vx;
      a.y += a.vy;
      a.alpha += a.alphaSpeed * a.alphaDir;
      if (a.alpha > 0.6 || a.alpha < 0.1) a.alphaDir *= -1;
      if (a.x < -a.r * 2) a.x = w + a.r;
      if (a.x > w + a.r * 2) a.x = -a.r;
      if (a.y < -a.r * 2) a.y = h + a.r;
      if (a.y > h + a.r * 2) a.y = -a.r;
    }

    // 愿望气泡
    for (const b of this.bubbles) {
      if (b._popping) {
        // 戳破动画：快速缩小
        const elapsed = now - b._popStart;
        const progress = Math.min(elapsed / 300, 1);
        const scale = 1 - progress;
        b._popScale = scale;
        b.alpha = 1 - progress;
        if (progress >= 1) b._remove = true;
        continue;
      }

      if (b._trembling) {
        // 颤抖效果
        const trembleElapsed = now - b._trembleStart;
        b._trembleX = Math.sin(trembleElapsed * 0.05) * 2;
        b._trembleY = Math.cos(trembleElapsed * 0.07) * 1.5;
        // 微微缩小
        b._trembleScale = Math.max(0.6, 1 - trembleElapsed * 0.0003);
      } else {
        b._trembleX = 0;
        b._trembleY = 0;
        b._trembleScale = 1;
      }

      if (b.entering) {
        b.enterProgress += 0.02;
        if (b.enterProgress >= 1) {
          b.enterProgress = 1;
          b.entering = false;
        }
        const t = 1 - Math.pow(1 - b.enterProgress, 3);
        b.y = (h + b.r + 20) + (b.targetY - (h + b.r + 20)) * t;
        b.alpha = b.targetAlpha * t;
      } else if (!b.leaving) {
        b.x += b.vx + Math.sin(now * 0.0005 + b.phase) * 0.1;
        b.y += b.vy + Math.cos(now * 0.0003 + b.phase) * 0.05;
        const margin = 20;
        if (b.x < margin + b.r) { b.x = margin + b.r; b.vx *= -1; }
        if (b.x > w - margin - b.r) { b.x = w - margin - b.r; b.vx *= -1; }
        if (b.y < margin + b.r) { b.y = margin + b.r; b.vy *= -1; }
        if (b.y > h * 0.85) { b.y = h * 0.85; b.vy *= -1; }
      }

      if (b.leaving) {
        b.leaveAlpha -= 0.03;
        b.y -= 0.5;
        b.alpha = Math.max(0, b.leaveAlpha);
        if (b.leaveAlpha <= 0) b._remove = true;
      }
    }

    // 碎片
    for (const s of this.shards) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += s.gravity;
      s.alpha -= 0.015;
      s.r *= 0.98;
    }

    // 清除
    this.bubbles = this.bubbles.filter(b => !b._remove);
    this.shards = this.shards.filter(s => s.alpha > 0 && s.r > 0.5);
  },

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. 氛围粒子
    for (const a of this.ambiance) {
      ctx.save();
      ctx.globalAlpha = a.alpha;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = a.fill;
      ctx.fill();
      ctx.strokeStyle = a.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 2. 碎片
    for (const s of this.shards) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.5, s.r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. 愿望气泡
    for (const b of this.bubbles) {
      ctx.save();
      ctx.globalAlpha = b.alpha;

      if (b._popping) {
        // 戳破中的气泡
        const r = b.r * b._popScale;
        if (r > 1) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fillStyle = b.done ? this.DONE_COLOR_FILL : this.PENDING_COLOR_FILL;
          ctx.fill();
        }
        ctx.restore();
        continue;
      }

      if (b.done) {
        this._drawWishBubble(ctx, b, this.DONE_COLOR_FILL, this.DONE_COLOR_STROKE, this.DONE_GLOW, this.DONE_TEXT_COLOR, true);
      } else {
        this._drawWishBubble(ctx, b, this.PENDING_COLOR_FILL, this.PENDING_COLOR_STROKE, this.PENDING_GLOW, this.PENDING_TEXT_COLOR, false);
      }

      ctx.restore();
    }
  },

  /** 绘制单个愿望气泡 */
  _drawWishBubble(ctx, b, fill, stroke, glow, textColor, isDone) {
    const r = b.r * (b._trembleScale || 1);
    const dx = b._trembleX || 0;
    const dy = b._trembleY || 0;
    const cx = b.x + dx;
    const cy = b.y + dy;

    // 外发光
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2);
    gradient.addColorStop(0, glow);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 气泡主体
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = isDone ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)';
    ctx.fill();

    if (isDone) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 168, 87, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 绘制文字（超长截断）
    const displayText = this._getDisplayText(b.text, 10);
    const fontSize = b.fontSize || Math.min(r * 0.55, this.MAX_FONT_SIZE);
    ctx.font = fontSize + 'px "Noto Sans SC", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = textColor;
    ctx.fillText(displayText, cx, cy);
    ctx.restore();
  },

  /** 添加新愿望气泡 */
  addWish(wish) {
    const sized = this._calcBubbleSize(wish.text);
    this.bubbles.push({
      wishId: wish.id,
      text: wish.text,
      done: wish.done,
      x: Utils.randomFloat(60, this.canvas.width - 60),
      y: this.canvas.height + sized.r + 20,
      targetY: Utils.randomFloat(100, this.canvas.height * 0.75),
      r: sized.r,
      fontSize: sized.fontSize,
      vx: Utils.randomFloat(-0.3, 0.3),
      vy: Utils.randomFloat(-0.08, -0.02),
      alpha: 0,
      targetAlpha: 0.85,
      phase: Math.random() * Math.PI * 2,
      entering: true,
      enterProgress: 0,
      _trembling: false,
      _popping: false,
    });
  },

  clear() {
    this.bubbles = [];
    this.shards = [];
  }
};
