const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  cdate: { type: Number, default: Date.now },
  total: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  cancelReason: { type: String, default: '' },
  customer: { type: Schema.Types.ObjectId, ref: 'customer' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number }
  }],

  // Thông tin ship hàng
  phone: { type: String },
  address: { type: String },
  paymentMethod: { type: String, default: 'COD' },

  // ✅ THÊM MỚI: hỗ trợ thanh toán chuyển khoản
  code: { type: String },                              // Mã đơn hàng VD: DH1718234567890
  paymentStatus: { type: String, default: 'PENDING' }, // PENDING | PAID
  paidAt: { type: Date },                              // Thời điểm thanh toán thành công
});

const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;