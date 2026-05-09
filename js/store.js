/**
 * store.js — 全局数据状态管理
 */

const Store = {
  /**
   * ===== 假数据 =====
   */

  /** 撞车报告 — 各种"梦想"及其撞车人数 */
  crashData: [
    // 工作职场
    { dream: '想辞职去大理开民宿', count: 28473 },
    { dream: '想裸辞环游世界', count: 67218 },
    { dream: '想转行做设计', count: 48392 },
    { dream: '想做自由职业者', count: 76234 },
    { dream: '想考公上岸', count: 218745 },
    { dream: '想辞职创业', count: 89234 },
    { dream: '想转行做程序员', count: 134567 },
    { dream: '想开一家自己的咖啡店', count: 134782 },
    { dream: '想回老家躺平', count: 156789 },
    { dream: '想进大厂', count: 98765 },

    // 婚姻家庭
    { dream: '想结婚', count: 245678 },
    { dream: '想离婚但不敢', count: 189234 },
    { dream: '想丁克不生孩子', count: 112345 },
    { dream: '想跟现任分手', count: 167890 },
    { dream: '想遇到灵魂伴侣', count: 234567 },
    { dream: '想给父母买套房', count: 67890 },
    { dream: '想生二胎', count: 45678 },
    { dream: '想找一个靠谱的对象', count: 287654 },

    // 生活日常
    { dream: '想养一只猫', count: 312456 },
    { dream: '想养一只狗', count: 234567 },
    { dream: '想学会做菜', count: 148923 },
    { dream: '想早睡早起', count: 345678 },
    { dream: '想断舍离精简生活', count: 56789 },
    { dream: '想搬到海边住', count: 78901 },
    { dream: '想去乡下种菜养花', count: 45678 },

    // 个人成长
    { dream: '想写一本小说', count: 152391 },
    { dream: '想学一门乐器', count: 92456 },
    { dream: '想学画画', count: 87341 },
    { dream: '想学一门外语', count: 193456 },
    { dream: '想读100本书', count: 123456 },
    { dream: '想考一个研究生', count: 87654 },
    { dream: '想学会摄影', count: 67890 },

    // 健康养生
    { dream: '想每天跑步5公里', count: 267893 },
    { dream: '想减肥20斤', count: 345678 },
    { dream: '想练出马甲线', count: 123456 },
    { dream: '想戒掉熬夜', count: 298765 },
    { dream: '想去体检但不敢', count: 187654 },
    { dream: '想学会冥想', count: 45678 },
    { dream: '想戒掉奶茶', count: 234567 },

    // 财务自由
    { dream: '想攒够100万提前退休', count: 98567 },
    { dream: '想财务自由', count: 234567 },
    { dream: '想还清房贷', count: 187654 },
    { dream: '想靠副业赚钱', count: 145678 },
    { dream: '想买自己的房子', count: 267890 },
    { dream: '想中一次彩票', count: 345678 },

    // 旅行/体验
    { dream: '想去冰岛看极光', count: 56789 },
    { dream: '想gap year一年', count: 34567 },
    { dream: '想一个人去旅行', count: 123456 },
    { dream: '想坐一次热气球', count: 23456 },
    { dream: '想去看一场极光', count: 45678 },

    // 人际关系
    { dream: '想扩大社交圈', count: 123456 },
    { dream: '想不再讨好别人', count: 189012 },
    { dream: '想学会拒绝', count: 234567 },
    { dream: '想联系旧友但不知从何说起', count: 145678 },
    { dream: '想找一个能深度交流的朋友', count: 98765 },
  ],

  /** 转化率统计 */
  conversionData: [
    // 健康
    { name: '每天跑5公里', attempted: 267893, done: 2345 },
    { name: '减肥20斤', attempted: 345678, done: 15678 },
    { name: '戒掉熬夜', attempted: 298765, done: 5678 },
    { name: '戒掉奶茶', attempted: 234567, done: 12345 },
    { name: '练出马甲线', attempted: 123456, done: 3456 },

    // 学习成长
    { name: '学一门外语', attempted: 193456, done: 4678 },
    { name: '写一本小说', attempted: 152391, done: 892 },
    { name: '读100本书', attempted: 123456, done: 2345 },
    { name: '考一个研究生', attempted: 87654, done: 12345 },
    { name: '自学画画', attempted: 87341, done: 8901 },

    // 乐器
    { name: '学会弹吉他', attempted: 92456, done: 4567 },
    { name: '学会弹钢琴', attempted: 45678, done: 1234 },

    // 工作财务
    { name: '考公上岸', attempted: 218745, done: 12345 },
    { name: '攒够100万', attempted: 98567, done: 2345 },
    { name: '做自由职业', attempted: 76234, done: 15678 },
    { name: '辞职创业', attempted: 89234, done: 5678 },
    { name: '靠副业赚钱', attempted: 145678, done: 23456 },

    // 生活
    { name: '早睡早起', attempted: 312456, done: 9876 },
    { name: '开一家咖啡店', attempted: 134782, done: 12345 },
    { name: '学会做菜', attempted: 148923, done: 34567 },

    // 婚姻情感
    { name: '找到灵魂伴侣', attempted: 234567, done: 34567 },
    { name: '成功离婚', attempted: 189234, done: 56789 },
    { name: '丁克到底', attempted: 112345, done: 23456 },
  ],

  /** 未完成博物馆 */
  museumData: [
    // 健身/运动
    { quote: '买了全套装备，跑了一次就再也没跑过。装备还在，膝盖已经不年轻了。', tag: '跑步', reason: '下雨天太多' },
    { quote: '立了30岁前跑一次马拉松的flag，30岁那天给自己买了双跑鞋作为生日礼物。31岁生日那天把跑鞋捐了。', tag: '跑步', reason: '膝盖不行了' },
    { quote: '办了三年健身卡，去了七次。平均每次的健身成本是857块钱，够请私教上一节课了。但我没请。', tag: '健身', reason: '下班后只想躺着' },
    { quote: '发誓每天做100个俯卧撑，第一天做了50个，第二天胳膊抬不起来了，第三天发誓再也不发誓了。', tag: '健身', reason: '第二天就废了' },
    { quote: '买了个瑜伽垫准备每天早起拉伸，现在它是我家猫的专属睡垫。', tag: '健身', reason: '猫比我更需要它' },

    // 学习/技能
    { quote: '报了三年的日语班，学了五十音图三遍，每次从头学。老师说你再这样学费可以当慈善了。', tag: '外语', reason: '工作太忙' },
    { quote: '想学Python转行，B站收藏夹里有200多个教学视频。打开最多的是那个"收藏了等于学了"的弹幕。', tag: '编程', reason: '看不懂' },
    { quote: '买了个素描本决定每天画一张，第一张画了一个很丑的苹果，之后本子就再也没翻开过。', tag: '绘画', reason: '画得太丑' },

    // 乐器
    { quote: '买了吉他，调好音，擦了灰，卖了。前后用了两周。买家是个刚辞职的年轻人，跟我当年一样。', tag: '乐器', reason: '没有天赋' },
    { quote: '学尤克里里是想在聚会上露一手，结果唯一会弹的一首曲子是《小星星》。关键是还没完整弹过一遍。', tag: '乐器', reason: '只学会了小星星' },
    { quote: '花三千买了把电钢琴，幻想自己能弹《致爱丽丝》。三个月后唯一会弹的是"两只老虎"的前两句。', tag: '乐器', reason: '手指不听话' },

    // 写作/创作
    { quote: '决定每天写1000字，第一天写了3000，第二天写了500，第三天……我已经很久没打开那个文档了。', tag: '写作', reason: '坚持不下去' },
    { quote: '开公众号那天发了朋友圈，之后6个月一篇文章都没写。阅读量最高的是第一篇——3个人看了，包括我自己和我妈。', tag: '写作', reason: '没人看就不想写了' },

    // 烹饪/生活
    { quote: '烤箱、空气炸锅、破壁机、面包机，全买齐的那天觉得自己会是个很会生活的人。现在它们的作用是让我觉得厨房看起来很充实。', tag: '烹饪', reason: '不想洗碗' },
    { quote: '发誓要每天做饭带便当，买了全套便当盒和保温袋。用了两次，现在便当盒在装我的螺丝和充电线。', tag: '烹饪', reason: '早上起不来' },
    { quote: '决定断舍离，扔东西扔到一半觉得"这个以后可能用得上"，然后收拾收拾又放回去了。', tag: '生活', reason: '舍不得扔' },
    { quote: '买了一堆多肉植物想打造阳台花园，三个月后只剩花盆了。', tag: '生活', reason: '浇水浇死了' },

    // 工作/转行
    { quote: '想转产品经理，买了三本入门书，一本看到第三章，两本没拆封。后来那家公司倒闭了，我也不想转了。', tag: '转行', reason: '被裁了' },
    { quote: '发誓今年一定要跳槽，更新了简历，看了三天招聘信息，然后告诉自己"年底再看看"。年底到了，简历还是那份。', tag: '职场', reason: '年底再说' },
    { quote: '想裸辞休息半年，算了算存款，够活三个月。然后默默打开了明天的闹钟。', tag: '职场', reason: '没钱' },

    // 情感/婚姻
    { quote: '跟对象吵架后发誓要分手，想了一百个分手的理由。第二天早上发现对方做了早餐，算了。', tag: '情感', reason: '心软了' },
    { quote: '相亲相了三十多次，每次见面都期待"这次不一样"，每次回家都觉得"还是一个人好"。', tag: '情感', reason: '没遇到对的人' },
    { quote: '决定要和父母好好沟通一次，打了一小时的腹稿。电话接通后："吃了没？""吃了。"——挂了。', tag: '家庭', reason: '话到嘴边说不出口' },

    // 财务
    { quote: '今年一定要存钱的flag立了五年。五年了，花呗额度倒是涨了不少。', tag: '理财', reason: '控制不住手' },
    { quote: '下载了记账App，坚持记了三天。第四天买了一堆东西，不想面对账单，把App删了。', tag: '理财', reason: '看了更焦虑' },
    { quote: '学会了定投，坚持了一个月。第二个月看到跌了赶紧赎回，之后再也没有打开过那个App。', tag: '理财', reason: '心脏受不了' },

    // 健康/作息
    { quote: '发誓今晚一定11点前睡。躺在床上刷手机，再抬头已经两点了。', tag: '作息', reason: '手机太好刷' },
    { quote: '办了体检卡，放在钱包里一年了。每次想预约都觉得自己还年轻，明天再去。明天的明天又到了明年。', tag: '健康', reason: '不敢看结果' },
  ],

  /** 愿望星河 — 用户愿望气泡 */
  wishes: [],

  /** 用户添加的自定义愿望 */
  customWishes: [],

  /** 当前用户输入 */
  currentWish: '',

  /**
   * ===== 方法 =====
   */

  /** 搜索撞车报告 */
  searchCrash(query) {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return this.crashData
      .filter(item => item.dream.includes(q))
      .sort((a, b) => b.count - a.count);
  },

  /** 获取转化率详情 */
  getConversion(item) {
    return {
      ...item,
      rate: item.done / item.attempted,
      failed: item.attempted - item.done
    };
  },

  /** 添加愿望 */
  addWish(text) {
    const wish = {
      id: Utils.uid(),
      text,
      done: false,
      createdAt: Date.now()
    };
    this.wishes.push(wish);
    this._saveWishes();
    return wish;
  },

  /** 切换愿望完成状态 */
  toggleWish(id) {
    const wish = this.wishes.find(w => w.id === id);
    if (wish) {
      wish.done = !wish.done;
      this._saveWishes();
    }
  },

  /** 加载持久化的愿望数据 */
  loadWishes() {
    this.wishes = Utils.storage.get('emotion_wishes', []);
  },

  /** 持久化愿望 */
  _saveWishes() {
    Utils.storage.set('emotion_wishes', this.wishes);
  },

  /** 获取愿望统计 */
  getWishStats() {
    const total = this.wishes.length;
    const done = this.wishes.filter(w => w.done).length;
    return { total, done, pending: total - done };
  },

  /** 随机获取一段心情语录 */
  getRandomMood() {
    const moods = [
      '今天你已经做得很好了。',
      '别着急，你的时区跟别人不一样。',
      '允许自己今天不努力。',
      '不是所有事都需要有意义。',
      '你比你以为的要厉害一点点。',
      '偶尔停下来，世界也不会塌。',
      '已经走到这里了，很不容易。',
      '没事的，大多数人都在假装会生活。',
      '你的拖延，背后是对完美的渴望。',
      '有时候放弃比坚持更需要勇气。',
      '慢慢来，比较快。',
      '你不需要活成别人期待的样子。',
      '疲惫的时候，躺着也是一种努力。',
      '接纳自己的普通，是成长的开始。',
      '今天不想跑，所以才去跑。今天不想活，所以才要活。',
      '你已经做得很好了，别太苛责自己。',
      '人生不是比赛，是体验。',
      '有些路慢慢走，才能看到风景。',
      '你的存在本身就是意义。',
      '不用每天都发光，偶尔暗一下也没关系。',
      '找不到答案的时候，就找自己。',
      '你值得被温柔对待。',
      '今天也是美好的一天。',
      '别让焦虑偷走你的快乐。',
      '你比你想象的要坚强得多。',
      '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
      '你不需要被所有人喜欢。',
      '你的感受是真实的，你的情绪是合理的。',
      '允许自己犯错，允许自己不够好。',
      '你的价值不需要通过别人来证明。',
    ];
    return Utils.pick(moods);
  }
};
