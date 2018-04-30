var Model = require('nextleveldb-model');


// Want to merge objects.

let res = Model;
res.Database = require('./nextleveldb-crypto-model-database')

/*
var res = {
    'Database': ,
    'Table': Model.Table,
    'Record': Model.Record,
    'Incrementor': Model.Incrementor,
    'Paging': Model.Paging
}
*/

module.exports = res;