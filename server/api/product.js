const express = require('express');
const router = express.Router();
// Models
const ProductModel = require('../models/ProductModel');
// Utils
const JwtUtil = require('../utils/JwtUtil');

// --- PHẦN PUBLIC (Ai cũng xem được) ---

// 1. LẤY TẤT CẢ SẢN PHẨM
router.get('/', async (req, res) => {
  // .populate('category') để lấy luôn thông tin chi tiết của danh mục (tên, id)
  const products = await ProductModel.find({}).populate('category'); 
  res.json(products);
});

// 2. LẤY TOP SẢN PHẨM MỚI (Ví dụ lấy 3 cái mới nhất)
router.get('/new', async (req, res) => {
  const products = await ProductModel.find({}).sort({ cdate: -1 }).limit(3);
  res.json(products);
});

// 3. LẤY SẢN PHẨM THEO DANH MỤC (categoryID)
router.get('/category/:cid', async (req, res) => {
  const cid = req.params.cid;
  const products = await ProductModel.find({ category: cid }).populate('category');
  res.json(products);
});

// 4. TÌM KIẾM SẢN PHẨM (Theo tên)
router.get('/search/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const products = await ProductModel.find({ name: new RegExp(keyword, "i") }).populate('category');
  res.json(products);
});

// 5. CHI TIẾT SẢN PHẨM (Theo ID)
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id).populate('category');
  res.json(product);
});

// --- PHẦN ADMIN (Cần Token để truy cập) ---

// 6. THÊM SẢN PHẨM
router.post('/', JwtUtil.checkToken, async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  // Nhận thêm dữ liệu mới
  const description = req.body.description || "Chưa có mô tả";
  const color = req.body.color || "Standard";
  const memory = req.body.memory || "Standard";
  
  const now = new Date().getTime();
  
  const product = new ProductModel({
    name: name,
    price: price,
    category: cid,
    image: image,
    description: description, // Lưu vào DB
    color: color,             // Lưu vào DB
    memory: memory,           // Lưu vào DB
    cdate: now
  });
  await product.save();
  res.json({ success: true, message: 'Successful' });
});

// 7. SỬA SẢN PHẨM
router.put('/:id', JwtUtil.checkToken, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  // Nhận thêm dữ liệu mới
  const description = req.body.description;
  const color = req.body.color;
  const memory = req.body.memory;
  
  const now = new Date().getTime();

  await ProductModel.findByIdAndUpdate(id, {
    name: name,
    price: price,
    category: cid,
    image: image,
    description: description,
    color: color,
    memory: memory,
    cdate: now
  });
  res.json({ success: true, message: 'Successful' });
});

// 8. XÓA SẢN PHẨM
router.delete('/:id', JwtUtil.checkToken, async (req, res) => {
  const id = req.params.id;
  await ProductModel.findByIdAndDelete(id);
  res.json({ success: true, message: 'Successful' });
});

module.exports = router;