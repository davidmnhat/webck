const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel'); // ✅ FIX: trỏ đúng vào model

const receivedTransactions = new Map();

// Đổi tên route cho SePay
router.post('/sepay-webhook', async (req, res) => {
  
  try {
    // Bật check token luôn cho an toàn. Nhớ khai báo SEPAY_API_KEY trong file .env
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Apikey ${process.env.SEPAY_API_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized: Sai API Key' });
    }

    // SePay bắn thẳng 1 object về, đổi tên biến cho khớp tài liệu SePay
    const { content, transferAmount, transactionDate } = req.body;
    console.log(">>> TIỀN VỀ -> NỘI DUNG:", content);
    // Nếu không có nội dung chuyển khoản thì bỏ qua luôn
    if (!content) return res.json({ success: true });

    // Giữ nguyên logic tìm chuỗi DH 
    const match = content.toUpperCase().match(/DH\w+/);
    if (!match) return res.json({ success: true }); // Không có mã đơn thì kệ nó

    const orderCode = match[0];
    
    // Lưu vào Map (nhớ map đúng tên biến đang dùng ở frontend)
    receivedTransactions.set(orderCode, { 
      amount: transferAmount, 
      when: transactionDate, 
      description: content 
    });

    // Cập nhật DB
    await Order.findOneAndUpdate(
      { code: orderCode },
      { paymentStatus: 'PAID', paidAt: new Date(transactionDate) }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('SePay webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ĐOẠN DƯỚI NÀY GIỮ NGUYÊN 100% KO ĐỤNG VÀO
// ==========================================
router.get('/check-payment/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;

    if (receivedTransactions.has(orderCode)) {
      const tx = receivedTransactions.get(orderCode);
      receivedTransactions.delete(orderCode);
      return res.json({ paid: true, transaction: tx });
    }

    const order = await Order.findOne({ code: orderCode });
    if (order?.paymentStatus === 'PAID') {
      return res.json({ paid: true });
    }

    res.json({ paid: false });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;