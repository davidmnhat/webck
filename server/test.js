const { GoogleGenerativeAI } = require("@google/generative-ai");

// DÁN TRỰC TIẾP API KEY MỚI VÀO ĐÂY ĐỂ TEST (Test xong nhớ xóa đi)
const API_KEY = "AIzaSyCeYEwYupUaQduBxuokbGPL_8B-zSEly6I"; 

const genAI = new GoogleGenerativeAI(API_KEY);

async function runTest() {
  try {
    console.log("Đang gửi request tới Gemini...");
    // Dùng đúng model gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Chào bạn, bạn là ai?");
    const response = await result.response;
    console.log("🎉 THÀNH CÔNG! Gemini trả lời:", response.text());
  } catch (error) {
    console.error("❌ VẪN LỖI:", error.message);
  }
}

runTest();