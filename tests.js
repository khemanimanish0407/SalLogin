//1.
var sql = require('mssql');
//2.
var config = {
    server: '127.0.0.1',
    database: 'test',
    user: 'Manish',
    password: 'Alex@123',
    port: 1433
};
//3.
function loadEmployees() {
    //4.
    var dbConn = new sql.Connection(config);
    //5.
    dbConn.connect().then(function () {
        //6.
        var request = new sql.Request(dbConn);
        //7.
        request.query("select * from application_user").then(function (recordSet) {
            console.log(recordSet);
            dbConn.close();
        }).catch(function (err) {
            //8.
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        //9.
        console.log(err);
    });
}
//10.
loadEmployees();