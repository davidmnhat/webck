const express = require('express');
const router = express.Router();

// Utils
const JwtUtil = require('../utils/JwtUtil');
const CryptoUtil = require('../utils/CryptoUtil');

// Models
const AdminModel = require('../models/AdminModel');
const OrderModel = require('../models/OrderModel');

// --- 2 DÒNG NÀY LÀ LINH HỒN ĐỂ HẾT BỊ LỖI TRẮNG TRANG ---
const CustomerModel = require('../models/CustomerModel');
const ProductModel = require('../models/ProductModel');

// ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    // Tìm admin trong DB (biến admin được khai báo chính thức ở đây)
    const admin = await AdminModel.findOne({ 
        username: username, 
        password: CryptoUtil.md5(password) 
    });

    if (admin) {
      const token = JwtUtil.genToken(admin._id, admin.username, admin.password);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please provide username and password' });
  }
});

// TẠO TÀI KHOẢN ADMIN (Dùng để test, chạy 1 lần rồi xóa cũng được)
router.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminModel.findOne({ username: username });
    if (admin) {
        res.json({ success: false, message: 'Exists already' });
    } else {
        const newAdmin = new AdminModel({
            username: username,
            password: CryptoUtil.md5(password) 
        });
        await newAdmin.save();
        res.json({ success: true, message: 'Created successful' });
    }
  } else {
    res.json({ success: false, message: 'Please provide username and password' });
  }
});
// 1. LẤY TẤT CẢ ĐƠN HÀNG CỦA MỌI KHÁCH
router.get('/orders', JwtUtil.checkToken, async (req, res) => {
  // Lấy đơn hàng, sắp xếp mới nhất lên đầu, móc luôn tên khách hàng và tên sản phẩm ra
  const orders = await OrderModel.find()
    .sort({ cdate: -1 })
    .populate('customer', 'name phone')
    .populate('items.product', 'name price');
  res.json(orders);
});

// 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
router.put('/orders/status/:id', JwtUtil.checkToken, async (req, res) => {
  const _id = req.params.id;
  const newStatus = req.body.status;
  // Cập nhật trạng thái mới vào Database
  const result = await OrderModel.findByIdAndUpdate(_id, { status: newStatus }, { new: true });
  res.json(result);
});
module.exports = router;