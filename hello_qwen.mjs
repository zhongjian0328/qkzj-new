import OpenAI from "openai";

try {
    // 直接使用环境变量值创建OpenAI实例
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
        console.log("API调用失败：缺少环境变量 DASHSCOPE_API_KEY，请先设置后再运行");
        process.exit(1);
    }
    const baseURL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
    
    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL
    });
    const completion = await openai.chat.completions.create({
        model: "qwen-turbo",  // 使用更基础的qwen-turbo模型
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "你是谁？" }
        ],
    });
    console.log("API调用成功！");
    console.log("模型响应：");
    console.log(completion.choices[0].message.content);
} catch (error) {
    console.log("API调用失败：");
    console.log(`错误信息： ${error} `);
    console.log("错误代码参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code");
}