// var couchbase = require('couchbase');
// var cluster = new couchbase.Cluster('couchbase://localhost');
// cluster.authenticate('Administrator', '123456');
// var bucket = cluster.openBucket('web_app_db', '', function (err) {
//     if (err) {
//         console.error('Got error: %j', err);
//     } else {
//         console.log("Connected");
//     }
// });

// Password = "4vQrK1QQV7ZuW3jss/nHICSVwrYoMOSFsCx6DxO2br4="
// PasswordSalt = "+WJSNES7oldlKoR77n4tMQ=="
// crypto = require("crypto")
// sha1 = crypto.createHash("sha1").update(PasswordSalt+"melissa", "utf8")
// // PasswordSalt = new Buffer(PasswordSalt, 'hex').toString('utf8')
// sha1.update(PasswordSalt+"melissa", "utf8")
// result = sha1.digest("hex")
// console.log(Password)
// console.log(result)

Roger.ziems
var crypto = require('crypto')
var data="melissa"
function createHash(data)  {
    console.log(crypto.createHash('sha1').update(data, 'ascii').digest('hex'));
}

createHash(data);