# API设计文档

## 1. 引言

### 1.1 文档目的
本文档详细描述了禽康智检APP的API设计，包括接口路径、请求/响应参数、数据格式、错误码定义及权限控制策略，旨在为开发团队提供明确的API开发指导，确保API设计符合RESTful规范，接口的一致性和可理解性。

### 1.2 文档范围
本文档涵盖了禽康智检APP的所有API接口，包括用户与认证、AI诊断、生产管理、疫情监测、知识学习、商业服务、数据标注等模块。

### 1.3 术语定义
| 术语 | 定义 |
|------|------|
| RESTful API | 一种软件架构风格，用于设计网络应用程序接口 |
| JWT | JSON Web Token，一种用于身份认证的令牌 |
| RBAC | 基于角色的访问控制（Role-Based Access Control） |
| HTTP | 超文本传输协议 |
| JSON | JavaScript对象表示法，一种轻量级的数据交换格式 |

## 2. API设计原则

### 2.1 RESTful设计规范
- 使用HTTP方法表示操作类型：
  - GET：获取资源
  - POST：创建资源
  - PUT：更新资源
  - DELETE：删除资源

- 使用名词表示资源：
  - 单数：表示单个资源
  - 复数：表示资源集合

- 使用HTTP状态码表示响应状态：
  - 2xx：成功
  - 4xx：客户端错误
  - 5xx：服务器错误

### 2.2 版本控制
- API版本控制采用URL路径方式：`/api/v1/resource`
- 版本号使用数字，如v1, v2等

### 2.3 数据格式
- 请求和响应数据格式均为JSON
- 字符编码：UTF-8

### 2.4 身份认证与授权
- 使用JWT进行身份认证
- 在HTTP请求头中携带JWT令牌：`Authorization: Bearer {token}`
- 基于角色的访问控制（RBAC）

### 2.5 错误处理
- 统一的错误响应格式
- 明确的错误码定义
- 详细的错误信息

## 3. 错误码定义

| 错误码 | 错误信息 | 描述 | HTTP状态码 |
|--------|----------|------|------------|
| 0 | 成功 | 请求成功 | 200 |
| 10001 | 无效的请求参数 | 请求参数不符合要求 | 400 |
| 10002 | 缺少必要的请求参数 | 缺少必填的请求参数 | 400 |
| 10003 | 无效的手机号 | 手机号格式不正确 | 400 |
| 10004 | 验证码无效或已过期 | 验证码无效或已过期 | 400 |
| 10005 | 手机号已注册 | 手机号已被注册 | 400 |
| 10006 | 无效的登录凭证 | 用户名或密码错误 | 401 |
| 10007 | 未授权访问 | 缺少有效的JWT令牌 | 401 |
| 10008 | 权限不足 | 没有访问该资源的权限 | 403 |
| 10009 | 资源不存在 | 请求的资源不存在 | 404 |
| 10010 | 服务器内部错误 | 服务器内部发生错误 | 500 |
| 10011 | 第三方服务调用失败 | 调用第三方服务失败 | 502 |
| 10012 | 数据库操作失败 | 数据库操作失败 | 500 |

## 4. 通用响应格式

### 4.1 成功响应
```json
{
  "code": 0,
  "message": "成功",
  "data": {
    // 响应数据
  }
}
```

### 4.2 错误响应
```json
{
  "code": 错误码,
  "message": "错误信息",
  "data": null
}
```

## 5. API接口设计

### 5.1 用户与认证API

#### 5.1.1 发送验证码
- **接口名称**：发送验证码
- **请求方法**：POST
- **请求路径**：`/api/v1/auth/send-code`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | phone_number | string | 是 | 手机号 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | success | boolean | 是否发送成功 |
  | message | string | 提示信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "success": true,
      "message": "验证码已发送"
    }
  }
  ```

- **权限控制**：无需认证

#### 5.1.2 手机号登录/注册
- **接口名称**：手机号登录/注册
- **请求方法**：POST
- **请求路径**：`/api/v1/auth/login`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | phone_number | string | 是 | 手机号 |
  | code | string | 是 | 验证码 |
  | password | string | 否 | 登录密码（注册时可选） |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | token | string | JWT令牌 |
  | user | object | 用户信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "user_id": "123456",
        "phone_number": "13800138000",
        "nickname": "用户123",
        "role_type": "FARMER",
        "sub_role": "SMALL",
        "auth_status": "UNVERIFIED",
        "registration_date": "2025-12-14T10:00:00Z"
      }
    }
  }
  ```

