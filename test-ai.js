const axios = require('axios');

// 测试AI聊天诊断接口
async function testChatDiagnosis() {
  try {
    const response = await axios.post('http://localhost:3000/api/ai-diagnosis/chat-diagnosis', {
      message: '我的鸡出现了腹泻症状',
      imageUrls: []
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-jwt-token'
      }
    });
    
    console.log('测试结果:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('测试失败:', error.response ? error.response.data : error.message);
  }
}

testChatDiagnosis();