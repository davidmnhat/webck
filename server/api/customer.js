const express = require('express');
const router = express.Router();
// Models
const CustomerModel = require('../models/CustomerModel');
// Utils
const JwtUtil = require('../utils/JwtUtil');

// 1. ĐĂNG KÝ TÀI KHOẢN (SIGNUP)
router.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  // Kiểm tra xem user này đã tồn tại chưa
  const dbCust = await CustomerModel.findOne({ username: username });
  if (dbCust) {
    res.json({ success: false, message: 'Tên đăng nhập đã tồn tại!' });
  } else {
    const newCust = new CustomerModel({
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
      active: 1, // 1 là tài khoản đang hoạt động
      token: ''
    });
    await newCust.save();
    res.json({ success: true, message: 'Đăng ký thành công!' });
  }
});

// 2. ĐĂNG NHẬP (LOGIN)
// ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    // --- ĐÂY LÀ DÒNG BỊ THIẾU NÊN NÓ MỚI BÁO LỖI ---
    // Tìm khách hàng trong DB khớp với username và password
    const customer = await CustomerModel.findOne({ username: username, password: password });
    // -----------------------------------------------

    if (customer) {
      if (customer.active === 0) {
        res.json({ success: false, message: 'Tài khoản chưa kích hoạt' });
      } else if (customer.lockaccount === 1) {
        res.json({ success: false, message: 'Tài khoản đã bị khóa' });
      } else {
        // Có customer rồi thì mới lấy được _id ở đây
        const token = JwtUtil.genToken(customer._id, customer.username, customer.password);
        res.json({ success: true, message: 'Đăng nhập thành công', token: token, customer: customer });
      }
    } else {
      res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  } else {
    res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
  }
});
// CHỈNH SỬA HỒ SƠ (CÓ LOG ĐỂ BẮT LỖI)
router.put('/profile', JwtUtil.checkToken, async (req, res) => {
  try {
    // --- MÁY SOI TOKEN (QUAN TRỌNG) ---
    console.log("====================================");
    console.log("🔍 NỘI DUNG TOKEN (req.decoded):", req.decoded);
    
    const id = req.decoded.id || req.decoded._id; 
    console.log("🔑 ID LẤY RA ĐƯỢC:", id);
    console.log("====================================");
    // ----------------------------------

    const { name, phone, email, address } = req.body;
    
    // Nếu không có ID thì báo lỗi luôn
    if (!id) {
       return res.json({ success: false, message: 'Lỗi Token: Không tìm thấy ID!' });
    }

    const newCustomer = await CustomerModel.findByIdAndUpdate(id, 
      { name, phone, email, address }, 
      { new: true }
    );

    if (newCustomer) {
      res.json({ success: true, message: 'Cập nhật thành công!', customer: newCustomer });
    } else {
      res.json({ success: false, message: 'Lỗi: Tìm ID trong DB không thấy!' });
    }
  } catch (err) {
    console.error("LỖI SERVER:", err);
    res.json({ success: false, message: 'Lỗi Server: ' + err.message });
  }
});

// 3. XEM THÔNG TIN CÁ NHÂN (Cần Token)
router.get('/account', JwtUtil.checkToken, async (req, res) => {
  // JwtUtil.checkToken sẽ giải mã token và nhét ID của khách vào req.decoded.id
  const id = req.decoded.id;
  const customer = await CustomerModel.findById(id);
  res.json(customer);
});

module.exports = router;