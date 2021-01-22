const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) { // 테이블에 대한 설정
        return super.init({ // 첫 번째 인수 - 테이블 컬럼 설정 두 번째 인수 테이블 자체 설정
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) { // 다른 모델과의 관계
        
    } 
};