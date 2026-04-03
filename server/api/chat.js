const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/ProductModel');

// Thay bằng API Key thật lấy từ Google AI Studio
const genAI = new GoogleGenerativeAI('AIzaSyCeYEwYupUaQduBxuokbGPL_8B-zSEly6I');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Lấy danh sách sản phẩm để AI có dữ liệu tư vấn
    const products = await Product.find();
    const productInfo = products.map(p => `- ${p.name}: ${p.price.toLocaleString()} VNĐ`).join('\n');

    
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Bạn là trợ lý ảo của "MY SHOP". Hãy dùng danh sách sau để tư vấn cho khách:\n${productInfo}\nKhách hỏi: ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("LỖI AI ĐÂY NÈ:", err); // Thêm dòng này
    res.status(500).json({ reply: 'Lỗi rồi mày ơi, kiểm tra Terminal backend nhé!' });
  }
});

module.exports = router;