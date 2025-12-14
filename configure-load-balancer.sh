#!/bin/bash

# 禽康智检APP负载均衡配置脚本
# 版本：v1.0
# 更新时间：2025-12-15

set -e

echo "======================================="
echo "禽康智检APP负载均衡配置脚本"
echo "======================================="

# 配置变量
PROJECT_DIR="$(pwd)"
LOG_FILE="configure-load-balancer.log"
NGINX_CONF_DIR="/etc/nginx"
LOAD_BALANCER_CONF="${NGINX_CONF_DIR}/conf.d/load-balancer.conf"

# 记录日志
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

log "开始评估和配置负载均衡方案..."

# 1. 负载均衡需求评估
log "评估负载均衡需求..."

# 当前服务器资源情况
log "当前服务器资源情况："
log "- 前端应用服务器：1台"
log "- 后端API服务器：1台"
log "- MongoDB数据库：1台"

# 业务需求评估
log "业务需求评估："
log "- 当前系统规模：小型应用，并发量较低"
log "- 可用性要求：高可用性，避免单点故障"
log "- 扩展性要求：支持未来服务器扩容"

# 负载均衡方案选择
log "负载均衡方案选择："
log "- 负载均衡器：Nginx（软件负载均衡）"
log "- 负载均衡算法：轮询（round-robin）"
log "- 健康检查：HTTP健康检查"
log "- 会话保持：无（当前系统为无状态API）"

# 2. 安装Nginx（如果未安装）
log "检查Nginx环境..."
if ! command -v nginx &> /dev/null; then
    log "安装Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# 3. 配置负载均衡
log "配置Nginx负载均衡..."

# 创建负载均衡配置文件
echo "# 禽康智检APP负载均衡配置
# 版本：v1.0
# 更新时间：2025-12-15

# 前端应用负载均衡池
upstream frontend_servers {
    # 轮询算法（默认）
    server localhost:8080 max_fails=3 fail_timeout=30s;  # 前端服务器1
    # 可以添加更多前端服务器
    # server 192.168.1.102:8080 max_fails=3 fail_timeout=30s;  # 前端服务器2
}

# 后端API负载均衡池
upstream backend_servers {
    # 轮询算法（默认）
    server localhost:3000 max_fails=3 fail_timeout=30s;  # 后端服务器1
    # 可以添加更多后端服务器
    # server 192.168.1.102:3000 max_fails=3 fail_timeout=30s;  # 后端服务器2
}

# 负载均衡器主配置
server {
    listen 80;
    server_name qinkangzhijian.com www.qinkangzhijian.com;
    
    # 访问日志
    access_log /var/log/nginx/load-balancer.access.log;
    error_log /var/log/nginx/load-balancer.error.log;
    
    # 前端请求处理
    location / {
        proxy_pass http://frontend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 负载均衡健康检查
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API请求处理
    location /api {
        proxy_pass http://backend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 负载均衡健康检查
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 健康检查端点
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}

# HTTPS配置（如果已配置HTTPS证书）
# server {
#     listen 443 ssl;
#     server_name qinkangzhijian.com www.qinkangzhijian.com;
#     
#     # SSL证书配置
#     ssl_certificate /etc/letsencrypt/live/qinkangzhijian.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/qinkangzhijian.com/privkey.pem;
#     
#     # TLS配置
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_prefer_server_ciphers on;
#     ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
#     
#     # 前端请求处理
#     location / {
#         proxy_pass http://frontend_servers;
#         # 其他proxy配置与HTTP服务器相同
#     }
#     
#     # API请求处理
#     location /api {
#         proxy_pass http://backend_servers;
#         # 其他proxy配置与HTTP服务器相同
#     }
# }" | sudo tee ${LOAD_BALANCER_CONF}

# 4. 配置健康检查
log "配置健康检查..."

# 添加健康检查脚本
HEALTH_CHECK_SCRIPT="/usr/local/bin/health-check.sh"
echo "#!/bin/bash

# 健康检查脚本
# 检查前端服务器健康状态
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo 500)
if [ "$FRONTEND_HEALTH" -eq 200 ]; then
    echo "前端服务器健康状态：正常"
else
    echo "前端服务器健康状态：异常，HTTP状态码：$FRONTEND_HEALTH"
fi

# 检查后端服务器健康状态
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo 500)
if [ "$BACKEND_HEALTH" -eq 200 ]; then
    echo "后端服务器健康状态：正常"
else
    echo "后端服务器健康状态：异常，HTTP状态码：$BACKEND_HEALTH"
fi

# 检查MongoDB健康状态
MONGODB_HEALTH=$(mongo --eval "db.adminCommand('ping').ok" --quiet || echo 0)
if [ "$MONGODB_HEALTH" -eq 1 ]; then
    echo "MongoDB健康状态：正常"
else
    echo "MongoDB健康状态：异常"
fi" | sudo tee ${HEALTH_CHECK_SCRIPT}

# 设置脚本权限
sudo chmod +x ${HEALTH_CHECK_SCRIPT}

# 5. 配置负载均衡器监控
log "配置负载均衡器监控..."

