const exp = require('express');
const dbInfo = require('./db-config');
const bodyParser = require('body-parser');
const oracleDb = require('oracledb');


// (async function () {
//     try {
//         var con = await oracleDb.getConnection(dbInfo);
//       console.log(con);

//    } catch (error) {
//         console.log(error);
//     }

// }).call();

// var getNodeTests = function(){
//     var con = oracleDb.getConnection(dbInfo)
//         .then(function (con) {
//             console.log(con);
//             var sql = 'select * from node_test';
//             con.execute(sql, [], function (err, result) {

//                 var jsonArr = [];
//                 for (var i = 0; i < result.rows.length; i++) {
//                     var row = result.rows[i];
//                     var nt = {};
//                     for (var j = 0; j < result.metaData.length; j++) {
//                         var md = result.metaData[j];
//                         nt[md.name] = row[j];
//                     }
//                     jsonArr.push(nt);
//                 }
//                 return jsonArr;
//             });

//         })

//     }
var getNodeTests = async function (params) {
    var conn = await oracleDb.getConnection(dbInfo);
    var sql = 'select * from node_test';
    if (params) {
        sql += ' where 1=1 ';
    }
    if (params.nt_num) {
        sql += ' and nt_num =: nt_num ';
    }
    if (params.nt_name) {
        sql += ' and nt_name =: nt_name ';
    }
    console.log(sql);
    var result = await conn.execute(sql, params);
    var jsonArr = [];
    for (var row of result.rows) {
        var nt = {};
        for (var i = 0; i < row.length; i++) {
            nt[result.metaData[i].name] = row[i];
        }
        jsonArr.push(nt);
    }
    return jsonArr;
};

var server = exp();
server.use(bodyParser.json());
server.get('/nodetests', async function (req, res, next) {
    var jsonArr = await getNodeTests(req.query);
    res.json(jsonArr);


});


server.get('/views/*', function (req, res) {
    
    console.log(req.url);
    res.sendFile(__dirname+req.url+'.html');
})

server.post('/nodetests',function(req,res){
    console.log(req.body);

    res.send('뭐하냐');
})
server.listen(80, function () {
    console.log('started with 80 port');
})

