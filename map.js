// 地图相关功能

// 当前选中的区域
let selectedRegion = null;
// 照片预览相关
let currentPhotoIndex = 0;
let currentPhotoList = [];

// 初始化地图页面
function initMapPage() {
  // 检查登录状态
  checkLoginStatus();
  
  // 加载地图
  loadMap();
  
  // 更新统计信息
  updateStatistics();
  
  // 绑定按钮事件
  bindButtonEvents();
  
  // 绑定弹窗事件
  bindModalEvents();
  
  // 绑定照片上传事件
  bindPhotoUploadEvents();
}

// 加载地图
function loadMap() {
  const mapSvg = document.getElementById('mapSvg');
  if (!mapSvg) return;
  
  // 清空地图
  mapSvg.innerHTML = '';
  
  // 获取所有区域数据
  const regions = getAllRegions();
  
  // 获取已到访的区域
  const visitedRegions = getAllVisitRecords().map(record => record.regionId);
  
  // 绘制每个区域
  regions.forEach(region => {
    // 创建矩形区域
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', `region-${region.id}`);
    rect.setAttribute('x', region.x);
    rect.setAttribute('y', region.y);
    rect.setAttribute('width', region.width);
    rect.setAttribute('height', region.height);
    rect.setAttribute('class', `map-region ${visitedRegions.includes(region.id) ? 'visited' : ''}`);
    rect.setAttribute('data-region-id', region.id);
    
    // 添加点击事件
    rect.addEventListener('click', () => handleRegionClick(region));
    
    // 添加悬停事件
    rect.addEventListener('mouseover', (e) => showRegionTooltip(e, region));
    rect.addEventListener('mouseout', hideRegionTooltip);
    
    // 添加到地图
    mapSvg.appendChild(rect);
    
    // 创建区域名称标签
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', region.x + region.width / 2);
    text.setAttribute('y', region.y + region.height / 2);
    text.setAttribute('class', 'region-label');
    text.textContent = region.name;
    
    // 添加到地图
    mapSvg.appendChild(text);
  });
  
  // 创建城市标签
  createCityLabels();
}

