const MyConstants = {
  DB_SERVER: 'cluster0.lychjcr.mongodb.net',
  DB_USER: 'admin',
  DB_PASS: '123',
  DB_DATABASE: 'doanck',
  EMAIL_USER: 'email_cua_ban@gmail.com', 
  EMAIL_PASS: 'mat_khau_ung_dung_email', 
  
  // --- SỬA DÒNG NÀY (Đổi JWT_SECRET thành SECRET) ---
  SECRET: 'hehehe', 
  // --------------------------------------------------
  
  JWT_EXPIRES: '3600000', 
  TOKEN_TIMEOUT: 60 * 60 * 1000
};
module.exports = MyConstants;