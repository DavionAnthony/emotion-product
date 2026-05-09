/**
 * poster.js — 撞车报告海报生成器
 *
 * 根据搜索词自动匹配主题风格，生成可保存的分享海报 Canvas
 *
 * 主题系统：
 *   旷野 → 辞职、旅行、自由
 *   沉静 → 考公、上岸、稳定
 *   文艺 → 写小说、学画、音乐
 *   热血 → 跑步、健身
 *   治愈 → 养猫、烹饪
 *   梦想 → 其他（通用）
 */
const Poster = {
  themes: {
    wilderness: {
      name: '旷野',
      bgGradient: ['#E8D5A8', '#F5F0E8'],
      accent: '#C4944A',
      textColor: '#4A3F35',
      numberColor: '#C4944A',
      tagline: '风会带你到该去的地方',
      decorate: function (ctx, w, h) {
        // 远山线条
        ctx.save();
        ctx.strokeStyle = 'rgba(196, 148, 74, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x += 1) {
          const y = h * 0.7 + Math.sin(x * 0.008) * 30 + Math.sin(x * 0.015) * 15;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // 第二层
        ctx.strokeStyle = 'rgba(196, 148, 74, 0.08)';
        ctx.beginPath();
        for (let x = 0; x < w; x += 1) {
          const y = h * 0.78 + Math.sin(x * 0.01 + 2) * 25 + Math.sin(x * 0.02) * 10;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // 飞鸟
        ctx.fillStyle = 'rgba(196, 148, 74, 0.2)';
        for (let i = 0; i < 5; i++) {
          const bx = w * 0.1 + i * w * 0.12 + Math.sin(i * 3) * 20;
          const by = h * 0.18 + Math.sin(i * 5) * 10;
          ctx.beginPath();
          ctx.arc(bx - 6, by, 3, Math.PI, 0);
          ctx.arc(bx + 6, by, 3, Math.PI, 0);
          ctx.fill();
        }
        ctx.restore();
      }
    },
    stable: {
      name: '沉静',
      bgGradient: ['#D4D8C8', '#F0F0E8'],
      accent: '#5A7A5A',
      textColor: '#3A4A3A',
      numberColor: '#5A7A5A',
      tagline: '每一步都算数',
      decorate: function (ctx, w, h) {
        ctx.save();
        // 阶梯
        ctx.strokeStyle = 'rgba(90, 122, 90, 0.12)';
        ctx.lineWidth = 2;
        const stepW = 20, stepH = 16;
        let sx = w * 0.15, sy = h * 0.75;
        for (let i = 0; i < 12; i++) {
          ctx.strokeRect(sx + i * stepW, sy - i * stepH, stepW, i * stepH);
        }
        // 书本轮廓
        ctx.fillStyle = 'rgba(90, 122, 90, 0.06)';
        ctx.fillRect(w * 0.7, h * 0.15, 60, 80);
        ctx.fillRect(w * 0.7 + 5, h * 0.15 - 3, 50, 5);
        ctx.fillStyle = 'rgba(90, 122, 90, 0.04)';
        ctx.fillRect(w * 0.7 + 8, h * 0.15 + 10, 44, 3);
        ctx.fillRect(w * 0.7 + 8, h * 0.15 + 20, 44, 3);
        ctx.fillRect(w * 0.7 + 8, h * 0.15 + 30, 44, 3);
        ctx.restore();
      }
    },
    artistic: {
      name: '文艺',
      bgGradient: ['#D8D0E0', '#F0ECF5'],
      accent: '#4A5A8A',
      textColor: '#3A3A4A',
      numberColor: '#4A5A8A',
      tagline: '创造本身就是意义',
      decorate: function (ctx, w, h) {
        ctx.save();
        // 羽毛笔线条
        ctx.strokeStyle = 'rgba(74, 90, 138, 0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.8, h * 0.2);
        ctx.quadraticCurveTo(w * 0.85, h * 0.1, w * 0.9, h * 0.15);
        ctx.quadraticCurveTo(w * 0.85, h * 0.25, w * 0.8, h * 0.2);
        ctx.stroke();
        // 音符
        ctx.fillStyle = 'rgba(74, 90, 138, 0.08)';
        for (let i = 0; i < 4; i++) {
          const nx = w * 0.1 + i * 25 + 10;
          const ny = h * 0.18 + Math.sin(i * 2) * 12;
          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(nx + 3, ny - 15, 2, 15);
        }
        ctx.restore();
      }
    },
    passionate: {
      name: '热血',
      bgGradient: ['#E8C8B8', '#F5ECE4'],
      accent: '#C45A3A',
      textColor: '#4A3020',
      numberColor: '#C45A3A',
      tagline: '出发就是赢',
      decorate: function (ctx, w, h) {
        ctx.save();
        // 箭头
        ctx.strokeStyle = 'rgba(196, 90, 58, 0.12)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.75);
        ctx.lineTo(w * 0.4, h * 0.75);
        ctx.moveTo(w * 0.35, h * 0.72);
        ctx.lineTo(w * 0.4, h * 0.75);
        ctx.lineTo(w * 0.35, h * 0.78);
        ctx.stroke();
        // 刻度线
        ctx.strokeStyle = 'rgba(196, 90, 58, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 25) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    cozy: {
      name: '治愈',
      bgGradient: ['#D8E8D0', '#F0F5EC'],
      accent: '#7A9A6A',
      textColor: '#3A4A30',
      numberColor: '#7A9A6A',
      tagline: '温柔本身就是力量',
      decorate: function (ctx, w, h) {
        ctx.save();
        // 叶子
        ctx.fillStyle = 'rgba(122, 154, 106, 0.1)';
        for (let i = 0; i < 8; i++) {
          const lx = w * 0.05 + i * (w * 0.12);
          const ly = h * 0.7 + Math.sin(i * 1.5) * 20;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 12, 6, i * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        // 波浪
        ctx.strokeStyle = 'rgba(122, 154, 106, 0.08)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x += 1) {
          const y = h * 0.85 + Math.sin(x * 0.02) * 8 + Math.sin(x * 0.01) * 5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
    },
    dreamy: {
      name: '梦想',
      bgGradient: ['#C8D0E0', '#E8ECF5'],
      accent: '#5A6A9A',
      textColor: '#30304A',
      numberColor: '#5A6A9A',
      tagline: '梦总还是要做的',
      decorate: function (ctx, w, h) {
        ctx.save();
        // 星星
        ctx.fillStyle = 'rgba(90, 106, 154, 0.1)';
        for (let i = 0; i < 15; i++) {
          const sx = (i * 97 + 33) % w;
          const sy = (i * 67 + 11) % (h * 0.5);
          const sr = 1.5 + (i % 3);
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI / 5) - Math.PI / 2;
            const px = sx + Math.cos(angle) * sr;
            const py = sy + Math.sin(angle) * sr;
            j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
        // 光晕
        const gradient = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.4);
        gradient.addColorStop(0, 'rgba(90, 106, 154, 0.05)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }
  },

  /** 根据关键词匹配主题 */
  matchTheme(keyword) {
    const kw = keyword.toLowerCase();
    if (/辞职|旅行|自由|环游|裸辞|大理|民宿/.test(kw)) return 'wilderness';
    if (/考公|上岸|考|稳定|体制|编制|公务员/.test(kw)) return 'stable';
    if (/写|画|学|音乐|吉|外语|尤克里里|小说|创作/.test(kw)) return 'artistic';
    if (/跑|健身|跑不|自律|马拉松|运动/.test(kw)) return 'passionate';
    if (/养|猫|狗|烹饪|做饭|烘焙|花|园艺/.test(kw)) return 'cozy';
    return 'dreamy';
  },

  /** 生成分享海报 Canvas */
  generate(data) {
    const { keyword, count } = data;
    const themeKey = this.matchTheme(keyword);
    const theme = this.themes[themeKey];

    // 创建画布
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) {
      // 如果没有预设 Canvas，创建一个
      const tempCanvas = document.createElement('canvas');
      tempCanvas.id = 'poster-canvas';
      tempCanvas.width = 600;
      tempCanvas.height = 900;
      return this._draw(tempCanvas, theme, data);
    }
    canvas.width = 600;
    canvas.height = 900;
    return this._draw(canvas, theme, data);
  },

  _draw(canvas, theme, data) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const { keyword, count } = data;

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, theme.bgGradient[0]);
    gradient.addColorStop(1, theme.bgGradient[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 装饰元素
    theme.decorate(ctx, w, h);

    // 顶部标签
    ctx.save();
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.6;
    ctx.font = '13px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('原来不只我', w / 2, 60);
    ctx.restore();

    // 搜索词
    ctx.save();
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.4;
    ctx.font = '15px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('「' + keyword + '」', w / 2, 95);
    ctx.restore();

    // 大数字
    ctx.save();
    ctx.fillStyle = theme.numberColor;
    ctx.font = 'bold 80px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Utils.formatNumber(count), w / 2, h * 0.42);
    ctx.restore();

    // 数字下面的文字
    ctx.save();
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.6;
    ctx.font = '16px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('和你有同样想法的人数', w / 2, h * 0.42 + 55);
    ctx.restore();

    // 分割线
    ctx.save();
    ctx.strokeStyle = theme.accent;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.55);
    ctx.lineTo(w * 0.8, h * 0.55);
    ctx.stroke();
    ctx.restore();

    // slogan
    ctx.save();
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.4;
    ctx.font = '14px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('「' + theme.tagline + '」', w / 2, h * 0.62);
    ctx.restore();

    // 底部品牌
    ctx.save();
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.2;
    ctx.font = '11px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('无用星球 · 你的平庸被收容，你的放弃被展览', w / 2, h * 0.92);
    ctx.restore();

    // 二维码占位区域
    ctx.save();
    ctx.strokeStyle = theme.accent;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const qrX = w / 2 - 40, qrY = h * 0.72;
    ctx.strokeRect(qrX, qrY, 80, 80);
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.15;
    ctx.font = '9px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('(扫码查看你的撞车报告)', w / 2, qrY + 95);
    ctx.restore();

    return canvas;
  }
};
