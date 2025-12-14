#!/bin/bash

# 禽康智检APP HTTPS配置脚本
# 版本：v1.0
# 更新时间：2025-12-15

set -e

echo "======================================="
echo "禽康智检APP HTTPS配置脚本"
echo "======================================="

# 配置变量
DOMAIN="qinkangzhijian.com"
API_DOMAIN="api.qinkangzhijian.com"
EMAIL="admin@qinkangzhijian.com"
LOG_FILE="configure-https.log"

# 记录日志
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

log "开始配置HTTPS..."

# 1. 检查Nginx是否安装
log "检查Nginx环境..."
if ! command -v nginx &> /dev/null; then
    log "错误：未安装Nginx，请先安装Nginx"
    exit 1
fi

# 2. 安装Certbot
log "安装Certbot..."
if ! command -v certbot &> /dev/null; then
    log "安装Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 3. 生成HTTPS证书
log "生成HTTPS证书..."

# 生成主域名证书
log "生成主域名证书：${DOMAIN}"
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -m ${EMAIL} --agree-tos --non-interactive

# 生成API域名证书
log "生成API域名证书：${API_DOMAIN}"
sudo certbot --nginx -d ${API_DOMAIN} -m ${EMAIL} --agree-tos --non-interactive

# 4. 配置TLS 1.2+支持
log "配置TLS 1.2+支持..."

# 编辑Nginx SSL配置
SSL_CONF="/etc/nginx/conf.d/ssl.conf"
echo "# SSL配置
global ssl_protocols TLSv1.2 TLSv1.3;
global ssl_prefer_server_ciphers on;
global ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
global ssl_session_timeout 1d;
global ssl_session_cache shared:SSL:50m;
global ssl_session_tickets off;

# OCSP Stapling
global ssl_stapling on;
global ssl_stapling_verify on;
global resolver 8.8.8.8 8.8.4.4 valid=300s;
global resolver_timeout 5s;

# HSTS
global add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
" | sudo tee ${SSL_CONF}

# 5. 配置后端API的Nginx反向代理
log "配置后端API的Nginx反向代理..."

API_NGINX_CONF="/etc/nginx/sites-available/api.${DOMAIN}"
echo "server {
    listen 80;
    server_name ${API_DOMAIN};
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name ${API_DOMAIN};
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${API_DOMAIN}/privkey.pem;
    
    # 访问日志
    access_log /var/log/nginx/api.${DOMAIN}.access.log;
    error_log /var/log/nginx/api.${DOMAIN}.error.log;
    
    # API反向代理配置
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 代理超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:3000/api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}" | sudo tee ${API_NGINX_CONF}

# 启用API Nginx配置
if [ -L "/etc/nginx/sites-enabled/api.${DOMAIN}" ]; then
    sudo rm /etc/nginx/sites-enabled/api.${DOMAIN}
fi
sudo ln -s ${API_NGINX_CONF} /etc/nginx/sites-enabled/api.${DOMAIN}

# 6. 配置证书自动更新
log "配置证书自动更新..."

# 检查crontab中是否已存在Certbot更新任务
CRON_JOB="0 2 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'"
if ! crontab -l | grep -q "certbot renew"; then
    log "添加Certbot自动更新任务到crontab..."
    (crontab -l; echo "${CRON_JOB}") | crontab -
    log "Certbot自动更新任务已添加"
else
    log "Certbot自动更新任务已存在"
fi

# 7. 测试Nginx配置
log "测试Nginx配置..."
sudo nginx -t

# 8. 重新加载Nginx
log "重新加载Nginx..."
sudo systemctl reload nginx

# 9. 验证HTTPS配置
log "验证HTTPS配置..."

# 检查证书有效期
log "检查证书有效期："
sudo certbot certificates

# 测试HTTPS连接
log "测试HTTPS连接..."

# 使用curl测试主域名
if curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} | grep -q "200"; then
    log "✓ 主域名HTTPS连接正常"
else
    log "✗ 主域名HTTPS连接失败"
fi

# 使用curl测试API域名
if curl -s -o /dev/null -w "%{http_code}" https://${API_DOMAIN}/health | grep -q "200"; then
    log "✓ API域名HTTPS连接正常"
else
    log "✗ API域名HTTPS连接失败"
fi

# 检查TLS版本支持
log "检查TLS版本支持..."

# 测试TLS 1.2
tls12_result=$(echo "Q" | openssl s_client -connect ${DOMAIN}:443 -tls1_2 2>&1 | grep -i "SSL connection established")
if [ -n "${tls12_result}" ]; then
    log "✓ TLS 1.2支持正常"
else
    log "✗ TLS 1.2支持失败"
fi

# 测试TLS 1.3
tls13_result=$(echo "Q" | openssl s_client -connect ${DOMAIN}:443 -tls1_3 2>&1 | grep -i "SSL connection established")
if [ -n "${tls13_result}" ]; then
    log "✓ TLS 1.3支持正常"
else
    log "✗ TLS 1.3支持失败"
fi

log "======================================="
log "HTTPS配置完成！"
log "主域名：https://${DOMAIN}"
log "API域名：https://${API_DOMAIN}"
log "证书有效期：查看上面的证书信息"
log "======================================="
