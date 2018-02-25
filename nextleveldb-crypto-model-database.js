var Model = require('nextleveldb-model');
var lang = require('lang-mini');
var CoinMarketCap_Watcher = require('coinmarketcap-watcher');


var each = lang.each;
var tof = lang.tof;
var Fns = lang.Fns;

var Database = Model.Database;
var Table = Model.Table;
var Record = Model.Record;

// watcher vs more simple API?
var Bittrex_Watcher = require('bittrex-watcher');
// Want an easy output of the model
//  Explanation of the tables, indexes, fields


// Maybe this will be retired, but with the definitions used and stored separately, with other components providing much of the legwork to ensure the data is in the DB, and the structure is set up.




var table_defs = [
    [
        'market providers', [
            [
                ['+id'],
                ['name']
            ],
            [
                [
                    ['name'],
                    ['id']
                ]
            ]
        ]
    ],

    [
        'bittrex currencies', [
            '+id',
            '!Currency',
            '!CurrencyLong',
            'MinConfirmation',
            'TxFee',
            'IsActive',
            'CoinType',
            'BaseAddress',
            'Notice'
        ]
    ],
    [
        'bittrex markets', [
            ['market_currency_id fk=> bittrex currencies', 'base_currency_id fk=> bittrex currencies'],
            ['MinTradeSize',
                '!MarketName',
                'IsActive',
                'Created',
                'Notice',
                'IsSponsored',
                'LogoUrl'
            ]
        ]
    ],
    [
        'bittrex market summary snapshots', [
            ['market_id fk=> bittrex markets',
                'timestamp'
            ],
            ['last',
                'bid',
                'ask',
                'volume',
                'base_volume',
                'open_buy_orders',
                'open_sell_orders'
            ]
        ]
    ]
]
class NextlevelDB_Crypto_Model_Database extends Model.Database {
    'constructor' () {
        super(table_defs);
    }
    'config_top_bittrex' (n, callback) {
        var cmcw = new CoinMarketCap_Watcher();
        var crypto_db = this;
        cmcw.get_top_n_symbols_by_market_cap(n, (err, arr_top_25_symbols) => {
            if (err) {
                callback(err)
            } else {
                var bw = new Bittrex_Watcher();
                bw.get_at_all_currencies_info((err, at_all_currencies) => {
                    var at_top_currencies = at_all_currencies.select_matching_field_values('Currency', arr_top_25_symbols);
                    var tbl_bittrex_currencies = crypto_db.map_tables['bittrex currencies'];
                    tbl_bittrex_currencies.add_arr_table_records(at_top_currencies);
                    var top_bittrex_currency_symbols = at_top_currencies;
                    var bittrex_top_currency_symbols = at_top_currencies.get_arr_field_values('Currency');
                    bw.get_arr_market_names_by_arr_currencies(bittrex_top_currency_symbols, (err, btx_top_market_names) => {
                        if (err) {
                            callback(err);
                        } else {
                            bw.get_markets_info_by_market_names(btx_top_market_names, (err, at_top_markets_info) => {
                                if (err) {
                                    callback(err);
                                } else {
                                    var tbl_bittrex_markets = crypto_db.map_tables['bittrex markets'];
                                    var field_names = tbl_bittrex_markets.field_names;

                                    var map_ids_by_currency = tbl_bittrex_currencies.get_map_lookup('Currency');
                                    //console.log('map_ids_by_currency', map_ids_by_currency);
                                    var arr_markets_records = [];
                                    var arr_market_names = [];

                                    each(at_top_markets_info.values, (v) => {
                                        //console.log('v', v);
                                        var str_market_currency = v[0];
                                        var str_base_currency = v[1];

                                        //arr_market_names.push(str_market_currency + '-' + str_base_currency);
                                        arr_market_names.push(str_base_currency + '-' + str_market_currency);

                                        var market_currency_key = map_ids_by_currency[str_market_currency];
                                        var base_currency_key = map_ids_by_currency[str_base_currency];

                                        var market_currency_id = market_currency_key[0];
                                        var base_currency_id = base_currency_key[0];
                                        var record_def = [
                                            [market_currency_id, base_currency_id], v.slice(4)
                                        ];
                                        arr_markets_records.push(record_def);
                                        // then we have the base currency key values...
                                    });

                                    tbl_bittrex_markets.add_records(arr_markets_records);
                                    callback(null, true);
                                }
                            })
                        }
                    });
                })
            }
        });
    }