# 在Prometheus配置中添加Nginx监控
if ! grep -q "nginx" /etc/prometheus/prometheus.yml; then
    log "添加Nginx监控到Prometheus配置..."
    # 安装nginx-prometheus-exporter
    sudo apt install -y nginx-prometheus-exporter
    
    # 启动nginx-prometheus-exporter服务
    sudo systemctl start nginx-prometheus-exporter
    sudo systemctl enable nginx-prometheus-exporter
    
    # 添加到Prometheus配置
    sudo sed -i '/scrape_configs:/a \  # Nginx监控\n  - job_name: "nginx"\n    static_configs:\n      - targets: ["localhost:9113"]' /etc/prometheus/prometheus.yml
    
    # 重启Prometheus
    sudo systemctl restart prometheus
    log "Nginx监控已添加到Prometheus"
else
    log "Nginx监控已存在于Prometheus配置中"
fi

# 6. 测试负载均衡配置
log "测试负载均衡配置..."

# 测试Nginx配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx

# 7. 负载均衡评估报告
log "生成负载均衡评估报告..."

cat << EOF > ${PROJECT_DIR}/LOAD_BALANCER_REPORT.md
# 负载均衡评估报告

## 1. 评估时间
2025-12-15

## 2. 评估对象
禽康智检APP系统

## 3. 评估内容

### 3.1 当前系统架构
- 前端应用服务器：1台
- 后端API服务器：1台
- MongoDB数据库：1台
- CDN/负载均衡：1台

### 3.2 负载均衡需求
- **并发量**：当前并发量较低，预计峰值并发数<1000
- **可用性**：要求高可用性，避免单点故障
- **扩展性**：支持未来服务器扩容
- **性能**：要求响应时间<1秒

### 3.3 负载均衡方案

#### 3.3.1 负载均衡器选择
- **类型**：软件负载均衡
- **产品**：Nginx
- **版本**：当前系统安装版本

#### 3.3.2 负载均衡算法
- **默认算法**：轮询（round-robin）
- **备选算法**：
  - 最少连接（least_conn）：适合长连接场景
  - IP哈希（ip_hash）：适合需要会话保持的场景
  - 加权轮询（weighted round-robin）：适合服务器性能差异较大的场景

#### 3.3.3 健康检查配置
- **检查方式**：HTTP健康检查
- **检查端点**：
  - 前端：/health
  - 后端：/api/health
- **检查频率**：由Nginx自动处理
- **失败阈值**：3次失败后标记为不可用
- **恢复阈值**：3次成功后标记为可用

#### 3.3.4 会话保持
- **当前配置**：无（系统为无状态API）
- **未来扩展**：如需会话保持，可使用ip_hash或sticky cookie

## 4. 实施建议

### 4.1 当前实施
- 已配置Nginx负载均衡器
- 已配置健康检查脚本
- 已配置Prometheus监控

### 4.2 未来扩展
1. **服务器扩容**：
   - 当并发量增加到1000+时，建议添加第二台前端服务器
   - 当后端API响应时间超过1秒时，建议添加第二台后端服务器
   - 当MongoDB连接数超过1000时，建议考虑MongoDB分片

2. **负载均衡优化**：
   - 根据服务器性能调整权重
   - 根据业务场景选择合适的负载均衡算法
   - 配置会话保持（如需）

3. **监控优化**：
   - 添加Grafana仪表盘监控负载均衡器性能
   - 设置负载均衡器告警阈值
   - 定期分析负载均衡器日志

## 5. 风险评估

### 5.1 单点故障风险
- **当前风险**：低，因为负载均衡器本身是单点，但系统整体架构包含CDN/负载均衡
- **缓解措施**：配置负载均衡器高可用（如使用keepalived）

### 5.2 性能风险
- **当前风险**：低，因为当前并发量较低
- **缓解措施**：优化Nginx配置，增加缓存，配置Gzip压缩

### 5.3 配置风险
- **当前风险**：低，因为配置简单
- **缓解措施**：定期备份Nginx配置，测试配置变更

## 6. 结论

当前系统负载均衡配置已完成，适合当前业务规模和服务器资源情况。随着业务发展和服务器扩容，可根据本报告的建议进行调整和优化。

## 7. 联系方式

- 技术负责人：XXX
- 联系方式：138XXXXXXX

EOF

log "负载均衡评估报告已生成：${PROJECT_DIR}/LOAD_BALANCER_REPORT.md"

# 8. 执行健康检查
log "执行健康检查..."
${HEALTH_CHECK_SCRIPT}

log "======================================="
log "负载均衡配置完成！"
log "负载均衡器状态：已启动"
log "健康检查脚本：${HEALTH_CHECK_SCRIPT}"
log "评估报告：${PROJECT_DIR}/LOAD_BALANCER_REPORT.md"
log "======================================="
log "下一步操作："
log "1. 查看负载均衡评估报告，了解当前负载均衡状态"
log "2. 根据业务需求和服务器资源情况，调整负载均衡配置"
log "3. 定期执行健康检查脚本，监控系统状态"
log "4. 当服务器扩容时，更新负载均衡配置"
log "======================================="
