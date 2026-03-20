const express = require('express');
const router = express.Router();
// Models
const OrderModel = require('../models/OrderModel');
// Utils
const JwtUtil = require('../utils/JwtUtil');

// 1. ĐẶT HÀNG (CHECKOUT) - Cần Token để biết ai đang mua
router.post('/checkout', JwtUtil.checkToken, async (req, res) => {
  const now = new Date().getTime();
  const total = req.body.total;
  const items = req.body.items;
  const customerId = req.decoded.id;

  // Lấy thêm 3 thông tin ship hàng từ dưới Frontend gửi lên
  const phone = req.body.phone;
  const address = req.body.address;
  const paymentMethod = req.body.paymentMethod;

  const order = new OrderModel({
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: customerId,
    items: items,
    phone: phone,
    address: address,
    paymentMethod: paymentMethod
  });
  
  await order.save();
  res.json({ success: true, message: 'Đặt hàng thành công!' });
});

// 2. XEM LỊCH SỬ ĐƠN HÀNG CỦA KHÁCH
router.get('/customer', JwtUtil.checkToken, async (req, res) => {
  const customerId = req.decoded.id;
  // Dùng .populate() để móc thông tin name, image, price từ bảng Product sang
  const orders = await OrderModel.find({ customer: customerId })
    .sort({ cdate: -1 })
    .populate('items.product', 'name image price');
  res.json(orders);
});

module.exports = router;