- **权限控制**：无需认证

#### 5.1.3 密码登录
- **接口名称**：密码登录
- **请求方法**：POST
- **请求路径**：`/api/v1/auth/login/password`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | phone_number | string | 是 | 手机号 |
  | password | string | 是 | 登录密码 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | token | string | JWT令牌 |
  | user | object | 用户信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "user_id": "123456",
        "phone_number": "13800138000",
        "nickname": "用户123",
        "role_type": "FARMER",
        "sub_role": "SMALL",
        "auth_status": "UNVERIFIED",
        "registration_date": "2025-12-14T10:00:00Z"
      }
    }
  }
  ```

- **权限控制**：无需认证

#### 5.1.4 角色选择
- **接口名称**：角色选择
- **请求方法**：PUT
- **请求路径**：`/api/v1/auth/role`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | role_type | string | 是 | 角色类型：FARMER, INSTITUTION, STUDENT, TEACHER |
  | sub_role | string | 是 | 子角色类型 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | success | boolean | 是否设置成功 |
  | message | string | 提示信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "success": true,
      "message": "角色设置成功"
    }
  }
  ```

- **权限控制**：需要认证

#### 5.1.5 提交认证材料
- **接口名称**：提交认证材料
- **请求方法**：POST
- **请求路径**：`/api/v1/auth/certify`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | cert_materials | object | 是 | 认证材料，根据角色不同有所差异 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | success | boolean | 是否提交成功 |
  | message | string | 提示信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "success": true,
      "message": "认证材料提交成功，等待审核"
    }
  }
  ```

- **权限控制**：需要认证

#### 5.1.6 获取认证状态
- **接口名称**：获取认证状态
- **请求方法**：GET
- **请求路径**：`/api/v1/auth/certify/status`

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | status | string | 认证状态：UNVERIFIED, PENDING, VERIFIED |
  | message | string | 提示信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "status": "PENDING",
      "message": "认证材料审核中"
    }
  }
  ```

- **权限控制**：需要认证

### 5.2 AI诊断API

#### 5.2.1 对话问诊
- **接口名称**：对话问诊
- **请求方法**：POST
- **请求路径**：`/api/v1/ai/diagnosis/chat`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | message | string | 是 | 用户输入的消息 |
  | images | array | 否 | 图片URL列表 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | response | object | AI响应内容 |
  | chat_history | array | 对话历史 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "response": {
        "type": "diagnosis",
        "content": "根据您的描述和图片，初步诊断为禽流感，请参考以下防控方案...",
        "confidence": 0.85
      },
      "chat_history": [
        {
          "role": "user",
          "content": "我的鸡出现了呼吸困难、鸡冠发紫的症状",
          "timestamp": "2025-12-14T10:00:00Z"
        },
        {
          "role": "ai",
          "content": "根据您的描述和图片，初步诊断为禽流感，请参考以下防控方案...",
          "timestamp": "2025-12-14T10:01:00Z"
        }
      ]
    }
  }
  ```

- **权限控制**：需要认证

#### 5.2.2 阶段一数据上传
- **接口名称**：阶段一数据上传
- **请求方法**：POST
- **请求路径**：`/api/v1/ai/diagnosis/stage1`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | basic_info | object | 是 | 基础养殖信息 |
  | clinical_symptoms | object | 是 | 临床表现 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | diagnosis_result | object | AI初诊结果 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "diagnosis_result": {
        "record_id": "123456",
        "preliminary_diagnosis": [
          {
            "disease": "禽流感",
            "confidence": 0.85,
            "symptoms": ["呼吸困难", "鸡冠发紫", "死亡率高"]
          },
          {
            "disease": "新城疫",
            "confidence": 0.65,
            "symptoms": ["呼吸困难", "神经症状", "死亡率高"]
          }
        ],
        "risk_level": "HIGH",
        "emergency_measures": ["隔离病鸡", "消毒场地", "联系兽医"],
        "diagnosis_plan": {
          "emergency_tests": ["病毒分离鉴定", "PCR检测"],
          "important_tests": ["血清学检测"]
        }
      }
    }
  }
  ```

