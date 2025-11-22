# 基于React构建的的swjtu-map



`npm install`安装依赖
`npm run dev`运行项目

---

详细项目说明见仓库根目录 README：

- 快速开始：`npm install`，`npm run dev` 启动开发服务器
- 构建：`npm run build`，`npm run preview` 预览构建

---


### 项目简介

本项目是一个校园导航演示应用，演示地图加载、路径规划、楼宇信息、预约记录、数据可视化等功能，适合作为课程演示或快速原型。

### 运行与开发

1. 安装依赖：

```powershell
npm install
```

2. 本地启动：

```powershell
npm run dev
```

3. 生产构建：

```powershell
npm run build
npm run preview
```

### 路由概览

参见 `src/routes.jsx`：

- `/`、`/login`：登录页
- `/register`：注册页
- `/loading`：加载页（登录后跳转）
- `/main`：主页面（地图与操作）
- `/shape`：形状页面
- `*`：404 页面
