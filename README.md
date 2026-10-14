# Shared.Component

云途公共组件库。可复用的界面组件统一放在这里；每个组件包含独立源码、样式、演示、说明和测试。

在可以复用本组件库的组件时，请优先复用。本库的修改可能影响其他软件的功能，修改前请与相关维护者确认；不要未经需求授权更改既有组件 UI。

## 查看演示

直接双击根目录 **index.html**，在左侧选择组件。无需启动服务、无需联网、无需先安装 Node.js。离线演示包已随目录保存；不要只复制 HTML 而遗漏 JS/CSS。

| 组件 | 说明 | 文档 | 独立演示 |
| --- | --- | --- | --- |
| yuntu_grid | 从获客项目抽取的云途数据表格，保留原有 UI | [README](yuntu_grid/README.md) | [打开演示](yuntu_grid/demo/index.html) |

## 深复制使用

遵循 [YuntuShared](https://github.com/YuntuAGI/YuntuShared) 的要求：**将需要的组件完整复制到自己的项目目录，确保业务项目可以独立编译。** 不使用 `D:\git\Shared.Component` 绝对路径、符号链接或跨仓库运行时引用。

推荐把 `yuntu_grid/` 深复制到业务项目的 `src/components/yuntu_grid/`，从其中的 `src/index.js` 导入。React、React DOM 和图标依赖由业务项目安装；详见组件 README。也可使用复制目录中的预编译 `dist/`，它仅依赖业务项目的 React / React DOM。

共享规范用于目录和复用方式。当前 Grid 沿用获客项目的奶油色、金色表格样式；**未根据共享 VI 重新设计 UI**。本次没有替换获客项目中的原表格，也没有修改其业务界面。未来迁移时应先在目标项目内复制再进行回归验证。

## 目录约定

```text
Shared.Component/
  index.html                  # 全部组件演示入口，双击可打开
  components.json             # 组件目录的唯一注册清单
  assets/                     # 组件库首页样式和生成后的目录
  scripts/                    # 构建、新组件生成、界面验收
  yuntu_grid/
    README.md                 # 功能、接入、API、限制、版本
    package.json              # 组件名称、版本、依赖
    src/                      # 独立源码、类型、局部样式
    tests/                    # 组件逻辑测试
    dist/                     # 可复制使用的 ESM / CSS 构建产物
    demo/
      index.html              # 独立演示入口
      main.jsx                # 演示源码与模拟数据
      bundle/                 # 离线演示包，提交到版本库
```

## 开发与构建

需要 Node.js 22.12+（当前使用 22.19）及 npm。在本目录执行：

```powershell
npm ci
npm test
npm run build
npm run test:ui
npm run test:copy
```

首次没有 lockfile 时使用 `npm install`。项目 `.npmrc` 保留 `legacy-peer-deps=true`，避免 npm 10 在本工具链的可选 peer 依赖解析中崩溃。`test:ui` 需要 Playwright Chromium；未安装时执行 `npx playwright install chromium`。

构建会更新每个组件的 `dist/`、`demo/bundle/` 和 `assets/catalog.js`。这些产物需要与源码一起保存，保证拿到目录就能看演示。构建不会访问业务账号或发出业务操作。

## 新增其他组件

```powershell
npm run component:new -- yuntu_button
```

生成器创建同样的目录结构，并向 `components.json` 注册组件；已有目录会拒绝覆盖。

1. 完成新组件的 `src/`，所有样式限制在该组件范围内。不可依赖获客项目的全局状态、Electron 桥接或外部目录。
2. 补充 `demo/main.jsx`，使用模拟数据，导出 `mountDemo(element)`，返回卸载函数。演示不得自动发送真实业务请求。
3. 补充 README：功能与限制、深复制步骤、依赖、API、完整示例、测试与版本变更。
4. 更新 `components.json` 中的标题、分类、描述和版本，以及本 README 的组件表。
5. 添加有意义的测试，运行 `npm install`、`npm test`、`npm run build`；双击根目录和独立演示页验证，再用一个深复制后的独立项目验证编译。
6. 同步更新组件版本和变更说明，提交源码、文档及构建产物。组件库改动不会自动覆盖业务项目中的副本。

仓库采用 `Shared.功能名` 命名；业务项目采用 APP Key，如 `yuntu_claw`。不要修改 YuntuShared 仓库中标明只能人工编辑的 README。

