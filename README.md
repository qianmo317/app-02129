# Vue3 天气预报应用

一款基于 Vue3 + Element Plus 的单页天气预报应用，支持城市搜索、天气展示、历史记录等功能。

## How to Run

### 方式一：Docker 运行（推荐）

```bash
# 使用 docker-compose 构建并启动
docker-compose up --build -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend-admin

# 停止服务
docker-compose down
```

### 方式二：本地开发运行

```bash
# 进入项目目录
cd frontend-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 验证 ARM 镜像兼容性

```bash
# 验证基础镜像支持 ARM64
docker pull --platform linux/arm64 node:20-alpine
docker pull --platform linux/arm64 nginx:1.25-alpine
```

## Services

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| frontend-admin | 8081 | Vue3 天气预报前端应用 |

### 技术栈

- **前端框架**: Vue 3.4 + Composition API
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **HTTP 客户端**: Axios
- **天气 API**: Open-Meteo（免费开源，无需 API Key）
- **地理编码 API**: Open-Meteo Geocoding API
- **容器化**: Docker + Nginx

## 测试账号

本应用无需登录，直接访问即可使用。

### 测试城市示例

- 北京 (Beijing)
- 上海 (Shanghai)
- 广州 (Guangzhou)
- 深圳 (Shenzhen)
- 杭州 (Hangzhou)
- 成都 (Chengdu)
- 东京 (Tokyo)
- 纽约 (New York)

## 题目内容

单页版天气预报小应用（Vue）需求分析

一、核心目标

开发一款基于 Vue 的单页天气预报应用，支持用户查询指定城市的天气信息，界面简洁、操作便捷，满足入门级前端开发实践需求。

二、功能需求

1. 城市搜索功能
- 支持手动输入城市名称进行搜索，提供输入提示或模糊匹配功能。
- 搜索结果支持快速选中，切换展示对应城市的天气数据。
- 处理搜索异常情况，如城市不存在、网络错误时给出明确提示。
2. 天气信息展示功能
- 显示当前城市的基础天气数据：城市名称、实时温度、天气状况（晴/雨/多云等）、湿度、风力风向。
- 展示未来1-3天的简易预报数据，包含日期、最高/最低温度、天气状况。
- 搭配天气图标（如晴天太阳、雨天云朵），直观呈现天气状态。
3. 本地存储功能
- 记录用户最近搜索的城市，页面刷新后保留历史记录。
- 支持一键清除历史搜索记录。
4. 页面交互功能
- 搜索按钮点击触发查询，支持回车键快捷搜索。
- 点击历史记录中的城市名称，可快速重新查询该城市天气。

三、非功能需求

1. 性能需求
- 接口请求响应后，页面数据渲染延迟不超过 500ms。
- 适配常见浏览器（Chrome、Firefox、Edge），无明显样式错乱。
2. 界面需求
- 采用简洁的响应式布局，兼容电脑端和手机端浏览。
- 配色清新直观，天气信息排版清晰，重点数据（如温度）突出显示。
3. 兼容性需求
- 基于 Vue3 开发，可搭配 Element Plus 等轻量 UI 组件库简化布局开发。
- 调用免费公开的天气 API（如和风天气、高德地图天气 API），无需复杂的鉴权配置。

根据以上要求帮我用vue写一个程序

## 项目结构

```
.
├── .gitignore                      # Git 忽略配置
├── docker-compose.yml              # Docker 编排文件
├── README.md                       # 项目文档
└── frontend-admin/                 # 前端项目
    ├── .env.example                # 环境变量示例
    ├── Dockerfile                  # Docker 构建文件（支持 ARM + X86）
    ├── index.html                  # HTML 模板
    ├── nginx.conf                  # Nginx 配置（含健康检查端点）
    ├── package.json                # 项目配置
    ├── vite.config.js              # Vite 配置
    ├── vitest.config.js            # Vitest 测试配置
    └── src/                        # 源代码目录
        ├── App.vue                 # 根组件
        ├── main.js                 # 入口文件
        ├── api/                    # API 接口封装
        │   ├── weather.js          # 天气 API 调用
        │   └── weather.test.js     # API 单元测试
        ├── components/             # 组件目录
        │   ├── CurrentWeather.vue  # 当前天气组件
        │   ├── ForecastList.vue    # 天气预报列表组件
        │   ├── SearchBox.vue       # 搜索框组件（含防抖）
        │   ├── SearchHistory.vue   # 搜索历史组件
        │   └── WeatherIcon.vue     # 天气图标组件
        ├── composables/            # 组合式函数
        │   ├── useDebounce.js      # 防抖 Hook
        │   ├── useLocalStorage.js  # 本地存储 Hook
        │   └── useWeatherCache.js  # 天气缓存 Hook
        ├── config/                 # 配置文件
        │   └── index.js            # 环境变量配置
        ├── styles/                 # 样式文件
        │   └── variables.css       # CSS 变量
        └── utils/                  # 工具函数
            ├── weatherCode.js      # 天气代码映射
            └── weatherCode.test.js # 工具函数单元测试
```

## License

MIT