// 创建城市标签
function createCityLabels() {
  const mapSvg = document.getElementById('mapSvg');
  if (!mapSvg) return;
  
  // 城市标签位置 - 重新排列版
  const cityLabels = [
    { name: '厦门市', x: 115, y: 115 },
    { name: '漳州市', x: 150, y: 300 },
    { name: '潮州市', x: 360, y: 115 },
    { name: '汕头市', x: 360, y: 190 },
    { name: '揭阳市', x: 535, y: 155 },
    { name: '汕尾市', x: 605, y: 335 },
    { name: '惠州市', x: 360, y: 405 },
    { name: '深圳市', x: 710, y: 155 }
  ];
  
  // 绘制每个城市标签
  cityLabels.forEach(city => {
    // 创建城市名称背景
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', city.x - 30);
    rect.setAttribute('y', city.y - 15);
    rect.setAttribute('width', 60);
    rect.setAttribute('height', 30);
    rect.setAttribute('rx', 15);
    rect.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
    rect.setAttribute('stroke', '#3b82f6');
    rect.setAttribute('stroke-width', 1);
    
    // 创建城市名称文本
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', city.x);
    text.setAttribute('y', city.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#1e40af');
    text.textContent = city.name;
    
    // 添加到地图
    mapSvg.appendChild(rect);
    mapSvg.appendChild(text);
  });
}

// 处理区域点击事件
function handleRegionClick(region) {
  selectedRegion = region;
  
  // 检查是否已有到访记录
  const existingRecord = getVisitRecordByRegionId(region.id);
  
  // 显示记录弹窗
  showRecordModal(existingRecord);
}

// 显示区域工具提示
function showRegionTooltip(event, region) {
  // 检查是否已有到访记录
  const record = getVisitRecordByRegionId(region.id);
  
  // 创建工具提示元素
  let tooltip = document.getElementById('region-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'region-tooltip';
    tooltip.className = 'region-tooltip';
    document.body.appendChild(tooltip);
  }
  
  // 设置工具提示内容
  let content = `<strong>${region.name}</strong><br>${region.city}`;
  if (record) {
    const visitDate = new Date(record.visitDate).toLocaleDateString('zh-CN');
    content += `<br><br>到访日期: ${visitDate}`;
    if (record.photos && record.photos.length > 0) {
      content += `<br>照片数量: ${record.photos.length}`;
    }
  }
  
  tooltip.innerHTML = content;
  
  // 显示工具提示
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.classList.add('visible');
}

// 隐藏区域工具提示
function hideRegionTooltip() {
  const tooltip = document.getElementById('region-tooltip');
  if (tooltip) {
    tooltip.classList.remove('visible');
  }
}

// 显示记录弹窗
function showRecordModal(record = null) {
  const modal = document.getElementById('recordModal');
  const regionIdInput = document.getElementById('regionId');
  const regionNameInput = document.getElementById('regionName');
  const visitDateInput = document.getElementById('visitDate');
  const photoPreviewArea = document.getElementById('photoPreviewArea');
  const photoPreviews = document.getElementById('photoPreviews');
  
  if (!modal || !regionIdInput || !regionNameInput || !visitDateInput) return;
  
  // 设置区域信息
  regionIdInput.value = selectedRegion.id;
  regionNameInput.value = `${selectedRegion.name} (${selectedRegion.city})`;
  
  // 设置日期（今天或已有记录的日期）
  if (record && record.visitDate) {
    visitDateInput.value = record.visitDate;
  } else {
    const today = new Date();
    visitDateInput.value = today.toISOString().split('T')[0];
  }
  
  // 清空照片预览
  photoPreviews.innerHTML = '';
  photoPreviewArea.classList.add('hidden');
  
  // 如果有记录且有照片，显示照片预览
  if (record && record.photos && record.photos.length > 0) {
    record.photos.forEach((photo, index) => {
      const photoData = getPhoto(photo);
      if (photoData) {
        const preview = createPhotoPreview(photoData, photo, index);
        photoPreviews.appendChild(preview);
      }
    });
    
    if (photoPreviews.children.length > 0) {
      photoPreviewArea.classList.remove('hidden');
    }
  }
  
  // 显示弹窗
  modal.classList.remove('hidden');
}

// 隐藏记录弹窗
function hideRecordModal() {
  const modal = document.getElementById('recordModal');
  if (modal) {
    modal.classList.add('hidden');
    selectedRegion = null;
  }
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
  
  // 查看记录按钮
  const toRecordsBtn = document.getElementById('toRecordsBtn');
  if (toRecordsBtn) {
    toRecordsBtn.addEventListener('click', () => {
      window.location.href = 'records.html';
    });
  }
  
  // 重置视图按钮
  const resetViewBtn = document.getElementById('resetViewBtn');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      // 在实际应用中，这里可以重置地图视图
      alert('地图视图已重置');
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

// 绑定弹窗事件
function bindModalEvents() {
  // 关闭弹窗按钮
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideRecordModal);
  }
  
  // 取消按钮
  const cancelRecordBtn = document.getElementById('cancelRecordBtn');
  if (cancelRecordBtn) {
    cancelRecordBtn.addEventListener('click', hideRecordModal);
  }
  
  // 记录表单提交
  const recordForm = document.getElementById('recordForm');
  if (recordForm) {
    recordForm.addEventListener('submit', handleRecordSubmit);
  }
  
  // 照片查看器关闭按钮
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

// 绑定照片上传事件
function bindPhotoUploadEvents() {
  const photoUploadArea = document.getElementById('photoUploadArea');
  const photoInput = document.getElementById('photoInput');
  
  if (!photoUploadArea || !photoInput) return;
  
  // 点击上传区域触发文件选择
  photoUploadArea.addEventListener('click', () => {
    photoInput.click();
  });
  
  // 文件选择变化事件
  photoInput.addEventListener('change', handlePhotoSelect);
  
  // 拖放事件
  photoUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoUploadArea.classList.add('dragover');
  });
  
  photoUploadArea.addEventListener('dragleave', () => {
    photoUploadArea.classList.remove('dragover');
  });
  
  photoUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    photoUploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      handlePhotoFiles(e.dataTransfer.files);
    }
  });
}

