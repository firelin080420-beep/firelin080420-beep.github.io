// 本地存储相关功能

// 存储键名
const STORAGE_KEYS = {
  VISIT_RECORDS: 'visitedTrackerRecords',
  USER_PREFERENCES: 'visitedTrackerPreferences'
};

// 到访记录数据结构
// {
//   id: String,           // 记录唯一ID
//   regionId: String,     // 区域ID
//   regionName: String,   // 区域名称
//   cityName: String,     // 所属城市
//   visitDate: Date,      // 到访日期
//   photos: Array,        // 照片路径数组
//   createTime: Date,     // 创建时间
//   updateTime: Date      // 更新时间
// }

// 保存到访记录
function saveVisitRecord(record) {
  try {
    // 获取现有记录
    const records = getAllVisitRecords();
    
    // 检查是否已存在该区域的记录
    const existingIndex = records.findIndex(r => r.regionId === record.regionId);
    
    // 生成唯一ID和时间戳
    const now = new Date();
    if (!record.id) {
      record.id = generateUniqueId();
    }
    record.updateTime = now.toISOString();
    
    if (existingIndex >= 0) {
      // 更新现有记录
      record.createTime = records[existingIndex].createTime;
      records[existingIndex] = record;
    } else {
      // 添加新记录
      record.createTime = now.toISOString();
      records.push(record);
    }
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.VISIT_RECORDS, JSON.stringify(records));
    
    return record;
  } catch (error) {
    console.error('保存到访记录失败', error);
    return null;
  }
}

// 获取所有到访记录
function getAllVisitRecords() {
  try {
    const recordsJson = localStorage.getItem(STORAGE_KEYS.VISIT_RECORDS);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error('获取到访记录失败', error);
    return [];
  }
}

// 获取特定区域的到访记录
function getVisitRecordByRegionId(regionId) {
  const records = getAllVisitRecords();
  return records.find(record => record.regionId === regionId);
}

// 删除到访记录
function deleteVisitRecord(recordId) {
  try {
    const records = getAllVisitRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    
    localStorage.setItem(STORAGE_KEYS.VISIT_RECORDS, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error('删除到访记录失败', error);
    return false;
  }
}

// 保存用户偏好设置
function saveUserPreferences(preferences) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('保存用户偏好设置失败', error);
    return false;
  }
}

// 获取用户偏好设置
function getUserPreferences() {
  try {
    const preferencesJson = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferencesJson ? JSON.parse(preferencesJson) : {};
  } catch (error) {
    console.error('获取用户偏好设置失败', error);
    return {};
  }
}

// 清空所有数据（仅用于测试）
function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.VISIT_RECORDS);
  localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
}

// 生成唯一ID
function generateUniqueId() {
  return 'record_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 保存照片到本地存储
function savePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        // 生成唯一文件名
        const fileName = 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.' + getFileExtension(file.name);
        
        // 保存到本地存储
        localStorage.setItem(fileName, e.target.result);
        
        resolve(fileName);
      } catch (error) {
        console.error('保存照片失败', error);
        reject(error);
      }
    };
    
    reader.onerror = function(error) {
      console.error('读取照片失败', error);
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
}

// 获取照片数据
function getPhoto(fileName) {
  try {
    return localStorage.getItem(fileName);
  } catch (error) {
    console.error('获取照片失败', error);
    return null;
  }
}

// 删除照片
function deletePhoto(fileName) {
  try {
    localStorage.removeItem(fileName);
    return true;
  } catch (error) {
    console.error('删除照片失败', error);
    return false;
  }
}

// 获取文件扩展名
function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

// 导出所有数据
function exportData() {
  try {
    const data = {
      records: getAllVisitRecords(),
      preferences: getUserPreferences(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('导出数据失败', error);
    return null;
  }
}

// 导入数据
function importData(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.records) {
      localStorage.setItem(STORAGE_KEYS.VISIT_RECORDS, JSON.stringify(data.records));
    }
    
    if (data.preferences) {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
    }
    
    return true;
  } catch (error) {
    console.error('导入数据失败', error);
    return false;
  }
}