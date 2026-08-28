# MongoDB Authentication Issue Resolution Plan

## 1. Problem Analysis

### Key Issues Identified:
1. **Username Mismatch**: Connection string uses `root` instead of specified `power-application-user`
2. **Password Encoding**: Password with special characters (REDACTED) not URL-encoded
3. **AuthSource Incorrect**: Mongoose configured with `authSource: 'qinkangzhijian'` instead of `admin`
4. **Database Name**: Connection string targets `admin` database instead of `qinkangzhijian`

### Expected Correct Configuration:
- Username: `power-application-user`
- Password: URL-encoded form of the actual password (REDACTED)
- AuthSource: `admin` (Alibaba Cloud MongoDB users are in admin db)
- Target Database: `qinkangzhijian`

## 2. Resolution Steps

### Step 1: Update Connection String in .env
- Replace current connection string with:
  ```
  MONGODB_URI=mongodb://<数据库用户名>:<数据库密码>@<主机1>:3717,<主机2>:3717/<数据库名>?replicaSet=<副本集名>&authSource=admin
  ```

### Step 2: Fix Mongoose Connection Options
- In `backend/index.js`, update authSource from `qinkangzhijian` to `admin`

### Step 3: Restart Backend Service
- Stop current running service
- Start service with updated configuration

### Step 4: Test Connection
- Verify service logs for "MongoDB连接成功" message
- Test health check API
- Attempt database operations to confirm access

## 3. Verification

### Success Criteria:
- Backend service starts without MongoDB authentication errors
- Service logs show successful connection
- Database operations complete without authentication failures
- Health check API returns 200 status

## 4. Expected Outcome

After implementing these changes, the application should successfully authenticate with MongoDB using the specified credentials, resolving the current authentication failure issue. The connection will use the correct username, properly encoded password, appropriate authSource, and target the intended database.