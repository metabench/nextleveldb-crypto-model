var Model = require('nextleveldb-model');

var res = {
    'Database': require('./nextleveldb-crypto-model-database'),
    'Table': Model.Table,
    'Record': Model.Record,
    'Incrementor': Model.Incrementor,
    'Paging': Model.Paging
}

module.exports = res;