- **权限控制**：需要认证

#### 5.2.3 阶段二数据上传
- **接口名称**：阶段二数据上传
- **请求方法**：POST
- **请求路径**：`/api/v1/ai/diagnosis/stage2`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | record_id | string | 是 | 诊断记录ID |
  | pathological_changes | object | 是 | 病理变化 |
  | rapid_test_results | object | 是 | 快速检测结果 |
  | sampling_info | object | 是 | 采样信息 |
  | experimental_data | object | 是 | 实验数据 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | final_diagnosis | object | AI确诊结果 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "final_diagnosis": {
        "record_id": "123456",
        "diagnosis": "禽流感（H9N2亚型）",
        "confidence": 0.95,
        "pathogens": ["禽流感病毒 (H9N2)", "新城疫病毒（低致病性）"],
        "core_threat": "混合感染导致死亡率升高",
        "emergency_prevention_plan": {
          "0-24小时": ["紧急隔离", "全面消毒", "紧急免疫"],
          "1-7天": ["药物治疗", "加强监测", "无害化处理"],
          "7-14天": ["恢复生产", "免疫接种", "生物安全体系优化"]
        },
        "biosecurity_optimization_plan": {
          "facilityOptimization": ["改进通风系统", "增加消毒通道"],
          "managementImprovement": ["加强人员培训", "完善消毒制度"],
          "monitoringSystem": ["安装监控设备", "建立预警机制"]
        }
      }
    }
  }
  ```

- **权限控制**：需要认证，仅限机构用户

#### 5.2.4 获取诊断历史
- **接口名称**：获取诊断历史
- **请求方法**：GET
- **请求路径**：`/api/v1/ai/diagnosis/history`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | limit | number | 否 | 每页数量，默认10 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | records | array | 诊断记录列表 |
  | total | number | 总记录数 |
  | page | number | 当前页码 |
  | limit | number | 每页数量 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "records": [
        {
          "record_id": "123456",
          "diagnosis_time": "2025-12-14T10:00:00Z",
          "diagnosis_mode": "VET",
          "disease": "禽流感",
          "risk_level": "HIGH",
          "status": "COMPLETED"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

- **权限控制**：需要认证

### 5.3 生产管理API

#### 5.3.1 创建批次
- **接口名称**：创建批次
- **请求方法**：POST
- **请求路径**：`/api/v1/production/batch`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | batch_name | string | 是 | 批次名称 |
  | species | string | 是 | 禽类品种 |
  | initial_quantity | number | 是 | 初始数量 |
  | entry_date | string | 是 | 入栏日期，格式：YYYY-MM-DD |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | batch_id | string | 批次ID |
  | message | string | 提示信息 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "batch_id": "123456",
      "message": "批次创建成功"
    }
  }
  ```

- **权限控制**：需要认证，仅限养殖企业用户

