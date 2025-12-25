// 闽南粤东八市县级地图简化数据 - 重新排列版
const mapData = {
  // 厦门市 (4个区) - 第一行左侧
  "350203": { id: "350203", name: "思明区", city: "厦门市", x: 80, y: 80, width: 60, height: 60 },
  "350205": { id: "350205", name: "海沧区", city: "厦门市", x: 150, y: 80, width: 60, height: 60 },
  "350206": { id: "350206", name: "湖里区", city: "厦门市", x: 80, y: 150, width: 60, height: 60 },
  "350211": { id: "350211", name: "集美区", city: "厦门市", x: 150, y: 150, width: 60, height: 60 },
  
  // 漳州市 (2个区, 8个县/县级市) - 第二、三行左侧
  "350602": { id: "350602", name: "芗城区", city: "漳州市", x: 80, y: 230, width: 60, height: 60 },
  "350603": { id: "350603", name: "龙文区", city: "漳州市", x: 150, y: 230, width: 60, height: 60 },
  "350622": { id: "350622", name: "云霄县", city: "漳州市", x: 220, y: 230, width: 60, height: 60 },
  "350623": { id: "350623", name: "漳浦县", city: "漳州市", x: 80, y: 300, width: 60, height: 60 },
  "350624": { id: "350624", name: "诏安县", city: "漳州市", x: 150, y: 300, width: 60, height: 60 },
  "350625": { id: "350625", name: "长泰县", city: "漳州市", x: 220, y: 300, width: 60, height: 60 },
  "350626": { id: "350626", name: "东山县", city: "漳州市", x: 290, y: 300, width: 60, height: 60 },
  "350627": { id: "350627", name: "南靖县", city: "漳州市", x: 80, y: 370, width: 60, height: 60 },
  "350628": { id: "350628", name: "平和县", city: "漳州市", x: 150, y: 370, width: 60, height: 60 },
  "350681": { id: "350681", name: "龙海市", city: "漳州市", x: 220, y: 370, width: 60, height: 60 },
  
  // 潮州市 (2个区, 1个县) - 第一行中间
  "445102": { id: "445102", name: "湘桥区", city: "潮州市", x: 290, y: 80, width: 60, height: 60 },
  "445103": { id: "445103", name: "潮安区", city: "潮州市", x: 360, y: 80, width: 60, height: 60 },
  "445122": { id: "445122", name: "饶平县", city: "潮州市", x: 430, y: 80, width: 60, height: 60 },
  
  // 汕头市 (6个区, 1个县) - 第二、三行中间
  "440507": { id: "440507", name: "龙湖区", city: "汕头市", x: 290, y: 150, width: 60, height: 60 },
  "440511": { id: "440511", name: "金平区", city: "汕头市", x: 360, y: 150, width: 60, height: 60 },
  "440512": { id: "440512", name: "濠江区", city: "汕头市", x: 430, y: 150, width: 60, height: 60 },
  "440513": { id: "440513", name: "潮阳区", city: "汕头市", x: 500, y: 150, width: 60, height: 60 },
  "440514": { id: "440514", name: "潮南区", city: "汕头市", x: 290, y: 230, width: 60, height: 60 },
  "440515": { id: "440515", name: "澄海区", city: "汕头市", x: 360, y: 230, width: 60, height: 60 },
  "440523": { id: "440523", name: "南澳县", city: "汕头市", x: 430, y: 230, width: 60, height: 60 },
  
  // 揭阳市 (2个区, 2个县, 1个县级市) - 第一、二行右侧
  "445202": { id: "445202", name: "榕城区", city: "揭阳市", x: 500, y: 80, width: 60, height: 60 },
  "445203": { id: "445203", name: "揭东区", city: "揭阳市", x: 570, y: 80, width: 60, height: 60 },
  "445222": { id: "445222", name: "揭西县", city: "揭阳市", x: 500, y: 230, width: 60, height: 60 },
  "445224": { id: "445224", name: "惠来县", city: "揭阳市", x: 570, y: 230, width: 60, height: 60 },
  "445281": { id: "445281", name: "普宁市", city: "揭阳市", x: 500, y: 300, width: 60, height: 60 },
  
  // 汕尾市 (1个区, 2个县, 1个县级市) - 第三、四行右侧
  "441502": { id: "441502", name: "城区", city: "汕尾市", x: 570, y: 300, width: 60, height: 60 },
  "441521": { id: "441521", name: "海丰县", city: "汕尾市", x: 640, y: 300, width: 60, height: 60 },
  "441523": { id: "441523", name: "陆河县", city: "汕尾市", x: 570, y: 370, width: 60, height: 60 },
  "441581": { id: "441581", name: "陆丰市", city: "汕尾市", x: 640, y: 370, width: 60, height: 60 },
  
  // 惠州市 (2个区, 3个县) - 第四、五行
  "441302": { id: "441302", name: "惠城区", city: "惠州市", x: 290, y: 370, width: 60, height: 60 },
  "441303": { id: "441303", name: "惠阳区", city: "惠州市", x: 360, y: 370, width: 60, height: 60 },
  "441322": { id: "441322", name: "博罗县", city: "惠州市", x: 430, y: 370, width: 60, height: 60 },
  "441323": { id: "441323", name: "惠东县", city: "惠州市", x: 290, y: 440, width: 60, height: 60 },
  "441324": { id: "441324", name: "龙门县", city: "惠州市", x: 360, y: 440, width: 60, height: 60 },
  
  // 深圳市 (9个区) - 第一、二、三行最右侧
  "440303": { id: "440303", name: "罗湖区", city: "深圳市", x: 640, y: 80, width: 60, height: 60 },
  "440304": { id: "440304", name: "福田区", city: "深圳市", x: 710, y: 80, width: 60, height: 60 },
  "440305": { id: "440305", name: "南山区", city: "深圳市", x: 780, y: 80, width: 60, height: 60 },
  "440306": { id: "440306", name: "宝安区", city: "深圳市", x: 640, y: 150, width: 60, height: 60 },
  "440307": { id: "440307", name: "龙岗区", city: "深圳市", x: 710, y: 150, width: 60, height: 60 },
  "440308": { id: "440308", name: "盐田区", city: "深圳市", x: 780, y: 150, width: 60, height: 60 },
  "440309": { id: "440309", name: "龙华区", city: "深圳市", x: 640, y: 230, width: 60, height: 60 },
  "440310": { id: "440310", name: "坪山区", city: "深圳市", x: 710, y: 230, width: 60, height: 60 },
  "440311": { id: "440311", name: "光明区", city: "深圳市", x: 780, y: 230, width: 60, height: 60 }
};

// 获取所有城市列表
const cities = [...new Set(Object.values(mapData).map(item => item.city))];

// 获取某个城市的所有区域
function getRegionsByCity(city) {
  return Object.values(mapData).filter(item => item.city === city);
}

// 获取所有区域
function getAllRegions() {
  return Object.values(mapData);
}

// 根据ID获取区域信息
function getRegionById(id) {
  return mapData[id];
}