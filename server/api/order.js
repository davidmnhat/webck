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

  // ✅ Tạo mã đơn hàng duy nhất
  const orderCode = 'DH' + now;

  const order = new OrderModel({
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: customerId,
    items: items,
    phone: phone,
    address: address,
    paymentMethod: paymentMethod,
    code: orderCode,                                                    // ✅ THÊM
    paymentStatus: paymentMethod === 'BANKING' ? 'PENDING' : 'PAID',   // ✅ THÊM
  });

  await order.save();
  res.json({ success: true, message: 'Đặt hàng thành công!', orderCode: orderCode }); // ✅ trả orderCode về
});

// 2. XEM LỊCH SỬ ĐƠN HÀNG CỦA KHÁCH
router.get('/customer', JwtUtil.checkToken, async (req, res) => {
  const customerId = req.decoded.id;
  // Dùng .populate() để móc thông tin name, image, price từ bảng Product sang
  const orders = await OrderModel.find({ customer: customerId })
    .sort({ cdate: -1 })
    .populate('items.product', 'name image price');
  res.json({ success: true, orders });
});

// 3. HỦY ĐƠN HÀNG
router.put('/cancel/:id', JwtUtil.checkToken, async (req, res) => {
  const customerId = req.decoded.id;
  const { reason } = req.body;

  const order = await OrderModel.findOne({ _id: req.params.id, customer: customerId });

  if (!order) {
    return res.json({ success: false, message: 'Không tìm thấy đơn hàng.' });
  }

  if (order.status !== 'PENDING') {
    return res.json({ success: false, message: 'Chỉ có thể hủy đơn đang chờ xác nhận.' });
  }

  order.status = 'CANCELED';
  order.cancelReason = reason;
  await order.save();

  res.json({ success: true, message: 'Hủy đơn hàng thành công.' });
});

// 4. THỐNG KÊ DASHBOARD (Admin)
router.get('/stats', async (req, res) => {
  const orders = await OrderModel.find({});

  // Tổng doanh thu (tính tất cả đơn trừ CANCELED)
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELED')
    .reduce((sum, o) => sum + o.total, 0);

  // Thống kê trạng thái
  const statusStats = {
    COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
    PENDING:   orders.filter(o => o.status === 'PENDING').length,
    APPROVED:  orders.filter(o => o.status === 'APPROVED').length,
    SHIPPING:  orders.filter(o => o.status === 'SHIPPING').length,
    CANCELED:  orders.filter(o => o.status === 'CANCELED').length,
  };

  // Doanh thu theo ngày/tháng (tất cả đơn trừ CANCELED)
  const dailyMap = {};
  const monthlyMap = {};

  orders
    .filter(o => o.status !== 'CANCELED')
    .forEach(o => {
      const d = new Date(o.cdate);
      const dayKey   = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const monthKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      dailyMap[dayKey]   = (dailyMap[dayKey]   || 0) + o.total;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + o.total;
    });

  const daily   = Object.entries(dailyMap).sort().slice(-30).map(([date, revenue]) => ({ date, revenue }));
  const monthly = Object.entries(monthlyMap).sort().slice(-12).map(([date, revenue]) => ({ date, revenue }));

  res.json({ totalRevenue, statusStats, daily, monthly });
});

module.exports = router;