#### 5.3.2 获取批次列表
- **接口名称**：获取批次列表
- **请求方法**：GET
- **请求路径**：`/api/v1/production/batches`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | limit | number | 否 | 每页数量，默认10 |
  | status | string | 否 | 批次状态：ACTIVE, FINISHED |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | batches | array | 批次列表 |
  | total | number | 总记录数 |
  | page | number | 当前页码 |
  | limit | number | 每页数量 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "batches": [
        {
          "batch_id": "123456",
          "batch_name": "20251214-001",
          "species": "白羽肉鸡",
          "initial_quantity": 10000,
          "current_quantity": 9500,
          "entry_date": "2025-12-14T00:00:00Z",
          "status": "ACTIVE"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

- **权限控制**：需要认证，仅限养殖企业用户

#### 5.3.3 记录死淘数量
- **接口名称**：记录死淘数量
- **请求方法**：POST
- **请求路径**：`/api/v1/production/death`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | batch_id | string | 是 | 批次ID |
  | death_count | number | 是 | 死淘数量 |
  | record_date | string | 是 | 记录日期，格式：YYYY-MM-DD |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | success | boolean | 是否记录成功 |
  | message | string | 提示信息 |
  | death_rate | number | 当前死淘率 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "success": true,
      "message": "死淘数量记录成功",
      "death_rate": 0.05
    }
  }
  ```

- **权限控制**：需要认证，仅限养殖企业用户

#### 5.3.4 获取死淘率分析
- **接口名称**：获取死淘率分析
- **请求方法**：GET
- **请求路径**：`/api/v1/production/death/analysis`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | batch_id | string | 是 | 批次ID |
  | start_date | string | 是 | 开始日期，格式：YYYY-MM-DD |
  | end_date | string | 是 | 结束日期，格式：YYYY-MM-DD |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | death_rate_data | array | 死淘率数据，包含日期和死淘率 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "death_rate_data": [
        {
          "date": "2025-12-14",
          "death_count": 50,
          "death_rate": 0.005
        },
        {
          "date": "2025-12-15",
          "death_count": 45,
          "death_rate": 0.0045
        }
      ]
    }
  }
  ```

- **权限控制**：需要认证，仅限养殖企业用户

### 5.4 疫情监测API

