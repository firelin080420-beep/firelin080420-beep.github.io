// 用户认证相关功能

// 模拟授权用户列表
const authorizedUsers = [
  { username: 'admin', password: 'admin123' },
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

// 当前登录用户
let currentUser = null;

// 初始化登录页面
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  
  // 检查是否已登录
  checkLoginStatus();
  
  // 登录表单提交事件
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      // 验证用户
      const user = authenticateUser(username, password);
      
      if (user) {
        // 登录成功
        login(user, remember);
      } else {
        // 登录失败
        showError('用户名或密码错误，请重试');
      }
    });
  }
}

// 验证用户
function authenticateUser(username, password) {
  return authorizedUsers.find(user => user.username === username && user.password === password);
}

// 用户登录
function login(user, remember = false) {
  currentUser = user;
  
  // 保存登录状态
  if (remember) {
    localStorage.setItem('visitedTrackerUser', JSON.stringify(user));
  } else {
    sessionStorage.setItem('visitedTrackerUser', JSON.stringify(user));
  }
  
  // 跳转到地图页面
  window.location.href = 'map.html';
}

// 用户登出
function logout() {
  currentUser = null;
  
  // 清除登录状态
  localStorage.removeItem('visitedTrackerUser');
  sessionStorage.removeItem('visitedTrackerUser');
  
  // 跳转到登录页面
  window.location.href = 'index.html';
}

// 检查登录状态
function checkLoginStatus() {
  // 从本地存储获取登录状态
  const storedUser = localStorage.getItem('visitedTrackerUser') || sessionStorage.getItem('visitedTrackerUser');
  
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      
      // 如果当前页面不是地图或记录页面，则跳转到地图页面
      if (window.location.pathname.endsWith('index.html')) {
        window.location.href = 'map.html';
      }
    } catch (e) {
      console.error('解析用户数据失败', e);
      // 清除无效数据
      localStorage.removeItem('visitedTrackerUser');
      sessionStorage.removeItem('visitedTrackerUser');
    }
  } else {
    // 未登录状态
    // 如果当前页面不是登录页面，则跳转到登录页面
    if (!window.location.pathname.endsWith('index.html')) {
      window.location.href = 'index.html';
    }
  }
  
  return currentUser;
}

// 显示错误信息
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    
    // 3秒后自动隐藏错误信息
    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, 3000);
  }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 根据当前页面执行不同的初始化
  if (window.location.pathname.endsWith('index.html')) {
    initLoginPage();
  } else {
    // 检查登录状态
    checkLoginStatus();
    
    // 显示当前用户名
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
      userNameElement.textContent = `欢迎，${currentUser.username}`;
    }
    
    // 绑定登出按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
});