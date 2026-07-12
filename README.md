# 今日抽卡 ttc-meal-gacha

五道口吃喝抽卡器：抽一张「今天吃/喝什么」的卡，接入阿里云百炼（qwen-plus）做智能推荐，带本地兜底。

UI 为 **ASCII 决策终端风格**（像素字体 + 照片生成的三层扫描线画面），用 React Native (Expo) 实现，可以跑在 iPhone / Android / 浏览器上。

## 项目结构

```
├── mobile/                    # App（React Native + Expo）
│   ├── App.tsx                # 入口：字体加载、视图切换、历史状态
│   ├── src/
│   │   ├── theme.ts           # 调色板 + 像素字体名
│   │   ├── styles.ts          # 全部 StyleSheet（UI 样式唯一来源）
│   │   ├── history.ts         # 历史记录的存取 / 格式化工具
│   │   ├── api/               # API 客户端（地址推断、历史、AI 推荐）
│   │   ├── components/        # AnimatedStoreArt 动效 + Shell/Header 等公共件
│   │   ├── screens/           # Home / Draw / History 三个页面
│   │   ├── store-art-assets.ts# 自动生成的店铺美术映射（勿手改）
│   │   └── ui-art-assets.ts   # 首页/分类/记录页的美术映射
│   ├── assets/                # 字体、店铺美术（webp 三层：dense/sparse/glow）
│   └── scripts/               # 美术映射生成 + 资源校验脚本
├── packages/core/             # 共享逻辑：店铺数据、推荐算法、类型
├── server/                    # AI 推荐（百炼 API 调用）+ 历史文件存储
├── vite.config.ts             # 本地 API 服务（8787 端口，中间件形式）
└── data/history.json          # 服务端保存的抽卡历史
```

店铺美术映射重新生成：`cd mobile && node scripts/generate-art-map.mjs`（新增店铺 / 美术后执行）。

## 准备工作

- Node 22+、pnpm 10+
- 首次运行先装依赖：

```bash
pnpm install
```

- 配置大模型 Key（不配也能跑，只是推荐会退化成「本地兜底」）：

```bash
cp .env.example .env
# 编辑 .env，填入 DASHSCOPE_API_KEY（阿里云百炼 API Key）
```

## 启动

需要**两个终端**：

**终端 1 —— API 服务**（端口 8787，负责调大模型和存历史）：

```bash
pnpm api:dev
```

**终端 2 —— App（Web）**：

```bash
cd mobile
npx expo start --web
```

### 📱 手机浏览器打开（同一个 Wi-Fi 即可，无需装任何 App）

1. **手机和电脑连同一个 Wi-Fi**。
2. 电脑上查出本机局域网 IP：

   ```bash
   # Windows
   ipconfig        # 看无线网卡的 IPv4 地址，例如 192.168.1.23

   # macOS / Linux
   ifconfig
   ```

3. 手机浏览器直接打开：

   ```
   http://<电脑IP>:8081
   ```

   例如 `http://192.168.1.23:8081`。API 会自动指向 `<电脑IP>:8787`，无需配置。

连不上时排查：

- 确认两个终端都在跑（8081 是 App，8787 是 API）。
- Windows 防火墙可能拦了 Node 的 8081 / 8787 端口入站，放行即可。
- 公司网络隔离设备时，可用手机热点让电脑和手机同网。

### 💻 电脑浏览器预览

`npx expo start --web` 后直接打开 http://localhost:8081。

### 📱 Expo Go（原生 App 方式，可选）

1. 手机装 **Expo Go**（App Store / 应用商店搜 "Expo Go"），手机电脑同一 Wi-Fi。
2. `cd mobile && npx expo start`，终端出现二维码：
   - iPhone：系统相机扫码跳转 Expo Go；
   - Android：Expo Go 内置扫码。
3. API 会自动通过电脑的局域网 IP 访问 8787 端口，无需配置。

如需显式指定 API 地址：

```bash
# Windows (PowerShell)
$env:EXPO_PUBLIC_API_BASE_URL="http://<电脑IP>:8787"; npx expo start

# macOS / Linux
EXPO_PUBLIC_API_BASE_URL="http://<电脑IP>:8787" npx expo start
```

### 打独立安装包（不依赖 Expo Go）

见 `mobile/README-ios.md`，使用 EAS internal distribution，需要 Apple Developer 账号。

## 测试与检查

```bash
pnpm test        # 推荐算法单元测试
pnpm lint        # ESLint
pnpm typecheck   # TypeScript
```

## AI 推荐说明

- API 服务收到 `POST /api/recommend` 后调用百炼 `qwen-plus` 生成推荐队列，返回的 `engine` 字段为 `bailian`（AI 生效）或 `fallback`（本地规则兜底）。
- 大模型不可用、Key 未配置或响应超时，都会自动退回本地推荐算法，App 不会报错。
- 抽卡历史合并两处来源：App 本地存储 + 服务端 `data/history.json`，用于「避开重复」。
