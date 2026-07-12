# iOS 使用方式

## 最快体验

1. 在项目根目录运行 `pnpm --filter ttc-meal-gacha-mobile start`。
2. iPhone 安装 Expo Go。
3. 扫终端里的二维码即可打开。

这种方式不用把本 App 上架 App Store，但用户需要安装 Expo Go。

## 本地网页预览

ASCII 风格的 React Native 版本也可以用 Expo Web 预览：

```bash
pnpm --filter ttc-meal-gacha-mobile exec expo start --web
```

当前 UI 使用黑底 ASCII 决策终端风格，并已按 320、390、430 px 宽度做过浏览器截图检查。

## 不上架 App Store 的独立安装包

使用 Expo EAS internal distribution：

```bash
pnpm --filter ttc-meal-gacha-mobile dlx eas-cli build --platform ios --profile preview
```

注意：

- 需要 Apple Developer 账号。
- iOS 真机需要登记设备 UDID，EAS 会用 ad hoc provisioning profile 打包。
- 这不是公开上架 App Store，也不是 TestFlight 公测。
