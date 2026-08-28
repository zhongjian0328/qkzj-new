// Expo 动态配置：在 app.json 静态配置基础上注入运行时值
// 回退链：环境变量 EXPO_PUBLIC_API_URL -> app.json extra.apiUrl -> localhost 默认值
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL ||
      (config.extra && config.extra.apiUrl) ||
      'http://localhost:3000/api',
  },
});
