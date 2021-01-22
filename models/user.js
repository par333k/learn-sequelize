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

/*
* sequelize : static init 메서드의 매개변수와 연결되는 옵션으로 db.sequelize 객체를 넣어야 한다. 나중에 model/index.js에서 연결한다.
* timestamps: 현재 fasle로 되어있으며, 이 속성값이 true면 시퀄라이즈는 createdAt과 updatedAt 컬럼을 추가한다. 각각 로우가 생성될 때와 수정될 때의 시간이 자동으로 입력된다.
* underscored: 시퀄라이즈는 기본적으로 테이블명과 컬럼명을 캐멀케이스로 만든다. 이를 스네이크 케이스로 바꾸는 옵션
* modelName: 모델 이름을 설정할 수 있다. 노드 프로젝트에서 사용.
* tableName: 실제 데이터베이스의 테이블 이름이 된다. 기본적으로는 모델 이름을 소문자 및 복수형으로 만든다.
* paranoid: true로 설정하면 deletedAt이라는 컬럼이 생긴다. 로우를 삭제할 때 완전히 지워지지 않고 deletedAt에 지운 시각이 기록된다. 로우를 조회하는 명령을 내렸을 때는 deletedAt의 값이
* null인 로우를 조회한다. 로우를 복원해야 하는 상황이 생길 것 같으면 true 로 설정
* charset과 collate:각자 utf8과 utf8_general_ci로 설정해야 한글이 입력된다. 이모티콘까지 입력할 수 있게 하고 싶다면 utf8mb4와 utf8mb4_general_ci를 입력합니다.
 */