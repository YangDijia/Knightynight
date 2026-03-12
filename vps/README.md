# Knightynight VPS deployment bundle

这个目录包含你在 Ubuntu VPS 上从 Supabase 迁移到自建 Node + PostgreSQL 所需的完整文件。

## 目录说明

- `backend/`: Node API 服务（Express + pg）
- `sql/schema.sql`: PostgreSQL 初始化脚本
- `nginx/knightynight.conf`: Nginx 站点配置
- `systemd/knightynight-api.service`: systemd 服务文件

---

## 一、VPS 目录落位建议

建议在 VPS 上这样放置：

- `/opt/knightynight/backend` ← `vps/backend/*`
- `/opt/knightynight/sql/schema.sql` ← `vps/sql/schema.sql`
- `/etc/nginx/sites-available/knightynight.conf` ← `vps/nginx/knightynight.conf`
- `/etc/systemd/system/knightynight-api.service` ← `vps/systemd/knightynight-api.service`
- `/var/www/knightynight` ← 前端构建产物（`dist/*`）

---

## 二、初始化数据库

1. 创建数据库与用户（示例）：

```bash
sudo -u postgres psql
create user knightynight with password 'your-password';
create database knightynight owner knightynight;
\q
```

2. 执行 schema：

```bash
psql "postgresql://knightynight:your-password@127.0.0.1:5432/knightynight" -f /opt/knightynight/sql/schema.sql
```

---

## 三、部署 API 服务

1. 进入后端目录安装依赖：

```bash
cd /opt/knightynight/backend
npm install --omit=dev
```

2. 创建环境变量文件：

```bash
cp .env.example .env
```

3. 修改 `.env`：

- `DATABASE_URL` 改成你的 PostgreSQL 连接串
- `CORS_ORIGINS` 改成你的前端域名
- `API_WRITE_TOKEN` 设置成强随机字符串

4. 启动测试：

```bash
node src/server.js
```

5. 健康检查：

```bash
curl http://127.0.0.1:3000/health
```

返回 `{"ok":true}` 说明后端与数据库连通。

---

## 四、配置 systemd 常驻

1. 安装 service 文件并启动：

```bash
sudo cp /opt/knightynight/systemd/knightynight-api.service /etc/systemd/system/knightynight-api.service
sudo systemctl daemon-reload
sudo systemctl enable knightynight-api
sudo systemctl start knightynight-api
```

2. 查看状态与日志：

```bash
sudo systemctl status knightynight-api
sudo journalctl -u knightynight-api -f
```

---

## 五、配置 Nginx

1. 拷贝配置并启用：

```bash
sudo cp /opt/knightynight/nginx/knightynight.conf /etc/nginx/sites-available/knightynight.conf
sudo ln -sf /etc/nginx/sites-available/knightynight.conf /etc/nginx/sites-enabled/knightynight.conf
sudo nginx -t
sudo systemctl reload nginx
```

2. 前端部署：

- 本地执行 `npm run build`
- 将 `dist/*` 上传到 `/var/www/knightynight`

---

## 六、前端改造要点（你项目）

你当前前端是 `supabase.ts` 直连 Supabase REST。迁移时建议：

1. 新增 `VITE_API_BASE_URL=https://your-domain.com/api`
2. 将 `supabase.ts` 的请求基地址从 `.../rest/v1` 改成你的 `/api`
3. 写接口时保持这些语义一致：
   - `getBenchStatus` / `updateBenchStatus`
   - `getNotes` / `createNote` / `updateNote` / `deleteNote`
   - `getCalendarEntries` / `upsertCalendarEntry`

后端已按这些能力实现对应路由。

---

## 七、上线后检查清单

- `GET /health` 正常
- message board 可新增、点赞、删除
- mood calendar 可按日期写入并刷新读到
- bench 状态可更新
- Nginx 反代 `/api/*` 正常
- CORS 仅允许你的前端域名

---

## 八、接口鉴权说明

- 默认读取接口不鉴权（便于前端读数据）
- 写接口会检查 `Authorization: Bearer <API_WRITE_TOKEN>`（若 `.env` 设置了 `API_WRITE_TOKEN`）
- 若你暂时不想鉴权，可将 `API_WRITE_TOKEN` 留空（不推荐生产环境）