// 处理照片选择
function handlePhotoSelect(event) {
  if (event.target.files.length > 0) {
    handlePhotoFiles(event.target.files);
  }
}

// 处理照片文件
function handlePhotoFiles(files) {
  const photoPreviews = document.getElementById('photoPreviews');
  const photoPreviewArea = document.getElementById('photoPreviewArea');
  
  if (!photoPreviews || !photoPreviewArea) return;
  
  // 限制最多5张照片
  const maxPhotos = 5;
  const currentPhotos = photoPreviews.children.length;
  const remainingSlots = maxPhotos - currentPhotos;
  const filesToProcess = Math.min(files.length, remainingSlots);
  
  if (filesToProcess === 0) {
    alert('最多只能上传5张照片');
    return;
  }
  
  // 处理选中的照片
  for (let i = 0; i < filesToProcess; i++) {
    const file = files[i];
    
    // 检查文件类型
    if (!file.type.match('image.*')) {
      continue;
    }
    
    // 读取文件并显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = createPhotoPreview(e.target.result, null, photoPreviews.children.length);
      photoPreviews.appendChild(preview);
      photoPreviewArea.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

// 创建照片预览元素
function createPhotoPreview(src, fileName, index) {
  const preview = document.createElement('div');
  preview.className = 'photo-preview';
  
  const img = document.createElement('img');
  img.src = src;
  img.alt = `照片 ${index + 1}`;
  
  // 添加点击事件查看大图
  img.addEventListener('click', () => {
    showPhotoInViewer(src, index);
  });
  
  const removeBtn = document.createElement('div');
  removeBtn.className = 'remove-photo';
  removeBtn.innerHTML = '&times;';
  
  // 添加点击事件删除照片
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    preview.remove();
    
    // 如果没有照片了，隐藏预览区域
    const photoPreviews = document.getElementById('photoPreviews');
    const photoPreviewArea = document.getElementById('photoPreviewArea');
    
    if (photoPreviews && photoPreviewArea && photoPreviews.children.length === 0) {
      photoPreviewArea.classList.add('hidden');
    }
  });
  
  preview.appendChild(img);
  preview.appendChild(removeBtn);
  
  // 存储文件名（如果有）
  if (fileName) {
    preview.dataset.fileName = fileName;
  }
  
  return preview;
}

