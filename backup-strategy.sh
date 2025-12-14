#!/bin/bash

# 禽康智检APP备份策略脚本
# 版本：v1.0
# 更新时间：2025-12-15

set -e

echo "======================================="
echo "禽康智检APP备份策略脚本"
echo "======================================="

# 配置变量
PROJECT_DIR="$(pwd)"
BACKUP_DIR="/var/backups/qinkangzhijian"
LOCAL_BACKUP_DIR="${BACKUP_DIR}/local"
REMOTE_BACKUP_DIR="${BACKUP_DIR}/remote"
LOG_DIR="${BACKUP_DIR}/logs"
LOG_FILE="${LOG_DIR}/backup.log"
DB_NAME="qinkangzhijian"
DB_HOST="localhost"
DB_PORT="27017"
# DB_USER="admin"
# DB_PASS="password"
RETENTION_DAYS=7  # 本地备份保留天数
REMOTE_RETENTION_DAYS=30  # 异地备份保留天数
BACKUP_INTERVAL="daily"  # 备份频率：daily, weekly, monthly

# 记录日志
mkdir -p ${LOG_DIR}

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ${LOG_FILE}
}

log "开始执行备份策略..."

# 1. 创建备份目录
log "创建备份目录..."
mkdir -p ${LOCAL_BACKUP_DIR} ${REMOTE_BACKUP_DIR}

# 2. 检查MongoDB环境
log "检查MongoDB环境..."
if ! command -v mongodump &> /dev/null; then
    log "错误：未安装mongodump，请先安装MongoDB工具包"
    exit 1
fi

# 3. 执行数据库备份
log "执行数据库备份..."

# 生成备份文件名
BACKUP_FILENAME="${DB_NAME}_${BACKUP_INTERVAL}_$(date +'%Y%m%d_%H%M%S')"
BACKUP_PATH="${LOCAL_BACKUP_DIR}/${BACKUP_FILENAME}"

# 执行mongodump
log "执行mongodump备份数据库：${DB_NAME}"
# 如果需要认证，使用以下命令：
# mongodump --host ${DB_HOST} --port ${DB_PORT} --db ${DB_NAME} --username ${DB_USER} --password ${DB_PASS} --out ${BACKUP_PATH}
mongodump --host ${DB_HOST} --port ${DB_PORT} --db ${DB_NAME} --out ${BACKUP_PATH}

# 压缩备份文件
log "压缩备份文件..."
tar -czf ${BACKUP_PATH}.tar.gz -C ${LOCAL_BACKUP_DIR} ${BACKUP_FILENAME}

# 删除未压缩的备份目录
rm -rf ${BACKUP_PATH}

log "备份完成：${BACKUP_PATH}.tar.gz"

# 4. 本地备份清理（保留指定天数）
log "清理本地过期备份..."
find ${LOCAL_BACKUP_DIR} -name "${DB_NAME}_${BACKUP_INTERVAL}_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete
log "本地过期备份已清理，保留最近${RETENTION_DAYS}天的备份"

# 5. 异地备份（示例：复制到另一台服务器）
# 注意：需要配置SSH免密登录或使用其他方式进行远程复制
# 这里仅作为示例，实际使用时需要根据环境配置
log "执行异地备份..."

# 示例：使用rsync复制到远程服务器
# REMOTE_SERVER="backup-server"
# REMOTE_PATH="/backup/qinkangzhijian"
# log "复制备份到远程服务器：${REMOTE_SERVER}:${REMOTE_PATH}"
# rsync -avz ${BACKUP_PATH}.tar.gz ${REMOTE_SERVER}:${REMOTE_PATH}/

# 示例：使用scp复制到远程服务器
# scp ${BACKUP_PATH}.tar.gz ${REMOTE_SERVER}:${REMOTE_PATH}/

# 示例：异地备份清理
# log "清理异地过期备份..."
# ssh ${REMOTE_SERVER} "find ${REMOTE_PATH} -name '${DB_NAME}_${BACKUP_INTERVAL}_*.tar.gz' -type f -mtime +${REMOTE_RETENTION_DAYS} -delete"
# log "异地过期备份已清理，保留最近${REMOTE_RETENTION_DAYS}天的备份"

# 6. 备份验证
log "验证备份文件..."

# 检查备份文件是否存在
if [ -f "${BACKUP_PATH}.tar.gz" ]; then
    log "✓ 备份文件存在"
    # 检查备份文件大小
    BACKUP_SIZE=$(du -h ${BACKUP_PATH}.tar.gz | cut -f1)
    log "✓ 备份文件大小：${BACKUP_SIZE}"
else
    log "✗ 备份文件不存在，备份失败"
    exit 1
fi

# 7. 配置自动备份任务
log "配置自动备份任务..."

# 生成crontab任务
if [ "${BACKUP_INTERVAL}" = "daily" ]; then
    CRON_SCHEDULE="0 2 * * *"  # 每天凌晨2点执行
elif [ "${BACKUP_INTERVAL}" = "weekly" ]; then
    CRON_SCHEDULE="0 2 * * 0"  # 每周日凌晨2点执行
elif [ "${BACKUP_INTERVAL}" = "monthly" ]; then
    CRON_SCHEDULE="0 2 1 * *"  # 每月1日凌晨2点执行
fi

# 脚本路径
SCRIPT_PATH="$(readlink -f $0)"

