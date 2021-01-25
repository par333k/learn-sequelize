const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        // 1:N, Comment가 N이고 User가 1일때 Comment->User는 belongsTo 메서드로 표현
        // 다른 모델의 정보가 들어가는 테이블에 belongsTo를 사용
        // commenter 컬럼이 추가되는 모델이 Comment 모델
        // foreignKey를 따로 지정하지 않는다면 이름이 모델명+기본 키인 컬럼이 모델에 생성됨
        db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
    }
}