#### 5.4.1 获取疫情热力图数据
- **接口名称**：获取疫情热力图数据
- **请求方法**：GET
- **请求路径**：`/api/v1/epidemic/heatmap`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | region | string | 否 | 地区，如省份、城市 |
  | time_range | string | 否 | 时间范围：7d, 30d, 90d |
  | disease_type | string | 否 | 疾病类型 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | heatmap_data | array | 热力图数据，包含经纬度、病例数、风险等级 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "heatmap_data": [
        {
          "lat": 39.9042,
          "lng": 116.4074,
          "cases": 15,
          "risk_level": "HIGH",
          "disease_type": "禽流感"
        },
        {
          "lat": 31.2304,
          "lng": 121.4737,
          "cases": 8,
          "risk_level": "MEDIUM",
          "disease_type": "新城疫"
        }
      ]
    }
  }
  ```

- **权限控制**：需要认证，仅限疫控机构和科研院所用户

#### 5.4.2 获取异常高发报警
- **接口名称**：获取异常高发报警
- **请求方法**：GET
- **请求路径**：`/api/v1/epidemic/alerts`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | limit | number | 否 | 每页数量，默认10 |
  | status | string | 否 | 报警状态：NEW, PROCESSING, RESOLVED |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | alerts | array | 报警列表 |
  | total | number | 总记录数 |
  | page | number | 当前页码 |
  | limit | number | 每页数量 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "alerts": [
        {
          "alert_id": "123456",
          "region": "北京市",
          "disease_type": "禽流感",
          "cases": 15,
          "risk_level": "HIGH",
          "alert_time": "2025-12-14T10:00:00Z",
          "status": "NEW",
          "description": "北京市某地区禽流感病例异常增加"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

- **权限控制**：需要认证，仅限疫控机构用户

### 5.5 知识学习API

#### 5.5.1 获取图谱百科列表
- **接口名称**：获取图谱百科列表
- **请求方法**：GET
- **请求路径**：`/api/v1/knowledge/graph`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | limit | number | 否 | 每页数量，默认10 |
  | category | string | 否 | 分类 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | graphs | array | 图谱百科列表 |
  | total | number | 总记录数 |
  | page | number | 当前页码 |
  | limit | number | 每页数量 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "graphs": [
        {
          "graph_id": "123456",
          "title": "禽流感",
          "category": "病毒性疾病",
          "description": "禽流感是由禽流感病毒引起的一种急性传染病...",
          "image_url": "https://example.com/image.jpg"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

- **权限控制**：需要认证

#### 5.5.2 获取题库列表
- **接口名称**：获取题库列表
- **请求方法**：GET
- **请求路径**：`/api/v1/knowledge/questions`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | limit | number | 否 | 每页数量，默认10 |
  | category | string | 否 | 分类 |

- **响应参数**：
  | 参数名 | 类型 | 描述 |
  |--------|------|------|
  | questions | array | 题库列表 |
  | total | number | 总记录数 |
  | page | number | 当前页码 |
  | limit | number | 每页数量 |

- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "成功",
    "data": {
      "questions": [
        {
          "question_id": "123456",
          "question_text": "以下哪种症状不是禽流感的典型症状？",
          "options": ["呼吸困难", "鸡冠发紫", "下痢", "体温下降"],
          "correct_answer": "D",
          "category": "病毒性疾病",
          "difficulty": "MEDIUM"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

- **权限控制**：需要认证，仅限学生用户

## 6. 权限控制策略

### 6.1 角色定义

| 角色 | 描述 |
|------|------|
| 养殖户（小散户） | 小规模养殖用户 |
| 养殖户（合作社） | 合作社养殖用户 |
| 养殖户（企业） | 规模化养殖企业用户 |
| 机构（疫控） | 疫情控制机构用户 |
| 机构（科研院所） | 科研院所用户 |
| 机构（服务商） | 服务商用户 |
| 学生（学习） | 学习阶段学生用户 |
| 学生（实习） | 实习阶段学生用户 |
| 教师 | 教师用户 |

### 6.2 权限矩阵

| API模块 | 接口名称 | 允许角色 |
|---------|----------|----------|
| 用户与认证 | 发送验证码 | 所有角色 |
| 用户与认证 | 手机号登录/注册 | 所有角色 |
| 用户与认证 | 密码登录 | 所有角色 |
| 用户与认证 | 角色选择 | 已注册用户 |
| 用户与认证 | 提交认证材料 | 已注册用户 |
| 用户与认证 | 获取认证状态 | 已注册用户 |
| AI诊断 | 对话问诊 | 所有注册用户 |
| AI诊断 | 阶段一数据上传 | 所有注册用户 |
| AI诊断 | 阶段二数据上传 | 机构用户 |
| AI诊断 | 获取诊断历史 | 所有注册用户 |
| 生产管理 | 创建批次 | 养殖企业用户 |
| 生产管理 | 获取批次列表 | 养殖企业用户 |
| 生产管理 | 记录死淘数量 | 养殖企业用户 |
| 生产管理 | 获取死淘率分析 | 养殖企业用户 |
| 疫情监测 | 获取疫情热力图数据 | 疫控机构、科研院所 |
| 疫情监测 | 获取异常高发报警 | 疫控机构 |
| 知识学习 | 获取图谱百科列表 | 所有注册用户 |
| 知识学习 | 获取题库列表 | 学生用户 |

## 7. API版本管理

### 7.1 版本号规则
- 主版本号：当API进行不兼容的重大变更时，递增主版本号
- 次版本号：当API新增功能，但保持向后兼容时，递增次版本号
- 修订号：当API进行向后兼容的问题修复时，递增修订号

### 7.2 版本支持策略
- 每个主版本至少支持6个月
- 新版本发布后，旧版本至少继续支持3个月
- 版本下线前，提前1个月通知用户

## 8. API测试要点

### 8.1 功能测试
- API请求和响应参数测试
- 接口逻辑测试
- 边界条件测试

### 8.2 性能测试
- API响应时间测试
- 并发请求测试
- 压力测试

### 8.3 安全测试
- 身份认证测试
- 权限控制测试
- 数据加密测试
- SQL注入测试
- XSS攻击测试

### 8.4 兼容性测试
- 不同客户端版本兼容性测试
- 不同操作系统兼容性测试

## 9. 结论

本文档详细描述了禽康智检APP的API设计，包括接口路径、请求/响应参数、数据格式、错误码定义及权限控制策略。API设计遵循RESTful规范，确保了接口的一致性和可理解性。通过遵循本文档的设计，将确保API开发符合需求和质量标准，实现预期的功能和性能目标。
