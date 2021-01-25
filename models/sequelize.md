## 데이터베이스 관계에 따른 sequelize 관계설정

### 1:1
- User 모델이 있고 사용자 정보를 담고 있는 가상의 Info 모델이 있다고 했을 경우
```
db.User.hasOne(db.Info, { foreignKey: 'UserId', sourceKey: 'id' });
db.Info.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });
```
- 1:1 관계에서도 1:N처럼 belongsTo는 새 컬럼이 왜래키에 의해 추가되는 모델에 쓰여야 한다.
- hasMany 대신 hasOne을  쓴다

### N:M
- 다대다 관계, 게시글과 해시태그 모델이 대표적인 예이다.
- 게시글 정보를 담고 있는 가상의 Post 모델과 해시태그 정보를 담고 있는 가상의 Hashtag 모델이 있다고 하면 다음과 같이 표현할 수 있다.
```
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
```
- 양쪽 모델에 모두 belongsToMany 메서드를 사용.
- N:M 관계의 특성상 새로운 모델이 생성된다. through 속성에 그 이름을 적으면 된다. 
- 새로 생성된 PostHashtag 모델에는 게시글과 해시태그의 아이디가 저장된다.
- N:M에서 데이터를 조회할 때는 여러 단계를 거쳐야 한다. 어떤 해시태그를 사용한 게시물을 조회할 경우, 
먼저 해시태그를 Hashtag 모델에서 조회하고 가져온 태그의 아이디를 바탕으로 PostHashtag 모델에서 hashtagId가 1인 postId들을 찾아 Post 모델에서 정보를 가져온다.
- 자동으로 만들어진 모델들도 다음과 같이 접근 가능하다.
```
db.sequelize.models.PostHashtag
```

### 시퀄라이즈 쿼리 활용
- 시퀄라이즈 쿼리는 프로미스를 반환하므로 then을 붙여 결괏값을 받을 수도 있고 async/await 문법과 같이 사용도 가능하다.
```
// INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
// models 모듈에서 User 모델을 불러와 create 메서드를 사용
const { User } = require('../models');

User.create({
    name: 'zero',
    age: 24,
    married: false,      // 시퀄라이즈 모델에 정의한 자료형에 맞춰야 해서 0이 아니라 false로 넣은 것
    comment: '자기소개1'
});

// SELECT * FROM nodejs.users;
User.findAll({});

// SELECT * FROM nodejs.users LIMIT 1;
User.findOne({});

// SELECT name, married FROM nodejs.users;
User.findAll({
    attributes: ['name', 'married'],
});

// SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
const { Op } = require('sequelize');

User.findAll({
    attributes: ['name', 'age'],
    where: {
        married: true,
        age: { [Op.gt]: 30 },
    },
}) 
```
- 주의할 점은 데이터를 넣을 때 MySQL의 자료형이 아니라 시퀄라이즈 모델에 정의한 자료형 대로 넣어야 한다.
- MySQL에서는 undefined라는 자료형을 지원하지 않으므로 where 옵션에는 undefined가 들어가면 안된다. 빈 값을 넣고자 하면 null을 사용해야 함.
- 자주 쓰이는 연산자
    - Op.gt(초과). Op.gte(이상), Op.lt(미만), Op.lte(이하), Op.ne(같지 않음), Op.or(또는), Op.in(배열 요소 중 하나), Op.notIn(배열 요소와 모두 다름)
    
```
// Op.or 사용 예제 - Op.or 속성에 OR 연산을 적용할 쿼리들을 배열로 나열하면 됨
// SELECT id, name FROM users WHERE married = 0 OR age > 30;
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['id', 'name'],
    where: {
        [Op.or]: [{ married: false }, { age: { [Op.gt]: 30 } }],
    },
});

// SELECT id, name FROM users ORDER BY age DESC;
// order 옵션으로 정렬, 배열 안에 배열이 있다는 점에 주의. 정렬은 꼭 컬럼 하나로 하는게 아니라 컬럼 두 개 이상으로도 할 수 있음
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
});

// SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
// limit 1의 경우 limit 옵션 가능
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
});

// OFFSET 도 offset을 사용 가능
// SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
User.findAll({
    attributes: ['id', 'name'],
    order: ['age', 'DESC'],
    limit: 1,
    offset: 1,
});

// UPDATE 쿼리
// UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
// 첫 번째 인수는 수정할 내용, 두 번째 인수는 어떤 로우를 수정할지에 대한 조건. where 옵션에 조건들을 적는다.
User.update({
    comment: '바꿀 내용',
}, {
    where: { id: 2 },
});

//DELETE 쿼리
// DELETE FROM nodejs.users WHERE id = 2;
// destroy 메서드로 삭제
User.destory({
    where: { id: 2 },
});
```

- 관계 쿼리, findOne 이나 findAll 메서드를 호출할 때 프로미스의 결과로 모델을 반환.
- findAll은 모두 찾는 것이므로 모델의 배열을 반환.
```
const user = await User.findOnd({});
consoel.log(user.nick); 사용자 닉네임
```
- User 모델의 정보에도 바로 접근 가능하나 관계 쿼리 역시 지원. MySQL의 JOIN기능
- 현재 User 모델은 Comment 모델과 hasMany-belongsTo 관계가 맺어져 있다.
- 만약 특정 사용자를 가져오면서 그 사람의 댓글까지 모두 가져오고 싶다면 include 속성을 사용한다.
```
// 어떤 모델과 관계가 있는지를 include 배열에 넣어주면 된다
// 배열인 이유는 다양한 모델과 관계가 있을 수 있기 때문
const user = await User.findOne({
    include: [{
        model: Comment,
    }]
});
console.log(user.Comments); // 사용자 댓글

// 다른 방법
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments); // 사용자 댓글
// 관계가 설정되어 있다면 get 외에도 set, add, remove 등의 메서드를 활용할 수 있다. 동사 뒤에 모델의 이름이 붙는 형식
// 동사 뒤의 모델 이름을 바꾸고 싶다면 관계 설정 시 as 옵션을 사용할 수 있다.

// 관꼐를 설정할 때 as로 등록
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id', as: 'Answers' });
// 쿼리 할 때
const user = await User.findOne({});
const comments = await user.getAnswers();
console.log(comments);

// as 를 설정하면 include시 추가되는 댓글 객체도 user.Answers로 바뀐다.
// include나 관계 쿼리 메서드에도 where나 attributes 같은 옵션 사용이 가능하다.
const user = await User.findOne({
    include: [{
        model: Comment,
        where: {
            id: 1,
        },
        attributes: ['id'],
    }]
});
// 또는
const comments = await user.getComments({
    where: {
        id: 1,
    },
    attributes: ['id'],
});
```

- 관계 쿼리의 수정, 생성 삭제때의 차이

```
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
// 또는
await user.addComment(comment.id);

// 여러 개를 추가할 때는 배열로 추가할 수 있다.
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([comment1, comment2]);

// 관계 쿼리 메서드의 인수로 추가할 댓글 모델을 넣거나 댓글의 아이디를 넣으면 됨. 수정 삭제도 마찬가지.
// 만약 시퀄라이즈 쿼리를 사용하기 싫거나 모를 경우 직접 SQL 문을 통해 쿼리할 수도 있다.
const [result, metadata] = await sequelize.query('SELECT * from comments');
console.log(result);
```