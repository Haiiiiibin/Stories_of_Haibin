# 王海滨 · 个人作品网站

中文为主的个人作品集，展示内容运营、品牌传播、员工沟通、社群活动、摄影与研究。

纯 HTML、CSS 和 JavaScript，无需安装依赖或构建。支持移动端、项目案例展开、作品图片放大与键盘浏览。首屏展示个人照片，并在首次出现时播放烟雾显现动效，无重播按钮。

Selected Work 顺序：Lundbeck、DanChurchAid、社群活动、数据叙事。

## 编辑网站

- `dist/index.html`：页面文案、项目卡片与完整案例。
- `dist/style.css`：配色、布局与响应式样式。
- `dist/script.js`：案例弹窗与图片浏览。
- `dist/assets/`：作品与摄影图片。

本地预览：

```sh
python3 -m http.server 8000 --directory dist
```

打开 `http://localhost:8000`。

## 发布到 GitHub Pages

1. 将本目录内容上传至你的 GitHub 仓库，默认分支为 `main`。
2. 打开仓库 **Settings → Pages**，将 **Source** 设置为 **GitHub Actions**。
3. 在 **Actions** 中运行 **Publish portfolio to GitHub Pages**，或提交一次修改触发发布。
4. 发布成功后，Pages 设置页与部署记录会显示正式网址。

之后向 `main` 提交网站修改，会自动更新网站。图片和样式使用相对路径，同时适用于个人首页仓库和普通项目仓库。

## 许可与素材

网站代码使用 MIT 许可，见 `LICENSE`。作品图片、摄影、文字内容、公司标识及第三方材料不纳入代码许可；参见 `ASSETS.md`。
