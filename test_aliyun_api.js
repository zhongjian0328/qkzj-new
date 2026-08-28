const axios = require('axios');

// 配置API参数
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) {
  console.error('错误: 缺少环境变量 DASHSCOPE_API_KEY，请先设置后再运行（如 DASHSCOPE_API_KEY=sk-xxx node test_aliyun_api.js）');
  process.exit(1);
}
const baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const model = 'qwen-turbo';

// 创建请求头
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

// 请求数据
const data = {
  model: model,
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: '你是谁？' }
  ]
};

// 直接使用axios调用API
console.log('正在调用阿里云通义千问API...');
console.log(`模型: ${model}`);
console.log(`API地址: ${baseURL}`);

try {
  axios.post(`${baseURL}/chat/completions`, data, { headers }) 
    .then(response => {
      console.log('\nAPI调用成功！');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
      if (response.data.choices && response.data.choices[0].message) {
        console.log('\n模型回答:');
        console.log(response.data.choices[0].message.content);
      }
    })
    .catch(error => {
      console.log('\nAPI调用失败:');
      if (error.response) {
        // 服务器返回了错误状态码
        console.log(`状态码: ${error.response.status}`);
        console.log(`错误信息: ${JSON.stringify(error.response.data, null, 2)}`);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.log('未收到响应:', error.request);
      } else {
        // 请求配置出错
        console.log('请求配置错误:', error.message);
      }
    });
} catch (error) {
  console.log('发生异常:', error);
}