# 检查crontab中是否已存在备份任务
CRON_JOB="${CRON_SCHEDULE} ${SCRIPT_PATH}"
if ! crontab -l | grep -q "${SCRIPT_PATH}"; then
    log "添加自动备份任务到crontab..."
    (crontab -l; echo "${CRON_JOB}") | crontab -
    log "自动备份任务已添加，执行频率：${BACKUP_INTERVAL}"
else
    log "自动备份任务已存在"
fi

# 8. 备份恢复测试（可选）
log "执行备份恢复测试..."

# 创建临时恢复目录
TEST_RESTORE_DIR="/tmp/mongo_restore_test"
mkdir -p ${TEST_RESTORE_DIR}

# 解压备份文件进行验证
tar -xzf ${BACKUP_PATH}.tar.gz -C ${TEST_RESTORE_DIR}

# 检查解压后的文件结构
if [ -d "${TEST_RESTORE_DIR}/${BACKUP_FILENAME}/${DB_NAME}" ]; then
    log "✓ 备份文件结构完整"
    # 统计集合数量
    COLLECTION_COUNT=$(ls -la ${TEST_RESTORE_DIR}/${BACKUP_FILENAME}/${DB_NAME} | grep -v "total" | grep -v ".json" | wc -l)
    log "✓ 备份包含${COLLECTION_COUNT}个集合"
else
    log "✗ 备份文件结构不完整"
fi

# 清理测试目录
rm -rf ${TEST_RESTORE_DIR}

# 9. 生成备份报告
log "生成备份报告..."

# 统计当前备份数量
CURRENT_BACKUP_COUNT=$(ls -la ${LOCAL_BACKUP_DIR}/${DB_NAME}_${BACKUP_INTERVAL}_*.tar.gz | wc -l)

log "======================================="
log "备份报告："
log "- 备份频率：${BACKUP_INTERVAL}"
log "- 本地备份目录：${LOCAL_BACKUP_DIR}"
log "- 异地备份目录：${REMOTE_BACKUP_DIR}"
log "- 当前本地备份数量：${CURRENT_BACKUP_COUNT}"
log "- 本地备份保留天数：${RETENTION_DAYS}"
log "- 异地备份保留天数：${REMOTE_RETENTION_DAYS}"
log "- 最新备份文件：${BACKUP_FILENAME}.tar.gz"
log "- 最新备份大小：${BACKUP_SIZE}"
log "- 备份状态：成功"
log "======================================="

log "备份策略执行完成！"

# 10. 备份恢复指南
cat << EOF > ${LOCAL_BACKUP_DIR}/RESTORE_GUIDE.md
# 数据库恢复指南

## 1. 恢复前准备

1. 确保目标MongoDB服务已启动
2. 确保有足够的磁盘空间
3. 备份当前数据库（可选，防止数据丢失）

## 2. 恢复步骤

### 2.1 从本地备份恢复

1. 查看可用备份文件：
   \`\`\`bash
   ls -la ${LOCAL_BACKUP_DIR}
   \`\`\`

2. 选择要恢复的备份文件，解压：
   \`\`\`bash
   tar -xzf ${LOCAL_BACKUP_DIR}/BACKUP_FILENAME.tar.gz -C /tmp
   \`\`\`

3. 执行恢复：
   \`\`\`bash
   # 恢复到指定数据库
   mongorestore --host ${DB_HOST} --port ${DB_PORT} --db ${DB_NAME} /tmp/BACKUP_FILENAME/${DB_NAME}
   
   # 如果需要认证：
   # mongorestore --host ${DB_HOST} --port ${DB_PORT} --db ${DB_NAME} --username ${DB_USER} --password ${DB_PASS} /tmp/BACKUP_FILENAME/${DB_NAME}
   
   # 恢复所有数据库（如果备份包含多个数据库）
   # mongorestore --host ${DB_HOST} --port ${DB_PORT} /tmp/BACKUP_FILENAME
   \`\`\`

### 2.2 从异地备份恢复

1. 从异地服务器复制备份文件到本地：
   \`\`\`bash
   # 使用rsync
   # rsync -avz backup-server:/backup/qinkangzhijian/BACKUP_FILENAME.tar.gz ${LOCAL_BACKUP_DIR}/
   
   # 使用scp
   # scp backup-server:/backup/qinkangzhijian/BACKUP_FILENAME.tar.gz ${LOCAL_BACKUP_DIR}/
   \`\`\`

2. 然后按照本地备份恢复步骤执行

## 3. 恢复验证

1. 检查数据库集合数量：
   \`\`\`bash
   mongo ${DB_NAME} --eval "db.getCollectionNames().length"
   \`\`\`

2. 检查关键集合数据：
   \`\`\`bash
   mongo ${DB_NAME} --eval "db.COLLECTION_NAME.countDocuments()"
   \`\`\`

## 4. 注意事项

1. 恢复操作会覆盖目标数据库中的现有数据，请谨慎操作
2. 建议在低峰期执行恢复操作
3. 恢复前请停止相关应用服务，避免数据不一致
4. 恢复后请验证数据完整性和应用功能

## 5. 紧急恢复联系人

- 技术负责人：XXX
- 联系方式：138XXXXXXX

EOF

log "备份恢复指南已生成：${LOCAL_BACKUP_DIR}/RESTORE_GUIDE.md"
