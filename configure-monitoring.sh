#!/bin/bash

# 禽康智检APP监控配置脚本
# 版本：v1.0
# 更新时间：2025-12-15

set -e

echo "======================================="
echo "禽康智检APP监控配置脚本"
echo "======================================="

# 配置变量
PROJECT_DIR="$(pwd)"
LOG_FILE="configure-monitoring.log"
PROMETHEUS_VERSION="2.54.1"
GRAFANA_VERSION="11.3.0"
NODE_EXPORTER_VERSION="1.8.2"
MONGODB_EXPORTER_VERSION="0.42.6"

# 记录日志
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

log "开始配置监控系统..."

# 1. 安装依赖
log "安装依赖..."
sudo apt update
sudo apt install -y wget curl gnupg2 apt-transport-https software-properties-common

# 2. 安装Prometheus
log "安装Prometheus..."

# 下载Prometheus
PROMETHEUS_TAR="prometheus-${PROMETHEUS_VERSION}.linux-amd64.tar.gz"
wget -q https://github.com/prometheus/prometheus/releases/download/v${PROMETHEUS_VERSION}/${PROMETHEUS_TAR}

# 解压安装
mkdir -p /tmp/prometheus
tar xzf ${PROMETHEUS_TAR} -C /tmp/prometheus --strip-components=1

# 创建Prometheus用户和目录
sudo useradd -rs /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus

# 复制文件
sudo cp /tmp/prometheus/prometheus /usr/local/bin/
sudo cp /tmp/prometheus/promtool /usr/local/bin/
sudo cp -r /tmp/prometheus/consoles /etc/prometheus/
sudo cp -r /tmp/prometheus/console_libraries /etc/prometheus/

# 设置权限
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo chmod +x /usr/local/bin/prometheus /usr/local/bin/promtool

# 创建Prometheus配置文件
echo "global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: []

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  # Prometheus自身监控
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # 服务器监控
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  # MongoDB监控
  - job_name: 'mongodb'
    static_configs:
      - targets: ['localhost:9216']

  # Node.js应用监控
  - job_name: 'nodejs'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'" | sudo tee /etc/prometheus/prometheus.yml

# 创建Prometheus服务文件
echo "[Unit]
Description=Prometheus Monitoring System
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/var/lib/prometheus \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries \
    --web.listen-address=0.0.0.0:9090

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/prometheus.service

# 3. 安装Node Exporter
log "安装Node Exporter..."

# 下载Node Exporter
NODE_EXPORTER_TAR="node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz"
wget -q https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/${NODE_EXPORTER_TAR}

# 解压安装
tar xzf ${NODE_EXPORTER_TAR}
cd node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64

sudo cp node_exporter /usr/local/bin/

# 创建Node Exporter用户
sudo useradd -rs /bin/false node_exporter

# 创建Node Exporter服务文件
echo "[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/node_exporter.service

cd ..

# 4. 安装MongoDB Exporter
log "安装MongoDB Exporter..."

# 下载MongoDB Exporter
MONGODB_EXPORTER_TAR="mongodb_exporter-${MONGODB_EXPORTER_VERSION}.linux-amd64.tar.gz"
wget -q https://github.com/percona/mongodb_exporter/releases/download/v${MONGODB_EXPORTER_VERSION}/${MONGODB_EXPORTER_TAR}

# 解压安装
tar xzf ${MONGODB_EXPORTER_TAR}
cd mongodb_exporter-${MONGODB_EXPORTER_VERSION}.linux-amd64

sudo cp mongodb_exporter /usr/local/bin/

# 创建MongoDB Exporter用户
sudo useradd -rs /bin/false mongodb_exporter

# 创建MongoDB Exporter服务文件
echo "[Unit]
Description=MongoDB Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=mongodb_exporter
Group=mongodb_exporter
Type=simple
# 配置MongoDB连接字符串，根据实际情况修改
ExecStart=/usr/local/bin/mongodb_exporter --mongodb.uri=mongodb://localhost:27017

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/mongodb_exporter.service

cd ..

# 5. 安装Grafana
log "安装Grafana..."

# 添加Grafana GPG密钥
sudo mkdir -p /etc/apt/keyrings
wget -q -O - https://apt.grafana.com/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/grafana.gpg

# 添加Grafana仓库
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list

# 安装Grafana
sudo apt update
sudo apt install -y grafana=${GRAFANA_VERSION}

# 6. 启动所有监控服务
log "启动所有监控服务..."

# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动并启用Prometheus
sudo systemctl start prometheus
sudo systemctl enable prometheus

# 启动并启用Node Exporter
sudo systemctl start node_exporter
sudo systemctl enable node_exporter

# 启动并启用MongoDB Exporter
sudo systemctl start mongodb_exporter
sudo systemctl enable mongodb_exporter

# 启动并启用Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# 7. 验证监控服务状态
log "验证监控服务状态..."

# 检查Prometheus状态
sudo systemctl status prometheus --no-pager -l

# 检查Node Exporter状态
sudo systemctl status node_exporter --no-pager -l

# 检查MongoDB Exporter状态
sudo systemctl status mongodb_exporter --no-pager -l

# 检查Grafana状态
sudo systemctl status grafana-server --no-pager -l

# 8. 配置Grafana
log "配置Grafana..."

# 等待Grafana启动
sleep 10

# 获取初始管理员密码
INITIAL_PASSWORD=$(sudo cat /etc/grafana/grafana.ini | grep -A 5 "admin_user" | grep -oP "admin_password = \K.*")
if [ -z "${INITIAL_PASSWORD}" ]; then
    INITIAL_PASSWORD="admin"
fi

log "Grafana初始管理员密码：${INITIAL_PASSWORD}"
log "请登录Grafana后立即修改密码"
log "Grafana访问地址：http://localhost:3000"

# 9. 配置防火墙（如启用）
log "配置防火墙规则..."
if command -v ufw &> /dev/null; then
    # 允许Prometheus端口
    sudo ufw allow 9090/tcp
    # 允许Grafana端口
    sudo ufw allow 3000/tcp
    # 允许Node Exporter端口
    sudo ufw allow 9100/tcp
    # 允许MongoDB Exporter端口
    sudo ufw allow 9216/tcp
    log "防火墙规则已配置"
fi

# 10. 清理临时文件
log "清理临时文件..."
rm -f ${PROMETHEUS_TAR} ${NODE_EXPORTER_TAR} ${MONGODB_EXPORTER_TAR}
rm -rf /tmp/prometheus node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64 mongodb_exporter-${MONGODB_EXPORTER_VERSION}.linux-amd64

log "======================================="
log "监控系统配置完成！"
log "Prometheus访问地址：http://localhost:9090"
log "Grafana访问地址：http://localhost:3000"
log "初始用户名：admin"
log "初始密码：${INITIAL_PASSWORD}"
log "======================================="
log "下一步操作："
log "1. 登录Grafana并修改初始密码"
log "2. 添加Prometheus数据源（URL：http://localhost:9090）"
log "3. 导入Grafana仪表盘："
log "   - 服务器监控：8919（Node Exporter Full）"
log "   - MongoDB监控：7353（MongoDB Dashboard）"
log "   - Prometheus监控：1860（Node.js Dashboard）"
log "======================================="
