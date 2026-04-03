// Thay chuỗi này bằng API Key của bạn
const API_KEY = "AIzaSyCeYEwYupUaQduBxuokbGPL_8B-zSEly6I"; 

async function checkModels() {
  console.log("Đang dò tìm các model được phép sử dụng...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("\n=== DANH SÁCH MODEL BẠN CÓ THỂ DÙNG CHÍNH XÁC LÀ: ===");
      data.models.forEach(m => {
        // Chỉ lọc ra những model hỗ trợ chat/tạo văn bản (generateContent)
        if (m.supportedGenerationMethods.includes("generateContent")) {
           console.log(`👉 ${m.name.replace('models/', '')}`);
        }
      });
      console.log("===================================================\n");
      console.log("Hãy copy chính xác một trong các tên có biểu tượng 👉 ở trên thay vào code của bạn!");
    } else {
      console.log("Lỗi phản hồi từ Google:", data);
    }
  } catch (error) {
    console.error("Lỗi khi kết nối:", error);
  }
}

checkModels();