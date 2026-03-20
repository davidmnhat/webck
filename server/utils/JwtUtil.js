const jwt = require('jsonwebtoken');
const config = require('./MyConstants');

const JwtUtil = {
  // THÊM THAM SỐ 'id' VÀO ĐẦU
  genToken: (id, username, password) => {
    const token = jwt.sign(
      { id: id, username: username, password: password }, // Nhét thêm id vào đây
      config.SECRET,
      { expiresIn: config.TOKEN_TIMEOUT }
    );
    return token;
  },
  
  checkToken: (req, res, next) => {
    // ... (Code đoạn checkToken giữ nguyên không cần sửa)
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Token is not valid' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({ success: false, message: 'Auth token is not supplied' });
    }
  }
};
module.exports = JwtUtil;