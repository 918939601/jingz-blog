# 天气模块实现计划

- [x] 1. 设置项目结构和创建基础组件
  - 创建 `components/shared/weather-widget` 目录结构
  - 创建 `WeatherWidget.tsx` 主容器组件
  - 创建 `WeatherCard.tsx` 卡片展示组件
  - 创建 `types.ts` 定义 TypeScript 接口
  - _需求: 1.1, 2.1, 3.1_

- [x] 2. 实现 IP 地理位置获取功能
  - 创建 `lib/api/location.ts` 文件
  - 实现 `fetchLocationByIP()` 函数调用 ip-api.com
  - 添加错误处理和超时机制（5 秒超时）
  - 实现位置信息缓存逻辑
  - _需求: 1.1, 1.2, 1.3, 1.4_

- [x] 3. 实现天气数据获取功能
  - 创建 `lib/api/weather.ts` 文件
  - 实现 `fetchWeatherByCoordinates()` 函数调用 open-meteo.com
  - 解析 API 响应并转换为 Weather 对象
  - 添加错误处理和重试机制（最多 2 次重试）
  - _需求: 2.1, 2.2, 2.3, 5.2, 5.3_

- [x] 4. 实现 WeatherWidget 主组件逻辑
  - 在 `WeatherWidget.tsx` 中实现 React hooks（useState, useEffect）
  - 实现 `fetchLocation()` 方法获取用户位置
  - 实现 `fetchWeather()` 方法获取天气数据
  - 实现 `handleRefresh()` 方法手动刷新
  - 实现 `setupAutoRefresh()` 方法设置 10 分钟自动更新
  - 管理 loading、error、location、weather 状态
  - _需求: 1.1, 2.1, 4.1, 4.2, 4.3, 4.4_

- [x] 5. 实现 WeatherCard 展示组件
  - 创建卡片布局，显示位置、温度、天气描述
  - 显示详细信息：体感温度、湿度、风速
  - 添加天气图标或 Emoji 展示
  - 实现刷新按钮，支持点击刷新
  - 实现加载状态动画
  - 实现错误状态提示
  - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2_

- [x] 6. 实现响应式设计
  - 使用 Tailwind CSS 实现桌面端布局（≥1024px）
  - 实现平板端布局（768px - 1023px）
  - 实现移动端布局（< 768px）
  - 使用 `sticky` 定位在桌面端固定右侧
  - 在移动端转换为横向条形或堆叠布局
  - _需求: 3.3, 3.4, 3.5_

- [x] 7. 集成天气模块到首页
  - 在 `modules/main/page/main-home-page/index.tsx` 中导入 WeatherWidget
  - 调整首页布局以容纳天气模块
  - 确保天气模块不阻塞首页初始加载
  - 使用 React 的 Suspense 或 lazy loading 优化加载
  - _需求: 5.1_

- [ ]* 8. 编写单元测试
  - 测试 `fetchLocationByIP()` 函数的正确性
  - 测试 `fetchWeatherByCoordinates()` 函数的正确性
  - 测试错误处理和重试逻辑
  - 测试数据缓存机制
  - _需求: 5.2, 5.3_

- [ ]* 9. 编写集成测试
  - 测试完整的数据获取流程
  - 测试自动刷新机制
  - 测试手动刷新功能
  - 测试在不同网络条件下的表现
  - _需求: 4.1, 4.2, 4.3, 4.4_
