'use strict';

const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Comment = Comment;
// 각각 모델의 static.init 메서드 호출
// init 이 실행되어야 테이블이 모델로 연결됨.
User.init(sequelize);   
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;

