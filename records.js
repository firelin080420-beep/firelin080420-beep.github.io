// 记录页面相关功能

// 当前排序方式
let currentSort = 'date-desc';
// 当前查看的记录
let currentRecord = null;
// 照片预览相关
let currentPhotoIndex = 0;
let currentPhotoList = [];

// 初始化记录页面
function initRecordsPage() {
  // 检查登录状态
  checkLoginStatus();
  
  // 加载记录
  loadRecords();
  
  // 绑定按钮事件
  bindButtonEvents();
  
  // 绑定排序事件
  bindSortEvents();
  
  // 绑定照片查看器事件
  bindPhotoViewerEvents();
}

// 加载记录
function loadRecords() {
  const recordsContainer = document.getElementById('recordsContainer');
  const noRecordsMessage = document.getElementById('noRecordsMessage');
  
  if (!recordsContainer || !noRecordsMessage) return;
  
  // 获取所有到访记录
  let records = getAllVisitRecords();
  
  // 根据当前排序方式排序
  records = sortRecords(records, currentSort);
  
  // 清空容器
  recordsContainer.innerHTML = '';
  
  // 检查是否有记录
  if (records.length === 0) {
    // 显示无记录消息
    noRecordsMessage.classList.remove('hidden');
    recordsContainer.appendChild(noRecordsMessage);
    return;
  }
  
  // 隐藏无记录消息
  noRecordsMessage.classList.add('hidden');
  
  // 创建记录卡片
  records.forEach(record => {
    const card = createRecordCard(record);
    recordsContainer.appendChild(card);
  });
}

// 创建记录卡片
function createRecordCard(record) {
  const card = document.createElement('div');
  card.className = 'record-card';
  card.dataset.recordId = record.id;
  
  // 格式化日期
  const visitDate = new Date(record.visitDate);
  const formattedDate = visitDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 卡片内容
  card.innerHTML = `
    <div class="record-header">
      <h3 class="record-title">${record.regionName}</h3>
      <div class="record-date">${record.cityName} · ${formattedDate}</div>
    </div>
    <div class="record-content">
      <div class="photo-grid">
        ${createPhotoGrid(record.photos)}
      </div>
    </div>
    <div class="record-actions">
      <button class="record-action-btn edit-btn" data-record-id="${record.id}">
        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        编辑
      </button>
      <button class="record-action-btn delete-btn" data-record-id="${record.id}">
        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        删除
      </button>
    </div>
  `;
  
  // 绑定照片点击事件
  const photoGrid = card.querySelector('.photo-grid');
  if (photoGrid) {
    photoGrid.addEventListener('click', (e) => {
      const target = e.target.closest('.photo-grid-item');
      if (target && target.dataset.photoIndex !== undefined) {
        const index = parseInt(target.dataset.photoIndex);
        showRecordPhotos(record, index);
      }
    });
  }
  
  // 绑定编辑按钮事件
  const editBtn = card.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => editRecord(record));
  }
  
  // 绑定删除按钮事件
  const deleteBtn = card.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => confirmDeleteRecord(record));
  }
  
  return card;
}

// 创建照片网格
function createPhotoGrid(photos) {
  if (!photos || photos.length === 0) {
    return `
      <div class="photo-grid-item col-span-3 flex items-center justify-center bg-gray-100">
        <span class="text-gray-500 text-sm">暂无照片</span>
      </div>
    `;
  }
  
  let html = '';
  
  // 最多显示3张照片
  const displayPhotos = photos.slice(0, 3);
  
  displayPhotos.forEach((photo, index) => {
    const photoData = getPhoto(photo);
    
    if (photoData) {
      html += `
        <div class="photo-grid-item" data-photo-index="${index}">
          <img src="${photoData}" alt="照片 ${index + 1}">
        </div>
      `;
    }
  });
  
  // 如果有更多照片，显示数量
  if (photos.length > 3) {
    html += `
      <div class="photo-grid-item relative" data-photo-index="0">
        <img src="${getPhoto(photos[0])}" alt="照片预览">
        <div class="photo-count-overlay">+${photos.length - 3}</div>
      </div>
    `;
  }
  
  return html;
}

// 绑定按钮事件
function bindButtonEvents() {
  // 返回地图按钮
  const backToMapBtn = document.getElementById('backToMapBtn');
  if (backToMapBtn) {
    backToMapBtn.addEventListener('click', () => {
      window.location.href = 'map.html';
    });
  }
  
  // 从空状态前往地图按钮
  const goToMapFromEmptyBtn = document.getElementById('goToMapFromEmptyBtn');
  if (goToMapFromEmptyBtn) {
    goToMapFromEmptyBtn.addEventListener('click', () => {
      window.location.href = 'map.html';
    });
  }
}

// 绑定排序事件
function bindSortEvents() {
  const sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;
  
  // 设置当前排序方式
  sortSelect.value = currentSort;
  
  // 排序变化事件
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    loadRecords();
  });
}

// 绑定照片查看器事件
function bindPhotoViewerEvents() {
  // 关闭按钮
  const closePhotoViewerBtn = document.getElementById('closePhotoViewerBtn');
  if (closePhotoViewerBtn) {
    closePhotoViewerBtn.addEventListener('click', hidePhotoViewer);
  }
  
  // 上一张照片按钮
  const prevPhotoBtn = document.getElementById('prevPhotoBtn');
  if (prevPhotoBtn) {
    prevPhotoBtn.addEventListener('click', showPreviousPhoto);
  }
  
  // 下一张照片按钮
  const nextPhotoBtn = document.getElementById('nextPhotoBtn');
  if (nextPhotoBtn) {
    nextPhotoBtn.addEventListener('click', showNextPhoto);
  }
}

