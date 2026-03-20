const express = require('express');
const router = express.Router();
// Models
const CategoryModel = require('../models/CategoryModel');
// Utils
const JwtUtil = require('../utils/JwtUtil');

// LẤY DANH SÁCH CATEGORY (Ai cũng xem được)
router.get('/', async (req, res) => {
  const categories = await CategoryModel.find({});
  res.json(categories);
});

// THÊM CATEGORY (Chỉ Admin mới được làm -> Cần checkToken)
router.post('/', JwtUtil.checkToken, async (req, res) => {
  const name = req.body.name;
  const category = new CategoryModel({ name: name });
  await category.save();
  res.json({ success: true, message: 'Successful' });
});

// SỬA CATEGORY
router.put('/:id', JwtUtil.checkToken, async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  await CategoryModel.findByIdAndUpdate(id, { name: name });
  res.json({ success: true, message: 'Successful' });
});

// XÓA CATEGORY
router.delete('/:id', JwtUtil.checkToken, async (req, res) => {
  const id = req.params.id;
  await CategoryModel.findByIdAndDelete(id);
  res.json({ success: true, message: 'Successful' });
});

module.exports = router;