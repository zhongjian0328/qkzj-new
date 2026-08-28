#!/bin/bash

# 禽康智检APP前端部署脚本
# 版本：v1.0
# 更新时间：2025-12-15

set -e

echo "======================================="
echo "禽康智检APP前端部署脚本"
echo "======================================="

# 配置变量
PROJECT_DIR="$(pwd)"
BUIld_DIR="${PROJECT_DIR}/dist"
WEB_SERVER_DIR="/var/www/html"
ENV_FILE=".env.production"
LOG_FILE="deploy-frontend.log"

# 记录日志
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

log "开始部署前端应用..."

# 1. 检查Node.js环境
log "检查Node.js环境..."
if ! command -v node &> /dev/null; then
    log "错误：未安装Node.js，请先安装Node.js 24.x"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
log "当前Node.js版本：${NODE_VERSION}"

# 2. 安装依赖
log "安装项目依赖..."
npm install --legacy-peer-deps

# 3. 配置环境变量
log "配置生产环境变量..."
if [ ! -f "${ENV_FILE}" ]; then
    log "未找到${ENV_FILE}文件，创建默认配置..."
    cp .env.example ${ENV_FILE}
    log "请编辑${ENV_FILE}文件配置生产环境变量"
    exit 1
fi

# 4. 构建前端应用
log "构建前端应用..."
npx expo export --platform all

# 5. 检查构建结果
if [ ! -d "${BUIld_DIR}" ]; then
    log "错误：构建失败，未生成${BUIld_DIR}目录"
    exit 1
fi

log "构建成功，构建文件位于：${BUIld_DIR}"

# 6. 部署到Web服务器
log "部署到Web服务器目录：${WEB_SERVER_DIR}"

# 备份当前版本
BACKUP_DIR="${WEB_SERVER_DIR}_backup_$(date +%Y%m%d%H%M%S)"
if [ -d "${WEB_SERVER_DIR}" ]; then
    log "备份当前版本到：${BACKUP_DIR}"
    sudo cp -r ${WEB_SERVER_DIR} ${BACKUP_DIR}
fi

# 创建Web服务器目录（如果不存在）
sudo mkdir -p ${WEB_SERVER_DIR}

# 复制构建文件到Web服务器目录
log "复制构建文件到Web服务器..."
sudo cp -r ${BUIld_DIR}/* ${WEB_SERVER_DIR}/

# 设置文件权限
log "设置文件权限..."
sudo chown -R www-data:www-data ${WEB_SERVER_DIR}
sudo chmod -R 755 ${WEB_SERVER_DIR}

# 7. 配置Nginx
log "配置Nginx..."
NGINX_CONF="/etc/nginx/sites-available/qinkangzhijian"
NGINX_ENABLED="/etc/nginx/sites-enabled/qinkangzhijian"

# 创建Nginx配置文件
echo "server {
    listen 80;
    server_name qinkangzhijian.com www.qinkangzhijian.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name qinkangzhijian.com www.qinkangzhijian.com;
    
    # SSL证书配置（稍后由HTTPS配置脚本生成）
    ssl_certificate /etc/letsencrypt/live/qinkangzhijian.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/qinkangzhijian.com/privkey.pem;
    
    # TLS配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # 根目录
    root ${WEB_SERVER_DIR};
    index index.html;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 256;
    
    # 缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 前端路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 访问日志
    access_log /var/log/nginx/qinkangzhijian.access.log;
    error_log /var/log/nginx/qinkangzhijian.error.log;
}" | sudo tee ${NGINX_CONF}

# 启用Nginx配置
if [ -L "${NGINX_ENABLED}" ]; then
    sudo rm ${NGINX_ENABLED}
fi
sudo ln -s ${NGINX_CONF} ${NGINX_ENABLED}

# 测试Nginx配置
log "测试Nginx配置..."
sudo nginx -t

# 重新加载Nginx
log "重新加载Nginx..."
sudo systemctl reload nginx

# 8. 验证部署结果
log "验证部署结果..."

# 检查Web服务器目录
log "检查Web服务器目录内容："
ls -la ${WEB_SERVER_DIR}

# 检查Nginx状态
log "检查Nginx状态："
sudo systemctl status nginx --no-pager -l

log "======================================="
log "前端部署完成！"
log "访问地址：https://qinkangzhijian.com"
log "======================================="
