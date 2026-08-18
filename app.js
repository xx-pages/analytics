/////////////////////////////////////////////////////// 倒计时小组件 ///////////////////////////////////////////////
function updateCountdown() {
  const now = new Date();
  const targetYear = 2029;
  const targetDate = new Date(`${targetYear}-06-07T09:00:00`);

  const diff = targetDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (diff <= 0) {
    if (daysEl) daysEl.innerText = '000';
    if (hoursEl) hoursEl.innerText = '00';
    if (minutesEl) minutesEl.innerText = '00';
    if (secondsEl) secondsEl.innerText = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (daysEl) daysEl.innerText = String(days).padStart(3, '0');
  if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
}

/////////////////////////////////////////////////////// 每日一言 ///////////////////////////////////////////////
async function fetchDailyQuote() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const dateEl = document.getElementById('quote-date');
  if (dateEl) dateEl.innerText = `${month}月${date}日`;

  const contentEl = document.getElementById('quote-content');
  const authorEl = document.getElementById('quote-author');

  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=h');
    const data = await response.json();

    if (contentEl) contentEl.innerText = `“${data.hitokoto}”`;
    if (authorEl) authorEl.innerText = `— ${data.from_who || data.from || '网络'}`;
  } catch (error) {
    if (contentEl) contentEl.innerText = '“星光不问赶路人，时光不负有心人。”';
    if (authorEl) authorEl.innerText = '— 励志语录';
  }
}

/////////////////////////////////////////////////////// 抽屉菜单逻辑 ///////////////////////////////////////////////
function openMenu() {
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const menuOverlay = document.getElementById('menuOverlay');
  sidebarDrawer?.classList.add('open');
  menuOverlay?.classList.add('active');
}

function closeMenu() {
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const menuOverlay = document.getElementById('menuOverlay');
  sidebarDrawer?.classList.remove('open');
  menuOverlay?.classList.remove('active');
}

// 页面 DOM 完全加载后再绑定事件，确保能获取到 DOM 节点
document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化倒计时与一言
  updateCountdown();
  setInterval(updateCountdown, 1000);
  fetchDailyQuote();

  // 2. 绑定抽屉菜单按钮事件
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // 3. 绑定菜单跳转逻辑
  const navItems = document.querySelectorAll(".drawer-nav .nav-item");
  const viewOverall = document.getElementById("view-overall");
  const contentFrame = document.getElementById("content-frame");

  // 学科路由映射表
  const pageRoutes = {
    "主页": "overall",
    "总分": "pages/overall_score.html",
    "语文": "pages/chinese.html",
    "数学": "pages/math.html",
    "英语": "pages/english.html",
    "物理": "pages/physics.html",
    "化学": "pages/chemical.html",
    "生物": "pages/biology.html",
    "政治": "pages/politics.html",
    "历史": "pages/history.html",
    "地理": "pages/geography.html"
  };

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // 切换菜单高亮
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      // 获取学科名称
      const spanEl = item.querySelector("span");
      if (!spanEl) return;
      const subjectName = spanEl.textContent.trim();
      const route = pageRoutes[subjectName];

      // 跳转控制
      if (route === "overall") {
        if (viewOverall) viewOverall.style.display = "flex";
        if (contentFrame) contentFrame.style.display = "none";
      } else if (route && contentFrame) {
        if (viewOverall) viewOverall.style.display = "none";
        contentFrame.style.display = "block";
        contentFrame.src = route;
      }

      // 切换后收起菜单
      closeMenu();
    });
  });
});