// 显示记录的照片
function showRecordPhotos(record, startIndex = 0) {
  try {
    const modal = document.getElementById('photoViewerModal');
    const image = document.getElementById('photoViewerImage');
    const counter = document.getElementById('photoCounter');
    
    if (!modal || !image || !counter) {
      console.error('照片查看器元素未找到');
      return;
    }
    
    if (!record.photos || record.photos.length === 0) {
      console.warn('该记录没有照片');
      return;
    }
  
  // 设置当前记录和照片列表
  currentRecord = record;
  currentPhotoList = record.photos.map(photo => getPhoto(photo));
  currentPhotoIndex = startIndex;
  
  // 设置当前照片
  image.src = currentPhotoList[currentPhotoIndex];
  
  // 更新计数器
  counter.textContent = `${currentPhotoIndex + 1} / ${currentPhotoList.length}`;
  
  // 显示弹窗
  modal.classList.remove('hidden');
  } catch (error) {
    console.error('显示照片时发生错误:', error);
    alert('无法查看照片，请重试');
  }
}

// 隐藏照片查看器
function hidePhotoViewer() {
  const modal = document.getElementById('photoViewerModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// 显示上一张照片
function showPreviousPhoto() {
  if (currentPhotoList.length === 0) return;
  
  currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
  
  const image = document.getElementById('photoViewerImage');
  const counter = document.getElementById('photoCounter');
  
  if (image && counter) {
    image.src = currentPhotoList[currentPhotoIndex];
    counter.textContent = `${currentPhotoIndex + 1} / ${currentPhotoList.length}`;
  }
}

// 显示下一张照片
function showNextPhoto() {
  if (currentPhotoList.length === 0) return;
  
  currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoList.length;
  
  const image = document.getElementById('photoViewerImage');
  const counter = document.getElementById('photoCounter');
  
  if (image && counter) {
    image.src = currentPhotoList[currentPhotoIndex];
    counter.textContent = `${currentPhotoIndex + 1} / ${currentPhotoList.length}`;
  }
}

// 编辑记录
function editRecord(record) {
  try {
    // 获取区域信息
    const region = getRegionById(record.regionId);
    
    if (region) {
      // 跳转到地图页面并显示编辑弹窗
      sessionStorage.setItem('editRecordId', record.id);
      window.location.href = 'map.html';
    } else {
      console.error('找不到区域信息:', record.regionId);
      alert('编辑失败，无法找到对应的区域信息');
    }
  } catch (error) {
    console.error('编辑记录时发生错误:', error);
    alert('编辑过程中发生错误，请重试');
  }
}

// 确认删除记录
function confirmDeleteRecord(record) {
  // 创建确认弹窗
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="confirm-modal-content">
      <h3 class="confirm-modal-title">确认删除</h3>
      <p class="confirm-modal-message">确定要删除 "${record.regionName}" 的到访记录吗？此操作无法撤销。</p>
      <div class="confirm-modal-actions">
        <button class="confirm-btn cancel-btn">取消</button>
        <button class="confirm-btn confirm-delete-btn">删除</button>
      </div>
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(modal);
  
  // 绑定取消按钮事件
  const cancelBtn = modal.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
  }
  
  // 绑定删除按钮事件
  const deleteBtn = modal.querySelector('.confirm-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      // 删除记录
      deleteRecord(record.id);
      
      // 移除弹窗
      modal.remove();
    });
  }
}

// 删除记录
function deleteRecord(recordId) {
  // 获取记录
  const record = getAllVisitRecords().find(r => r.id === recordId);
  
  if (!record) return;
  
  // 删除相关照片
  if (record.photos && record.photos.length > 0) {
    record.photos.forEach(photo => deletePhoto(photo));
  }
  
  // 删除记录
  const success = deleteVisitRecord(recordId);
  
  if (success) {
    // 从页面中移除卡片
    const card = document.querySelector(`.record-card[data-record-id="${recordId}"]`);
    if (card) {
      card.remove();
    }
    
    // 检查是否还有记录
    if (getAllVisitRecords().length === 0) {
      // 显示无记录消息
      const recordsContainer = document.getElementById('recordsContainer');
      const noRecordsMessage = document.getElementById('noRecordsMessage');
      
      if (recordsContainer && noRecordsMessage) {
        noRecordsMessage.classList.remove('hidden');
        recordsContainer.appendChild(noRecordsMessage);
      }
    }
    
    // 显示成功消息
    alert('记录已删除');
  } else {
    alert('删除失败，请重试');
  }
}

// 排序记录
function sortRecords(records, sortType) {
  if (!records || records.length === 0) return [];
  
  const sortedRecords = [...records];
  
  switch (sortType) {
    case 'date-asc':
      // 日期从旧到新
      sortedRecords.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
      break;
    case 'date-desc':
      // 日期从新到旧
      sortedRecords.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
      break;
    case 'name-asc':
      // 名称A-Z
      sortedRecords.sort((a, b) => a.regionName.localeCompare(b.regionName));
      break;
    case 'name-desc':
      // 名称Z-A
      sortedRecords.sort((a, b) => b.regionName.localeCompare(a.regionName));
      break;
    default:
      // 默认日期从新到旧
      sortedRecords.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  }
  
  return sortedRecords;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.endsWith('records.html')) {
    initRecordsPage();
  }
});