    config_all_bittrex(callback) {
        //console.log('config_all_bittrex');
        var bw = new Bittrex_Watcher();
        var crypto_db = this;
        bw.get_at_all_currencies_info((err, at_all_currencies) => {
            var tbl_bittrex_currencies = crypto_db.map_tables['bittrex currencies'];
            tbl_bittrex_currencies.add_arr_table_records(at_all_currencies);
            var bittrex_currency_symbols = at_all_currencies.get_arr_field_values('Currency');
            bw.get_markets_info((err, at_markets_info) => {
                if (err) {
                    callback(err);
                } else {
                    var tbl_bittrex_markets = crypto_db.map_tables['bittrex markets'];
                    var field_names = tbl_bittrex_markets.field_names;
                    var map_ids_by_currency = tbl_bittrex_currencies.get_map_lookup('Currency');
                    //console.log('map_ids_by_currency', map_ids_by_currency);
                    var arr_markets_records = [];
                    each(at_markets_info.values, (v) => {
                        //console.log('v', v);
                        var str_market_currency = v[0];
                        var str_base_currency = v[1];
                        var market_currency_key = map_ids_by_currency[str_market_currency];
                        var base_currency_key = map_ids_by_currency[str_base_currency];
                        var market_currency_id = market_currency_key[0];
                        var base_currency_id = base_currency_key[0];
                        var record_def = [
                            [market_currency_id, base_currency_id], v.slice(4)
                        ];

                        arr_markets_records.push(record_def);
                        // then we have the base currency key values...
                    });

                    tbl_bittrex_markets.add_records(arr_markets_records);

                    callback(null, true);
                }
            })
        })
    }

    download_ensure_bittrex_currencies(callback) {
        var bw = new Bittrex_Watcher();
        var that = this;

        bw.get_at_all_currencies_info((err, at_c) => {
            if (err) {
                callback(err);
            } else {
                that.ensure_table_records_no_overwrite('bittrex currencies', at_c.values);
            }
        });
    }

    'get_bittrex_market_summary_records_filtered_by_market_name' (arr_market_names, callback) {
        var map_ids_by_market = tbl_bittrex_markets.get_map_lookup('MarketName');

        bw.get_market_summaries_filter_by_arr_market_names(arr_market_names, (err, at_market_summaries) => {
            if (err) {
                callback(err);
            } else {
                var arr_market_summary_records = at_market_summaries.transform_each((value) => {
                    var str_market_name = value[0];
                    var market_key = map_ids_by_market[str_market_name];
                    var d = Date.parse(value[6]);

                    var res = [
                        [market_key, d],
                        [value[4], value[7], value[8], value[3], value[5], value[9], value[10]]
                    ];

                    return res;

                });
                var tbl_bittrex_markets = crypto_db.map_tables['bittrex market summary snapshots'];

                tbl_bittrex_markets.add_records(arr_market_summary_records);


                //throw 'stop';
                callback(null, true);
            }
        });
    }
}

if (require.main === module) {
    var crypto_db = new NextlevelDB_Crypto_Model_Database();
    var view_decoded_rows = () => {
        var model_rows = crypto_db.get_model_rows();
        //console.log('model_rows.length', model_rows.length);

        each(model_rows, (model_row) => {
            console.log('model_row', Database.decode_model_row(model_row));
        });
        console.log('\n\n\n');
    }
    //view_decoded_rows();

    var test_remodel = () => {
        var model_rows = crypto_db.get_model_rows();
        each(model_rows, (model_row) => {
            console.log('1) model_row', Database.decode_model_row(model_row));
        });
        var buf = crypto_db.get_model_rows_encoded();
        console.log('buf', buf);

        // Looks like the loading of the model rows does not work correctly?
        //  Actually, it's the definition of the table that gets created wrong because it does not also assign it the 4th incrementor.

        var m2 = Model.Database.load_buf(buf);
        var model_rows_2 = m2.get_model_rows();
        each(model_rows_2, (model_row) => {
            console.log('2) model_row', Database.decode_model_row(model_row));
        });
        crypto_db.view_decoded_rows();
    }
    test_remodel();

    add_some_crypto_data = (callback) => {

    }

    var test_with_crypto_data = () => {
        crypto_db.config_all_bittrex((err, res_config) => {
            if (err) {
                throw err;
            } else {
                console.log('res_config', res_config);
                view_decoded_rows();
            }
        })
    }

    var pk_c = crypto_db.map_tables['bittrex currencies'].record_def.pk;
    //console.log('pk_c.length', pk_c.length);

    var pk_m = crypto_db.map_tables['bittrex markets'].record_def.pk;

} else {
    //console.log('required as a module');
}

NextlevelDB_Crypto_Model_Database.table_defs = table_defs;

module.exports = NextlevelDB_Crypto_Model_Database;