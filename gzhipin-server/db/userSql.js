const userSql = {
    queryAll:'select * from users',  //查询所有用户
    queryByType:'select * from users where type=?',//根据用户类型查找
    queryByName:'select * from users where username=?',  //通过用户名索引查询用户
    queryByNamePassword:'select * from users where username=? and password=?',   //通过用户名和密码索引查询用户
    insert:'insert into users set ?',   //插入新用户
    updateUser:'update users set ? where username=?',   //更新用户信息
    deleteUser:'delete from users where username=?'     //删除用户
}

const schemaSql = {
    queryAll: 'select * from users2',
    queryByFromorTo:'select * from users2 where from2=? or to2=?',
    updateRead:'update users2 set ? where from2=? and to2=?', 
    insert:'insert into users2 set ?'
}
module.exports = {userSql,schemaSql};