// 显示照片查看器
function showPhotoInViewer(src, index) {
  const modal = document.getElementById('photoViewerModal');
  const image = document.getElementById('photoViewerImage');
  const counter = document.getElementById('photoCounter');
  
  if (!modal || !image || !counter) return;
  
  // 获取所有预览照片
  const previews = document.querySelectorAll('#photoPreviews .photo-preview img');
  currentPhotoList = Array.from(previews).map(img => img.src);
  currentPhotoIndex = index;
  
  // 设置当前照片
  image.src = src;
  
  // 更新计数器
  counter.textContent = `${index + 1} / ${currentPhotoList.length}`;
  
  // 显示弹窗
  modal.classList.remove('hidden');
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

// 处理记录表单提交
function handleRecordSubmit(event) {
  event.preventDefault();
  
  try {
    const regionId = document.getElementById('regionId').value;
    const visitDate = document.getElementById('visitDate').value;
    const photoPreviews = document.getElementById('photoPreviews');
    
    if (!regionId || !visitDate) {
      alert('请填写完整的到访信息');
      return;
    }
  
  // 收集照片
  const photos = [];
  const previews = photoPreviews.querySelectorAll('.photo-preview');
  
  // 保存新照片
  const savePromises = [];
  
  previews.forEach(preview => {
    // 如果已有文件名（编辑模式），直接使用
    if (preview.dataset.fileName) {
      photos.push(preview.dataset.fileName);
    } else {
      // 否则，获取图片数据并保存
      const img = preview.querySelector('img');
      if (img) {
        // 从DataURL创建Blob
        const blob = dataURLToBlob(img.src);
        
        // 创建临时文件对象
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type });
        
        // 保存照片
        savePromises.push(
          savePhoto(file).then(fileName => {
            photos.push(fileName);
          })
        );
      }
    }
  });
  
  // 等待所有照片保存完成
  Promise.all(savePromises).then(() => {
    // 创建记录对象
    const record = {
      regionId: regionId,
      regionName: selectedRegion.name,
      cityName: selectedRegion.city,
      visitDate: visitDate,
      photos: photos
    };
    
    // 检查是否已有记录
    const existingRecord = getVisitRecordByRegionId(regionId);
    if (existingRecord) {
      record.id = existingRecord.id;
      
      // 删除不再使用的照片
      const photosToDelete = existingRecord.photos.filter(photo => !photos.includes(photo));
      photosToDelete.forEach(photo => deletePhoto(photo));
    }
    
    // 保存记录
    const savedRecord = saveVisitRecord(record);
    
    if (savedRecord) {
      // 更新地图显示
      updateRegionDisplay(regionId, true);
      
      // 更新统计信息
      updateStatistics();
      
      // 隐藏弹窗
      hideRecordModal();
      
      // 显示成功消息
      alert('到访记录已保存');
    } else {
      alert('保存失败，请重试');
    }
  }).catch(error => {
    console.error('保存照片失败', error);
    alert('保存照片失败，请重试');
  });
  } catch (error) {
    console.error('提交记录时发生错误:', error);
    alert('保存记录失败，请重试');
  }
}

// 更新区域显示
function updateRegionDisplay(regionId, isVisited) {
  const regionElement = document.getElementById(`region-${regionId}`);
  if (!regionElement) return;
  
  if (isVisited) {
    // 添加到访样式
    regionElement.classList.add('visited');
    
    // 添加点亮动画
    regionElement.classList.add('light-up-animation');
    
    // 动画结束后移除动画类
    setTimeout(() => {
      regionElement.classList.remove('light-up-animation');
    }, 1500);
  } else {
    // 移除到访样式
    regionElement.classList.remove('visited');
  }
}

// 更新统计信息
function updateStatistics() {
  const visitedCountElement = document.getElementById('visitedCount');
  const totalCountElement = document.getElementById('totalCount');
  const progressBarElement = document.getElementById('progressBar');
  
  if (!visitedCountElement || !totalCountElement || !progressBarElement) return;
  
  // 获取总区域数
  const totalCount = getAllRegions().length;
  
  // 获取已到访区域数
  const visitedCount = getAllVisitRecords().length;
  
  // 计算进度百分比
  const progressPercentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;
  
  // 更新显示
  visitedCountElement.textContent = visitedCount;
  totalCountElement.textContent = totalCount;
  progressBarElement.style.width = `${progressPercentage}%`;
}

// 将DataURL转换为Blob
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.endsWith('map.html')) {
    initMapPage();
  }
});

// 检查是否有编辑记录的请求
function checkEditRecordRequest() {
  const editRecordId = sessionStorage.getItem('editRecordId');
  if (editRecordId) {
    // 获取记录
    const record = getAllVisitRecords().find(r => r.id === editRecordId);
    if (record) {
      // 获取区域信息
      const region = getRegionById(record.regionId);
      if (region) {
        // 设置选中的区域
        selectedRegion = region;
        
        // 延迟显示弹窗，确保页面完全加载
        setTimeout(() => {
          showRecordModal(record);
        }, 500);
      }
    }
    
    // 清除编辑请求
    sessionStorage.removeItem('editRecordId');
  }
}

// 扩展initMapPage函数以支持编辑模式
const originalInitMapPage = initMapPage;
initMapPage = function() {
  originalInitMapPage();
  
  // 检查是否有编辑记录的请求
  checkEditRecordRequest();
};