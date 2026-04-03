// CLI: npm install mongoose --save
const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

// Tạo chuỗi kết nối URI
const uri = 'mongodb://admin:123@ac-rir2ppz-shard-00-00.lychjcr.mongodb.net:27017,ac-rir2ppz-shard-00-01.lychjcr.mongodb.net:27017,ac-rir2ppz-shard-00-02.lychjcr.mongodb.net:27017/doanck?ssl=true&replicaSet=atlas-10macy-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(uri, {
  family: 4 // Ép Node.js sử dụng IPv4
})
.then(() => { console.log('Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE); })
.catch((err) => { console.error(err); });